from django.shortcuts import render, redirect
from django.middleware.csrf import get_token
from django.http import JsonResponse

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrftoken': csrf_token})

def home(request):
    return render(request, 'home.html')

def store(request):

    if request.user.is_authenticated:
        return render(request, 'store.html')
    else:
        return redirect("home")
