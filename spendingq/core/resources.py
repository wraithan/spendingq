from tastypie.authentication import Authentication
from tastypie.resources import ModelResource
from tastypie.fields import ToManyField

from .auth import DataPointAuthorization, ProfileAuthorization
from .models import DataPoint, Profile


class ProfileResource(ModelResource):
    data_points = ToManyField('spendingq.core.resources.DataPointResource',
                              'data_points', full=True)

    class Meta:
        allowed_methods = ('get',)
        authentication = Authentication()
        authorization = ProfileAuthorization()
        queryset = Profile.objects.all()
        resource_name = 'profile'


class DataPointResource(ModelResource):

    class Meta:
        list_allowed_methods = ('get', 'post', 'put', 'patch')
        authentication = Authentication()
        authorization = DataPointAuthorization()
        queryset = DataPoint.objects.all()
        resource_name = 'datapoint'
        exclude = ('owner',)

    def obj_create(self, bundle, request=None, **kwargs):
        user_id = request.user.id
        return super(DataPointResource, self).obj_create(bundle, request,
                                                         owner_id=user_id)
