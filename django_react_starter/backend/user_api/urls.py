from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserCreate.as_view(), name='account-create'),
    path('register-guest/', views.GuestCreate.as_view(), name='guest-create'),
    path('register-page/', views.create_account, name='register-page'),
    path('user-management/<str:token>/<str:username>/', views.UserManagement.as_view(), name='user-management')
]
