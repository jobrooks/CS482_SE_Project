from django.shortcuts import render
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import fivecarddrawSerializer
from .models import fivecarddraw

# Create your views here.

class fivecarddrawView(viewsets.ModelViewSet):
    serializer_class = fivecarddrawSerializer
    queryset = fivecarddraw.objects.all()