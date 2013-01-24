from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin

from tastypie.api import Api

from spendingq.core.views import (AboutView, AllTimePoints, GraphList,
                                  GraphView, HomeView, ProfileUpdate,
                                  RobotsView, StatsView)
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
    url(r'^robots.txt$',
        RobotsView.as_view(),
        name='robots.txt'),
    url(r'^about/$',
        AboutView.as_view(),
        name='about'),
    url(r'^profile/edit$',
        ProfileUpdate.as_view(),
        name='profile'),
    url(r'^admin/',
        include(admin.site.urls)),
    url(r'^browserid/',
        include('django_browserid.urls')),
    url(r'graph/$',
        GraphList.as_view(),
        name='graph_list'),
    url(r'graph/(?P<username>[\w\s.@+-]+)$',
        GraphView.as_view(),
        name='graph'),
    url(r'^logout/',
        'django.contrib.auth.views.logout',
        name='logout'),
    url(r'^favicon\.ico$',
        'django.views.generic.simple.redirect_to',
        {'url': settings.STATIC_URL + 'images/favicon.ico',
         'permanent': False}),
    url(r'stats/$',
        StatsView.as_view(),
        name='stats'),
    url(r'^stats/data.json$',
        AllTimePoints.as_view(),
        name='stats-data'),
    url(r'^',
        include(api.urls)),
)

print 'static_url: %s' % settings.STATIC_URL
