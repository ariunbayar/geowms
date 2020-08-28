from django.db import migrations, models

def update_user(apps, schema_editor):
    User = apps.get_model('geoportal_app', 'User')
    users = User.objects.all()
  
    for user in users:
        if not user.password:
            continue
        if user.password.startswith('pbkdf2_sha256'):
            continue
        else:
            user.set_password(user.password)
            user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0010_delete_page'),
    ]

    operations = [
        migrations.RunPython(update_user),
    ]
