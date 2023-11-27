from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, Group, Permission
# Create your models here.

class User(AbstractUser):
    TABLE_THEME_CHOICES = [
        ("blue", "Blue"),
        ("green", "Green"),
    ]
    CARD_BACKING_CHOICES = [
        ("red", "Red"),
        ("green", "Green"),
        ("blue", "Blue"),
    ]
    
    wins = models.PositiveIntegerField(default=0)
    avatar = models.ImageField(upload_to='avatars/', height_field=None, width_field=None, max_length=None, null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    games_played = models.PositiveIntegerField(default=0)
    money = models.PositiveIntegerField(default=0)
    avatar_color = models.TextField(max_length=500, null=True, blank=True)
    table_theme = models.TextField(max_length=500, choices=TABLE_THEME_CHOICES, null=True, blank=True)
    card_backing = models.TextField(max_length=500, choices=CARD_BACKING_CHOICES, null=True, blank=True)
    class Meta:
        db_table = 'auth_user'

class GuestUser(AbstractUser):    
    password = None
    first_name = None
    last_name = None

    TABLE_THEME_CHOICES = [
        ("blue", "Blue"),
        ("green", "Green"),
    ]
    CARD_BACKING_CHOICES = [
        ("red", "Red"),
        ("green", "Green"),
        ("blue", "Blue"),
    ]

    wins = models.PositiveIntegerField(default=0)
    avatar = models.ImageField(upload_to='avatars/', height_field=None, width_field=None, max_length=None, null=True, blank=True)
    games_played = models.PositiveIntegerField(default=0)
    money = models.PositiveIntegerField(default=0)
    avatar_color = models.TextField(max_length=500, null=True, blank=True)
    table_theme = models.TextField(max_length=500, choices=TABLE_THEME_CHOICES, null=True, blank=True)
    card_backing = models.TextField(max_length=500, choices=CARD_BACKING_CHOICES, null=True, blank=True)
    groups = models.ManyToManyField(Group, related_name='guest_user_set')
    user_permissions = models.ManyToManyField(
        Permission, related_name='guest_user_set_permissions'
    )
    is_guest = models.BooleanField(default=1)

    def __str__(self):
        return self.username
    
