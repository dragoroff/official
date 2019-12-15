from app.base_model import BaseModel
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.core.validators import MaxValueValidator, MinValueValidator

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

MAIL_BUILDER_TYPE_IGNORE = "IGNORE"
MAIL_BUILDER_TYPE_CONDITIONAL = "CONDITIONAL"
MAIL_BUILDER_TYPE_FORCE = "FORCE"

MAIL_BUILDER_TYPES = [
    (MAIL_BUILDER_TYPE_IGNORE, "Ignore"),
    (MAIL_BUILDER_TYPE_CONDITIONAL, "Conditional"),
    (MAIL_BUILDER_TYPE_FORCE, "Force"),
]


class CampaignPeople(BaseModel):
    keyword = models.CharField(max_length=64, null=False, blank=False)
    company = models.CharField(max_length=128, null=True, blank=True)
    industry = models.CharField(max_length=128, null=True, blank=True)
    mail_builder = models.CharField(max_length=32, choices=MAIL_BUILDER_TYPES, default=MAIL_BUILDER_TYPE_IGNORE, null=False)
    max_pages = models.IntegerField(blank=True, null=True, default=None, validators=[MaxValueValidator(100), MinValueValidator(1)])
    positions_white_list = models.CharField(max_length=1068, null=True, blank=True)
    page_num = models.IntegerField(blank=True, null=True, default=1)
    limit = models.IntegerField(blank=True, null=True, default=5)
    status = models.CharField(
        max_length=64, choices=CAMPAIGN_STATUSES, default=CAMPAIGN_STATUS_MANAGER_READY)

    class Meta:
        db_table = "campaign_people"
