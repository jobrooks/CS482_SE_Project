from django.urls import path
from . import views

urlpatterns = [
    path('invite/<str:username>', views.Invite.as_view(), name='send_invite'),
]