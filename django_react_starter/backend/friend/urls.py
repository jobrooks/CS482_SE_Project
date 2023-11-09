from django.urls import path
from . import views

urlpatterns = [
    # Other URL patterns...
    path('search_users/', views.search_users, name='search_users'),
]