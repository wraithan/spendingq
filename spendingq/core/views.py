from datetime import date, datetime
import decimal
import json

from django import http
from django.db.models import Avg, Count, Q
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import UpdateView
from django.views.generic.list import ListView

from .models import DataPoint, Profile
from .forms import ProfileForm


class HomeView(TemplateView):
    template_name = 'core/home.html'


class RobotsView(TemplateView):
    template_name = 'robots.txt'


class AboutView(TemplateView):
    template_name = 'core/about.html'


class ProfileUpdate(UpdateView):
    form_class = ProfileForm
    model = Profile

    def get_initial(self):
        initial = super(ProfileUpdate, self).get_initial()
        initial['username'] = self.request.user.username
        return initial

    def get_object(self, queryset=None):
        return self.request.user.profile

    def form_valid(self, form):
        if form.is_valid():
            self.request.user.username = form.cleaned_data['username']
            self.request.user.save()
        return super(ProfileUpdate, self).form_valid(form)


class GraphList(ListView):
    template_name = 'core/graph_list.html'

    def get_queryset(self):
        return (Profile.objects
                .filter(Q(user__id=self.request.user.id) | Q(public=True))
                .select_related('user')
                .annotate(dp_count=Count('data_points'),
                          sq_avg=Avg('data_points__spending_quotient'))
                .order_by('-dp_count'))


class GraphView(DetailView):
    context_object_name = 'profile'
    model = Profile
    template_name = 'core/graph.html'

    def get_context_data(self, **kwargs):
        context = super(GraphView, self).get_context_data(**kwargs)

        username = self.kwargs['username']
        public = self.request.user.username != username

        context.update({
            'initial_data': DataPoints.get_json(username, public)
        })

        return context

    def get_object(self, queryset=None):
        return get_object_or_404(Profile.objects.select_related('user'),
                                 user__username=self.kwargs['username'])


class DateTimeJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, decimal.Decimal):
            return float(obj)
        else:
            return super(DateTimeJSONEncoder, self).default(obj)


class AllTimePoints(TemplateView):
    def render_to_response(self, context):
        data = list(DataPoint.objects
                    .values('when')
                    .annotate(count=Count('id'))
                    .order_by('when'))
        content = (DateTimeJSONEncoder().encode(data))
        return http.HttpResponse(content, content_type='application/json')


class DataPoints(TemplateView):

    @classmethod
    def get_json(cls, user_name, public_only):
        query_filter = Q(owner__user__username=user_name)
        if public_only:
            query_filter &= Q(owner__public=True)
        data = DataPoint.objects.filter(query_filter).values().order_by('id')
        content = (DateTimeJSONEncoder().encode(list(data)))
        return content

    def render_to_response(self, context):
        user = self.kwargs.get('username')
        content = self.get_json(user, self.request.user.username != user)
        return http.HttpResponse(content, content_type='application/json')


class StatsView(TemplateView):
    template_name = 'core/stats.html'
