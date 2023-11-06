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

class Hand(models.Model):
    name = models.CharField(max_length=10)

class Card(models.Model):
    suit = models.CharField(max_length=1, choices=SUIT_CHOICES)
    rank = models.CharField(max_length=2, choices=RANK_CHOICES)
    deck = models.ForeignKey(Deck(), null=True, on_delete=models.CASCADE)
    hand = models.ForeignKey(Hand(), null=True, on_delete=models.CASCADE)

class Pot(models.Model):
    moneyAmount = models.IntegerField()

class Game(models.Model):
    deck = models.OneToOneField(Deck(), null=True, on_delete=models.CASCADE)
    pot = models.OneToOneField(Pot(), null=True, on_delete=models.CASCADE)

def create_deck():
    deck = Deck()
    deck.save()
    for x in SUIT_CHOICES:
        for y in RANK_CHOICES:
            card = Card(suit=x, rank=y, deck=deck)
            card.save()

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