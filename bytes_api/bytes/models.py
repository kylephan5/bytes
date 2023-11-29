from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db.models import IntegerField

# Create your models here.


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


class Inventory(models.Model):
    # each inventory should be assigned to a specific user
    email = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    ingredient = models.CharField(max_length=75)

    def __str__(self):
        return self.user


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
    votes = models.IntegerField(default=0)

    # ingredients = models.JSONField(default=list)

    def __str__(self):
        return self.recipe_name


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, default=0,
                               on_delete=models.CASCADE)  # if a recipe is deleted, all of the items inside of recipe ingredient will be deleted
    recipe_ingredient = models.CharField(max_length=100)

    def __str__(self):
        return self.recipe_ingredient


# RecipeIngredient is used as a skinny table to join Recipe and inventory
# RecipeIgredient joins with recipe on recipe_id
# RecipeIngredient joins with inventory on ingredient