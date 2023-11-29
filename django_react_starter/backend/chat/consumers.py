import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # Join the group
        self.group_name = "chatter"
        
        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name
        )
        
        self.accept()

    def disconnect(self, close_code):
        # Leave the group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        serialized_text_data = json.loads(text_data)
        # Send the data to the group.
        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {"type": "message_notice", "serialized_text_data": serialized_text_data}
        )
        # self.send(text_data=text_data)
    
    # this is necessary to output the recieved message to your own websocket
    # it does result in echoing on your end when you send a message though, but
    # this is good because you can verify your message reached the server
    def message_notice(self, event):
        serialized_text_data = event["serialized_text_data"]
        self.send(text_data=json.dumps(serialized_text_data))