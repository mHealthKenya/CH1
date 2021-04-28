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

class TravelExpenseReportFinanceViewSet(viewsets.ModelViewSet):
    queryset = TravelExpenseReportFinance.objects.all()
    serializer_class = TravelExpenseReportFinanceSerializer

class mHealthImagesViewSet(viewsets.ModelViewSet):
    queryset = mHealthImages.objects.all()
    serializer_class = mHealthImagesSerializers
    filter_fields = ["imagename"]

# Create your views here.
