from django.urls import re_path
from django.urls import path

import chat.consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", chat.consumers.ChatConsumer.as_asgi()),
]