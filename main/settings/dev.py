from .base import *  # noqa


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ae1158bdb614a226dedc4b18'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'geo',
        'USER': 'geoportal',
        'PASSWORD': 'geo',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

INSTALLED_APPS += [
    'debug_toolbar',
]

MIDDLEWARE += [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
]

DEBUG_TOOLBAR_CONFIG = {
    'SHOW_TOOLBAR_CALLBACK': lambda v: DEBUG == True,
}

SSO_GOV_MN = {
    'ENDPOINTS': {
        'AUTHORIZE': 'https://sso.gov.mn/oauth2/authorize',
        'TOKEN': 'https://sso.gov.mn/oauth2/token',
        'SERVICE': 'https://sso.gov.mn/oauth2/api/v1/service',
    },
    'CLIENT_ID': '',
    'CLIENT_SECRET': '',
    'CALLBACK_URI': 'https://nsdi.gov.mn/oauth2/',
}

EMAIL_USE_TLS = True
EMAIL_HOST = ''
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
EMAIL_PORT = 587

PAYMENT = {
    'SIGN_KEY_LOCATION': '',
    'DES3_ENCRYPTION_KEY': ''
}