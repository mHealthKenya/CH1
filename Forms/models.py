from django.contrib.auth import get_user_model
from django.db import models
from Users.models import *

User = get_user_model()
api_url = "http://api-finance-docs.mhealthkenya.co.ke/"

class LodgingMIE(models.Model):
    lodging = models.PositiveIntegerField()
    mie = models.PositiveIntegerField()

    def __str__(self):
        return f'Lodging- {self.lodging}, mie -{self.mie}'

    class Meta:
        verbose_name_plural = 'LodgingMIE'

class TravelAuthorization(models.Model):
    staff = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    destination = models.CharField(max_length = 20)
    purpose = models.TextField()
    period = models.CharField(max_length = 20)
    project_to_charge = models.ForeignKey(Projects, on_delete = models.CASCADE)
    accommodation = models.BooleanField(default=False)
    airticket = models.BooleanField(default=False)
    taxi = models.BooleanField(default=False)
    supervisor = models.ForeignKey(Supervisors, on_delete = models.CASCADE)
    approved = models.BooleanField(default = False)
    supervisor_comment = models.TextField(null=True)
    date_approved = models.DateTimeField(blank=True, null=True)
    mieandlodging = models.ForeignKey(LodgingMIE, default = 1, on_delete = models.SET_NULL, null=True)

    @property
    def staff_name(self):
        return f'{self.staff.first_name} {self.staff.last_name}'

    @property
    def staff_signature(self):
        return f'{api_url}media/{self.staff.signature}'

    @property
    def staff_phone(self):
        return f'{self.staff.phone_number}'

    @property
    def staff_department(self):
        return f'{self.staff.department}'

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.supervisor.name.signature}'

    @property
    def supervisor_name(self):
        return f'{self.supervisor.name.first_name} {self.supervisor.name.last_name}'

    @property
    def project_name(self):
        return self.project_to_charge.project

    @property
    def total(self):
        if int(self.period) == 1:
            return 0.75 * self.mieandlodging.mie
        elif int(self.period) == 0:
            return 0
        else:
            return (self.mieandlodging.lodging + self.mieandlodging.mie) * int(self.period) - 6700

    def __str__(self):
            return self.purpose

    class Meta:
        verbose_name_plural = 'TravelAuthorization'
        ordering = ['approved', '-id']

class Other(models.Model):
    request = models.ForeignKey(TravelAuthorization, on_delete = models.CASCADE)
    description = models.TextField(blank=True, null=True)
    receipt_no = models.CharField(max_length=200, blank=True, null=True)
    receipt = models.ImageField(upload_to='receipts', blank=True, null=True)
    amount = models.PositiveIntegerField()

    def __str__(self):
        return self.request.purpose

    # class Meta:
    #     verbose_name_plural = 'Other'
    #     ordering = ['-id']


class TravelAuthorizationSupervisor(models.Model):
    request = models.ForeignKey(TravelAuthorization, on_delete = models.CASCADE)
    other = models.ForeignKey(Other, on_delete = models.SET_NULL, blank=True, null =True)
    approved = models.BooleanField(default = False)
    owner = models.ForeignKey(User, on_delete = models.CASCADE)

    def __str__(self):
        return self.request.purpose

    class Meta:
        verbose_name_plural = 'TravelAuthorizationSupervisor'
        ordering = ['-id']

class TravelAuthorizationFinance(models.Model):
    request = models.OneToOneField(TravelAuthorizationSupervisor, on_delete = models.CASCADE)
    # approved = models.BooleanField(default = False)
    # owner = models.ForeignKey(User, on_delete = models.SET_NULL, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'TravelAuthorizationFinance'
        ordering = ['-id']

    def __str__(self):
        return self.request.request.purpose
        

class TravelExpenseReport(models.Model):
    request = models.OneToOneField(TravelAuthorizationSupervisor, on_delete = models.CASCADE)
    # other = models.OneToOneField(Other, on_delete = models.CASCADE, blank=True, null=True)
    receipt_no = models.CharField(max_length=200, blank=True, null=True)
    receipt = models.ImageField(upload_to = 'receipts')
    receipt_other = models.ImageField(upload_to = 'receipts', blank=True, null=True)
    approved = models.BooleanField(default = False)

    def __str__(self):
        return self.request.request.purpose

    @property
    def staff_name(self):
        return f'{self.request.request.staff.first_name} {self.request.request.staff.last_name}'

    @property
    def department_name(self):
        return f'{self.request.request.staff.department}'
    
    @property
    def total(self):
        if int(self.request.request.period) == 0:
            return 0
        elif int(self.request.request.period) == 1:
            return f'{(self.request.request.mieandlodging.mie * 0.75)}'
        else:
            return f'{(self.request.request.mieandlodging.mie + self.request.request.mieandlodging.lodging) * int(self.request.request.period) - 6700}'


    # @property
    # def description_other(self):
    #     return f'{self.other.id}'

    # @property
    # def amount_other(self):
    #     return f'{self.other.amount}'


    # @property
    # def receipt_no_other(self):
    #     return f'{self.other.amount}'


    @property
    def staff_signature(self):
        return f'{api_url}media/{self.request.request.staff.signature}'

    @property
    def purpose(self):
        return {self.request.request.purpose}

    @property
    def date(self):
        return {self.request.request.date}

    @property
    def period(self):
        return {self.request.request.period}

    @property
    def supervisor_signature(self):
        return f'{api_url}media/{self.request.request.supervisor.name.signature}'

    @property
    def date_approved(self):
        return {self.request.request.date_approved}

    @property
    def supervisor_name(self):
        return f'{self.request.request.supervisor.name.first_name} {self.request.request.supervisor.name.last_name}'

    class Meta: 
        verbose_name_plural = 'TravelExpenseReport'
        ordering = ['-id']

class TravelExpenseReportFinance(models.Model):
    request = models.OneToOneField(TravelExpenseReport, on_delete = models.CASCADE)
    approved = models.BooleanField(default = False)
    owner = models.ForeignKey(User, on_delete = models.SET_NULL, blank=True, null=True)

    class Meta:
        verbose_name_plural = 'TravelExpenseReportFinance'
        ordering = ['-id']

    def __str__(self):
        return self.request.request.request.purpose


class mHealthImages(models.Model):
    imagename = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to="images")

    class Meta:
        verbose_name_plural = "mHealthImages"
        ordering = ["-id"]

    def __str__(self):
        return self.imagename