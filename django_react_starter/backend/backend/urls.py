"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("user_api/", include('user_api.urls')),
    path("user_profile/", include('user_profile.urls')),
    path("friend/", include('friend.urls')),
    path("", views.home, name="home"),
    path("store/", views.store, name="store"),
    path("chat/", include("chat.urls")),
    path("user_login/", include('user_login.urls')),
    path("convert/", include("guest_user.urls")),
    path("", include('game.urls')),
    path("get-csrf-token/", views.get_csrf_token, name='get_csrf_token'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
