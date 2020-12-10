class BaseCodeEntity():

    def __init__(self, code):
        self.code = str(code)

    def __hash__(self):
        return hash(self.code)

    def __eq__(self, other):
        assert isinstance(other, self.__class__)
        return self.code == other.code

    def __str__(self):
        return '<{} ({})>'.format(self.__class__.__name__, self.code)

    def __repr__(self):
        return str(self)
