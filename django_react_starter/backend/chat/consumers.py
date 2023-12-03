import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from chat.models import ChatRoom

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # try:
            # Join the group
            self.group_name = "global"
            self.chat_type = "global"
            
            async_to_sync(self.channel_layer.group_add)(
                self.group_name, self.channel_name
            )
            
            self.chat_room = ChatRoom.get(self.group_name, self.chat_type)
            
            self.accept()
        # except:
            # print("Could not join group: " + self.group_name)
            # self.send(text_data=json.dumps({"error": "Could not join group: " + self.group_name}))

    def disconnect(self, close_code):
        # Leave the group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        try:
            serialized_text_data = json.loads(text_data)
            # Send the data to the group.
            async_to_sync(self.channel_layer.group_send)(
                self.group_name, {"type": "message_notice", "serialized_text_data": serialized_text_data}
            )
            
            self.chat_room.send_message(serialized_text_data)
            
        except:
            self.send(text_data=json.dumps({"sender": "error", "avatar_color": "#000000", "message": "**Message did not send**"}))
    
    # this is necessary to output the recieved message to your own websocket
    # it does result in echoing on your end when you send a message though, but
    # this is good because you can verify your message reached the server
    def message_notice(self, event):
        serialized_text_data = event["serialized_text_data"]
        self.send(text_data=json.dumps(serialized_text_data))