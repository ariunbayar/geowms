# Generated by Django 3.0.7 on 2021-05-21 09:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('backend_org', '0026_delete_nemawms'),
    ]

    operations = [
        migrations.CreateModel(
            name='RequestFiles',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=250, verbose_name='Нэр')),
                ('kind', models.PositiveIntegerField(choices=[(2, 'ХҮЛЭЭГДЭЖ БУЙ'), (1, 'ШИИДВЭРЛЭГДСЭН'), (3, 'БУЦААГДСАН'), (4, 'ЦУЦЛАСАН')], db_index=True, null=True)),
                ('state', models.PositiveIntegerField(choices=[(1, 'ШИНЭ'), (2, 'ИЛГЭЭСЭН ')], db_index=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('geo_id', models.CharField(max_length=100)),
                ('file_path', models.FileField(upload_to='llc-request-files/')),
            ],
            options={
                'db_table': 'llc_request_files',
            },
        ),
        migrations.CreateModel(
            name='RequestFilesShape',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('theme_id', models.IntegerField()),
                ('package_id', models.IntegerField()),
                ('feature_id', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('files', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='llc_request.RequestFiles')),
                ('org', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend_org.Org')),
            ],
            options={
                'db_table': 'llc_file_shapes',
            },
        ),
        migrations.CreateModel(
            name='ShapeGeom',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom_json', models.TextField()),
                ('form_json', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True, null=True)),
                ('shape_id', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='llc_request.RequestFilesShape')),
            ],
            options={
                'db_table': 'llc_shapes_geom',
            },
        ),
    ]
