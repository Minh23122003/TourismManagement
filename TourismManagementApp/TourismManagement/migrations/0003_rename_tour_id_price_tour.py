# Generated by Django 5.0.3 on 2024-07-04 14:46

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('TourismManagement', '0002_alter_tour_end_date_alter_tour_start_date'),
    ]

    operations = [
        migrations.RenameField(
            model_name='price',
            old_name='tour_id',
            new_name='tour',
        ),
    ]