from knox import views as knox_views
from .views import *
from django.urls import path, include

urlpatterns = [
     path('login/', LoginView.as_view(), name='knox_login'),
     path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
     path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
     path('register/', RegisterView.as_view(), name='auth_register'),
     path('request/password/reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
     path('passwordreset/<uidb64>/<token>/', TokenCheckAPI.as_view(), name = 'password-reset-confirm'),
     path('passwordreset/complete/', PasswordResetConfirmView.as_view(), name='request-confirmed'),
]
