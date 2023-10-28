from django.urls import path
from . import views

urlpatterns = [
    #path('register/', views.UserCreate.as_view(), name='account-create'),
    path('profile/<str:username>/', views.get_user_profile, name ='get_user_profile'),
]
