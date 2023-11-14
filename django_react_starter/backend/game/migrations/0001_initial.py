# Generated by Django 4.2.6 on 2023-11-14 20:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Deck',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10, null=True)),
                ('deck', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.deck')),
            ],
        ),
        migrations.CreateModel(
            name='Hand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('moneyAmount', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Round',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('currentBetAmount', models.IntegerField(null=True)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('money', models.PositiveBigIntegerField(default=0)),
                ('name', models.CharField(max_length=25, null=True)),
                ('canRaise', models.BooleanField(null=True)),
                ('canFold', models.BooleanField(null=True)),
                ('canCall', models.BooleanField(null=True)),
                ('canAllIn', models.BooleanField(null=True)),
                ('action', models.CharField(max_length=5, null=True)),
                ('betAmount', models.IntegerField(null=True)),
                ('game', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.game')),
                ('hand', models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.hand')),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='pot',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.pot'),
        ),
        migrations.CreateModel(
            name='Card',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('suit', models.CharField(choices=[('H', 'Hearts'), ('D', 'Diamonds'), ('C', 'Clubs'), ('S', 'Spades')], max_length=1)),
                ('rank', models.CharField(choices=[('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'), ('6', '6'), ('7', '7'), ('8', '8'), ('9', '9'), ('10', '10'), ('J', 'Jack'), ('Q', 'Queen'), ('K', 'King'), ('A', 'Ace')], max_length=2)),
                ('deck', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.deck')),
                ('hand', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='game.hand')),
            ],
        ),
    ]
