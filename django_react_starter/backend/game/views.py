from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
import random
import time
from game.models import Card, Round, Deck, Hand, Game, Player, TurnOrder, Pot, SUIT_CHOICES, RANK_CHOICES
from game.serializers import RoundSerializer, CardSerializer, DeckSerializer, HandSerializer, PotSerializer, GameSerializer, PlayerSerializer

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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoundList(APIView):
    def get(self, request):
        round = Round.objects.all()
        serializer = RoundSerializer(round, many=True)
        return Response(serializer.data)
    
class RoundDetail(APIView):
    def get_round(self, pk):
            try:
                return Round.objects.get(pk=pk)
            except:
                raise Http404

    def get(self, request, pk, format=None):
            round = self.get_round(pk)
            serializer = RoundSerializer(round)
            return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        round = self.get_round(pk)
        serializer = GameSerializer(round, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class DrawCard(APIView):
    def draw_card(self, deckID: int, handID: int):
        deck_cards = list(Card.objects.filter(deck=deckID))
        chosen_card = random.sample(deck_cards, 1)
        hand = Hand.objects.get(pk=handID)
        chosen_card[0].deck = None
        chosen_card[0].hand = hand
        chosen_card[0].save()
        return chosen_card[0]
    
    def get(self, request, deckID, handID):
        card = self.draw_card(deckID=deckID, handID=handID)
        serializer = CardSerializer(card)
        return Response(serializer.data)

class DiscardCard(APIView):
    def discard_card(self, cardID, deckID):
        card = Card.objects.get(pk=cardID)
        deck = Deck.objects.get(pk=deckID)
        card.deck = deck
        card.hand = None
        card.save()
        return card
    
    def get(self, request, cardID, deckID):
        card = self.discard_card(cardID=cardID, deckID=deckID)
        serializer = CardSerializer(card)
        return Response(serializer.data)
    
class GameDetail(APIView):
    def get_game(self, pk):
            try:
                return Game.objects.get(pk=pk)
            except:
                raise Http404

    def get(self, request, pk, format=None):
            game = self.get_game(pk)
            serializer = GameSerializer(game)
            return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        game = self.get_game(pk)
        serializer = GameSerializer(game, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
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
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PlayerDetail(APIView):
    
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404

    def get(self, request, pk, format=None):
        player = self.get_player(pk)
        player.checkActions(PlayerID=pk, GameID=Game.objects.get(self.get_player(pk).game))
        serializer = PlayerSerializer(player)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        player = self.get_player(pk)
        serializer = PlayerSerializer(player, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class StartGame(APIView):
    def get(self, request, gameID):
        firstRound = Round()
        firstRound.createTurnOrder(gameID=gameID)
        while (firstRound.turns.order != 0):
            time.sleep(5)
        secondRound = Round()
        secondRound.createTurnOrder(gameID=gameID)
        while (secondRound.turns.order != 0):
            time.sleep(5)

class TakeTurn(APIView):
    def get_round(self, pk):
            try:
                return Round.objects.get(pk=pk)
            except:
                raise Http404
    def get_player(self, pk):
        try:
            return Player.objects.get(pk=pk)
        except:
            raise Http404
    def put(self, request, playerID, roundID):
        player = self.get_player(pk=playerID)
        round = self.get_round(pk=roundID)
        if playerID == round.turns.order[0]:
            player.checkActions(playerID=playerID)
            serializer = PlayerSerializer(player, data=request.data)
            if serializer.is_valid():
                serializer.save()
                player.takeAction()
        else:
            return Response(status.HTTP_429_TOO_MANY_REQUESTS)

def create_pot():
    pot = Pot(moneyAmount=0)
    pot.save()
    return pot.pk

def create_hand(user: int, name: str):
    hand = Hand(name=name, player=Player.objects.get(pk=user))
    hand.save()
    return hand.pk

def create_player(money: int):
    player = Player(money=money)
    player.save()
    return player.pk

def create_game(name: str, pot: Pot(), deck: Deck()):
    game = Game(name=name, pot=pot, deck=deck)
    game.save()
    return game.pk
    
def get_player_hand(user: int):
    hand = Hand.objects.get(user=user)
    cards = Card.objects.filter(hand=hand)
    return cards

def get_game(game: int):
    game = Game.objects.get(game=game)
    return game

def bet(gameID: int, playerID: int, isBetting: bool, betAmount: int):
    player = Player.objects.get(pk=playerID)
    game = Game.objects.get(pk=gameID)
    pot = Pot.objects.get(pk=game.pot)
    if isBetting:
        pot.moneyAmount += betAmount
        player.money -= betAmount

def start_game(gameID: int):
    players = Player.objects.get(game=gameID)
    game = Game.objects.get(pk=gameID)

    turns = TurnOrder()

    for player in players:
        turns.order.append(player.name)
        player.hand = Hand.objects.get(pk=create_hand())
        for _ in range(0, 5):
            draw_card(game.deck, player.hand)

    game.currentTurn = players[0].pk

    return turns

def take_turn(gameID: int, turns: TurnOrder, playerID: int, isBetting: bool, betAmount: int):
    game = Game.objects.get(pk=gameID)

    if game.currentTurn == playerID:
        bet(gameID, playerID, isBetting, betAmount)
        turns.order.rotate(1)
        game.currentTurn = Player.objects.get(name=turns.order[0]).pk

    else:
        return Response(status=status.HTTP_429_TOO_MANY_REQUESTS)