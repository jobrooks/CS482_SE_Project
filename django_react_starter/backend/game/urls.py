from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    # path("cardview/", views.cardView),
    # path("handview/", views.handView),
    # path("deckview/", views.deckView),
    path("player/<int:pk>", views.PlayerDetail.as_view()),
    path("player/", views.PlayerList.as_view()),
    path("game/<int:pk>/", views.GameDetail.as_view()),
    path("game/", views.GameList.as_view()),
    path("hand/<int:pk>/", views.HandDetail.as_view()),
    path("test/", views.index, name="index"),
]