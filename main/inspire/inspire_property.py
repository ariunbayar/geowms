from .base_code_entity import BaseCodeEntity
from .inspire_manager import InspireManager


class InspireProperty(BaseCodeEntity):

    items_mapped = {}
    items_pending = set()

    @classmethod
    def map_pending_items(cls):

        manager = InspireManager.get_instance()
        qs = manager.get_model('LProperties').objects
        qs = qs.filter(property_code__in=cls.items_pending)
        num_results = qs.count()
        properties = qs

        if len(cls.items_pending) != num_results:
            msg = 'Expected {} LProperties for {}. Found {}'.format(
                len(cls.items_pending),
                str(cls.items_pending),
                num_results,
            )
            raise Exception(msg)

        cls.items_mapped.update({
            prop.property_code: prop
            for prop in properties
        })

        cls.items_pending = set()

    def __init__(self, code):
        super().__init__(code)
        if code not in self.items_mapped:
            self.items_pending.add(code)

    @property
    def property_id(self):
        if self.code in self.items_pending:
            self.map_pending_items()
        return self.items_mapped[self.code].property_id

    @property
    def value_type_id(self):
        if self.code in self.items_pending:
            self.map_pending_items()
        return self.items_mapped[self.code].value_type_id
