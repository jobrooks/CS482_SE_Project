# Generated by Django 4.2.6 on 2023-11-07 17:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, null=True, upload_to=None),
        ),
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.TextField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='games_played',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='wins',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
