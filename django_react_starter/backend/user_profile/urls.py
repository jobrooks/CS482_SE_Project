from django.urls import path
from . import views

urlpatterns = [
    # Other URL patterns...
    path('profile/<str:token>/', views.get_user_profile, name='get_user_profile'),
    #path('register/', views.UserCreate.as_view(), name='account-create'),
    path('profile/<str:username>/', views.get_user_profile, name ='get_user_profile'),
    path('profile/tabletheme/<str:token>/', views.TableTheme.as_view(), name='table_theme'),
    path('profile/getusers', views.UserList.as_view(), name='get_users'),
    # path('profile/gettabletheme/<str:token>/', views.get_table_theme, name='get_table_theme')
]
