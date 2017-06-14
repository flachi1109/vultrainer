# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_vulncontainer'),
    ]

    operations = [
        migrations.AddField(
            model_name='vulncontainer',
            name='rep_steps',
            field=models.CharField(max_length=20, null=True),
        ),
        migrations.AddField(
            model_name='vulncontainer',
            name='vuln_num',
            field=models.CharField(max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='vulncontainer',
            name='description',
            field=models.CharField(max_length=500, null=True),
        ),
    ]
