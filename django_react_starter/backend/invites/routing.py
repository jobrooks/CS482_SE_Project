from django.urls import re_path
from django.urls import path

import invites.consumers

websocket_urlpatterns = [
    re_path(r"ws/invites/(?P<username>\w+)$", invites.consumers.InviteConsumer.as_asgi()),
]