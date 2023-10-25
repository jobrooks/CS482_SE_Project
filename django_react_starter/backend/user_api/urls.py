from django.urls import path
from . import views

urlpatterns = [
    path('api/', views.UserCreate.as_view(), name='account-create'),
]
