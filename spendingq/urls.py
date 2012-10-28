from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from tastypie.api import Api

from spendingq.core.views import ProfileUpdate
from spendingq.core.resources import DataPointResource, ProfileResource


api = Api(api_name='api')
api.register(ProfileResource())
api.register(DataPointResource())
admin.autodiscover()

urlpatterns = patterns(
    '',  # view prefix
    url(r'^$', TemplateView.as_view(template_name='base.html'), name='home'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^profile/(?P<pk>\d+)/', ProfileUpdate.as_view(), name='profile'),
    (r'^', include(api.urls)),
    (r'^browserid/', include('django_browserid.urls')),
)
