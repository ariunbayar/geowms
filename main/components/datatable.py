from django.contrib.postgres.search import SearchVector
from django.core.paginator import Paginator, Page
from main.utils import get_display_items, get_fields


class Datatable():

    def __init__(self, model, initial_qs=None, payload=None, оруулах_талбарууд=[], хасах_талбарууд=[], хувьсах_талбарууд=[], нэмэлт_талбарууд=[], has_search=True):
        self.Model = model
        self.payload = payload
        self.оруулах_талбарууд = оруулах_талбарууд
        self.хасах_талбарууд = хасах_талбарууд
        self.query = payload.get('query') or ''
        self.perpage = payload.get('perpage') or 20
        self.page = payload.get('page') or 1
        self.sort_name = payload.get('sort_name') or 'pk'
        self.custom_query = payload.get('custom_query') or ''
        self.хувьсах_талбарууд = хувьсах_талбарууд
        self.search_qs = initial_qs or model.objects
        self.items_page = None
        self.total_page = None
        self.нэмэлт_талбарууд = нэмэлт_талбарууд
        self.start_index = 1
        self.has_search = has_search

    @property
    def хасах_талбарууд(self):
        return self.хасах_талбарууд

    @хасах_талбарууд.setter
    def хасах_талбарууд(self, values):
        if values or not self.оруулах_талбарууд:
            fields = get_fields(self.Model)
            for value in values:
                if value in fields:
                    fields.remove(value)

            self.оруулах_талбарууд = fields

    def search(self):
        search_qs = self.search_qs.annotate(search=SearchVector(*self.оруулах_талбарууд))
        search_qs = search_qs.filter(search__icontains=self.query)

        if self.custom_query:
            search_qs = search_qs.filter(**self.custom_query)

        self.search_qs = search_qs

    def sort(self):
        self.search_qs = self.search_qs.order_by(self.sort_name)

    def paginator(self):
        total_items = Paginator(self.search_qs, self.perpage)
        items_page = total_items.page(self.page)
        page = Page(self.search_qs, self.page, total_items)
        self.start_index = page.start_index()
        self.items_page = items_page.object_list
        self.total_page = total_items.num_pages

    def get(self):
        if self.has_search:
            self.search()
        self.sort()
        self.paginator()
        items = get_display_items(self.items_page, self.оруулах_талбарууд, self.хувьсах_талбарууд, self.нэмэлт_талбарууд)
        return items, self.total_page, self.start_index
