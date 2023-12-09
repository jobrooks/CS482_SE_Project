from rest_framework.views import APIView
from django.http import Http404
from django.shortcuts import HttpResponse
from django.http import JsonResponse
from chat.serializers import MessageSerializer, ChatRoomSerializer, ChatterSerializer
from chat.models import ChatRoom, Chatter, Message
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

class Invite(APIView):
    def post(self, request, username, *args, **kwargs):
        try:
            body_unicode = request.body.decode('utf-8')
            body = json.loads(body_unicode)
            serialized_text_data = {"game_id": body["game_id"], "sender": body["sender"]} # Should be form of request
            layer = get_channel_layer()
            async_to_sync(layer.group_send)(
                username, {"type": "invite_notice", "serialized_text_data": serialized_text_data}
            )
            print("sent to group: " + username)
            return HttpResponse(status=200)
        except:
            return HttpResponse(status=401)
        
# class AcceptInvite(APIView):
#     def post(self, request, )