from django.shortcuts import render, redirect
from guest_user.decorators import allow_guest_user

def home(request):
    return render(request, 'home.html')

@allow_guest_user
def store(request):

    if request.user.is_authenticated:
        return render(request, 'store.html')
    else:
        return redirect("home")
