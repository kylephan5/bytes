# Generated by Django 4.2.5 on 2023-11-29 20:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=254, primary_key=True, serialize=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('recipe_id', models.AutoField(default=None, primary_key=True, serialize=False)),
                ('recipe_name', models.CharField(max_length=100)),
                ('recipe_url', models.CharField(max_length=150)),
                ('gluten_friendly', models.BooleanField(default=True)),
                ('vegan_friendly', models.BooleanField(default=True)),
                ('vegetarian_friendly', models.BooleanField(default=True)),
                ('lactose_friendly', models.BooleanField(default=True)),
                ('keto_friendly', models.BooleanField(default=True)),
                ('nut_friendly', models.BooleanField(default=True)),
                ('shellfish_friendly', models.BooleanField(default=True)),
                ('votes', models.IntegerField(default=0)),
            ],
            options={
                'db_table': 'bytes_recipe',
            },
        ),
        migrations.CreateModel(
            name='RecipeIngredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ingredient', models.CharField(max_length=100)),
                ('recipe', models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='bytes.recipe')),
            ],
            options={
                'db_table': 'bytes_recipe_ingredients',
            },
        ),
        migrations.CreateModel(
            name='Inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ingredient', models.CharField(max_length=75)),
                ('email', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'bytes_inventory',
            },
        ),
        migrations.AddConstraint(
            model_name='recipeingredient',
            constraint=models.UniqueConstraint(fields=('recipe', 'ingredient'), name='unique_recipe_ingredient'),
        ),
        migrations.AddConstraint(
            model_name='inventory',
            constraint=models.UniqueConstraint(fields=('email', 'ingredient'), name='unique_email_ingredient'),
        ),
    ]
