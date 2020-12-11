from .base_code_entity import BaseCodeEntity
from .inspire_manager import InspireManager


class InspireDataType(BaseCodeEntity):

    items_mapped = {}
    items_pending = set()

    @classmethod
    def map_pending_items(cls):

        manager = InspireManager.get_instance()
        qs = manager.get_model('LDataTypes').objects
        qs = qs.filter(data_type_code__in=cls.items_pending)
        num_results = qs.count()
        data_types = qs

        if len(cls.items_pending) != num_results:
            msg = 'Expected {} LDataTypes for {}. Found {}'.format(
                len(cls.items_pending),
                str(cls.items_pending),
                num_results,
            )
            raise Exception(msg)

        cls.items_mapped.update({
            data_type.data_type_code: data_type
            for data_type in data_types
        })

        cls.items_pending = set()

    def __init__(self, code):
        super().__init__(code)
        if code not in self.items_mapped:
            self.items_pending.add(code)

    @property
    def data_type_id(self):
        if self.code in self.items_pending:
            self.map_pending_items()
        return self.items_mapped[self.code].data_type_id
