from tastypie.resources import ModelResource
from tastypie.fields import ToManyField, IntegerField

from .models import DataPoint, Profile


class ProfileResource(ModelResource):
    data_points = ToManyField('spendingq.core.resources.DataPointResource',
                              'data_points', full=True)

    class Meta:
        queryset = Profile.objects.all()
        resource_name = 'profile'


class DataPointResource(ModelResource):
    spending_quotient = IntegerField(attribute='sq', readonly=True)

    class Meta:
        queryset = DataPoint.objects.all()
        resource_name = 'datapoint'
