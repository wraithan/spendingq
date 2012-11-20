from django.db.models import Q

from tastypie.authorization import Authorization


class ProfileAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        if request.method != 'GET' and not request.user.is_authenticated:
            return False
        return True

    def apply_limits(self, request, object_list):
        if request.method == 'GET':
            return object_list.filter(Q(user__id=request.user.id) |
                                      Q(public=True))
        else:
            return object_list.filter(user__id=request.user.id)


class DataPointAuthorization(Authorization):
    def is_authorized(self, request, object=None):
        if request.method != 'GET' and not request.user.is_authenticated:
            return False
        return True

    def apply_limits(self, request, object_list):
        if request.method == 'GET':
            return object_list.filter(Q(owner__id=request.user.id) |
                                      Q(public=True))
        else:
            return object_list.filter(owner__id=request.user.id)
