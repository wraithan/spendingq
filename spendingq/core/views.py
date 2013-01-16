from django.db.models import Avg, Count, Q
from django.views.generic import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import UpdateView
from django.views.generic.list import ListView

from .models import Profile
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
                .order_by('user__username')
                .annotate(dp_count=Count('data_points'),
                          sq_avg=Avg('data_points__spending_quotient')))


class GraphView(DetailView):
    context_object_name = 'profile'
    model = Profile
    template_name = 'core/graph.html'

    def get_object(self, queryset=None):
        return (Profile.objects.select_related('user')
                               .get(user__username=self.kwargs['username']))
