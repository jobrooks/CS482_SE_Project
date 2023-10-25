from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token

# Create your tests here.
class UserApitest(APITestCase):
    def setUp(self):
        self.test_user = User.objects.create_user('testuser', 'test@example.com', 'testpassword')

        self.create_url = reverse('account-create')

    def test_create_user(self):
        data = {
            'username': 'foobar',
            'email':'foobar@example.com',
            'password':'somepassword'
        }

        response = self.client.post(self.create_url, data, format='json')
        user = User.objects.latest('id')

        self.assertEqual(User.objects.count(), 2)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], data['username'])
        self.assertEqual(response.data['email'], data['email'])
        self.assertFalse('password' in response.data)
        token = Token.objects.get(user=user)
        self.assertEqual(response.data['token'], token.key)
    
    def test_create_user_with_short_password(self):
        data = {
            'username': 'foobar',
            'email': 'foobar@gmail.com',
            'password':'foo'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['password']),1)

    def test_create_user_with_no_password(self):
        data = {
            'username': 'foobar',
            'email': 'foobar@gmail.com',
            'password':''
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['password']),1)

    def test_create_user_with_long_username(self):
        data = {
            'username': 'foo'*30,
            'email': 'foobar@gmail.com',
            'password':'foobar'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['username']),1)

    def test_create_user_with_no_username(self):
        data = {
            'username': '',
            'email': 'foobar@gmail.com',
            'password':'foobar'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['username']),1)

    def test_create_user_with_preexisting_username(self):
        data = {
            'username': 'testuser',
            'email': 'foobar@gmail.com',
            'password':'testuser'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['username']),1)

    def test_create_user_with_preexisting_email(self):
        data = {
            'username': 'testuser2',
            'email': 'test@example.com',
            'password':'testuser'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['email']),1)

    def test_create_user_with_invalid_email(self):
        data = {
            'username': 'foobar',
            'email': 'test',
            'password':'foobarbaz'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['email']),1)

    def test_create_user_with_no_email(self):
        data = {
            'username': 'foobar',
            'email': '',
            'password':'foobarbaz'
        }

        response = self.client.post(self.create_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(),1)
        self.assertEqual(len(response.data['email']),1)

    
    
        
