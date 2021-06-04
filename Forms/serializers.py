from rest_framework import serializers
from .models import *


class TravelAuthorizationSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField("get_staff_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    staff_phone = serializers.SerializerMethodField("get_staff_phone")
    staff_department = serializers.SerializerMethodField("get_staff_department")
    project_name = serializers.SerializerMethodField("get_project_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    total = serializers.SerializerMethodField("get_total")


    class Meta:
        model = TravelAuthorization
        fields = '__all__'

    def get_project_name(self, TravelAuthorization):
        project_name = TravelAuthorization.project_name
        return project_name

    def get_staff_signature(self, TravelAuthorization):
        staff_signature = TravelAuthorization.staff_signature
        return staff_signature

    def get_staff_phone(self, TravelAuthorization):
        staff_phone = TravelAuthorization.staff_phone
        return staff_phone

    def get_staff_department(self, TravelAuthorization):
        staff_department = TravelAuthorization.staff_department
        return staff_department

    def get_project_name(self, TravelAuthorization):
        project_name = TravelAuthorization.project_name
        return project_name


    def get_total(self, TravelAuthorization):
        total = TravelAuthorization.total
        return total

    def get_staff_name(self, TravelAuthorization):
        staff_name = TravelAuthorization.staff_name
        return staff_name

    def get_supervisor_signature(self, TravelAuthorization):
        supervisor_signature = TravelAuthorization.supervisor_signature
        return supervisor_signature

    def get_supervisor_name(self, TravelAuthorization):
        supervisor_name = TravelAuthorization.supervisor_name
        return supervisor_name


class LodgingMIESerializer(serializers.ModelSerializer):
    class Meta:
        model = LodgingMIE
        fields = '__all__'

    

class OtherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Other
        fields = '__all__'

class TravelAuthorizationSupervisorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelAuthorizationSupervisor
        fields = '__all__'

class TravelAuthorizationFinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelAuthorizationFinance
        fields = '__all__'

class TravelExpenseReportSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField("get_staff_name")
    # receipt_no_other = serializers.SerializerMethodField("get_receipt_no_other")
    total = serializers.SerializerMethodField("get_total")
    # description_other = serializers.SerializerMethodField("get_description_other")
    department_name = serializers.SerializerMethodField("get_department_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    purpose = serializers.SerializerMethodField("get_purpose")
    date = serializers.SerializerMethodField("get_date")
    period = serializers.SerializerMethodField("get_period")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    date_approved = serializers.SerializerMethodField("get_date_approved")
    class Meta:
        model = TravelExpenseReport
        fields = '__all__'

    def get_purpose(self, TravelExpenseReport):
        purpose = TravelExpenseReport.purpose
        return purpose

    def get_total(self, TravelExpenseReport):
        total = TravelExpenseReport.total
        return total

    # def get_description_other(self, TravelExpenseReport):
    #     description_other = TravelExpenseReport.description_other
    #     return description_other

    # def get_receipt_no_other(self, TravelExpenseReport):
    #     receipt_no_other = TravelExpenseReport.receipt_no_other
    #     return receipt_no_other

    def get_date(self, TravelExpenseReport):
        date = TravelExpenseReport.date
        return date
    
    def get_department_name(self, TravelExpenseReport):
        department_name = TravelExpenseReport.department_name
        return department_name

    def get_staff_signature(self, TravelExpenseReport):
        staff_signature = TravelExpenseReport.staff_signature
        return staff_signature

    def get_period(self, TravelExpenseReport):
        period = TravelExpenseReport.period
        return period


    def get_staff_name(self, TravelExpenseReport):
        staff_name = TravelExpenseReport.staff_name
        return staff_name

    def get_supervisor_signature(self, TravelExpenseReport):
        supervisor_signature = TravelExpenseReport.supervisor_signature
        return supervisor_signature

    def get_supervisor_name(self, TravelExpenseReport):
        supervisor_name = TravelExpenseReport.supervisor_name
        return supervisor_name

    def get_date_approved(self, TravelExpenseReport):
        date_approved = TravelExpenseReport.date_approved
        return date_approved

class TravelExpenseReportFinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TravelExpenseReportFinance
        fields = '__all__'


class mHealthImagesSerializers(serializers.ModelSerializer):
    class Meta:
        model = mHealthImages
        fields = "__all__"

class LeaveDefinitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveDefinition
        fields = '__all__'

class LeaveApplicationSerializer(serializers.ModelSerializer):
    staff_name = serializers.SerializerMethodField("get_staff_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    class Meta:
        model = LeaveApplication
        fields = '__all__'

    def get_staff_name(self, LeaveApplication):
        staff_name = LeaveApplication.staff_name
        return staff_name

    def get_staff_signature(self, LeaveApplication):
        staff_signature = LeaveApplication.staff_signature
        return staff_signature

class LeaveApplicationSupervisorSerializer(serializers.ModelSerializer):
    staff = serializers.SerializerMethodField("get_staff")
    staff_name = serializers.SerializerMethodField("get_staff_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    leave = serializers.SerializerMethodField("get_leave")
    duration = serializers.SerializerMethodField("get_duration")
    class Meta:
        model = LeaveApplicationSupervisor
        fields = '__all__'

    def get_staff(self, LeaveApplicationSupervisor):
        staff = LeaveApplicationSupervisor.staff
        return staff

    def get_staff_name(self, LeaveApplicationSupervisor):
        staff_name = LeaveApplicationSupervisor.staff_name
        return staff_name

    def get_staff_signature(self, LeaveApplicationSupervisor):
        staff_signature = LeaveApplicationSupervisor.staff_signature
        return staff_signature

    def get_supervisor_name(self, LeaveApplicationSupervisor):
        supervisor_name = LeaveApplicationSupervisor.supervisor_name
        return supervisor_name

    def get_supervisor_signature(self, LeaveApplicationSupervisor):
        supervisor_signature = LeaveApplicationSupervisor.supervisor_signature
        return supervisor_signature

    def get_leave(self, LeaveApplicationSupervisor):
        leave = LeaveApplicationSupervisor.leave
        return leave

    def get_duration(self, LeaveApplicationSupervisor):
        duration = LeaveApplicationSupervisor.duration
        return duration


class LeaveApplicationCOOSerializer(serializers.ModelSerializer):
    coo_name = serializers.SerializerMethodField("get_coo_name")
    coo_signature = serializers.SerializerMethodField("get_coo_signature")
    staff = serializers.SerializerMethodField("get_staff")
    staff_id = serializers.SerializerMethodField("get_staff_id")
    staff_name = serializers.SerializerMethodField("get_staff_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    leave = serializers.SerializerMethodField("get_leave")
    duration = serializers.SerializerMethodField("get_duration")
    position = serializers.SerializerMethodField("get_position")
    date_approved = serializers.SerializerMethodField("get_date_approved")
    start_date = serializers.SerializerMethodField("get_start_date")
    last_date = serializers.SerializerMethodField("get_last_date")

    class Meta:
        model = LeaveApplicationCOO
        fields = "__all__"

    def get_coo_name(self, LeaveApplicationCOO):
        coo_name = LeaveApplicationCOO.coo_name
        return coo_name

    def get_coo_signature(self, LeaveApplicationCOO):
        coo_signature = LeaveApplicationCOO.coo_signature
        return coo_signature

    def get_staff(self, LeaveApplicationCOO):
        staff = LeaveApplicationCOO.staff
        return staff

    def get_staff_id(self, LeaveApplicationCOO):
        staff_id = LeaveApplicationCOO.staff_id
        return staff_id

    def get_staff_name(self, LeaveApplicationCOO):
        staff_name = LeaveApplicationCOO.staff_name
        return staff_name

    def get_staff_signature(self, LeaveApplicationCOO):
        staff_signature = LeaveApplicationCOO.staff_signature
        return staff_signature

    def get_supervisor_name(self, LeaveApplicationCOO):
        supervisor_name = LeaveApplicationCOO.supervisor_name
        return supervisor_name

    def get_supervisor_signature(self, LeaveApplicationCOO):
        supervisor_signature = LeaveApplicationCOO.supervisor_signature
        return supervisor_signature

    def get_leave(self, LeaveApplicationCOO):
        leave = LeaveApplicationCOO.leave
        return leave

    def get_duration(self, LeaveApplicationCOO):
        duration = LeaveApplicationCOO.duration
        return duration

    def get_position(self, LeaveApplicationCOO):
        position = LeaveApplicationCOO.position
        return position

    def get_date_approved(self, LeaveApplicationCOO):
        date_approved = LeaveApplicationCOO.date_approved
        return date_approved

    def get_start_date(self, LeaveApplicationCOO):
        start_date = LeaveApplicationCOO.start_date
        return start_date

    def get_last_date(self, LeaveApplicationCOO):
        last_date = LeaveApplicationCOO.last_date
        return last_date

class GrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grant
        fields = "__all__"

class NonProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = NonProject
        fields = "__all__"


class OffDutySerializer(serializers.ModelSerializer):
    class Meta:
        model = OffDuty
        fields = "__all__"

class OffDutyTimeSheetSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField("get_month")
    year = serializers.SerializerMethodField("get_year")
    class Meta:
        model = OffDutyTimeSheet
        fields = "__all__"

    def get_month(self, OffDutyTimeSheet):
        month = OffDutyTimeSheet.month
        return month

    def get_year(self, OffDutyTimeSheet):
        year = OffDutyTimeSheet.year
        return year


class NonProjectTimeSheetSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField("get_month")
    year = serializers.SerializerMethodField("get_year")
    class Meta:
        model = NonProjectTimeSheet
        fields = "__all__"

    def get_month(self, NonProjectTimeSheet):
        month = NonProjectTimeSheet.month
        return month

    def get_year(self, NonProjectTimeSheet):
        year = NonProjectTimeSheet.year
        return year


class MonthlyTimeSheetSerializer(serializers.ModelSerializer):
    month = serializers.SerializerMethodField("get_month")
    year = serializers.SerializerMethodField("get_year")
    class Meta:
        model = MonthlyTimeSheet
        fields = "__all__"

    def get_month(self, MonthlyTimeSheet):
        month = MonthlyTimeSheet.month
        return month

    def get_year(self, MonthlyTimeSheet):
        year = MonthlyTimeSheet.year
        return year


    
        