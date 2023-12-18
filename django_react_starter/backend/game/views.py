from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
from game.models import Card, Deck, Hand, Game, Player, TurnOrder, Pot, SUIT_CHOICES, RANK_CHOICES
from game.serializers import CardSerializer, DeckSerializer, HandSerializer, PotSerializer, GameSerializer, PlayerSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

# Create your views here.

class GameList(APIView):
    def get(self, request):
        game = Game.objects.all()
        serializer = GameSerializer(game, many=True)
        return Response(serializer.data)
   
    def post(self, request):
        serializer = GameSerializer(data=request.data)
        if serializer.is_valid(): 
            serializer.save()
            game = Game.objects.get(pk=serializer.data['id'])
            game.updateTurnOrder()
            game.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateGame(APIView):
    def post(self, request):
        serializer = GameSerializer(data=request.data)
        deck = Deck()
        deck.save()
        deck.create_deck()
        pot = Pot()
        pot.save()
        if serializer.is_valid(): 
            serializer.save()
            game = Game.objects.get(pk=serializer.data['id'])
            game.deck = deck
            game.pot = pot
            game.save()
            gameser = GameSerializer(game)
            return Response(gameser.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StartGame(APIView):
    def get(self, request, gameID):
        game = Game.objects.get(pk=gameID)
        players = Player.objects.filter(game=game.pk)
        if len(players) > 6:
            return Response("Too many players. Unable to start.")
        for player in players:
            player.drawStartingCards(game=game)
            player.checkActions(game)
        game.createTurnOrder()
        game.updateTurnOrder()
        serializer = GameSerializer(game)
        return Response(serializer.data)

class DrawCard(APIView):
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404
    def get_hand(self, player):
        try:
            return Hand.objects.get(pk=player.hand.pk)
        except:
            raise Http404
    def get_deck(self, game):
        try:
            return Deck.objects.get(pk=game.deck.pk)
        except:
            raise Http404
    def get_game(self, player):
        try:
            return Game.objects.get(pk=player.game.pk)
        except:
            raise Http404
    def draw_card(self, playerID):
        player = self.get_player(playerID)
        game = self.get_game(player=player)
        hand = self.get_hand(player=player)
        deck = self.get_deck(game=game)
        return player.draw_card(hand=hand, deck=deck)

    def get(self, request, playerID):
        player = self.get_player(pk=playerID)
        game = Game.objects.get(pk=player.game)
        if player.discardedCards != player.drawnCards and game.isDrawingRound == True:
            serializer = HandSerializer(self.draw_card(playerID=playerID), many=True)
            player.drawnCards += 1
            return Response(serializer.data)
        else:
            return Response(status.HTTP_429_TOO_MANY_REQUESTS)

    # def draw_card(self, deckID: int, handID: int):
    #     deck_cards = list(Card.objects.filter(deck=deckID))
    #     chosen_card = random.sample(deck_cards, 1)
    #     hand = Hand.objects.get(pk=handID)
    #     chosen_card[0].deck = None
    #     chosen_card[0].hand = hand
    #     chosen_card[0].save()
    #     return chosen_card[0]
    
    # def get(self, request, deckID, handID):
    #     card = self.draw_card(deckID=deckID, handID=handID)
    #     serializer = CardSerializer(card)
    #     return Response(serializer.data)

class DiscardCard(APIView):
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404
    def get_game(self, player):
        try:
            return Game.objects.get(pk=player.game.pk)
        except:
            return Http404
    def get_card(self, cardID):
        try:
            return Card.objects.get(pk=cardID)
        except:
            return Http404
    def get(self, request, cardID, playerID):
        player = self.get_player(pk=playerID)
        game = self.get_game(player=player)
        card = self.get_card(cardID=cardID)
        if player.discardedCards < 5 and game.isDrawingRound == True:
            if player.discard_card == True:
                player.discardedCards += 1
                player.save()
                return Response({"Card": CardSerializer(card).data, "Discarded": True})
            return Response({"Card": CardSerializer(card).data, "Discarded": False, "Reason": "Card Not Found"})
        else:
            return Response(status.HTTP_429_TOO_MANY_REQUESTS)

class GameDetail(APIView):
    def get_game(self, pk):
            try:
                return Game.objects.get(pk=pk)
            except:
                raise Http404

    def get(self, request, pk, format=None):
            game = self.get_game(pk)
            game.pullTurnOrder()
            game.updateTurnOrder()
            serializer = GameSerializer(game)
            return Response(serializer.data)
    
    # def put(self, request, pk, format=None):
    #     game = self.get_game(pk)
    #     serializer = GameSerializer(game, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors)

class ResetGame(APIView):
    def get(self, request, gameID):
        players = Player.objects.filter(game=gameID)
        game = Game.objects.get(pk=gameID)
        pot = Pot.objects.get(pk=game.pot.pk)
        deck = Deck.objects.get(pk=game.deck.pk)
        for player in players:
            if player.hand != None:
                deck.resetToDefault(player=player)
            player.resetToDefault()
        game.resetToDefault()
        pot.resetToDefault()
        return Response({"Game": GameSerializer(game).data, "Pot": PotSerializer(pot).data})

class HandList(APIView):
    def get(self, request):
        hand = Hand.objects.all()
        serializer = HandSerializer(hand, many=True)
        return Response(serializer.data)
   
    def post(self, request):
        serializer = HandSerializer(data=request.data) 
        if serializer.is_valid(): 
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HandDetail(APIView):
    def get_hand(self, pk):
        try:
            return Card.objects.filter(hand=pk)
        except:
            raise Http404
        
    def get(self, request, pk):
        hand = self.get_hand(pk)
        serializer = CardSerializer(hand, many=True)
        return Response(serializer.data)
    
    def put(self, request, pk):
        hand = self.get_hand(pk)
        serializer = CardSerializer(hand, many=True, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class DeckList(APIView):
    def get(self, request):
        deck = Deck.objects.all()
        serializer = DeckSerializer(deck, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = DeckSerializer(data=request.data) 
        if serializer.is_valid(): 
            serializer.save()
            Deck.create_deck(deckserializer=serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeckDetail(APIView):
    def get_deck(self, pk):
        try:
            return Card.objects.filter(deck=pk)
        except:
            raise Http404
        
    def get(self, request, pk):
        deck = self.get_deck(pk)
        serializer = CardSerializer(deck, many=True)
        return Response(serializer.data)
    
    def put(self, request, pk):
        deck = self.get_hand(pk)
        serializer = CardSerializer(deck, many=True, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class PlayerList(APIView):
    def get(self, request):
        players = Player.objects.all()
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = PlayerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            game = Game.objects.get(pk=serializer.data['game'])
            players = Player.objects.filter(game=game.pk)
            hand = Hand()
            hand.save()
            player = Player.objects.get(pk=serializer.data['id'])
            player.hand = hand
            if len(players)  > 6:
                player.delete()
                return Response("Too many players. Unable to join player to game.")
            player.save()
            return Response(PlayerSerializer(player).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlayerDetail(APIView):
    
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404

    def get(self, request, pk, format=None):
        player = self.get_player(pk)
        hand = Hand.objects.get(pk=player.hand.pk)
        cards = Card.objects.filter(hand=hand)
        if player.game != None:
            player.checkActions(game=player.game)
        return Response({"Player": PlayerSerializer(player).data, "Hand": CardSerializer(cards, many=True).data})
    
    def put(self, request, pk, format=None):
        player = self.get_player(pk)
        serializer = PlayerSerializer(player, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class GameState(APIView):
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404
    def get_game(self, player):
        try:
            return Game.objects.get(pk=player.game.pk)
        except:
            raise Http404
    def get_pot(self, game):
        try:
            return Pot.objects.get(pk=game.pot.pk)
        except:
            raise Http404
    def get_hand(self, player):
        try:
            return Hand.objects.get(pk=player.hand.pk)
        except:
            raise Http404
    def get_cards(self, hand):
        try:
            return Card.objects.filter(hand=hand)
        except:
            raise Http404
    def get(self, request, playerID):
        player = self.get_player(pk=playerID)
        game = self.get_game(player=player)
        players = Player.objects.filter(game=game.pk)
        print(players)
        otherPlayers = [{"id": x.pk, "username": x.name, "money": x.money, "betAmount": x.betAmount} for x in players]
        pot = self.get_pot(game=game)
        hand = self.get_hand(player=player)
        hand.evaluateHand()
        cards = self.get_cards(hand=hand)
        return Response({"player": PlayerSerializer(player).data, "otherPlayers": otherPlayers, "game": GameSerializer(game).data, "pot": PotSerializer(pot).data, "hand": HandSerializer(hand).data, "cards": CardSerializer(cards, many=True).data})
        
class TakeTurn(APIView):
    def send_action(self, player, game, pot):
        player_data = PlayerSerializer(player).data
        print(player_data)
        serialized_text_data = {"event": "player_action", "action_type": player.action, "player": player_data} # Should be form of request
        print(serialized_text_data)
        layer = get_channel_layer()
        async_to_sync(layer.group_send)(
            str(game.pk), {"type": serialized_text_data["event"], "serialized_text_data": serialized_text_data}
        )
        print("sent to group: " + str(game.pk))
    
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404
    def get_game(self, player):
        try:
            return Game.objects.get(pk=player.game.pk)
        except:
            raise Http404
    def get_pot(self, game):
        try:
            return Pot.objects.get(pk=game.pot.pk)
        except:
            raise Http404
    
    def get(self, request, playerID):
        player = self.get_player(playerID)
        game = self.get_game(player=player)
        pot = self.get_pot(game=game)
        player.checkActions(game)
        return Response({"Player": PlayerSerializer(player).data, "Game": GameSerializer(game).data, "Pot": PotSerializer(pot).data})
    
    def put(self, request, playerID):
        player = self.get_player(pk=playerID)
        game = self.get_game(player=player)
        pot = self.get_pot(game=game)
        players = Player.objects.filter(game=game.pk)
        serializer = PlayerSerializer(player, data=request.data)
        if serializer.is_valid():
            serializer.save()
            # If it is the first round, we check to see if it is this player's turn.
            # Then, if it is, we will take their action and input into the player object.
            # Then, execute their turn (bet, fold, etc.)
            # Lastly, remove them from the turn order - if they fold
            #
            # CODE FOR FIRST BETTING ROUND BELOW
            #
            #
            # First Betting Round:
            game.pullTurnOrder()
            currentTurnPlayerId = None
            if len(game.turns.order) != 0:
                print(game.turns.order)
                currentTurnPlayerId = game.getCurrentPlayerTurn()
                print(player.pk)
                print(currentTurnPlayerId)
            if not game.checkFirstRoundOver():
                if currentTurnPlayerId == player.pk:
                    player.checkActions(game=game)
                    turnResponse = Response({"Turn Successful": player.takeAction(game=game, pot=pot), "Player": PlayerSerializer(player).data, "Game": GameSerializer(game).data, "Pot": PotSerializer(pot).data})
                    self.send_action(player, game, pot)
                    game.incrementPlayer()
                    if game.checkFirstRoundOver():
                        # game.resetToDefault()
                        game.isFirstBetRound = False
                        game.isDrawingRound = True
                        game.save()
                        return Response("First Round Finished. Proceeding to Drawing.")
                    # game.nextTurn()
                    print(game.turns.getStringOrder())
                    print(game.turns.order)
                    game.updateTurnOrder()
                    return turnResponse
                else:
                    game.updateTurnOrder()
                    return Response(status.HTTP_429_TOO_MANY_REQUESTS)
            # CODE FOR DRAWING ROUND BELOW
            #
            #
            #
            #
            # Drawing Round:
            if not game.checkDrawingRoundOver() and game.checkFirstRoundOver():
                print("success!")
                # We check to see if the drawing round is done.
                # Go through each player in the game. Check to see if each player has 
                # Done drawing = True
                # If all players done, change to second betting round.
                playersFinished = 0
                for player in players:
                    if player.checkIfDrawingDone():
                        playersFinished += 1
                print("players finished: " + str(playersFinished))
                print("num playeres: " + str(len(players)))
                if playersFinished == len(players) or game.checkDrawingRoundOver():
                    game.isDrawingRound = False
                    game.isSecondBetRound = True
                    game.save()
                    return Response("Drawing Finished. Proceeding to Betting.")
                return Response({"Drawing In Progress - Players Finished": playersFinished})
            # If it is the second round, we check to see if it is this player's turn.
            # Then, if it is, we will take their action and input into the player object.
            # Then, execute their turn (bet, fold, etc.)
            # Lastly, remove them from the turn order - if they fold
            #
            # CODE FOR SECOND BETTING ROUND BELOW:
            #
            #
            # Second Betting Round:
            game.resetToDefault()
            game.createTurnOrder()
            game.updateTurnOrder()
            game.pullTurnOrder()
            if not game.checkSecondRoundOver() and game.checkDrawingRoundOver():
                if currentTurnPlayerId == player.pk:
                    player.checkActions(game=game)
                    turnResponse = Response({"Turn Successful": player.takeAction(game=game, pot=pot), "Player": PlayerSerializer(player).data, "Game": GameSerializer(game).data, "Pot": PotSerializer(pot).data})
                    game.incrementPlayer()
                    if game.checkSecondRoundOver():
                        winner = game.determineWinner()
                        # game.resetToDefault()
                        game.isSecondBetRound = False
                        game.isFinished = True
                        game.winner = winner.name
                        game.save()
                        return Response({"Winner": PlayerSerializer(winner).data, "Player": PlayerSerializer(player).data, "Game": GameSerializer(game).data, "Pot": PotSerializer(pot).data})
                    # game.nextTurn()
                    game.updateTurnOrder()
                    return turnResponse
                else:
                    game.updateTurnOrder()
                    return Response(status.HTTP_429_TOO_MANY_REQUESTS)
            else:
                return Response(status.HTTP429_TOO_MANY_REQUESTS)
            

# give the players in a given game
class PlayerListforGame(APIView):  
    def get(self, request, pk, format=None):
        players = Player.objects.filter(game=pk)
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)
    
# give the enemies of a game given a player
class EnemiesforGame(APIView):  
    def get(self, request, gameID, playerID, format=None):
        players = Player.objects.filter(game=gameID).exclude(id=playerID)
        serializer = PlayerSerializer(players, many=True)
        return Response(serializer.data)
    
# give the player of a username
# Note: need to modify based on if player is created twice
class PlayerfromUsername(APIView):
    def get(self, request, username, format=None):
        player = Player.objects.get(name=username)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)
    
class DeletePlayersFromGame(APIView):
    def get(self, request, gameID, format=None):
        try:
            players = Player.objects.filter(game=gameID)
            for player in players:
                player.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Player.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        