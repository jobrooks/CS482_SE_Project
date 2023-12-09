from django.urls import re_path
from django.urls import path

import gamechannel.consumers

websocket_urlpatterns = [
    re_path(r"ws/gamechannel/(?P<game_id>\w+)$", gamechannel.consumers.GameConsumer.as_asgi()),
]