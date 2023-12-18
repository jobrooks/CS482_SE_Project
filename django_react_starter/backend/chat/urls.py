from django.urls import path
from . import views

urlpatterns = [
    path('get_chat_history/<str:group_name>', views.ChatHistory.as_view(), name='search_users'),
]