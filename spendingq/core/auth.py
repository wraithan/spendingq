from tastypie.authentication import Authentication


class DjangoAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        return request.user.is_authenticated()

    def get_identifier(self, request, **kwargs):
        return request.user.email
