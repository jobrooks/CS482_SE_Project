from rest_framework.views import APIView
from django.http import Http404
from django.http import JsonResponse
from chat.serializers import MessageSerializer, ChatRoomSerializer, ChatterSerializer
from chat.models import ChatRoom, Chatter, Message

def get_chat_room(group_name):
    try:
        return ChatRoom.objects.get(group_name=group_name)
    except:
        raise Http404

class ChatHistory(APIView):
    def get(self, request, group_name, *args, **kwargs):
        room = get_chat_room(group_name)
        message_history = room.get_chat_history()
        serializer = MessageSerializer(message_history, many=True)
        print(serializer.data)
        return JsonResponse({"messages": serializer.data}, status=200)