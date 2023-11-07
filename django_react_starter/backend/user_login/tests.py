from rest_framework.test import APITestCase
# from django.contrib.auth.models import User
from user_api.models import User
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.urls import reverse

# Create your tests here.
class UserLoginAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')

        self.create_url = reverse('login')
    
    def test_user_login_valid_credentials(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.wsgi_request.user.is_authenticated)
        self.assertTrue('token' in response.data)
        user_token = Token.objects.get(user=self.user)
        self.assertEqual(response.data['token'], user_token.key)

    def test_user_login_invalid_credentials(self):
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.wsgi_request.user.is_authenticated)
