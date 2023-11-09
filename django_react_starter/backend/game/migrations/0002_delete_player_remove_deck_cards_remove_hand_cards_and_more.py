# Generated by Django 4.2.6 on 2023-10-31 23:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("game", "0001_initial"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Player",
        ),
        migrations.RemoveField(
            model_name="deck",
            name="cards",
        ),
        migrations.RemoveField(
            model_name="hand",
            name="cards",
        ),
        migrations.AddField(
            model_name="card",
            name="deck",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to="game.deck"
            ),
        ),
        migrations.AddField(
            model_name="card",
            name="hand",
            field=models.ForeignKey(
                null=True, on_delete=django.db.models.deletion.CASCADE, to="game.hand"
            ),
        ),
        migrations.AlterField(
            model_name="deck",
            name="name",
            field=models.CharField(max_length=10),
        ),
        migrations.AlterField(
            model_name="hand",
            name="name",
            field=models.CharField(max_length=10),
        ),
    ]