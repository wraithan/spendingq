from tastypie.authorization import Authorization
from tastypie.resources import ModelResource
from tastypie.fields import ToManyField, IntegerField

from .auth import DjangoAuthentication
from .models import DataPoint, Profile


class ProfileResource(ModelResource):
    data_points = ToManyField('spendingq.core.resources.DataPointResource',
                              'data_points', full=True)

    class Meta:
        authentication = DjangoAuthentication()
        authorization = Authorization()
        queryset = Profile.objects.all()
        resource_name = 'profile'


class DataPointResource(ModelResource):
    spending_quotient = IntegerField(attribute='sq', readonly=True)

    class Meta:
        authentication = DjangoAuthentication()
        authorization = Authorization()
        queryset = DataPoint.objects.all()
        resource_name = 'datapoint'

    def obj_create(self, bundle, request=None, **kwargs):
        user_id = request.user.id
        return super(DataPointResource, self).obj_create(bundle, request,
                                                         owner_id=user_id)
