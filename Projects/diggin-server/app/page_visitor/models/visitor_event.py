from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class VisitorEvent(BaseModel):
    visitor = models.ForeignKey("PageVisitor", related_name="visitor", null=False, on_delete=models.PROTECT)
    event = JSONField(null=False, default=dict)

    class Meta:
        db_table = "visitor_event"
        ordering = ["created_at"]

