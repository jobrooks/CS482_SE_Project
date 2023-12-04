import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from chat.models import ChatRoom

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        try:
            # Join the group
            self.group_name = self.scope["url_route"]["kwargs"]["group_name"]
            self.chat_type = self.scope["url_route"]["kwargs"]["chat_type"]
            
            async_to_sync(self.channel_layer.group_add)(
                self.group_name, self.channel_name
            )
            
            self.chat_room = ChatRoom.get(self.group_name, self.chat_type)
            
            self.accept()
        except:
            print("Could not join group: " + self.group_name)
            self.close()
            # self.send(text_data=json.dumps({"error": "Could not join group: " + self.group_name}))

    def disconnect(self, close_code):
        # Leave the group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        set_group_status_code = "set_group"
        try:
            serialized_text_data = json.loads(text_data)
            # Checks if incoming message is a request to set new group for this websocket connection
            if ("type" in serialized_text_data) and serialized_text_data["type"] == set_group_status_code:
                group_name = serialized_text_data["group_name"]
                chat_type = serialized_text_data["chat_type"]
                self.change_group(group_name=group_name, chat_type=chat_type)
                self.send_info({"sender": "server", "avatar_color": "#000000", "message": "**Changed group**"})
            else:
                # Send the data to the group.
                async_to_sync(self.channel_layer.group_send)(
                    self.group_name, {"type": "message_notice", "serialized_text_data": serialized_text_data}
                )
                
                self.chat_room.send_message(serialized_text_data)
            
        except:
            self.send_info({"sender": "server", "avatar_color": "#000000", "message": "**Message did not send**"})
            
    def change_group(self, group_name, chat_type):
        try:
            # Change these values
            self.group_name = group_name
            self.chat_type = chat_type
            
            async_to_sync(self.channel_layer.group_add)(
                self.group_name, self.channel_name
            )
            
            self.chat_room = ChatRoom.get(self.group_name, self.chat_type)
            
        except:
            print("Could not change groups")
            
    def send_info(self, serialized_text_data): # Utility function for sending info across the websocket
        async_to_sync(self.channel_layer.group_send)( # Send a notice that group updated
            self.group_name, {"type": "info_notice", "serialized_text_data": serialized_text_data}
        )
        
    # this is necessary to output the recieved message to your own websocket
    # it does result in echoing on your end when you send a message though, but
    # this is good because you can verify your message reached the server
    def message_notice(self, event):
        serialized_text_data = event["serialized_text_data"]
        self.send(text_data=json.dumps(serialized_text_data))
        
    def info_notice(self, event):
        serialized_text_data = event["serialized_text_data"]
        # self.send(text_data=json.dumps(serialized_text_data))
        # ^- disabled output only used for testing