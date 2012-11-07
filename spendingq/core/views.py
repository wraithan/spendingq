from django.core.urlresolvers import reverse
from django.views.generic import TemplateView
from django.views.generic.edit import UpdateView

from .models import Profile
from .forms import ProfileForm


class HomeView(TemplateView):
    template_name = 'core/home.html'


class ProfileUpdate(UpdateView):
    model = Profile
    form_class = ProfileForm
