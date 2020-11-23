from django.db import migrations, models
from django.core import serializers
from django.db import connections



def update_bundles(apps, schema_editor):
    bundles = apps.get_model('backend_bundle', 'Bundle')
    themes = apps.get_model('backend_inspire', 'LThemes')
    

    for i in bundles.objects.all():
        theme = themes.objects.filter(theme_name=i.name).first()
        if theme:
            bundles.objects.filter(id=i.id).update(ltheme=theme)
        else:
            theme = themes.objects.filter(theme_name__istartswith=i.name[:3], theme_name__endswith= i.name[-4:]).first()
            if theme:
                bundles.objects.filter(id=i.id).update(ltheme=theme)
            else:
                cursor = connections['default'].cursor()
                sql = """
                INSERT INTO 
                    public.l_themes(
                        theme_name,
                        order_no, 
                        is_active
                        )
                VALUES (
                    '{theme_name}', 
                    {order_no},
                    {is_active}
                    )
             
                """.format(
                    theme_name=i.name,
                    order_no=i.sort_order,
                    is_active=True
                )
                cursor.execute(sql)
                theme = themes.objects.filter(theme_name=i.name).first()
                bundles.objects.filter(id=i.id).update(ltheme=theme)



class Migration(migrations.Migration):

    dependencies = [
        ('backend_bundle', '0015_bundle_ltheme'),
    ]

    operations = [
        migrations.RunPython(update_bundles),
    ]
