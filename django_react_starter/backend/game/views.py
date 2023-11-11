from django.shortcuts import render
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import status
import random
from game.models import Card, Deck, Hand, Game, Player, TurnOrder, Pot, SUIT_CHOICES, RANK_CHOICES
from game.serializers import CardSerializer, DeckSerializer, HandSerializer, PotSerializer, GameSerializer, PlayerSerializer

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
    
class HandDetail(APIView):
    def get_hand(self, pk):
        try:
            return Card.objects.filter(hand=pk)
        except:
            raise Http404
        
    def get(self, request, pk):
        hand = self.get_hand(pk)
        print(hand)
        serializer = CardSerializer(hand, many=True)
        return Response(serializer.data)
    
    def put(self, request, pk):
        hand = self.get_hand(pk)
        serializer = CardSerializer(hand, many=True, data=request.data)
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
        serializer = PlayerSerializer(player)
        return Response(serializer.data)
    
    def put(self, request, pk, format=None):
        player = self.get_player(pk)
        serializer = PlayerSerializer(player, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
def create_deck():
    deck = Deck()
    deck.save()
    for x in SUIT_CHOICES:
        for y in RANK_CHOICES:
            card = Card(suit=x, rank=y, deck=deck)
            card.save()
    return deck.pk

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

def draw_card(deck: int, hand: int):
    deck_cards = list(Card.objects.filter(deck=deck))
    chosen_card = random.sample(deck_cards, 1)
    hand = Hand.objects.get(pk=hand)
    chosen_card[0].deck = None
    chosen_card[0].hand = hand
    chosen_card[0].save()

def discard_card(cardsToBeDiscarded: [int], deck: int):
    for card in cardsToBeDiscarded:
        deck_cards = Card.objects.get(pk=card)
        deck = Deck.objects.get(pk=deck)
        deck_cards.deck = deck
        deck_cards.hand = None
        deck_cards.save()

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

# @csrf_exempt
# def cardView(request):
#     if request.method == 'GET':
#         cards = Card.objects.all()
#         serializer = CardSerializer(cards, many=True)
#         return JsonResponse(serializer.data, safe=False)
#     elif request.method == 'POST':
#         data = JSONParser().parse(request)
#         serializer = CardSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.errors, status=400)


# @csrf_exempt
# def display_pot(request, gameID):
#     if request.method == 'GET':
#         serializer = PotSerializer()
#         return JsonResponse(serializer.data, safe=False)

# @csrf_exempt
# def display_hand(request, userID):
#     if request.method =='GET':
#         serializer = CardSerializer(get_player_hand(user=userID), many=True)
#         return JsonResponse(serializer.data, safe=False)

# @csrf_exempt
# def handView(request):
#     if request.method == 'GET':
#         hands = Hand.objects.all()
#         serializer = HandSerializer(hands, many=True)
#         return JsonResponse(serializer.data, safe=False)
#     elif request.method == 'POST':
#         data = JSONParser().parse(request)
#         serializer = HandSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.errors, status=400)

# @csrf_exempt
# def deckView(request):
#     if request.method == 'GET':
#         deck = Deck.objects.all()
#         serializer = DeckSerializer(deck, many=True)
#         return JsonResponse(serializer.data, safe=False)
#     elif request.method == 'POST':
#         data = JSONParser().parse(request)
#         serializer = DeckSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=201)
#         return JsonResponse(serializer.errors, status=400)
