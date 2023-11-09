from django.db import models
from user_api.models import User
import random

DECK_SIZE = 52
MAX_HAND_SIZE = 5

SUIT_CHOICES = (
        ('H', 'Hearts'),
        ('D', 'Diamonds'),
        ('C', 'Clubs'),
        ('S', 'Spades'),
    )

RANK_CHOICES = (
    ('2', '2'),
    ('3', '3'),
    ('4', '4'),
    ('5', '5'),
    ('6', '6'),
    ('7', '7'),
    ('8', '8'),
    ('9', '9'),
    ('10', '10'),
    ('J', 'Jack'),
    ('Q', 'Queen'),
    ('K', 'King'),
    ('A', 'Ace'),
)
class Player(models.Model):
    money = models.PositiveBigIntegerField()

class Deck(models.Model):
    name = models.CharField(max_length=10)

class Hand(models.Model):
    name = models.CharField(max_length=10)
    player = models.OneToOneField(Player(), null=True, on_delete=models.CASCADE)

class Card(models.Model):
    suit = models.CharField(max_length=1, choices=SUIT_CHOICES)
    rank = models.CharField(max_length=2, choices=RANK_CHOICES)
    deck = models.ForeignKey(Deck(), null=True, on_delete=models.CASCADE)
    hand = models.ForeignKey(Hand(), null=True, on_delete=models.CASCADE)

class Pot(models.Model):
    moneyAmount = models.IntegerField()

class Game(models.Model):
    name = models.CharField(max_length=10)
    deck = models.OneToOneField(Deck(), null=True, on_delete=models.CASCADE)
    pot = models.OneToOneField(Pot(), null=True, on_delete=models.CASCADE)
    turn = models.OneToOneField(Player(), null=True, on_delete=models.CASCADE)


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

def bet(gameID: int, userID: int, isBetting: bool, betAmount: int):
    user = User.objects.get(pk=userID)
    game = Game.objects.get(pk=gameID)
    pot = Pot.objects.get(pk=game.pot)
    if isBetting:
        pot.moneyAmount += betAmount
        user.money -= betAmount

def start_game():

# all game logic
# def play_game(numPlayers: int, arrUsers: [int]):
#     # just one deck and pot for the game, game created with ids of those objects
#     deckid = create_deck()
#     potid = create_pot()
#     game = create_game(pot=Pot.objects.get(pk=potid), deck=Deck.objects.get(pk=deckid))

    # import player info from db and create game "users"
    # need:
    # number of players
    # each players id?
    # money each player has


    # start game
    # round class?
    # blinds or ante?
    # small blind , big blind assigned, 
    # need function to identify dealer, small blind, big blind every round
    # p0 is dealer, p1 is small blind, p2 is big blind (shift around every round)
    # small blind - half min bet, big blind - min bet
    # or
    # ante - each remaining player pays minimum bet or doesn't play that round

    # deal 5 cards to each player starting with small blind 
    # hand = []

    # for _ in range(0, numPlayers):
    #     hand.append(create_hand())

    
    # for id in hand:
    #     for _ in range(0, 5):
    #         draw_card(deckid, id)

    # put 5 cards out face down

    # betting for round
    # first player to bet is left of big blind
    # fold, call or raise (can't check)
    # when someone raises, the min raise goes up
    # call is matching min raise
    