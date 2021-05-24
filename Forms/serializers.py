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
    class Meta:
        model = LeaveApplication
        fields = '__all__'

    
        