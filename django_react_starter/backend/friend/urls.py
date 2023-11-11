from django.urls import path
from . import views

urlpatterns = [
    # Other URL patterns...
    path('search_users/', views.search_users, name='search_users'),
    path('send_requests/<int:receiver_id>', views.send_friend_request, name='send_requests'),
    path('requests/', views.friend_requests, name='request'),
    path('get_username/<int:id>', views.get_username, name='get_username'),
    
]