from django.test import TestCase
from .models import Card, Deck, Hand


class GameModelTestCase(TestCase):
    def test_card_creation(self):
        card = Card.objects.create(suit='H', rank='A')
        self.assertEqual(str(card), 'Ace of Hearts')

    def test_create_standard_deck(self):
        deck = Deck.objects.create(name="Test Deck")

        # Check if there are 52 cards in the deck
        self.assertEqual(deck.cards.count(), 52)

        # Check if the deck contains a specific card
        self.assertTrue(deck.cards.filter(suit='H', rank='A').exists())
        self.assertTrue(deck.cards.filter(suit='H', rank='2').exists())
    
    def test_pulling_from_Deck(self):

        deck = Deck.objects.create(name="Test Deck")
        hand = Hand.objects.create(name="test hand")

        # draw first card from Deck and put in hand
        hand.draw_card_from_deck(deck)

        #check if length reduces
        self.assertEqual(deck.cards.count(), 51)

"""
class PokerModelTestCase(TestCase):
    def test_create_card(self):
        card = Card.objects.create(suit='H', rank='A')
        self.assertEqual(card.suit, 'H')
        self.assertEqual(card.rank, 'A')

    def test_create_deck(self):
        deck = Deck.objects.create()
        card = Card.objects.create(suit='H', rank='A')
        deck.cards.add(card)
        print(type(deck.cards))
        #self.assertEqual(len(deck.cards) > 0)

    def test_deck(self):
        d = Deck()
        c = Card()
        c.suit = 'H'
        c.rank = '2'
        d.cards.add(c)
        print(type(d.cards))
        """
