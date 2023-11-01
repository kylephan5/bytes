from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser
from .models import *

admin.site.register(CustomUser)

admin.site.register(Inventory)
admin.site.register(Recipe)
admin.site.register(Recipe_Ingredient)
admin.site.register(Temp_Table)