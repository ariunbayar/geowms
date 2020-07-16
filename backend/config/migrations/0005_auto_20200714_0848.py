from django.db import migrations


def create_default_configs(apps, schema_editor):

    Config = apps.get_model('backend_config', 'Config')

    values = (
        ('agency_name', 'ГАЗАР ЗОХИОН БАЙГУУЛАЛТ, ГЕОДЕЗИ, ЗУРАГ ЗҮЙН ГАЗАР'),
        ('agency_contact_address', 'Монгол улс, Улаанбаатар хот, Чингэлтэй дүүрэг, 4-р хороо, Барилгачдын талбай, Засгийн газрын 12-р байр'),
        ('agency_contact_phone', '+976 7000-3959'),
        ('agency_contact_email', 'info@gazar.gov.mn'),
        ('site_footer_text', '© Бүх эрх хуулиар хамгаалагдсан ГЕОПОРТАЛ'),
        ('site_title', 'ГЕОПОРТАЛ - Монгол Улс'),
    )

    for name, value in values:
        Config.objects.create(name=name, value=value)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_config', '0004_auto_20200714_0838'),
    ]

    operations = [
        migrations.RunPython(create_default_configs),
    ]
