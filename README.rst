SpendingQ
=========

SpendingQ is the software that runs http://spendingq.com/ which is a StarCraft 2
site for tracking your Spending Quotient and graphing it.

Install
-------

Standard django app, make a virtualenv then::

    pip install -r requirements.txt
    ./manage.py syncdb
    ./manage.py runserver 8080

Then browse to http://localhost:8080/

If you'd like to generate some data points after creating an account, I have
setup Eadred ( https://github.com/willkg/django-eadred ). You'll need to get the
ID of your user, then run::

    ./manage.py generatedata --with=id=<user id> --with=points=<# of points>

And you are done!
