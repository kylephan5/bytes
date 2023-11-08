from .serializers import *
from rest_framework import viewsets, permissions, status
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recipe
from .process_images import process_images

from .serializers import ImageUploadSerializer, ComputerVisionSerializer

# Create your views here.


class ComputerVisionView(APIView):
    def post(self, request):
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            # WRITE COMPUTER VISION SCRIPT AND USE HERE
            uploaded_images = serializer.validated_data['images']
            # MAKE PROCESS_IMAGES
            results = process_images(uploaded_images)

            result_serializer = ComputerVisionSerializer(
                data={'items': results})
            if result_serializer.is_valid():
                return Response(result_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(result_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecipeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication, )

    serializer_class = RecipeSerializer
    queryset = Recipe.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        top_10_recipes = queryset.order_by('recipe_id')[:10]
        print(self.request.query_params)

        return top_10_recipes


class AllUsers(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication, )

    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()

    def get_queryset(self):
        queryset = super().get_queryset()
        custom_param = self.request.query_params.get('id')
        if custom_param:
            queryset = queryset.filter(id=custom_param)

        return queryset


# Register user
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer_class = UserRegistrationSerializer(data=request.data)
        if serializer_class.is_valid(raise_exception=True):
            user = serializer_class.create(request.data)
            if user:
                return Response(serializer_class.data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)


# Log in to user
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny, )
    authentication_classes = (SessionAuthentication, )

    def post(self, request):
        data = request.data

        print(data)
        serializer_class = UserLoginSerializer(data=data)
        if serializer_class.is_valid(raise_exception=True):
            user = serializer_class.check_user(data)
            login(request, user)
            return Response(serializer_class.data, status=status.HTTP_200_OK)


# Change current user password
class UserChangePassword(UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    authentication_classes = (SessionAuthentication, )
    serializer_class = ChangeUserPasswordSerializer

    def update(self, request, *args, **kwargs):
        instance = self.request.user
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.data.get('old_password')
            new_password = serializer.data.get('new_password')
            confirm_password = serializer.data.get('confirm_password')

            if not instance.check_password(old_password):
                return Response({'detail': 'Incorrect old password'}, 400)

            if new_password != confirm_password:
                return Response({'detail': 'Passwords do not match'}, 400)

            instance.set_password(new_password)
            instance.save()
            return Response({'detail': 'Password updated successfully'}, 200)

        return Response(serializer.errors, 400)


# Log out of Current User
class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated, )

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


# See Logged In User Profile
class ProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication, )

    def get(self, request):
        serializer_class = CustomUserSerializer(request.user)
        return Response({'user': serializer_class.data}, status=status.HTTP_200_OK)
