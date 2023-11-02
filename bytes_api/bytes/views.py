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

# Create your views here.


class RecipeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer

    def list(self, request):
        top_10_recipes = self.get_queryset().order_by('recipe_id')[:10]
        serializer = self.serializer_class(top_10_recipes, many=True)

        return Response(serializer.data)

# class RecipeViewSet(viewsets.ModelViewSet):
#     permission_classes = (permissions.AllowAny,)
#     serializer_class = RecipeSerializer

#     def list(self, request):
#         queryset = Recipe.objects.all()

#         filters = request.query_params
#         search_query = filters.get('search', '')

#         queryset = queryset.filter(recipe_name__icontains=search_query)

#         for field in Recipe._meta.fields:
#             if field.name in filters and filters.get(field.name) == 'true':
#                 queryset = queryset.filter(**{f'{field.name}': True})

#         top_10_recipes = queryset.order_by('recipe_id')[:10]
#         serializer = self.serializer_class(top_10_recipes, many=True)

#         return Response(serializer.data)


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
