import uuid
from PIL import Image
from collections import namedtuple
from io import BytesIO
import base64
import re
import unicodedata
from django.db import connections
from backend.dedsanbutets.models import ViewNames
from django.conf import settings
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from geoportal_app.models import UserValidationEmail


def resize_b64_to_sizes(src_b64, sizes):

    src_bytes = base64.b64decode(src_b64)
    src_io = BytesIO(src_bytes)

    def _resize(image, size):
        dst = BytesIO()
        image.thumbnail(size)
        image.save(dst, format='PNG')
        return dst

    image = Image.open(src_io)

    return map(lambda size: _resize(image, size).getvalue(), sizes)


def named_tuple_fetchall(cursor):
    """ Return all rows from a cursor as a namedtuple """
    desc = cursor.description
    nt_result = namedtuple('Result', [col[0] for col in desc])
    for row in cursor.fetchall():
        yield nt_result(*row)


def dict_fetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    for row in cursor.fetchall():
        yield dict(zip(columns, row))


GIS_CONNECTION = 'postgis_db'


def gis_table_by_oid(oid):

    cursor = connections[GIS_CONNECTION].cursor()

    sql = """
        SELECT
            n.nspname as "schema",
            c.relname as "name"
        FROM
            pg_catalog.pg_class c
        LEFT JOIN
            pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE
            c.oid = %s
    """

    cursor.execute(sql, [oid])
    schema, table = cursor.fetchone()

    return '"{}"."{}"'.format(schema, table)


def gis_tables_by_oids(oids):

    sql = """
        SELECT
            c.oid as "oid",
            n.nspname as "schema",
            c.relname as "table"
        FROM
            pg_catalog.pg_class c
        LEFT JOIN
            pg_catalog.pg_namespace n ON n.oid = c.relnamespace
        WHERE
            c.oid IN ({oids})
    """.format(
        oids=('%s, ' * len(oids))[:-2],
    )

    query_args = oids

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)
        tables = list(dict_fetchall(cursor))
    return tables


def gis_fields_by_oid(oid, exclude=[]):

    with connections[GIS_CONNECTION].cursor() as cursor:

        sql = """
            SELECT
                attname,
                atttypid::regtype AS atttypid
            FROM
                pg_catalog.pg_attribute
            WHERE
                attrelid = %s::regclass
                AND NOT attisdropped
                AND attnum > 0
            ORDER BY
                attnum ASC
        """.format(
            gis_table_by_oid(oid)
        )
        table = gis_table_by_oid(oid)
        cursor.execute(sql, [table])
        fields = list(named_tuple_fetchall(cursor))

    fields_final = [
        field
        for field in fields
        if field.attname not in exclude
    ]

    return fields_final


def gis_insert(oid, fields, values, value_default=''):

    table = gis_table_by_oid(oid)

    sql = """
        INSERT INTO
            {table}
            ({fields})
        VALUES
            ({values})
    """.format(
        table=table,
        fields=', '.join(['"{}"'.format(f.attname) for f in fields]),
        values=('%s, ' * len(fields))[:-2]
    )

    query_args = [
        values.get(f.attname, value_default)
        for f in fields
    ]

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)


def gis_delete(oid, pk):

    sql = """
        DELETE FROM
            {table}
        WHERE
            id = %s
    """.format(
        table=gis_table_by_oid(oid)
    )

    query_args = [pk]

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)


def gis_fetch_one(oid, pk):

    table = gis_table_by_oid(oid)
    fields = gis_fields_by_oid(oid)

    columns_to_select = [
        'ST_AsGeoJSON(ST_Transform("%s", 4326)) AS "%s"' % (f.attname, f.attname)
        if f.atttypid == 'geometry' else '"%s"' % f.attname
        for f in fields
    ]

    cursor = connections['postgis_db'].cursor()
    sql = """
        SELECT
            {columns}
        FROM
            {table}
        WHERE
            id = %s
        LIMIT 1
    """.format(
        table=table,
        columns=', '.join(columns_to_select),
    )
    query_args = [pk]

    with connections['postgis_db'].cursor() as cursor:
        cursor.execute(sql, query_args)
        rows = list(dict_fetchall(cursor))

    return len(rows) and rows[0] or None


def slugifyWord(word):
    word = unicodedata.normalize('NFKD', word).encode('ascii', 'ignore').decode('ascii')
    word = re.sub(r'[^\w\s_]', '', word.lower())
    word = re.sub(r'[_\s]+', '_', word).strip('-_')
    return word


def refreshMaterializedView(fid):

    view_data = ViewNames.objects.filter(feature_id=fid).first()
    if view_data:
        sql = """ REFRESH MATERIALIZED VIEW CONCURRENTLY public.{table_name} """.format(table_name=view_data.view_name)
        with connections['default'].cursor() as cursor:
            cursor.execute(sql)
            return True

        return False
    else:
        return True


def _generate_user_token():
    return uuid.uuid4().hex[:32]


def send_approve_email(user):

    if not user.email:
        return False

    token = _generate_user_token()

    UserValidationEmail.objects.create(
        user=user,
        token=token,
        valid_before=timezone.now() + timedelta(days=90)
    )

    subject = 'Геопортал хэрэглэгч баталгаажуулах'
    msg = 'Дараах холбоос дээр дарж баталгаажуулна уу! http://{host_name}/gov/user/approve/{token}/'.format(token=token, host_name=settings.EMAIL_HOST_NAME)
    from_email = settings.EMAIL_HOST_USER
    to_email = [user.email]

    send_mail(subject, msg, from_email, to_email, fail_silently=False)


    return True
