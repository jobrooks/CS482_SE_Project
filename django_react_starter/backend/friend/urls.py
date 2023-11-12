from django.urls import path
from . import views

urlpatterns = [
    # Other URL patterns...
    path('search_users/', views.search_users, name='search_users'),
    path('send_requests/<int:receiver_id>', views.send_friend_request, name='send_requests'),
    path('requests/', views.friend_requests, name='request'),
    path('get_username/<int:id>', views.get_username, name='get_username'),
    path('get_friends/', views.get_friends, name='get_friends'),
    path('accept_requests/<int:request_id>', views.accept_friend_request, name='accept'),
    path('decline_requests/<int:request_id>', views.decline_friend_request, name='decline'),
    path('unfriend/<int:friend_id>', views.unfriend, name='unfriend'),
    
]