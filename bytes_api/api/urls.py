"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
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
from bytes.views import UserRegister, UserLogin, UserLogout, UserChangePassword, ProfileView, AllUsers, RecipeViewSet, ComputerVisionView, ManualInputView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'users', AllUsers, 'users')
router.register(r'recipes', RecipeViewSet, 'recipes')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('bytes_api/', include(router.urls)),
    path('bytes_api/register/', UserRegister.as_view()),
    path('bytes_api/login/', UserLogin.as_view()),
    path('bytes_api/logout/', UserLogout.as_view()),
    path('bytes_api/profile/', ProfileView.as_view()),
    path('bytes_api/change_password/', UserChangePassword.as_view()),
    path('bytes_api/cv/', ComputerVisionView.as_view()),
    path('bytes_api/manual_input/', ManualInputView.as_view()),

]
