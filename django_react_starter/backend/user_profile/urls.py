from django.urls import path
from . import views

urlpatterns = [
    path('profile/<str:token>/', views.GetUserProfile.as_view(), name='get_user_profile'),
    path('profile/edit/<str:token>/', views.UpdateUserProfile.as_view(), name='update_user_profile'),
    path('validate/<str:username>/', views.CheckUserExists.as_view(), name='check_user'),
    path('question/<str:username>/', views.GetSecurityQuestion.as_view(), name='get_security_question'),
    path('verify-security-answer/', views.VerifyAnswer.as_view(), name='verify_security_answer'),
    path('reset-password/', views.UpdateUserPassword.as_view(), name='reset_password'),
    path('profile/getuserprofile/<str:username>/', views.GetOtherUserProfile.as_view(), name='get_other_user_profile'),
    path('profile/getguestprofile/<str:username>/', views.GetGuestProfile.as_view(), name='get_guest_profile'),
    path('profile/tabletheme/<str:token>/', views.TableTheme.as_view(), name='table_theme'),
    path('profile/cardbacking/<str:token>/', views.CardBacking.as_view(), name='card_backing'),
    path('profile/guesttabletheme/<str:username>/', views.GuestTableTheme.as_view(), name='guest_table_theme'),
    path('profile/guestcardbacking/<str:username>/', views.GuestCardBacking.as_view(), name='guest_card_backing'),
    path('profile/avatarcolor/<str:token>/', views.AvatarColor.as_view(), name='avatar_color'),
    path('profile/leaderboard', views.Leaderboard.as_view(), name='leaderboard'),
    path('profile/isadmin/<str:token>/', views.IsAdmin.as_view(), name='is_admin'),
    path('profile/usermanager/<str:token>/<int:page>/', views.Adminpage.as_view(), name='admin_page'),
    path('edit-page/', views.edit_profile, name='edit-page'),
]
