from django.db import models
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

class Deck(models.Model):
    name = models.CharField(max_length=10)

class User(models.Model):
    money = models.IntegerField()

class Hand(models.Model):
    name = models.CharField(max_length=10)
    user = models.OneToOneField(User(), null=True, on_delete=models.CASCADE)

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

def create_hand(name: str):
    hand = Hand(name=name)
    hand.save()
    return hand.pk

def create_user(money: int):
    user = User(money=money)
    user.save()
    return user.pk

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

def place_bet(betAmount: int, potid: int, userid: int):
    user = User.objects.get(pk=userid)
    pot = Pot.objects.get(pk=potid)
    pot.moneyAmount += betAmount
    user.money -= betAmount

def create_game(name: str, pot: Pot(), deck: Deck()):
    game = Game(name=name, pot=pot, deck=deck)
    game.save()
    return game.pk

def play_game(numPlayers: int, arrUsers: [int]):
    deckid = create_deck()
    potid = create_pot()
    game = create_game(pot=Pot.objects.get(pk=potid), deck=Deck.objects.get(pk=deckid))

    hand = []

    for _ in range(0, numPlayers):
        hand.append(create_hand())

    
    for id in hand:
        for _ in range(0, 5):
            draw_card(deckid, id)
    
