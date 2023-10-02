from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

# Create your models here.

'''

class CustomUser
    email str
    password hash
    favorited_items array
'''

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password, favorited_items=None):
        if not email:
            raise ValueError('Email not found')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        if json_data:
            user.json_data = json_data
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, email, password=None, json_data=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, json_data, **extra_fields)
        

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=32)
    favorited_items = models.JSONField(null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()

    def __str__(self):
        return self.email
