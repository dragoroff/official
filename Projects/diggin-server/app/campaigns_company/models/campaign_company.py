from app.base_model import BaseModel
from django.db import models
from django.contrib.postgres.fields import JSONField


CAMPAIGN_STATUS_MANAGER_READY = "MANAGER_READY"
CAMPAIGN_STATUS_MANAGER_IN_PROGRESS = "MANAGER_IN_PROGRESS"
CAMPAIGN_STATUS_MANAGER_DONE = "MANAGER_DONE"
CAMPAIGN_STATUS_WORKER_READY = "WORKER_READY"
CAMPAIGN_STATUS_WORKER_IN_PROGRESS = "WORKER_IN_PROGRESS"
CAMPAIGN_STATUS_WORKER_DONE = "WORKER_DONE"

CAMPAIGN_STATUSES = [
    (CAMPAIGN_STATUS_MANAGER_READY, "Manager Ready"),
    (CAMPAIGN_STATUS_MANAGER_IN_PROGRESS, "Manager In Progress"),
    (CAMPAIGN_STATUS_MANAGER_DONE, "Manager Done"),
    (CAMPAIGN_STATUS_WORKER_READY, "Worker Ready"),
    (CAMPAIGN_STATUS_WORKER_IN_PROGRESS, "Worker In Progress"),
    (CAMPAIGN_STATUS_WORKER_DONE, "Worker Done"),
]


class CampaignCompany(BaseModel):
    keyword = models.CharField(max_length=64, null=False, blank=False)
    get_people = models.BooleanField(null=False, blank=False, default=False,
                                     help_text="Get company's employees")
    positions_white_list = models.CharField(max_length=1068, null=True, blank=True,
                                     help_text="Won't work w/o get_people True")
    max_people = models.IntegerField(blank=True, null=True, default=None)
    max_companies = models.IntegerField(blank=True, null=True, default=None)
    status = models.CharField(
        max_length=64, choices=CAMPAIGN_STATUSES, default=CAMPAIGN_STATUS_MANAGER_READY)
    page_num = models.IntegerField(blank=True, null=True, default=1)
    limit = models.IntegerField(blank=True, null=True, default=5)

    class Meta:
        db_table = "campaign_company"
