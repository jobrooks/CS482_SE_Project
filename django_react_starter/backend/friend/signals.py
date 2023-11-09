from django.db.models.signals import post_save
from django.dispatch import receiver
from user_api.models import User
from friend.models import FriendList

@receiver(post_save, sender=User)
def create_friend_list(sender, instance, created,**kwargs):
    if created:
        FriendList.objects.create(user=instance)