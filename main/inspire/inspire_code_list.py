from .base_code_entity import BaseCodeEntity
from .inspire_manager import InspireManager
from .inspire_value import InspireValue


class InspireCodeList(InspireValue, BaseCodeEntity):

    items_mapped = {}
    items_pending = set()

    @classmethod
    def map_pending_items(cls):

        manager = InspireManager.get_instance()
        qs = manager.get_model('LCodeLists').objects
        qs = qs.filter(code_list_code__in=cls.items_pending)
        qs = qs.values_list('code_list_code', 'code_list_id')
        code_list_pairs = list(qs)

        if len(cls.items_pending) != len(code_list_pairs):
            msg = 'Expected {} LCodeLists for {}. Found {}'.format(
                len(cls.items_pending),
                str(cls.items_pending),
                len(code_list_pairs),
            )
            raise Exception(msg)

        cls.items_mapped.update({
            code_list_code: code_list_id
            for code_list_code, code_list_id in code_list_pairs
        })

        cls.items_pending = set()

    def __init__(self, code):
        super().__init__(code)
        if code not in self.items_mapped:
            self.items_pending.add(code)

    @property
    def code_list_id(self):
        if self.code in self.items_pending:
            self.map_pending_items()
        return self.items_mapped[self.code]
