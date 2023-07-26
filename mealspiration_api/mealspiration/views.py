from django.shortcuts import render

from .models import *
from .serializers import *

from rest_framework import viewsets
from rest_framework.response import Response

# Create your views here.

class CustomUsersViewset(viewsets.ModelViewSet):
    serializer_class=CustomUserSerializer
    queryset=CustomUser.objects.all()