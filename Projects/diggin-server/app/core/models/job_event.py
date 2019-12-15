from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField


class JobEvent(BaseModel):
    job = models.ForeignKey("Job", related_name="events", on_delete=models.PROTECT)
    data = JSONField(null=False, default=dict)

    class Meta:
        db_table = "job_event"
        ordering = ["-created_at"]
