# Generated by Django 4.2.6 on 2023-10-29 20:34

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Card",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "suit",
                    models.CharField(
                        choices=[
                            ("H", "Hearts"),
                            ("D", "Diamonds"),
                            ("C", "Clubs"),
                            ("S", "Spades"),
                        ],
                        max_length=1,
                    ),
                ),
                (
                    "rank",
                    models.CharField(
                        choices=[
                            ("2", "2"),
                            ("3", "3"),
                            ("4", "4"),
                            ("5", "5"),
                            ("6", "6"),
                            ("7", "7"),
                            ("8", "8"),
                            ("9", "9"),
                            ("10", "10"),
                            ("J", "Jack"),
                            ("Q", "Queen"),
                            ("K", "King"),
                            ("A", "Ace"),
                        ],
                        max_length=2,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Player",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(default="player", max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Hand",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(default="Test_Hand", max_length=100)),
                ("cards", models.ManyToManyField(max_length=5, to="game.card")),
            ],
        ),
        migrations.CreateModel(
            name="Deck",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(default="Test_Deck", max_length=100)),
                ("cards", models.ManyToManyField(to="game.card")),
            ],
        ),
    ]
