from django.test import TestCase
from game.models import Card, Deck, Hand


class GameModelTestCase(TestCase):

    # see if Card made correctly
    def test_card_creation(self):
        card = Card.objects.create(suit='H', rank='A')
        self.assertEqual(str(card), 'Ace of Hearts')

    # see if card is 52 long
    # see if it contains Ace of Hearts and 2 of Hearts
    def test_create_standard_deck(self):
        deck = Deck.objects.create(name="Test Deck")

        # Check if there are 52 cards in the deck
        self.assertEqual(deck.cards.count(), 52)

        # Check if the deck contains a specific card
        self.assertTrue(deck.cards.filter(suit='H', rank='A').exists())
        self.assertTrue(deck.cards.filter(suit='H', rank='2').exists())
    

    # see if pulling from deck into hand works
    def test_pulling_from_Deck(self):

        deck = Deck.objects.create(name="Test Deck")
        hand = Hand.objects.create(name="test hand")

        self.assertEqual(deck.cards.count(), 52)
        self.assertEqual(hand.cards.count(), 0)

        # draw first card from Deck and put in hand
        hand.draw_card_from_deck(deck)

        #check if length reduces
        self.assertEqual(deck.cards.count(), 51)
        self.assertEqual(hand.cards.count(), 1)
        
        #card in hand should be 2 of hearts
        self.assertEqual(str(hand.cards.first()), '2 of Hearts')

    # see if code will allow you to draw more than 5
    def test_hand_bigger_than_five(self):

        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        for i in range(10):
            hand.draw_card_from_deck(deck)

        self.assertEqual(hand.cards.count(), 5)

    # see if code will allow you to add duplicates to deck
    def test_add_duplicate_card_to_deck(self):

        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        # create duplicate card and add to hand
        # no functionality for hand to get cards from anywhere other than deck, but just to test
        extra_card = Card.objects.create(suit='H', rank='2')
        hand.cards.add(extra_card)

        hand.return_card_to_deck(deck, extra_card)
        self.assertEqual(deck.cards.count(), 52)

    #if i pull 5 times from the top of the ordered deck, it should be hearts 2-6 in my hand
    def test_pulling_from_top(self):
        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        for i in range(6):
            hand.draw_card_from_deck(deck)

        self.assertEqual(str(hand.cards.all()[0]), '2 of Hearts')
        self.assertEqual(str(hand.cards.all()[1]), '3 of Hearts')
        self.assertEqual(str(hand.cards.all()[2]), '4 of Hearts')
        self.assertEqual(str(hand.cards.all()[3]), '5 of Hearts')
        self.assertEqual(str(hand.cards.all()[4]), '6 of Hearts')

    # test adding back to deck
    def test_add_to_deck(self):
        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        hand.draw_card_from_deck(deck)

        #check if card drawn is 2 of hearts
        self.assertEqual(str(hand.cards.all()[0]), '2 of Hearts')
        self.assertEqual(deck.cards.count(), 51)
        # put it back in the deck
        hand.return_card_to_deck(deck, hand.cards.first())

        #see if it made it
        #self.assertTrue(deck.cards.filter(suit='2', rank='H').exists())
        #self.assertEqual(deck.cards.count(), 52)
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-1]), '2 of Hearts')


"""
    # pull 5, adding to the end of the deck, the top should now be 7 of hearts
    # the last 5 should be 2-6 of hearts
    def test_adding_to_bottom(self):
        deck = Deck.objects.create(name="test_deck")
        hand = Hand.objects.create(name="test_hand")

        # pull 5 cards
        for i in range(5):
            hand.draw_card_from_deck(deck)

        self.assertEqual(hand.cards.count(), 5)
        # make sure deck is less now
        self.assertEqual(deck.cards.count(), 47)

        # check if i got the right cards
        self.assertEqual(str(hand.cards.all()[0]), '2 of Hearts')
        self.assertEqual(str(hand.cards.all()[1]), '3 of Hearts')
        self.assertEqual(str(hand.cards.all()[2]), '4 of Hearts')
        self.assertEqual(str(hand.cards.all()[3]), '5 of Hearts')
        self.assertEqual(str(hand.cards.all()[4]), '6 of Hearts')

        # put cards back in deck
        for i in range(4):
            hand.return_card_to_deck(deck, hand.cards.first())

        # check if card made it to deck
        self.assertTrue(deck.cards.filter(suit='2', rank='H').exists())

        #verify the last 5 in deck
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-1]), '6 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-2]), '5 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-3]), '4 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-4]), '3 of Hearts')
        self.assertEqual(str(deck.cards.all()[deck.cards.count()-5]), '2 of Hearts')
        
"""
        
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
