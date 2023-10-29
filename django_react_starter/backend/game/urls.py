from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path("cardview/", views.cardView),
    path("handview/", views.handView),
    path("deckview/", views.deckView),
]