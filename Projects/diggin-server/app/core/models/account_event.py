from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class AccountEvent(BaseModel):
    account = models.ForeignKey("Account", related_name="events", on_delete=models.PROTECT)
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "account_event"
        ordering = ["-created_at"]
