from django.conf.urls import patterns, include, url
from django.contrib import admin

from tastypie.api import Api

from spendingq.core.views import HomeView, ProfileUpdate
from spendingq.core.resources import DataPointResource, ProfileResource


api = Api(api_name='api')
api.register(ProfileResource())
api.register(DataPointResource())
admin.autodiscover()

urlpatterns = patterns(
    '',  # view prefix
    url(r'^$',
        HomeView.as_view(),
        name='home'),
    url(r'^profile/(?P<pk>\d+)/',
        ProfileUpdate.as_view(),
        name='profile'),
    url(r'^admin/',
        include(admin.site.urls)),
    url(r'^browserid/',
        include('django_browserid.urls')),
    url(r'graph/(?P<username>[\w.@+-]+)$',
        GraphView.as_view(),
        name='graph')
    url(r'^',
        include(api.urls)),
)
