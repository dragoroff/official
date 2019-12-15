from app.base_model import BaseModel
from django.db import models
from django.contrib.postgres.fields import JSONField


PAGE_VISITOR_STATUS_NEW = "NEW"
PAGE_VISITOR_STATUS_STARTED = "STARTED"
PAGE_VISITOR_STATUS_ENDED = "ENDED"
PAGE_VISITOR_STATUSES = [
    (PAGE_VISITOR_STATUS_NEW, "NEW"),
    (PAGE_VISITOR_STATUS_STARTED, "STARTED"),
    (PAGE_VISITOR_STATUS_ENDED, "ENDED"),
]

class PageVisitor(BaseModel):
    status = models.CharField(
        max_length=32, null=False, db_index=True, choices=PAGE_VISITOR_STATUSES, default=PAGE_VISITOR_STATUS_NEW)
    url_list = JSONField(null=False, blank=True, default=list)
    keyword_list = JSONField(null=False, blank=True, default=list)
    serp_index = models.IntegerField(null=False, blank=True, default=0)
    target_url = models.CharField(max_length=128, null=False, blank=False, help_text="Write full url address")
    element_text = models.CharField(max_length=128, null=False, blank=True, default=str)
    time_delay = models.IntegerField(null=False, blank=True, default=0, help_text="Write delay in seconds")

    class Meta:
        db_table = "page_visitor"

