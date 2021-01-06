from django.db import migrations
from django.db import connections


def mdatas_field_transport_id_update(apps, schema_editor):
    with connections['default'].cursor() as cursor:
        create_seq_sql = """ CREATE SEQUENCE m_datas_id_seq OWNED BY public.m_datas.transport_id; """
        alter_table_seq_sql = """ ALTER TABLE public.m_datas ALTER COLUMN transport_id SET DEFAULT nextval('m_datas_id_seq'); """
        update_id_sql = """ UPDATE public.m_datas SET transport_id = nextval('m_datas_id_seq'); """
        primary_key_sql = """ ALTER TABLE public.m_datas ADD PRIMARY KEY (transport_id); """
        print("SEQUENCE үүссэж байна.")
        cursor.execute(create_seq_sql)
        print("SEQUENCE ийг mdatas.transport_id-д оноож өгөж байна.")
        cursor.execute(alter_table_seq_sql)
        print("SEQUENCE ийг ашиглан mdatas.transport_id дараалсан тоо болгож байна.")
        cursor.execute(update_id_sql)
        print("mdatas.transport_id-д PRIMARY KEY үүсгэж байна.")
        cursor.execute(primary_key_sql)


class Migration(migrations.Migration):

    dependencies = [
        ('backend_inspire', '0009_mdatas'),
    ]

    operations = [
        migrations.RunPython(mdatas_field_transport_id_update),
    ]
