from .models import Recipe, Inventory
from .models import CustomUser
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Recipe, Inventory, UserPreferences


class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ['email', 'gluten_free', 'is_vegan', 'is_vegetarian',
                  'is_lactose_intolerant', 'is_keto', 'nut_allergy', 'shellfish_allergy']

    def create(self, validated_data):
        email = validated_data.get('email', None)
        if email is None:
            raise serializers.ValidationError(
                {"email": ["This field is required."]})

        return UserPreferences.objects.create(**validated_data)


class RecommendationSerializer(serializers.Serializer):
    recipe_id = serializers.IntegerField()
    recipe_name = serializers.CharField()
    recipe_url = serializers.CharField()
    matching_percentage = serializers.FloatField()
    gluten_friendly = serializers.BooleanField()
    vegan_friendly = serializers.BooleanField()
    vegetarian_friendly = serializers.BooleanField()
    lactose_friendly = serializers.BooleanField()
    keto_friendly = serializers.BooleanField()
    nut_friendly = serializers.BooleanField()
    shellfish_friendly = serializers.BooleanField()
    votes = serializers.IntegerField()

    def to_representation(self, instance):
        # instance is a tuple
        return {
            'recipe_id': instance[0],
            'recipe_name': instance[1],
            'recipe_url': instance[2],
            'matching_percentage': instance[3],
            'gluten_friendly': bool(instance[4]),
            'vegan_friendly': bool(instance[5]),
            'vegetarian_friendly': bool(instance[6]),
            'lactose_friendly': bool(instance[7]),
            'keto_friendly': bool(instance[8]),
            'nut_friendly': bool(instance[9]),
            'shellfish_friendly': bool(instance[10]),
            'votes': instance[11],
        }


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
