from rest_framework import serializers
from chat.models import Message, ChatRoom, Chatter

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ("sender", "avatar_color", "message") #'__all__'
        
class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'
        
class ChatterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chatter
        fields = '__all__'