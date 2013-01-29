from random import randint
from .models import Profile


def generate_sampledata(options):
    user_id = options.get('id', None)
    point_count = int(options.get('points', None))
    fail = False
    if user_id is None:
        print 'id required'
        fail = True
    if point_count is None:
        print 'points requires'
        fail = True
    if fail:
        raise TypeError('fix arguments')
    prof = Profile.objects.get(user__id=user_id)
    for i in xrange(point_count):
        prof.data_points.create(collection_rate=randint(700, 1200),
                                average_unspent=randint(300, 500))
