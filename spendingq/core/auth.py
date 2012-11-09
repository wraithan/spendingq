from django.db.models import Q

from tastypie.authentication import Authentication
from tastypie.authorization import Authorization


class DjangoAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()

    def get_identifier(self, request, **kwargs):
        return request.user.email


class ProfileAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        return True

    def apply_limits(self, request, object_list):
        return object_list.filter(Q(user__id=request.user.id) | Q(public=True))
