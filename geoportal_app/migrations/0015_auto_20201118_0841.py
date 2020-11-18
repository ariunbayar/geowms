import uuid
from django.db import migrations

def _generate_user_token():
    return uuid.uuid4().hex[:32]

def user_approve(apps, schema_editor):
    User = apps.get_model('geoportal_app', 'User')

    for user in User.objects.all():
        user.is_approve = True
        user.token = _generate_user_token()
        user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('geoportal_app', '0014_user_token'),
    ]

    operations = [
        migrations.RunPython(user_approve),
    ]
