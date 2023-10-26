from django.urls import path
from . import views

urlpatterns = [
    #path('register/', views.UserCreate.as_view(), name='account-create'),
    path('profile/', views.get_user_profile),
]
