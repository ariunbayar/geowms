import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

AUTH_USER_MODEL = 'geoportal_app.User'

INTERNAL_IPS = ['127.0.0.1',]

# Application definition

INSTALLED_APPS = [

    # Unchained

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_user_agents',
    'django.contrib.gis',

    # Dependencies

    'crispy_forms',
    'easyaudit',

    # Frontend apps

    'geoportal_app.apps.GeoportalAppConfig',
    'frontend.bundle.apps.BundleConfig',
    'frontend.mobile.apps.MobileConfig',
    'frontend.суурь_давхарга.apps.СуурьДавхаргаConfig',
    'frontend.secure.apps.SecureConfig',
    'frontend.payment.apps.PaymentConfig',
    'frontend.page.apps.PageConfig',
    'frontend.profile.apps.ProfileConfig',
    'frontend.qpay.apps.QpayConfig',

    # Backend apps

    'backend.webapp.apps.WebappConfig',
    'backend.wms.apps.WMSConfig',
    'backend.wmslayer.apps.WMSLayerConfig',
    'backend.bundle.apps.BundleConfig',
    'backend.user.apps.UserConfig',
    'backend.суурь_давхарга.apps.СуурьДавхаргаConfig',
    'backend.govorg.apps.GovOrgConfig',
    'backend.config.apps.ConfigConfig',
    'backend.org.apps.OrgConfig',
    'backend.log.apps.LogConfig',
    'backend.payment.apps.PaymentConfig',
    'backend.changeset.apps.ChangesetConfig',
    'backend.gis.apps.GisConfig',
    'backend.dedsanbutets.apps.DedsanbutetsConfig',
    'backend.inspire.apps.InspireConfig',
    'backend.geoserver.apps.GeoserverConfig',

    # API apps

    'api.govorg.apps.GovOrgConfig',
    'api.public.apps.PublicConfig',

    # GovOrg apps

    'govorg.backend.org.apps.OrgConfig',
    'govorg.backend.bundle.apps.BundleConfig',
    'govorg.backend.employee.apps.EmployeeConfig',
    'govorg.backend.system.apps.SystemConfig',
    'govorg.backend.govorg_inspire.apps.InspireConfig',
    'govorg.backend.org_request.apps.OrgRequestConfig',
    'govorg.backend.zipcode.apps.ZipcodeConfig',
    'govorg.backend.forms.apps.FormsConfig',
]

USER_AGENTS_CACHE = 'default'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_user_agents.middleware.UserAgentMiddleware',
    'easyaudit.middleware.easyaudit.EasyAuditMiddleware',
]

ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'main', 'templates')]
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'main.context_processors.context_processor',
                'main.context_processors.context_config',
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'main.wsgi.application'
CRISPY_TEMPLATE_PACK="bootstrap4"

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'mn'

TIME_ZONE = 'Asia/Ulaanbaatar'

USE_I18N = True

USE_L10N = False

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'geoportal_app', 'static')
FILES_ROOT = os.path.join(BASE_DIR, 'geoportal_app', 'files', 'payment')

LOGIN_URL = 'secure:login'
LOGIN_REDIRECT_URL = 'bundle:all'
LOGIN_REDIRECT_ORG_URL = 'org:frontend'
LOGIN_REDIRECT_URL_MOBILE = 'mobile:all'
LOGOUT_REDIRECT_URL = 'bundle:all'

DATA_UPLOAD_MAX_MEMORY_SIZE = 9175040 #70mb

MEDIA_ROOT = os.path.join(BASE_DIR, 'geoportal_app/media')
MEDIA_URL = '/media/'

# Энд бичсэн url ийн log ийг хадгалж авахгүй.
DJANGO_EASY_AUDIT_UNREGISTERED_URLS_EXTRA = [r'^/back/wms/WMS/', r'^/api/service/']
