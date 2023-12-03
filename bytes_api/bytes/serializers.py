from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import Recipe, Inventory


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ('ingredient',)


class ManualInputSerializer(serializers.Serializer):
    class Meta:
        model = Inventory
        fields = ('email', 'ingredient')


class ImageUploadSerializer(serializers.Serializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True)


# class ComputerVisionSerializer(serializers.Serializer):
#     items = serializers.ListField(
#         child=serializers.CharField(), read_only=True)


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('recipe_id', 'recipe_name', 'recipe_url', 'gluten_friendly', 'vegan_friendly',
                  'vegetarian_friendly', 'lactose_friendly', 'keto_friendly', 'nut_friendly', 'shellfish_friendly', 'votes')


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'is_superuser')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = super().create(validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(
            username=validated_data['email'], password=validated_data['password'])

        if not user:
            raise ValueError('Password incorrect, or user does not exist.')

        return user


class ChangeUserPasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password')
