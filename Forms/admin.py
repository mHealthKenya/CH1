from django.contrib import admin
from .models import *

admin.site.register(TravelAuthorization)
admin.site.register(LodgingMIE)
admin.site.register(Other)
admin.site.register(TravelExpenseReport)
admin.site.register(TravelExpenseReportFinance)
admin.site.register(mHealthImages)
admin.site.register(LeaveDefinition)
admin.site.register(LeaveApplication)
admin.site.register(LeaveApplicationSupervisor)
admin.site.register(LeaveApplicationCOO)
admin.site.register(Grant)
admin.site.register(NonProject)
admin.site.register(OffDuty)
admin.site.register(MonthlyTimeSheet)
admin.site.register(OffDutyTimeSheet)
admin.site.register(NonProjectTimeSheet)

