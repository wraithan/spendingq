from math import log

from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    public = models.BooleanField(default=False)
    user = models.OneToOneField('auth.User')

    def get_absolute_url(self):
        return reverse('profile', kwargs={'pk': self.id})


class DataPoint(models.Model):
    collection_rate = models.PositiveIntegerField()
    average_unspent = models.PositiveIntegerField()
    owner = models.ForeignKey('core.Profile')

    @property
    def sq(self):
        cr = self.collection_rate
        au = self.average_unspent
        return 35 * ((0.00137 * cr) - log(au)) + 240


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        profile, new = Profile.objects.get_or_create(user=instance)
