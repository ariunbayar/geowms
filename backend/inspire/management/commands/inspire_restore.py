import os
import subprocess
from datetime import datetime

from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import connections

# from polls.models import Question as Poll


class Command(BaseCommand):

    help = 'python3 manage.py inspire_restore <filename.backup>'

    def add_arguments(self, parser):
        parser.add_argument('filename', type=str)

    def info(self, msg):
        self.stdout.write(self.style.SUCCESS(msg))

    def warn(self, msg):
        self.stdout.write(self.style.ERROR(msg))

    def check_and_warn_db_owner(self):

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    pg_catalog.pg_get_userbyid(d.datdba) as "Owner"
                FROM
                    pg_catalog.pg_database d
                WHERE
                    d.datname = %s
            """
            cursor.execute(sql, [self.db_conf['NAME']])
            owner, = cursor.fetchone()
            if owner != self.db_conf['USER']:
                self.warn('Database owner mismatch')
                print('Run following command:')
                print('===')
                print(
                    (
                        "sudo -u postgres psql "
                        "-c 'ALTER DATABASE {database} OWNER TO {user};'"
                    ).format(
                        database=self.db_conf['NAME'],
                        user=self.db_conf['USER'],
                    )
                )
                print()
                return False

        return True

    def check_and_warn_schema_owner(self):

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    pg_catalog.pg_get_userbyid(n.nspowner) AS "Owner"
                FROM
                    pg_catalog.pg_namespace n
                WHERE
                    n.nspname !~ '^pg_' AND n.nspname <> 'information_schema'
                    AND n.nspname = 'public'
            """
            cursor.execute(sql)
            owner, = cursor.fetchone()
            if owner != self.db_conf['USER']:
                self.warn('Schema owner mismatch')
                print('Run following command:')
                print('===')
                print(
                    (
                        "sudo -u postgres psql "
                        "-c 'ALTER SCHEMA public OWNER TO {user};' "
                        "{database}"
                    ).format(
                        user=self.db_conf['USER'],
                        database=self.db_conf['NAME'],
                    )
                )
                print()
                return False

        return True

    def check_and_warn_extension_postgis(self):

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    COUNT(*)
                FROM
                    pg_catalog.pg_extension e
                LEFT JOIN
                    pg_catalog.pg_namespace n ON n.oid = e.extnamespace
                WHERE
                    e.extname = 'postgis'
                    AND n.nspname != 'public'
            """
            cursor.execute(sql)
            num_results, = cursor.fetchone()

        if num_results:
            self.warn('Extension "postgis" must be on schema "public"')
            print('Run following command:')
            print('===')
            print(
                (
                    "sudo -u postgres psql "
                    "-c 'DROP EXTENSION postgis;' "
                    "{database}\n"

                    "sudo -u postgres psql "
                    "-c 'CREATE EXTENSION postgis WITH SCHEMA \"public\";' "
                    "{database}"
                ).format(
                    database=self.db_conf['NAME'],
                )
            )
            print()

            return False
        else:
            return True

    def check_and_warn_extension_tablefunc(self):

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    COUNT(*)
                FROM
                    pg_catalog.pg_extension e
                WHERE
                    e.extname = 'tablefunc'
            """
            cursor.execute(sql)
            num_results, = cursor.fetchone()
            if num_results == 0:
                self.warn('Missing extension tablefunc')
                print('Run following command:')
                print('===')
                print(
                    (
                        "sudo -u postgres psql "
                        "-c 'CREATE EXTENSION tablefunc WITH SCHEMA public;' "
                        "{database}"
                    ).format(
                        database=self.db_conf['NAME'],
                    )
                )
                print()
                return False

        return True

    def check_and_warn_extension_plpython3u(self):

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    COUNT(*)
                FROM
                    pg_catalog.pg_extension e
                WHERE
                    e.extname = 'plpython3u'
            """
            cursor.execute(sql)
            num_plpython3u, = cursor.fetchone()
            if num_plpython3u == 0:
                self.warn('Missing extension plpython3u')
                print('Run following command:')
                print('===')
                print(
                    (
                        "sudo apt install -y postgresql-plpython3-12\n"
                        "sudo -u postgres psql "
                        "-c 'CREATE EXTENSION plpython3u WITH SCHEMA pg_catalog;' "
                        "{database}"
                    ).format(
                        database=self.db_conf['NAME'],
                    )
                )
                print()
                return False

        return True

    def check_and_warn_trusted_plpython3u(self):

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    COUNT(*)
                FROM
                    pg_language
                WHERE
                    lanname LIKE 'plpython3u'
                    AND lanpltrusted = true
            """
            cursor.execute(sql)
            num_plpython3u, = cursor.fetchone()
            if num_plpython3u == 0:
                self.warn('Language "plpython3u" must be trusted.')
                print('Run following command:')
                print('===')
                print(
                    (
                        "sudo -u postgres psql "
                        "-c \"UPDATE pg_language SET lanpltrusted = true WHERE lanname = 'plpython3u'\" "
                        "{database}"
                    ).format(
                        database=self.db_conf['NAME'],
                    )
                )
                print()
                return False

        return True

    def check_and_warn_filename(self, filename):

        if not os.path.exists(filename):
            msg = 'File "%s" doesn\'t exist' % filename
            self.warn(msg)
            return False

        return True

    def db_backup(self):

        filename = "{}_tmp_{}.backup".format(
            self.db_conf['NAME'],
            datetime.now().strftime('%Y-%m-%d_%H-%M-%S'),
        )

        with connections['default'].cursor() as cursor:
            sql = """
                SELECT
                    tablename
                FROM
                    pg_tables
                WHERE
                    schemaname = 'public'
                    AND tablename NOT SIMILAR TO '(l\_|m\_|spatial_ref_sys)%';
            """
            cursor.execute(sql)
            tables = cursor.fetchall()

        table_args = [
            v
            for table, in tables
            for v in ['-t', table]
        ]

        cmd = [
            '/usr/bin/pg_dump',
            '--file', filename,
            '--host', self.db_conf['HOST'],
            '--port', self.db_conf['PORT'],
            '--username', self.db_conf['USER'],
            '--no-password',
            '--verbose',
            *table_args,
            '--format=c',
            '--blobs',
            '--table="django_migrations"',
            self.db_conf['NAME'],
        ]

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stdin=subprocess.PIPE,
            env={'PGPASSWORD': self.db_conf['PASSWORD']},
        )
        stdout, stderr = proc.communicate()

        print(stdout.decode())

        if stderr:
            self.stdout.write(self.style.ERROR(stderr.decode()))

        return filename

    def exec_psql(self, sql):
        cmd = [
            '/usr/bin/psql',
            '--host', self.db_conf['HOST'],
            '--port', self.db_conf['PORT'],
            '--username', self.db_conf['USER'],
            '--no-password',
            '-c', sql,
            self.db_conf['NAME'],
        ]

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stdin=subprocess.PIPE,
            env={'PGPASSWORD': self.db_conf['PASSWORD']},
        )

        stdout, stderr = proc.communicate()

        print(stdout.decode())

        if stderr:
            self.stdout.write(self.style.ERROR(stderr.decode()))

    def db_restore(self, filename):

        cmd = [
            '/usr/bin/pg_restore',
            '-h', self.db_conf['HOST'],
            '-p', self.db_conf['PORT'],
            '-U', self.db_conf['USER'],
            '--no-password',
            '--dbname', self.db_conf['NAME'],
            '--verbose',
            filename,
        ]

        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stdin=subprocess.PIPE,
            env={
                'PGPASSWORD': self.db_conf['PASSWORD']
            },
        )
        stdout, stderr = proc.communicate()

        print(stdout.decode())

        if stderr:
            self.stdout.write(self.style.ERROR(stderr.decode()))

    def handle(self, *args, **options):

        self.db_conf = settings.DATABASES['default']
        filename_inspire = options['filename']

        is_all_valid = all([
            self.check_and_warn_db_owner(),
            self.check_and_warn_schema_owner(),
            self.check_and_warn_extension_postgis(),
            self.check_and_warn_extension_tablefunc(),
            self.check_and_warn_extension_plpython3u(),
            self.check_and_warn_trusted_plpython3u(),
            self.check_and_warn_filename(filename_inspire),
        ])

        if not is_all_valid:
            return

        self.info('Backup some tables in schema "public"')
        filename_geoportal = self.db_backup()

        self.info('Dropping schema "public"')
        self.exec_psql('DROP SCHEMA public CASCADE')

        self.info('Creating schema "public"')
        self.exec_psql('CREATE SCHEMA public')

        self.info('Creating "public.py_pgrest"')
        self.exec_psql(
            """
                CREATE FUNCTION public.py_pgrest(
                        uri text,
                        body text DEFAULT NULL::text,
                        content_type text DEFAULT 'application/json'::text
                    ) RETURNS text
                LANGUAGE plpython3u
                AS $$
                    import requests
                    headers = {'Content-Type': content_type}
                    try:
                        rsp = requests.post(uri, data=body, headers=headers)
                    except Exception as e:
                        if hasattr(e, 'reason'):
                            return e.reason
                        elif hasattr(e, 'code'):
                            return e.code
                        else:
                            return e
                    else:
                        return rsp.content
                $$;
            """
        )

        self.info('Restoring "{}"'.format(filename_geoportal))
        self.db_restore(filename_geoportal)

        self.info('🎉 Inspire restore is READY...')
        print('Run following command to finish restore:')
        print('===')
        print(
            (
                """
                    sudo -u postgres pg_restore -d {database} -v '{filename}';
                    sudo -u postgres psql -qAt -c "
                        SELECT
                            c.relname as \"table\"
                        FROM pg_catalog.pg_class c
                        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                        WHERE
                            c.relkind IN ('r', 'p')
                            AND pg_catalog.pg_table_is_visible(c.oid)
                            AND n.nspname = 'public'
                            AND pg_catalog.pg_get_userbyid(c.relowner) = 'postgres';
                    " {database} | while read t; do
                        echo -en "\\033[1;32m$t: \\033[0m"
                        sudo -u postgres psql -c "ALTER TABLE \"$t\" OWNER TO {user}" {database}
                    done

                    sudo -u postgres psql -qAt -c "
                        SELECT
                            c.relname as \\"table\\"
                        FROM pg_catalog.pg_class c
                        LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                        WHERE
                            c.relkind IN ('v')
                            AND pg_catalog.pg_table_is_visible(c.oid)
                            AND n.nspname = 'public'
                            AND pg_catalog.pg_get_userbyid(c.relowner) = 'postgres';
                    " {database} | while read t; do
                        echo -en "\\033[1;32m$t: \\033[0m"
                        sudo -u postgres psql -c "ALTER VIEW \"$t\" OWNER TO {user}" {database}
                    done
                """
            ).format(
                database=self.db_conf['NAME'],
                user=self.db_conf['USER'],
                filename=filename_inspire,
            )
        )
        print()

        os.remove(filename_geoportal)
