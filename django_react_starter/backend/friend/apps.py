from django.apps import AppConfig


class FriendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'friend'

    def ready(self):
        import friend.signals
