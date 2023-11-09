from django.urls import path
from . import views

urlpatterns = [
    # Other URL patterns...
    path('profile/<str:token>/', views.get_user_profile, name='get_user_profile'),
]
