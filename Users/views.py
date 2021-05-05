from rest_framework import viewsets
from .models import *
from .serializers import *
from django_filters.rest_framework import DjangoFilterBackend
from knox.views import LoginView as KnoxLoginView
from django.contrib.auth import login
from rest_framework import permissions, generics
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.models import AuthToken
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import filters
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.shortcuts import redirect
from rest_framework import status


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = customuser
        fields = '__all__'

class SupervisorsViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.

    Additionally we also provide an extra `highlight` action.
    """
    queryset = Supervisors.objects.all()
    serializer_class = SupervisorsSerializer
    filterset_fields = ['name']

class ProjectsViewSet(viewsets.ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectsSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes= [ AllowAny ]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UsersSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

class DepartmentsViewSet(viewsets.ModelViewSet):
    queryset = Departments.objects.all()
    serializer_class = DepartmentSerializer

class CEOViewSet(viewsets.ModelViewSet):
    queryset = ChiefExecutiveOfficer.objects.all()
    serializer_class = CEOSerializer

class FinanceStaffViewSet(viewsets.ModelViewSet):
    queryset = FinanceStaff.objects.all()
    serializer_class = FinanceStaffSerializer
    filter_fields = ['staff']

class AccountCodesViewSet(viewsets.ModelViewSet):
    queryset = FinanceAccountCodes.objects.all()
    serializer_class = AccountCodesSerializer

class PurchaseRequisitionViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequisition.objects.all()
    serializer_class = PurchaseRequisitionSerializer
    filterset_fields = ['reviewing_supervisor', 'reviewing_finance_officer', 'supervisor_approved', 'finance_approved', 'ceo_approved', 'requested_by']

class GroupsViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class SupervisorApprovedPurchaseRequisitionsViewSet(viewsets.ModelViewSet):
    queryset = SupervisorApprovedPurchaseRequisitions.objects.all()
    serializer_class = SupervisorApprovedPurchaseRequisitionsSerializer
    filterset_fields = ['supervisor', 'requisition']

class FinanceApprovedPurchaseRequisitionsViewSet(viewsets.ModelViewSet):
    queryset = FinanceApprovedPurchaseRequisitions.objects.all()
    serializer_class = FinanceApprovedPurchaseRequisitionsSerializer
    filterset_fields = ['requisition']

class CEOApprovedPurchaseRequisitionsViewSet(viewsets.ModelViewSet):
    queryset = CEOApprovedPurchaseRequisitions.objects.all()
    serializer_class = CEOApprovedPurchaseRequisitionsSerializer
    filterset_fields = ['requisition']
    
class TaxiLogisticsViewSet(viewsets.ModelViewSet):
    queryset = TaxiLogistics.objects.all()
    serializer_class = TaxiLogisticsSerializer
    filterset_fields = ['supervisor', 'staff_booking_taxi']


class TaxiLogisticsSupervisorViewSet(viewsets.ModelViewSet):
    queryset = TaxiLogisticsSupervisor.objects.all()
    serializer_class = TaxiLogisticsSupervisorSerializer
    filterset_fields = ['request']

class BusinessAdvanceRequestViewSet(viewsets.ModelViewSet):
    queryset = BusinessAdvanceRequest.objects.all()
    serializer_class = BusinessAdvanceRequestSerializer
    filter_fields = ['supervisor', 'approved', 'finance_reviewed', 'staff']

class BARSupervisorViewSet(viewsets.ModelViewSet):
    queryset = BARSupervisor.objects.all()
    serializer_class = BARSupervisorSerializer
    filterset_fields = ['request']

class BARFinanceViewSet(viewsets.ModelViewSet):
    queryset = BARFinance.objects.all()
    serializer_class = BARFinanceSerializer
    filterset_fields = ['request']

class BusinessExpenseReportViewSet(viewsets.ModelViewSet):
    queryset = BusinessExpenseReport.objects.all()
    serializer_class = BusinessExpenseSerializer
    filterset_fields = ['request']

class BusinessExpenseReportFinanceViewSet(viewsets.ModelViewSet):
    queryset = BusinessExpenseReportFinance.objects.all()
    serializer_class = BusinessExpenseFinanceSerializer
    filterset_fields = ['request']

class RequestPasswordResetView(generics.GenericAPIView):
    serializer_class = RequestPasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        email = request.data['email']
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            current_site = get_current_site(request=request).domain
            relativeLink = reverse(
                'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            absurl = 'http://forms.mhealthkenya.co.ke'+relativeLink
            email_body = f'Hi {user.first_name} {user.last_name} Please click on the link below to reset your password. \n' + 'Ignore this email if you did not make this request. \n' +\
                absurl + f'\n Your reset code is: \n {uidb64}/{token}'
            data = {
                'email_subject': 'Password Reset',
                'email_body': email_body,
                'to_email': user.email,
            }
            Util.send_email(data)
        return Response({'success': 'Check your email for password reset instructions.'}, status=status.HTTP_200_OK)
        # return redirect('/auth/password-reset-confirm')


class TokenCheckAPI(generics.GenericAPIView):

    def get(self, request, uidb64, token):

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return redirect('/auth/reset/password/fail')

            return redirect('/auth/reset/password/')

        except DjangoUnicodeDecodeError as identifier:
            if not PasswordResetTokenGenerator().check_token(user, token):
                return redirect('/auth/reset/password/fail')


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer

    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({
            'success', 'Invalid password reset link.'
        }, status=status.HTTP_200_OK)



