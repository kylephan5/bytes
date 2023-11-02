from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models import IntegerField

# Create your models here.

'''

class CustomUser
    email str
    password hash
    favorited_items array
'''


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email not found')

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("superuser must have is_staff as True")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("superuser must have is_superuser as True")

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


'''
Inventory class: Used to store what items a specific user has
email: 
'''


class Inventory(models.Model):
    email = models.EmailField(unique=True)
    ingredient = models.CharField(max_length=75)

    # gluten_free_bool = models.BooleanField(default=False)
    # vegitarian_bool = models.BooleanField(default=False)
    # vegan_bool = models.BooleanField(default=False)
    # lactose_bool = models.BooleanField(default=False)
    # nut_free_bool = models.BooleanField(default=False)
    # shellfish_free_bool = models.BooleanField(default=False)

    def __str__(self):
        return self.email


'''
Recipe class: Used to store recipe data
'''


class Recipe(models.Model):
    recipe_id = models.AutoField(primary_key=True, default=None)
    recipe_name = models.CharField(max_length=100)
    recipe_url = models.CharField(max_length=150)
    gluten_friendly = models.BooleanField(default=True)
    vegan_friendly = models.BooleanField(default=True)
    vegetarian_friendly = models.BooleanField(default=True)
    lactose_friendly = models.BooleanField(default=True)
    keto_friendly = models.BooleanField(default=True)
    nut_friendly = models.BooleanField(default=True)
    shellfish_friendly = models.BooleanField(default=True)

    def __str__(self):
        return self.recipe_name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, default=0,
                               on_delete=models.CASCADE)  # if a recipe is deleted, all of the items inside of recipe ingredient will be deleted
    recipe_ingredient = models.CharField(max_length=100)

    def __str__(self):
        return self.recipe_ingredient




