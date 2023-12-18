import json
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from chat.models import ChatRoom

class GameConsumer(WebsocketConsumer):
    def connect(self):
        try:
            # Join the group
            self.group_name = self.scope["url_route"]["kwargs"]["game_id"] # Listen to incoming invites on group marked by my username
            
            async_to_sync(self.channel_layer.group_add)(
                self.group_name, self.channel_name
            )
            
            self.accept()
            print("Joined group: " + self.group_name)
        except:
            print("Could not join group: " + self.group_name)
            self.close()

    def disconnect(self, close_code):
        # Leave the group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    """
    Protocols for game events -> serialized text data:
    player_join: {event: "player_join", username: <username>}
    start_game: {event: "start_game", username: <username of player who started>}
    player_action: {event: "player_action", action_type: <type of action (raise, call, fold, check, all-in, discard)>, player: <player's data>}
    """
    def receive(self, text_data):
        try:
            serialized_text_data = json.loads(text_data)

            async_to_sync(self.channel_layer.group_send)(
                self.group_name, {"type": serialized_text_data["event"], "serialized_text_data": serialized_text_data}
            )
                    
        except:
            print("Hit an issue")
        
    # this is necessary to output the recieved message to your own websocket
    # it does result in echoing on your end when you send a message though, but
    # this is good because you can verify your message reached the server
    def player_join(self, event):
        serialized_text_data = event["serialized_text_data"]
        self.send(text_data=json.dumps(serialized_text_data))
        
    def start_game(self, event):
        serialized_text_data = event["serialized_text_data"]
        self.send(text_data=json.dumps(serialized_text_data))
        
    def player_action(self, event):
        serialized_text_data = event["serialized_text_data"]
        self.send(text_data=json.dumps(serialized_text_data))