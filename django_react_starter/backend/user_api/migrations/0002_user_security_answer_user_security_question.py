# Generated by Django 4.2.6 on 2023-11-30 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='security_answer',
            field=models.CharField(default='', max_length=128),
        ),
        migrations.AddField(
            model_name='user',
            name='security_question',
            field=models.CharField(default='', max_length=255),
        ),
    ]
