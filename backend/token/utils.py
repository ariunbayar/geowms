import uuid

from django.apps import apps


class TokenGenerator():

    NUM_NEW_TOKENS = 100

    def __init__(self, kind):
        self.kind = kind

    @property
    def model(self):
        if not hasattr(self, '_model'):
            self._model = apps.get_model('backend_token', 'KindToken')
        return self._model

    @property
    def qs(self):
        if not hasattr(self, '_qs'):
            self._qs = self.model.objects.filter(kind=self.kind)
        return self._qs

    def _exclude_existing_tokens(self, values):
        qs = self.qs
        qs = qs.filter(token__in=values)
        values_existing = qs.values_list('token', flat=True)

        return set(values) - set(values_existing)

    def generate_tokens(self, amount=NUM_NEW_TOKENS):

        values = [uuid.uuid4().hex[:32] for i in range(amount)]
        values = self._exclude_existing_tokens(values)

        if not values:
            raise Exception('[ERROR] New token error for "%r"' % self.qs.query)

        tokens_new = [
            self.model(
                kind=self.kind,
                token=token,
                is_used=False
            )
            for token in values
        ]

        tokens = self.model.objects.bulk_create(tokens_new)

        return tokens

    def get(self):

        token = self.qs.filter(is_used=False).first()

        if token is None:
            tokens = self.generate_tokens()
            token = tokens[-1]

        token.is_used = True
        token.save()

        return token.token


class TokenGeneratorSystem(TokenGenerator):
    def __init__(self):
        kind = self.model.KIND_GIS_SYSTEM_TOKEN
        super().__init__(kind)


class TokenGeneratorUserValidationEmail(TokenGenerator):
    def __init__(self):
        kind = self.model.KIND_VALIDATION_EMAIL
        super().__init__(kind)


class TokenGeneratorEmployee(TokenGenerator):
    def __init__(self):
        kind = self.model.KIND_GIS_EMPLOYEE_TOKEN
        super().__init__(kind)


# TODO TokenGenerator for following:
# KIND_RESET_PASSWORD = 2
