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


