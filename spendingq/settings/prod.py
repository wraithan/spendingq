from os import getenv

from .base import *


DEBUG = bool(getenv('DJANGO_DEBUG', False))
TEMPLATE_DEBUG = DEBUG
STATIC_URL = 'http://media.spendingq.com/static/'
SITE_URL = 'spendingq.com'
SENTRY_DSN = getenv('SENTRY_DSN', None)

INSTALLED_APPS += ('raven.contrib.django',)
