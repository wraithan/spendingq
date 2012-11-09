from fabric.api import task, local, lcd


s3 = {
    'bucket': 'media.spendingq.com',
    'key': 'static',
}


@task
def deploy():
    local('git push heroku')
    local('./manage.py static --noinput')
    local('s3sync.rb -r --progress collectedstatic/ %(bucket)s:%(key)s' % s3)
