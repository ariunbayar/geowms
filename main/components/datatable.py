from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator
from main.utils import get_display_items


class Datatable():

    def __init__(self, model, payload=None, оруулах_талбарууд=[], хасах_талбарууд=[], хувьсах_талбарууд=[]):
        self.Model = model
        self.payload = payload
        self.оруулах_талбарууд = оруулах_талбарууд
        self.хасах_талбарууд = хасах_талбарууд
        self.query = payload.get('query') or ''
        self.perpage = payload.get('perpage') or 20
        self.page = payload.get('page') or 1
        self.sort_name = payload.get('sort_name') or 'pk'
        self.хувьсах_талбарууд = хувьсах_талбарууд
        self.qs = None
        self.items_page = None
        self.total_page = None

    def get_fields(self):
        fields = []
        for field in self.Model._meta.get_fields():
            name = field.name
            if field.get_internal_type() == 'ForeignKey':
                name = name + '_id'
            fields.append(name)

        return fields

    @property
    def хасах_талбарууд(self):
        return self.хасах_талбарууд

    @хасах_талбарууд.setter
    def хасах_талбарууд(self, values):
        if values:
            fields = self.get_fields()
            for value in values:
                if value in fields:
                    fields.remove(value)

            self.оруулах_талбарууд = fields

    def search(self):
        qs = self.Model.objects.annotate(search=SearchVector(*self.оруулах_талбарууд))
        qs = qs.filter(search__icontains=self.query)
        qs = qs.order_by(self.sort_name)
        self.qs = qs

    def paginator(self):
        total_items = Paginator(self.qs, self.perpage)
        items_page = total_items.page(self.page)
        self.items_page = items_page.object_list
        self.total_page = total_items.num_pages

    def get(self):
        self.search()
        self.paginator()
        items = get_display_items(self.items_page, self.оруулах_талбарууд, self.хувьсах_талбарууд)

        return items, self.total_page
