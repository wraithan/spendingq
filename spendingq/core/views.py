from django.views.generic.edit import UpdateView

from .models import Profile
from .forms import ProfileForm


class ProfileUpdate(UpdateView):
    model = Profile
    form_class = ProfileForm
