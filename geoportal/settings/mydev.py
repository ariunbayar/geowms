from .base import *  # noqa


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'tuuguu'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'geodata',
        'USER': 'myprojectuser',
        'PASSWORD': 'password',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

XYP_DAN = {
   'ENDPOINTS': {
       'LOGIN': 'https://tz.mohs.mn/api/login/?',
        'AUTHORIZE': 'https://tz.mohs.mn/api/auth/?',
        'SERVICE': 'https://tz.mohs.mn/api/service/?',
   },
   'CLIENT_KEY': '7OByrP28vNydwYtm3Eabfg==',
   'CLIENT_SECRET': 'S7WzoQOyKg0VbWxd9U7xjaq5ZuPvQQ1lHfHtmaJDKzSsPW5uiAq2FapZ/DM3niRfHpSMFUSVPRD+oOX/XNL8TA==',
   'REDIRECT_URI': 'http://localhost:8000/login/dan/',
}

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'tooktogi@gmail.com'
EMAIL_HOST_PASSWORD = 'togoldor1234'
EMAIL_PORT = 587