from .models import *
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
User = get_user_model()


@receiver(post_save, sender=Supervisors)
def supervisors_mgt(sender, instance, created, **kwargs):
    if created:
        group = Group.objects.get(name='Supervisors')
        group.user_set.add(instance.name.id)

@receiver(post_save, sender=FinanceStaff)
def financestaff_mgt(sender, instance, created, **kwargs):
    if created:
        group = Group.objects.get(name='Finance')
        group.user_set.add(instance.staff.id)

@receiver(post_save, sender=ChiefExecutiveOfficer)
def ceo_mgt(sender, instance, created, **kwargs):
    if created:
        group = Group.objects.get(name='CEO')
        group.user_set.add(instance.ceo.id)