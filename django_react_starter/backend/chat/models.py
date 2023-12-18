from django.db import models
from user_api.models import User

class ChatRoom(models.Model):
    CHAT_TYPE_CHOICES = [
        ("global", "Global"),
        ("game", "Game"),
        ("friend", "Friend"),
    ]
    
    group_name = models.CharField(max_length=255, primary_key=True)
    chat_type = models.CharField(max_length=255, choices=CHAT_TYPE_CHOICES, null=True, blank=True)
    
    def get_ChatRoom(group_name, chat_type):
        try:
            return ChatRoom.objects.get(group_name=group_name, chat_type=chat_type)
        except ChatRoom.DoesNotExist:
            return None
    
    def get_chat_history(self):
        messages = Message.objects.filter(chat_room=ChatRoom.objects.get(group_name=self.group_name)) # Probably needs some restriction on how many are returned
        return messages
    
    def send_message(self, serialized_text_data):
        new_message = Message.create(serialized_text_data, ChatRoom.objects.get(group_name=self.group_name), Chatter.get(serialized_text_data["sender"], ChatRoom.objects.get(group_name=self.group_name)))
        
    def get(group_name, chat_type):
        existing_chat = ChatRoom.get_ChatRoom(group_name=group_name, chat_type=chat_type)
        if existing_chat:
            return existing_chat
        else: # Make a new chat room
            chat_room = ChatRoom(group_name=group_name, chat_type=chat_type)
            chat_room.save()
            return chat_room
    
    def __str__(self):
        return "group_name: " + self.group_name + " type: " + self.chat_type
        

class Chatter(models.Model):
    
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    chat_room = models.ForeignKey(ChatRoom(), on_delete=models.CASCADE)
    
    def get_Chatter(user, chat_room):
        try:
            return Chatter.objects.get(user=user, chat_room=chat_room)
        except Chatter.DoesNotExist:
            return None
    
    def get(username, chat_room):
        user = User.objects.get(username=username)
        if user: # Check user exists
            chatting_user = Chatter.get_Chatter(user=user, chat_room=chat_room)
            if chatting_user:
                return chatting_user
            else:
                chatter = Chatter(user=user, chat_room=chat_room)
                chatter.save()
                return chatter
        else:
            print("User DNE") # May cause errors if nothing is returned think about returning chatter from generic guest user
    
    def __str__(self):
        return self.user.username

class Message(models.Model):
    sender = models.TextField(max_length=500, null=True, blank=True)
    avatar_color = models.TextField(max_length=500, null=True, blank=True)
    message = models.TextField(max_length=500, null=True, blank=True)
    chat_room = models.ForeignKey(ChatRoom(), on_delete=models.CASCADE)
    chatter = models.ForeignKey(Chatter(), on_delete=models.CASCADE)
    
    def create(serialized_text_data, chat_room, chatter):
        message = Message(sender=serialized_text_data["sender"], avatar_color=serialized_text_data["avatar_color"], message=serialized_text_data["message"],
                       chat_room=chat_room, chatter=chatter)
        message.save()
        return message
    
    def __str__(self):
        return self.sender + ": " + self.message