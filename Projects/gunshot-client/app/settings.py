import os

DEBUG = True
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRIVER_MAIN_MODULE = f'{BASE_DIR}/main'
SECRET_KEY = '!+vxu8x8fy-db$rr%!&q=pnf$^m96hm5di(7s%j8t=ot_@jz_l'
WSGI_APPLICATION = 'app.wsgi.application'
STATIC_URL = '/static/'
ROOT_URLCONF = 'app.urls'
ALLOWED_HOSTS = ["*"]
RQ_SHOW_ADMIN_LINK = True
REDIS_PASS = '253300ae-d1c3-443b-9250-d77a2a6eef17'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

QUEUE_SETTINGS = {
    'HOST': 'gunshot.phanatic.io',
    'PORT': 6379,
    'DB': 1,
    'PASSWORD': REDIS_PASS,
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

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.admin',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app',
    'django_rq',
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

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ]
        },
    },
]

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
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Jerusalem'
USE_I18N = True
USE_L10N = True
USE_TZ = True
