# Generated by Django 4.0.1 on 2022-04-27 11:12

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('SOM_vis_app', '0008_coord2d'),
    ]

    operations = [
        migrations.AddField(
            model_name='coord2d',
            name='colour',
            field=models.CharField(default=0, max_length=100000),
        ),
        migrations.AddField(
            model_name='coorddome',
            name='colour',
            field=models.CharField(default=0, max_length=100000),
        ),
        migrations.CreateModel(
            name='Triangle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('point1', models.IntegerField(default=0)),
                ('point2', models.IntegerField(default=0)),
                ('point3', models.IntegerField(default=0)),
                ('toDraw', models.BooleanField(default=False)),
                ('geoDome', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='SOM_vis_app.geodome')),
            ],
        ),
    ]
