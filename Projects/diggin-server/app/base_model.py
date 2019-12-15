import uuid
from uuid import UUID
from datetime import datetime, date
from django.db import models


class BaseModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now=True, db_index=True)

    class Meta:
        abstract = True

    def as_dict(self):
        ret = {}
        for k in self.__dict__:
            if k.startswith('_'):
                continue
            v = self.__dict__[k]
            if type(v) is datetime:
                ret[k] = v.strftime('%c')
            elif type(v) is date:
                ret[k] = v.strftime('%d/%m/%Y')
            elif type(v) is UUID:
                ret[k] = str(v)
            else:
                ret[k] = v
        return ret
