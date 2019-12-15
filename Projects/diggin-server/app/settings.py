
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


SECRET_KEY = 'zn0jx9^l!*52$$oke&521-+lw25!g&&lhz_$rvr2hul!f+5(^&'

DEBUG = True

ADMINS = (('Phanatic', 'alerts@phanatic.io'),)
ALLOWED_HOSTS = ["*"]  # TODO
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR + STATIC_URL
UPLOAD_PATH = os.path.join(BASE_DIR, "uploads"),


QUEUE_SETTINGS = {
    'HOST': '127.0.0.1',
    'PORT': 6379,
    'DB': 1,
    'PASSWORD': '253300ae-d1c3-443b-9250-d77a2a6eef17',
    'DEFAULT_TIMEOUT': 60 * 60,
}

RQ_QUEUES = {
    'pass_checker': QUEUE_SETTINGS,
    'profile_crawler': QUEUE_SETTINGS,
    'builder': QUEUE_SETTINGS,
    'filler': QUEUE_SETTINGS,
    'searcher': QUEUE_SETTINGS,
    'campaign_crawler': QUEUE_SETTINGS,
    'campaign_messenger': QUEUE_SETTINGS,
    'voter': QUEUE_SETTINGS,
    'visitor': QUEUE_SETTINGS,
}


INSTALLED_APPS = [
    'grappelli',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django_rq",
    'app'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'app.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR + '/app/templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'app.wsgi.application'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'gunshot',
        'PORT': '5432',
        #'USER': 'gunshot',
        #'PASSWORD': 'sh0tgunsh0T',
        'USER': 'olegbrusilovski',
        'PASSWORD': '123456',
        'HOST': 'localhost',
    }
}


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


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Jerusalem'
USE_I18N = True
USE_L10N = True
USE_TZ = False


GRAPPELLI_ADMIN_TITLE = "Shotgun Core v3.0"
GRAPPELLI_SWITCH_USER = True
GRAPPELLI_INDEX_DASHBOARD = 'app.dashboard.RootDashboard'
