from django.db import models
from django.contrib.auth import get_user_model
from PIL import Image
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django import forms
from django.core.validators import RegexValidator
from django.contrib.sites.shortcuts import get_current_site
from .utils import *
from utils import *

api_url = api_url

class Departments(models.Model):
    department = models.CharField(max_length=200)

    def __str__(self):
        return self.department

    class Meta:
        verbose_name_plural = "Departments"


class MyAccountManager(BaseUserManager):
    def create_user(self, first_name, last_name, email, staff_id, phone_number, department, signature, password=None):
        
        if not first_name:
            raise ValueError('Users must have a first_name')
        if not last_name:
            raise ValueError('Users must have a last_name')
        if not email:
            raise ValueError('Please input your email')
        if not staff_id:
            raise ValueError('Please input your staff ID')
        if not department:
            raise ValueError('Please Select your department')
        if not phone_number:
            raise ValueError('Please input your phone number')
        if not signature:
            raise ValueError('Please upload your signature')

        user = self.model(
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            staff_id=staff_id,
            department=department,
            phone_number=phone_number,
            signature=signature
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, first_name, last_name, email, staff_id, phone_number, department, signature, password):
        user = self.create_user(
            first_name=first_name,
            last_name=last_name,
            email=self.normalize_email(email),
            staff_id=staff_id,
            phone_number=phone_number,
            password=password,
            department=department,
            signature=signature
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class customuser(AbstractBaseUser, PermissionsMixin):
    date_joined = models.DateTimeField(verbose_name='date joined', auto_now_add=True)
    last_login = models.DateTimeField(verbose_name='last login', auto_now=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(verbose_name="email", max_length=60, unique=True)
    staff_id = models.CharField(max_length=15, unique=True)
    phone_number=models.CharField(max_length=15, unique=True)
    department=models.ForeignKey(Departments, on_delete=models.CASCADE)
    signature = models.ImageField(null=True, blank=True, upload_to = "signatures")
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number', 'staff_id']

    objects = MyAccountManager()

    def __str__(self):
        return f'{self.first_name}, Staff ID: {self.staff_id}'
    # For checking permissions. to keep it simple all admin have ALL permissons
    def has_perm(self, perm, obj=None):
        return self.is_admin

    # Does this user have permission to view this app? (ALWAYS YES FOR SIMPLICITY)
    def has_module_perms(self, app_label):
        return True


User = get_user_model()

class Supervisors(models.Model):
    name = models.ForeignKey(User, on_delete = models.CASCADE)

    class Meta:
        verbose_name_plural = "supervisors"

    @property
    def supervisor_name(self):
        return self.name.first_name
    
    def __str__(self):
        return f'{self.name.first_name}'

class FinanceStaff(models.Model):
    staff = models.ForeignKey(User, on_delete = models.CASCADE)

    class Meta:
        verbose_name_plural = 'Finance Staff'

    def __str__(self):
        return self.staff.first_name

class ChiefExecutiveOfficer(models.Model):
    ceo = models.ForeignKey(User, on_delete = models.CASCADE)

    class Meta:
        verbose_name_plural = 'CEO'

    def __str__(self):
        return self.ceo.first_name



class FinanceAccountCodes(models.Model):
    account = models.CharField(max_length = 30, null=True)
    name = models.CharField(max_length = 30, null=True)

    class Meta:
        verbose_name_plural = 'Account Codes'

    def __str__(self):
        return self.name


class PurchaseRequisition(models.Model):
    activity = models.CharField(max_length = 70)
    account_code = models.ForeignKey(FinanceAccountCodes, on_delete = models.CASCADE)
    description = models.TextField()
    amount = models.PositiveIntegerField()
    requested_by = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "PurReqrequester")
    date_requested = models.DateTimeField(auto_now_add = True)
    reviewing_supervisor = models.ForeignKey(Supervisors, on_delete = models.CASCADE)
    supervisor_approved = models.BooleanField(default=False)
    supervisor_comments = models.TextField(null=True, blank=True)
    reviewing_finance_officer = models.ForeignKey(FinanceStaff, on_delete = models.CASCADE, null=True, blank=True)
    finance_approved = models.BooleanField(default=False)
    finance_comments = models.TextField(null=True, blank=True)
    ceo_approval = models.ForeignKey(ChiefExecutiveOfficer, on_delete = models.CASCADE, null=True, blank=True)
    ceo_approved = models.BooleanField(default=False)
    ceo_comments = models.TextField(null=True, blank=True)
    date_supervisor_review = models.DateTimeField(blank=True, null=True)
    date_finace_officer_review = models.DateTimeField(blank=True, null=True)
    date_ceo_approval = models.DateTimeField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Purchase Requisition'
        ordering = ['ceo_approved', 'finance_approved', 'supervisor_approved', '-id']

    @property
    def requester_name(self):
        return f'{self.requested_by.first_name} {self.requested_by.last_name}'

    @property
    def requester_signature(self):
        return f'{api_url}media/{self.requested_by.signature}'

    @property
    def account_code_value(self):
        return f'{self.account_code.account}'

    @property
    def supervisor_name(self):
        return f'{self.reviewing_supervisor.name.first_name} {self.reviewing_supervisor.name.last_name}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.reviewing_supervisor.name.signature}'

    @property
    def finance_officer_signature(self):
        try: 
            return f'{api_url}media/{self.reviewing_finance_officer.staff.signature}'
        except AttributeError:
            return f'To be approved by finance'

    @property
    def finance_officer_name(self):
        try: 
            return f'{self.reviewing_finance_officer.staff.first_name} {self.reviewing_finance_officer.staff.last_name}'
        except AttributeError:
            return f'To be approved by finance'

    @property
    def CEO_signature(self):
        try: 
            return f'{api_url}media/{self.ceo_approval.ceo.signature}'
        except AttributeError:
            return f'To be approved by CEO'

    @property
    def CEO_name(self):
        try: 
            return f'{self.ceo_approval.ceo.first_name} {self.ceo_approval.ceo.last_name}'
        except AttributeError:
            return f'To be approved by CEO'

    def __str__(self):
        return self.activity


class SupervisorApprovedPurchaseRequisitions(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    requisition = models.OneToOneField(PurchaseRequisition, on_delete = models.CASCADE)
    supervisor = models.ForeignKey(Supervisors, on_delete = models.CASCADE)
    supervisor_approved = models.BooleanField(default=False)
    supervisor_disapproved = models.BooleanField(default = False)
    disapproval_message = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Supervisor Approved Purchase Requisitions'
        ordering = ['-id']

    @property
    def requester_name(self):
        return f'{self.requisition.requested_by.first_name} {self.requisition.requested_by.last_name}'

    @property
    def requester_signature(self):
        return f'{api_url}media/{self.requisition.requested_by.signature}'

    @property
    def supervisor_name(self):
        return f'{self.supervisor.name.first_name} {self.supervisor.name.last_name}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.supervisor.name.signature}'

    def __str__(self):
        return f'{self.requisition.activity}'
        
class FinanceApprovedPurchaseRequisitions(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    requisition = models.OneToOneField(SupervisorApprovedPurchaseRequisitions, on_delete = models.CASCADE)
    finance_staff = models.ForeignKey(FinanceStaff, on_delete = models.CASCADE)
    finance_approved = models.BooleanField(default=False)
    finance_disapproved = models.BooleanField(default = False)
    disapproval_message = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'Finance Approved Purchase Requisitions'
        ordering = ['-id']

    @property
    def requester_name(self):
        return f'{self.requisition.requisition.requested_by.first_name} {self.requisition.requisition.requested_by.last_name}'

    @property
    def requester_signature(self):
        return f'{api_url}media/{self.requisition.requisition.requested_by.signature}'

    @property
    def supervisor_name(self):
        return f'{self.requisition.requisition.reviewing_supervisor.name.first_name} {self.requisition.requisition.reviewing_supervisor.name.last_name}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.requisition.requisition.reviewing_supervisor.name.signature}'

    @property
    def finance_officer_signature(self):
        return f'{api_url}media/{self.requisition.requisition.reviewing_finance_officer.staff.signature}'
        
    @property
    def finance_officer_name(self):

        return f'{self.requisition.requisition.reviewing_finance_officer.staff.first_name} {self.requisition.requisition.reviewing_finance_officer.staff.last_name}'

    def __str__(self):
        return f'{self.requisition.requisition.activity}'

class CEOApprovedPurchaseRequisitions(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    requisition = models.ForeignKey(FinanceApprovedPurchaseRequisitions, on_delete = models.CASCADE)
    ceo = models.ForeignKey(ChiefExecutiveOfficer, on_delete = models.CASCADE)
    ceo_approved = models.BooleanField(default=False)
    ceo_disapproved = models.BooleanField(default = False)
    disapproval_message = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'CEO Approved Purchase Requisitions'
        ordering = ['-id']

    @property
    def requester_name(self):
        return f'{self.requisition.requisition.requisition.requested_by.first_name} {self.requisition.requisition.requisition.requested_by.last_name}'

    @property
    def requester_signature(self):
        return f'{api_url}media/{self.requisition.requisition.requisition.requested_by.signature}'

    @property
    def supervisor_name(self):
        return f'{self.requisition.requisition.requisition.reviewing_supervisor.name.first_name} {self.requisition.requisition.requisition.reviewing_supervisor.name.last_name}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.requisition.requisition.requisition.reviewing_supervisor.name.signature}'

    @property
    def finance_officer_signature(self):
        return f'{api_url}media/{self.requisition.finance_staff.staff.signature}'
       

    @property
    def finance_officer_name(self):
        return f'{self.requisition.finance_staff.staff.first_name} {self.requisition.finance_staff.staff.last_name}'

    @property
    def CEO_signature(self):
        return f'{api_url}media/{self.ceo.ceo.signature}'

    @property
    def CEO_name(self):
        return f'{self.ceo.ceo.first_name} {self.ceo.ceo.last_name}'

class Projects(models.Model):
    project = models.CharField(max_length = 30)

    class Meta:
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.project

class TaxiLogistics(models.Model):
    date = models.DateTimeField(auto_now_add = True)
    staff_booking_taxi = models.ForeignKey(User, on_delete = models.CASCADE)
    location_from = models.CharField(max_length = 100)
    location_to = models.CharField(max_length = 100)
    project = models.ForeignKey(Projects, on_delete = models.CASCADE)
    supervisor = models.ForeignKey(Supervisors, on_delete = models.CASCADE, null = True)
    supervisor_approved = models.BooleanField(default = False)
    supervisor_comment = models.TextField(blank = True, null = True)
    date_approved = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.staff_booking_taxi.first_name

    class Meta:
        verbose_name_plural = 'TaxiLogistics'
        ordering = ['supervisor_approved', '-id']

    @property
    def project_name(self):
        return f'{self.project}'

    @property
    def staff_name(self):
        return f'{self.staff_booking_taxi.first_name} {self.staff_booking_taxi.last_name}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.supervisor.name.signature}'


class TaxiLogisticsSupervisor(models.Model):
    request = models.OneToOneField(TaxiLogistics, on_delete = models.CASCADE)
    approved = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete = models.CASCADE)

    class Meta:
        ordering = ['-id']

    def __str__(self):
        return self.request.supervisor.name.first_name

class BusinessAdvanceRequest(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    staff = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.PositiveIntegerField()
    account = models.ForeignKey(FinanceAccountCodes, on_delete=models.CASCADE)
    project = models.ForeignKey(Projects, on_delete=models.CASCADE)
    description = models.TextField()
    supervisor = models.ForeignKey(Supervisors, on_delete = models.CASCADE)
    approved = models.BooleanField(default=False)
    supervisor_comment = models.TextField(blank = True, null = True)
    finance_staff = models.ForeignKey(FinanceStaff, on_delete = models.CASCADE, null=True, blank=True)
    finance_reviewed = models.BooleanField(default=False)
    finance_comment = models.TextField(blank = True, null = True)
    reported = models.BooleanField(default=False)

    class Meta:
        ordering = ['finance_reviewed', 'approved', '-id']

    @property
    def project_name(self):
        return self.project.project

    @property
    def requester_name(self):
        return f'{self.staff.first_name} {self.staff.last_name}'

    @property
    def department_name(self):
        return f'{self.staff.department}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.supervisor.name.signature}'

    @property
    def finance_signature(self):
        if self.finance_staff:
            return f'{api_url}media/{self.finance_staff.staff.signature}'
        else:
            return None

    @property
    def finance_name(self):
        if self.finance_staff:
            return f'{self.finance_staff.staff.first_name} {self.finance_staff.staff.last_name}'
        else: 
            return None

    @property
    def supervisor_name(self):
        return f'{self.supervisor.name.first_name} {self.supervisor.name.last_name}'

    @property
    def staff_signature(self):
        return f'{api_url}media/{self.staff.signature}'

    @property
    def account_code_value(self):
        return f'{self.account.account}'

    def __str__(self):
        return f'{self.staff.first_name} {self.staff.last_name}'

class BARSupervisor(models.Model):
    request = models.OneToOneField(BusinessAdvanceRequest, on_delete = models.CASCADE)
    approved = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete = models.CASCADE)

    class Meta:
        ordering = ['-id']
        verbose_name_plural = 'BARSupervisor'

    @property
    def amount(self):
        return self.request.amount


    def __str__(self):
        return self.request.supervisor.name.first_name

class BARFinance(models.Model):
    request = models.OneToOneField(BARSupervisor, on_delete = models.CASCADE)
    approved = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete = models.CASCADE)

    class Meta:
        ordering = ['-id']
        verbose_name_plural = 'BARFinance'

    @property
    def amount(self):
        return self.request.request.amount

    @property
    def department(self):
        return self.request.request.staff.department.department

    @property
    def requester_name(self):
        return f'{self.request.request.staff.first_name} {self.request.request.staff.last_name}'

    @property
    def requester_signature(self):
        return f'{api_url}media/{self.request.request.staff.signature}'

    @property
    def requested_date(self):
        return self.request.request.date

    @property
    def supervisor_name(self):
        return f'{self.request.request.supervisor.name.first_name} {self.request.request.supervisor.name.last_name}'
    
    @property
    def supervisor_signature(self):
        return self.request.request.supervisor.name.signature

    def __str__(self):
        return f'{self.request.request.date}'

class BusinessExpenseReport(models.Model):
    request = models.OneToOneField(BARFinance, on_delete = models.CASCADE)
    purpose = models.CharField(max_length = 255)
    receipt_no = models.CharField(max_length = 255)
    date = models.DateTimeField(auto_now_add = True)
    total = models.PositiveIntegerField()
    total_reimbursed = models.IntegerField()
    Finance_staff = models.ForeignKey(FinanceStaff, on_delete = models.CASCADE, blank=True, null=True)
    receipt = models.ImageField(upload_to='receipts', null=True, blank=True)
    approved = models.BooleanField(default = False)
    date_approved = models.DateTimeField(blank=True, null=True)
    finance_comments = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = 'BusinessExpenseReport'
        ordering = ['-id']

    @property
    def requester_name(self):
        return f'{self.request.request.request.staff.first_name} {self.request.request.request.staff.last_name}'

    @property
    def advance_amount(self):
        return self.request.request.request.amount

    @property
    def description(self):
        return self.request.request.request.description 


    @property
    def department_name(self):
        return f'{self.request.request.request.staff.department}'

    @property
    def staff_signature(self):
        return f'{api_url}media/{self.request.request.request.staff.signature}'

    @property
    def finance_date(self):
        return f'{self.request.request.request.staff.date}'

    @property
    def finance_name(self):
        if self.Finance_staff:
            return f'{self.Finance_staff.staff.first_name} {self.Finance_staff.staff.last_name}'
        else:
            return None

    @property
    def finance_signature(self):
        if self.Finance_staff:
            return f'{api_url}media/{self.Finance_staff.staff.signature}'
        else:
            return None

    def __str__(self):
        return self.purpose


class BusinessExpenseReportFinance(models.Model):
    request = models.OneToOneField(BusinessExpenseReport, on_delete=models.CASCADE)
    finance_staff = models.ForeignKey(FinanceStaff, on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = 'BusinessExpenseReportFinance'
        ordering = ['-id']

    def __str__(self):
        return self.request.purpose

