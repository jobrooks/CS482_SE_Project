from django.urls import path
from . import views

urlpatterns = [
    path('register'),
    path('login'),
    path('logout'),
    path('user'),
]