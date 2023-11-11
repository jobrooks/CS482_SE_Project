from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from user_api.models import User
from rest_framework.authtoken.models import Token

class FriendTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

    def test_search_users(self):
        url = 'http://localhost:8000/friend/search_users/'
        response = self.client.get(url, {'username': 'searched_user'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
