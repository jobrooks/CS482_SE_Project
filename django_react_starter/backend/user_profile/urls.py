from django.urls import path
from . import views

urlpatterns = [
    path('profile/<str:token>/', views.get_user_profile, name='get_user_profile'),
    path('profile/tabletheme/<str:token>/', views.TableTheme.as_view(), name='table_theme'),
    path('profile/cardbacking/<str:token>/', views.CardBacking.as_view(), name='card_backing'),
]
