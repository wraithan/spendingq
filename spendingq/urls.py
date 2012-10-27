from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from spendingq.core.views import ProfileUpdate

admin.autodiscover()

urlpatterns = patterns(
    '',  # view prefix
    url(r'^$', TemplateView.as_view(template_name='base.html'), name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^profile/(?P<pk>\d+)/', ProfileUpdate.as_view(), name='profile'),
    (r'^browserid/', include('django_browserid.urls')),
)
