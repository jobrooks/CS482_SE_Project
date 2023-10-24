from django.http import HttpResponse
from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def store(request):
    return HttpResponse("Welcome to the store!")