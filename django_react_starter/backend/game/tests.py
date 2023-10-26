from django.test import TestCase
from .models import Card, Deck

class PokerModelTestCase(TestCase):
    def test_create_card(self):
        card = Card.objects.create(suit='H', rank='A')
        self.assertEqual(card.suit, 'H')
        self.assertEqual(card.rank, 'A')


# Create your tests here.

