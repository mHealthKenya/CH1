from django.urls import path, include
from rest_framework.routers import DefaultRouter
from Users import views
from . import views as Views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'accountcodes', views.AccountCodesViewSet)
router.register(r'businessadvancerequestsupervisor', views.BARSupervisorViewSet)
router.register(r'businessadvancerequestfinance', views.BARFinanceViewSet)
router.register(r'businessexpensereport', views.BusinessExpenseReportViewSet)
router.register(r'businessexpensereportfinance', views.BusinessExpenseReportFinanceViewSet)
router.register(r'businessadvancerequest', views.BusinessAdvanceRequestViewSet)
router.register(r'ceo', views.CEOViewSet)
router.register(r'CAPR', views.CEOApprovedPurchaseRequisitionsViewSet) #CAPR is an abbreviation for CEO Approved Purchase Requisitions
router.register(r'departments', views.DepartmentsViewSet)
router.register(r'financestaff', views.FinanceStaffViewSet)
router.register(r'FAPR', views.FinanceApprovedPurchaseRequisitionsViewSet) #FAPR is an abbreviation for Finance Approved Purchase Requisitions
router.register(r'groups', views.GroupsViewSet)
router.register(r'leavedefinitions', Views.LeaveDefinitionViewSet)
router.register(r'leaveapplications', Views.LeaveApplicationViewSet)
router.register(r'leaveapplicationssupervisor', Views.LeaveApplicationSupervisorViewSet)
router.register(r'leaveapplicationscoo', Views.LeaveApplicationCOOViewSet)
router.register(r'lodgingmie', Views.LodgingMIEViewSet)
router.register(r'mhealthimages', Views.mHealthImagesViewSet)
router.register(r'other', Views.OtherViewSet)
router.register(r'projects', views.ProjectsViewSet)
router.register(r'purchaserequisition', views.PurchaseRequisitionViewSet)
router.register(r'supervisors', views.SupervisorsViewSet)
router.register(r'SAPR', views.SupervisorApprovedPurchaseRequisitionsViewSet) #SAPR is an abbreviation for Supervisor Approved Purchase Requisitions
router.register(r'taxilogistics', views.TaxiLogisticsViewSet)
router.register(r'taxilogisticssupervisor', views.TaxiLogisticsSupervisorViewSet)
router.register(r'travelauthorization', Views.TravelAuthorizationViewSet)
router.register(r'travelexpensereport', Views.TravelExpenseReportViewSet)
router.register(r'travelexpensereportfinance', Views.TravelExpenseReportFinanceViewSet)
router.register(r'travelauthorizationsupervisor', Views.TravelAuthorizationSupervisorViewSet)
router.register(r'travelauthorizationfinance', Views.TravelAuthorizationFinanceViewSet)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]