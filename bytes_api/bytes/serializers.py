from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = ('recipe_id', 'recipe_name', 'recipe_url', 'gluten_friendly', 'vegan_friendly',
                  'vegetarian_friendly', 'lactose_friendly', 'keto_friendly', 'nut_friendly', 'shellfish_friendly')

    # def create(self, validated_data):
    #     recipe = Recipe.objects.create(**validated_data)
    #     return recipe

    # def update(self, instance, validated_data):
    #     instance.recipe_name = validated_data.get(
    #         'recipe_name', instance.recipe_name)
    #     instance.recipe_url = validated_data.get(
    #         'recipe_url', instance.recipe_url)
    #     instance.gluten_friendly = validated_data.get(
    #         'gluten_friendly', instance.gluten_friendly)
    #     instance.vegan_friendly = validated_data.get(
    #         'vegan_friendly', instance.vegan_friendly)
    #     instance.vegetarian_friendly = validated_data.get(
    #         'vegetarian_friendly', instance.vegetarian_friendly)
    #     instance.lactose_friendly = validated_data.get(
    #         'lactose_friendly', instance.lactose_friendly)
    #     instance.keto_friendly = validated_data.get(
    #         'keto_friendly', instance.keto_friendly)
    #     instance.nut_friendly = validated_data.get(
    #         'nut_friendly', instance.nut_friendly)
    #     instance.shellfish_friendly = validated_data.get(
    #         'shellfish_friendly', instance.shellfish_friendly)
    #     instance.save()
    #     return instance


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'password', 'is_superuser')

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
        fields = ('id', 'email', 'password')
