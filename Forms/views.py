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
from .permissions import *



class TravelAuthorizationViewSet(viewsets.ModelViewSet):
    queryset = TravelAuthorization.objects.all()
    serializer_class = TravelAuthorizationSerializer
    filterset_fields = ['supervisor', 'staff', 'approved', 'supervisor_comment' ]
    


class OtherViewSet(viewsets.ModelViewSet):
    queryset = Other.objects.all()
    serializer_class = OtherSerializer
    filterset_fields = ['request']


class LodgingMIEViewSet(viewsets.ModelViewSet):
    queryset = LodgingMIE.objects.all()
    serializer_class = LodgingMIESerializer

class TravelAuthorizationSupervisorViewSet(viewsets.ModelViewSet):
    queryset = TravelAuthorizationSupervisor.objects.all()
    serializer_class = TravelAuthorizationSupervisorSerializer
    filter_fields = ['request']

class TravelAuthorizationFinanceViewSet(viewsets.ModelViewSet):
    queryset = TravelAuthorizationFinance.objects.all()
    serializer_class = TravelAuthorizationFinanceSerializer

class TravelExpenseReportViewSet(viewsets.ModelViewSet):
    queryset = TravelExpenseReport.objects.all()
    serializer_class = TravelExpenseReportSerializer
    filter_fields = ['request']

class TravelExpenseReportFinanceViewSet(viewsets.ModelViewSet):
    queryset = TravelExpenseReportFinance.objects.all()
    serializer_class = TravelExpenseReportFinanceSerializer

class mHealthImagesViewSet(viewsets.ModelViewSet):
    queryset = mHealthImages.objects.all()
    serializer_class = mHealthImagesSerializers
    filter_fields = ["imagename"]

class LeaveDefinitionViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnly]
    queryset = LeaveDefinition.objects.all()
    serializer_class = LeaveDefinitionSerializer
    filter_fields = ["leave"]

class LeaveApplicationViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplication.objects.all()
    serializer_class = LeaveApplicationSerializer
    filter_fields = ["staff", "year", "leave", "supervisor", "approved"]
   
class LeaveApplicationSupervisorViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplicationSupervisor.objects.all()
    serializer_class = LeaveApplicationSupervisorSerializer
    filter_fields = ["application__staff", "application", "approved", "coo_approved"]

class LeaveApplicationCOOViewSet(viewsets.ModelViewSet):
    queryset = LeaveApplicationCOO.objects.all()
    serializer_class = LeaveApplicationCOOSerializer
    filter_fields = ["application__application__staff", "application", "approved"]

class GrantViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnly]
    queryset = Grant.objects.all()
    serializer_class = GrantSerializer

class NonProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnly]
    queryset = NonProject.objects.all()
    serializer_class = NonProjectSerializer
    
class OffDutyViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnly]
    queryset = OffDuty.objects.all()
    serializer_class = OffDutySerializer

class OffDutyTimeSheetViewSet(viewsets.ModelViewSet):
    queryset = OffDutyTimeSheet.objects.all()
    serializer_class = OffDutyTimeSheetSerializer
    filter_fields =['staff']

class NonProjectTimeSheetViewSet(viewsets.ModelViewSet):
    queryset = NonProjectTimeSheet.objects.all()
    serializer_class = NonProjectTimeSheetSerializer
    filter_fields =['staff']
    

class MonthlyTimeSheetViewSet(viewsets.ModelViewSet):
    queryset = MonthlyTimeSheet.objects.all()
    serializer_class = MonthlyTimeSheetSerializer
    filter_fields =['staff']
   


