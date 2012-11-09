from fabric.api import task, local, lcd


s3 = {
    'bucket': 'media.spendingq.com',
    'key': 'static',
}


@task
def deploy():
    local('git push heroku')
    local('./manage.py collectstatic --noinput')
    local('s3sync.rb -r --progress static/ %(bucket)s:%(key)s' % s3)
