from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import EmailMessage

def site(request):
    current_site = get_current_site(request)
    return current_site.domain

class Util:
    @staticmethod
    def send_email(data):
        email = EmailMessage(
            subject=data['email_subject'],
            body=data['email_body'],
            to=[data['to_email']]
        )

        email.send()
