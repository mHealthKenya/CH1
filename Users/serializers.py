from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.utils.encoding import smart_str, force_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import *

User = get_user_model()

class SupervisorsSerializer(serializers.ModelSerializer):
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    class Meta:
        model = Supervisors
        fields = '__all__'

    def get_supervisor_name(self, Supervisors):
        supervisor_name = Supervisors.supervisor_name
        return supervisor_name

class ProjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Projects
        fields = '__all__'


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departments
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Group
        fields = '__all__'


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    # groups = GroupSerializer(many=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")



class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )

    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('staff_id', 'password', 'password2', 'email', 'first_name', 'last_name', 'signature', 'department', 'phone_number') 
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'staff_id': {'required': True},
            'signature': {'required': True},
            'department': {'required': True},
            'phone_number': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            staff_id=validated_data['staff_id'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            signature = validated_data['signature'],
            department = validated_data['department'],
            phone_number = validated_data['phone_number']
        )

        
        user.set_password(validated_data['password'])
        user.save()

        return user

# To be moved to a new app

class PurchaseRequisitionSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField("get_requester_name")
    requester_signature = serializers.SerializerMethodField("get_requester_signature")
    finance_officer_signature = serializers.SerializerMethodField("get_finance_officer_signature")
    finance_officer_name = serializers.SerializerMethodField("get_finance_officer_name")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    CEO_name = serializers.SerializerMethodField("get_CEO_name")
    CEO_signature = serializers.SerializerMethodField("get_CEO_signature")
    account_code_value = serializers.SerializerMethodField("get_account_code_value")
    
    def get_requester_name(self, PurchaseRequisition):
        requester_name = PurchaseRequisition.requester_name
        return requester_name

    def get_supervisor_signature(self, PurchaseRequisition):
        supervisor_signature = PurchaseRequisition.supervisor_signature
        return supervisor_signature

    def get_finance_officer_signature(self, PurchaseRequisition):
        finance_officer_signature = PurchaseRequisition.finance_officer_signature
        return finance_officer_signature

    def get_finance_officer_name(self, PurchaseRequisition):
        finance_officer_name = PurchaseRequisition.finance_officer_name
        return finance_officer_name

    def get_requester_signature(self, PurchaseRequisition):
        requester_signature = PurchaseRequisition.requester_signature
        return requester_signature

    def get_supervisor_name(self, PurchaseRequisition):
        supervisor_name = PurchaseRequisition.supervisor_name
        return supervisor_name

    def get_CEO_name(self, PurchaseRequisition):
        CEO_name = PurchaseRequisition.CEO_name
        return CEO_name

    def get_CEO_signature(self, PurchaseRequisition):
        CEO_signature = PurchaseRequisition.CEO_signature
        return CEO_signature
    
    def get_account_code_value(self, PurchaseRequisition):
        account_code_value = PurchaseRequisition.account_code_value
        return account_code_value

    class Meta:
        model = PurchaseRequisition
        fields = '__all__'

class CEOSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChiefExecutiveOfficer
        fields = '__all__'

class FinanceStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceStaff
        fields = '__all__'

class AccountCodesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceAccountCodes
        fields = '__all__'

class SupervisorApprovedPurchaseRequisitionsSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField("get_requester_name")
    requester_signature = serializers.SerializerMethodField("get_requester_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    class Meta:
        model = SupervisorApprovedPurchaseRequisitions
        fields = '__all__'

    def get_requester_name(self, SupervisorApprovedPurchaseRequisitions):
        requester_name = SupervisorApprovedPurchaseRequisitions.requester_name
        return requester_name

    def get_requester_signature(self, SupervisorApprovedPurchaseRequisitions):
        requester_signature = SupervisorApprovedPurchaseRequisitions.requester_signature
        return requester_signature

    def get_supervisor_name(self, SupervisorApprovedPurchaseRequisitions):
        supervisor_name = SupervisorApprovedPurchaseRequisitions.supervisor_name
        return supervisor_name

    def get_supervisor_signature(self, SupervisorApprovedPurchaseRequisitions):
        supervisor_signature = SupervisorApprovedPurchaseRequisitions.supervisor_signature
        return supervisor_signature

    
class FinanceApprovedPurchaseRequisitionsSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField("get_requester_name")
    requester_signature = serializers.SerializerMethodField("get_requester_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    finance_officer_signature = serializers.SerializerMethodField("get_finance_officer_signature")
    finance_officer_name = serializers.SerializerMethodField("get_finance_officer_name")
    class Meta: 
        model = FinanceApprovedPurchaseRequisitions
        fields = '__all__'

    def get_requester_name(self,  FinanceApprovedPurchaseRequisitions):
        requester_name =  FinanceApprovedPurchaseRequisitions.requester_name
        return requester_name

    def get_requester_signature(self,  FinanceApprovedPurchaseRequisitions):
        requester_signature =  FinanceApprovedPurchaseRequisitions.requester_signature
        return requester_signature

    def get_supervisor_name(self, SupervisorApprovedPurchaseRequisitions):
        supervisor_name = SupervisorApprovedPurchaseRequisitions.supervisor_name
        return supervisor_name

    def get_supervisor_signature(self, SupervisorApprovedPurchaseRequisitions):
        supervisor_signature = SupervisorApprovedPurchaseRequisitions.supervisor_signature
        return supervisor_signature

    def get_finance_officer_signature(self, FinanceApprovedPurchaseRequisitions):
        finance_officer_signature = FinanceApprovedPurchaseRequisitions.finance_officer_signature
        return finance_officer_signature

    def get_finance_officer_name(self, FinanceApprovedPurchaseRequisitions):
        finance_officer_name = FinanceApprovedPurchaseRequisitions.finance_officer_name
        return finance_officer_name

class CEOApprovedPurchaseRequisitionsSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField("get_requester_name")
    requester_signature = serializers.SerializerMethodField("get_requester_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    finance_officer_signature = serializers.SerializerMethodField("get_finance_officer_signature")
    finance_officer_name = serializers.SerializerMethodField("get_finance_officer_name")
    CEO_name = serializers.SerializerMethodField("get_CEO_name")
    CEO_signature = serializers.SerializerMethodField("get_CEO_signature")
    class Meta:
        model = CEOApprovedPurchaseRequisitions
        fields = '__all__'

    def get_requester_name(self,  FinanceApprovedPurchaseRequisitions):
        requester_name =  FinanceApprovedPurchaseRequisitions.requester_name
        return requester_name

    def get_requester_signature(self,  FinanceApprovedPurchaseRequisitions):
        requester_signature =  FinanceApprovedPurchaseRequisitions.requester_signature
        return requester_signature

    def get_supervisor_name(self, SupervisorApprovedPurchaseRequisitions):
        supervisor_name = SupervisorApprovedPurchaseRequisitions.supervisor_name
        return supervisor_name

    def get_supervisor_signature(self, SupervisorApprovedPurchaseRequisitions):
        supervisor_signature = SupervisorApprovedPurchaseRequisitions.supervisor_signature
        return supervisor_signature

    def get_finance_officer_signature(self, FinanceApprovedPurchaseRequisitions):
        finance_officer_signature = FinanceApprovedPurchaseRequisitions.finance_officer_signature
        return finance_officer_signature

    def get_finance_officer_name(self, FinanceApprovedPurchaseRequisitions):
        finance_officer_name = FinanceApprovedPurchaseRequisitions.finance_officer_name
        return finance_officer_name

    def get_CEO_name(self, CEOApprovedPurchaseRequisitions):
        CEO_name = CEOApprovedPurchaseRequisitions.CEO_name
        return CEO_name

    def get_CEO_signature(self, CEOApprovedPurchaseRequisitions):
        CEO_signature = CEOApprovedPurchaseRequisitions.CEO_signature
        return CEO_signature

    
class TaxiLogisticsSerializer(serializers.ModelSerializer):
    project_name = serializers.SerializerMethodField("get_project_name")
    staff_name = serializers.SerializerMethodField("get_staff_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    class Meta:
        model = TaxiLogistics
        fields = '__all__'

    def get_project_name(self, TaxiLogistics):
        project_name =  TaxiLogistics.project_name
        return project_name

    def get_staff_name(self, TaxiLogistics):
        staff_name =  TaxiLogistics.staff_name
        return staff_name

    def get_supervisor_signature(self, TaxiLogistics):
        supervisor_signature =  TaxiLogistics.supervisor_signature
        return supervisor_signature



class TaxiLogisticsSupervisorSerializer(serializers.ModelSerializer):
    # project_name = serializers.SerializerMethodField("get_project_name")
    # staff_name = serializers.SerializerMethodField("get_staff_name")
    # supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    class Meta:
        model = TaxiLogisticsSupervisor
        fields = '__all__'

class BusinessAdvanceRequestSerializer(serializers.ModelSerializer):
    project_name = serializers.SerializerMethodField("get_project_name")
    finance_signature = serializers.SerializerMethodField("get_finance_signature")
    finance_name = serializers.SerializerMethodField("get_finance_name")
    department_name = serializers.SerializerMethodField("get_department_name")
    requester_name = serializers.SerializerMethodField("get_requester_name")
    supervisor_signature = serializers.SerializerMethodField("get_supervisor_signature")
    supervisor_name = serializers.SerializerMethodField("get_supervisor_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    account_code_value = serializers.SerializerMethodField("get_account_code_value")
    class Meta:
        model = BusinessAdvanceRequest
        fields = '__all__'

    def get_requester_name(self, BusinessAdvanceRequest):
        requester_name = BusinessAdvanceRequest.requester_name
        return requester_name

    def get_finance_name(self, BusinessAdvanceRequest):
        finance_name = BusinessAdvanceRequest.finance_name
        return finance_name

    def get_finance_signature(self, BusinessAdvanceRequest):
        finance_signature = BusinessAdvanceRequest.finance_signature
        return finance_signature

    def get_project_name(self, BusinessAdvanceRequest):
        project_name = BusinessAdvanceRequest.project_name
        return project_name

    def get_department_name(self, BusinessAdvanceRequest):
        department_name = BusinessAdvanceRequest.department_name
        return department_name


    def get_supervisor_signature(self, BusinessAdvanceRequest):
        supervisor_signature = BusinessAdvanceRequest.supervisor_signature
        return supervisor_signature

    def get_supervisor_name(self, BusinessAdvanceRequest):
        supervisor_name = BusinessAdvanceRequest.supervisor_name
        return supervisor_name

    def get_staff_signature(self, BusinessAdvanceRequest):
        staff_signature = BusinessAdvanceRequest.staff_signature
        return staff_signature

    def get_account_code_value(self, BusinessAdvanceRequest):
        account_code_value = BusinessAdvanceRequest.account_code_value
        return account_code_value

class BARSupervisorSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField("get_amount")
    
    
    class Meta:
        model = BARSupervisor
        fields = '__all__'
        
    def get_amount(self, BARSupervisor):
        amount = BARSupervisor.amount
        return amount
    

class BARFinanceSerializer(serializers.ModelSerializer):
    amount = serializers.SerializerMethodField("get_amount")
    department = serializers.SerializerMethodField("get_department")
    requester_name = serializers.SerializerMethodField("get_requester_name")
    requester_signature = serializers.SerializerMethodField("get_requester_signature")
    requester_signature = serializers.SerializerMethodField("get_requester_signature")
    requested_date = serializers.SerializerMethodField("get_requested_date")
    
    class Meta:
        model = BARFinance
        fields = '__all__'

    def get_amount(self, BARFinance):
        amount = BARFinance.amount
        return amount
    
    def get_department(self, BARFinance):
        department = BARFinance.department
        return department

    def get_requester_name(self, BARFinance):
        requester_name = BARFinance.requester_name
        return requester_name
    
    def get_requester_signature(self, BARFinance):
        requester_signature = BARFinance.requester_signature
        return requester_signature

    def get_requested_date(self, BARFinance):
        requested_date = BARFinance.requested_date
        return requested_date

class BusinessExpenseSerializer(serializers.ModelSerializer):
    advance_amount = serializers.SerializerMethodField("get_advance_amount")
    description = serializers.SerializerMethodField("get_description")
    requester_name = serializers.SerializerMethodField("get_requester_name")
    department_name = serializers.SerializerMethodField("get_department_name")
    staff_signature = serializers.SerializerMethodField("get_staff_signature")
    finance_signature = serializers.SerializerMethodField("get_finance_signature")
    finance_name = serializers.SerializerMethodField("get_finance_name")

    class Meta:
        model = BusinessExpenseReport
        fields = '__all__'

    def get_requester_name(self, BusinessExpenseReport):
        requester_name = BusinessExpenseReport.requester_name
        return requester_name


    def get_advance_amount(self, BusinessExpenseReport):
        advance_amount = BusinessExpenseReport.advance_amount
        return advance_amount

    def get_description(self, BusinessExpenseReport):
        description = BusinessExpenseReport.description
        return description

    def get_department_name(self, BusinessExpenseReport):
        department_name = BusinessExpenseReport.department_name
        return department_name
    
    def get_staff_signature(self, BusinessExpenseReport):
        staff_signature = BusinessExpenseReport.staff_signature
        return staff_signature

    def get_finance_name(self, BusinessExpenseReport):
        finance_name = BusinessExpenseReport.finance_name
        return finance_name

    def get_finance_signature(self, BusinessExpenseReport):
        finance_signature = BusinessExpenseReport.finance_signature
        return finance_signature

class BusinessExpenseFinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessExpenseReportFinance
        fields = '__all__'

class RequestPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    class Meta:
        fields = '__all__'

    def validate(self, attrs):
        return super().validate(attrs)

class PasswordResetConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=8, max_length=200, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = '__all__'

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            id = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed(
                    'The password reset link is invalid.', 401)
            user.set_password(password)
            user.save()
            return user
        except Exception as e:
            raise AuthenticationFailed(
                'The password reset link is invalid.', 401)
    