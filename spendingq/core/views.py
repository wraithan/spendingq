from django.views.generic import TemplateView
from django.views.generic.edit import UpdateView

from .models import Profile
from .forms import ProfileForm


class HomeView(TemplateView):
    template_name = 'core/home.html'


class ProfileUpdate(UpdateView):
    model = Profile
    form_class = ProfileForm

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


class GraphView(TemplateView):
    template_name = 'core/graph.html'
