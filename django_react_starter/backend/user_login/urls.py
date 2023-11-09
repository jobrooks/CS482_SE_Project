from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.UserLogin.as_view(), name='login'),
    path('login-page/', views.login_user, name='login-page'),
    path('logout/', views.logout_view, name='logout'),
]