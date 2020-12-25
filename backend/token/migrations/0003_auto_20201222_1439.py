from django.db import migrations


def record_used_tokens(apps, schema_editor):

    KindToken = apps.get_model('backend_token', 'KindToken')
    UserValidationEmail = apps.get_model('geoportal_app', 'UserValidationEmail')
    System = apps.get_model('backend_govorg', 'GovOrg')

    KIND_VALIDATION_EMAIL = 1
    KIND_GIS_SYSTEM_TOKEN = 4

    validation_emails = UserValidationEmail.objects.all()

    for validation_email in validation_emails:

        obj, is_created = KindToken.objects.get_or_create(
            kind=KIND_VALIDATION_EMAIL,
            token=validation_email.token,
            defaults={
                'is_used': True,
            }
        )

    systems = System.objects.all()
    for system in systems:

        obj, is_created = KindToken.objects.get_or_create(
            kind=KIND_GIS_SYSTEM_TOKEN,
            token=system.token,
            defaults={
                'is_used': True,
            }
        )


class Migration(migrations.Migration):

    dependencies = [
        ('backend_token', '0002_auto_20201221_2030'),
        ('geoportal_app', '0018_user_davhtsal_error'),
        ('backend_govorg', '0008_auto_20201208_1234'),
    ]

    operations = [
        migrations.RunPython(record_used_tokens),
    ]
