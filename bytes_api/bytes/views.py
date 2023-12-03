from .serializers import *
from rest_framework import viewsets, permissions, status
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Recipe, Inventory
from .process_images import process_images
from django.db import connection, IntegrityError
from django.db.models import Count
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.


class ComputerVisionView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = ImageUploadSerializer(data=request.data)

        if serializer.is_valid():
            uploaded_images = serializer.validated_data['images']

            results = process_images(uploaded_images)

            try:
                for item in results:
                    user_inventory_item, created = Inventory.objects.update_or_create(
                        email=request.user, ingredient=item,
                        defaults={'ingredient': item}
                    )
            except IntegrityError:
                pass

            return Response({'items': results}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        email = request.user.email
        item_to_delete = request.data.get('item', '')

        try:
            Inventory.objects.filter(
                email=email, ingredient=item_to_delete).delete()
            return Response({'message': 'Item deleted successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error deleting item: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetInventoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            existing_items = Inventory.objects.filter(email=request.user)
            serializer = InventorySerializer(existing_items, many=True)

            inventory_data = {str(request.user): [
                item['ingredient'] for item in serializer.data]}
            return Response(inventory_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VoteView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(recipe_id=recipe_id)
            value = int(request.data.get('value', 0))

            sql_query = request.data.get('sqlQuery')

            with connection.cursor() as cursor:
                cursor.execute(sql_query)

            return Response({'message': 'Vote successful'}, status=status.HTTP_200_OK)
        except Recipe.DoesNotExist:
            return Response({'message': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({'message': 'Invalid vote value'}, status=status.HTTP_400_BAD_REQUEST)


class ManualInputView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = request.data.get('items', [])

        try:
            for item in items:
                user_inventory_item, created = Inventory.objects.update_or_create(
                    email=request.user, ingredient=item,
                    defaults={'ingredient': item}
                )
        except IntegrityError:
            pass

        results = items

        return Response({'items': results}, status=status.HTTP_200_OK)


class RecipeViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication, )
    serializer_class = RecipeSerializer

    def get_queryset(self):
        queryset = Recipe.objects.all()
        filters = {}

        for param, value in self.request.query_params.items():
            if param != 'search':
                if value == 'false':
                    pass
                if value == 'true':
                    filters[param] = True

        if 'search' in self.request.query_params:
            queryset = queryset.filter(
                recipe_name__icontains=self.request.query_params.get('search'))

        queryset = queryset.filter(**filters).order_by('recipe_id')[:100]
        return queryset


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
