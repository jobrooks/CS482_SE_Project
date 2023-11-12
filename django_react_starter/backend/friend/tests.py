from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from user_api.models import User
from friend.models import FriendList, FriendRequest
from rest_framework.authtoken.models import Token
from django.test import override_settings

class FriendTest(APITestCase, TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.token = Token.objects.create(user=self.user)
        self.user1 = User.objects.create(username='user1', email='user1@example.com')
        self.user2 = User.objects.create(username='user2', email='user2@example.com')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        

    def test_search_users(self):
        url = 'http://localhost:8000/friend/search_users/'
        response = self.client.get(url, {'username': 'testuser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response, 'testuser')

        response = self.client.get(url, {'username': 'unknown'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotContains(response, 'testuser')

    @override_settings(ALLOWED_HOSTS=['*'])
    def test_get_username(self):
        response = self.client.get(f'http://localhost:8000/friend/get_username/{self.user.id}')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'testuser')

    def test_send_friend_request(self):
        another_user = User.objects.create(username='another_user', email='another@example.com')

        response = self.client.post(f'http://localhost:8000/friend/send_requests/{another_user.id}')
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertTrue(response_data['success'])

    def test_add_friend(self):
        friend_list = FriendList.objects.get(user=self.user1)
        friend_list.add_friend(self.user2)
        self.assertTrue(friend_list.is_mutual_friend(self.user2))

    def test_remove_friend(self):
        friend_list = FriendList.objects.get(user=self.user1)
        friend_list.add_friend(self.user2)
        friend_list.remove_friend(self.user2)
        self.assertFalse(friend_list.is_mutual_friend(self.user2))

    def test_unfriend(self):
        friend_list1 = FriendList.objects.get(user=self.user1)
        friend_list2 = FriendList.objects.get(user=self.user2)

        friend_list1.add_friend(self.user2)
        friend_list2.add_friend(self.user1)

        friend_list1.unfriend(self.user2)
        self.assertFalse(friend_list1.is_mutual_friend(self.user2))
        self.assertFalse(friend_list2.is_mutual_friend(self.user1))