from app.base_model import BaseModel
from django.db import models
from django.contrib.postgres.fields import JSONField
from app.models import *
from datetime import datetime

CAMPAIGN_TYPE_BY_KEYWORD = "KEYWORD"
CAMPAIGN_TYPE_BY_COMPANY_NAME = "COMPANY"

CAMPAIGN_TYPES = [
    (CAMPAIGN_TYPE_BY_KEYWORD, "Search By Keyword"),
    (CAMPAIGN_TYPE_BY_COMPANY_NAME, "Search By Company Name")
]

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


class Campaign(BaseModel):
    campaign_type = models.CharField(max_length=64, choices=CAMPAIGN_TYPES, null=False,
                                     default=CAMPAIGN_TYPE_BY_KEYWORD)
    keyword = models.CharField(max_length=128, null=False, default=str)
    get_people = models.BooleanField(null=False, default=False)
    get_groups = models.BooleanField(null=False, default=False)
    get_companies = models.BooleanField(null=False, default=False)
    mail_builder = models.CharField(max_length=32, choices=MAIL_BUILDER_TYPES, default=MAIL_BUILDER_TYPE_IGNORE, null=False)
    status = models.CharField(
        max_length=64, choices=CAMPAIGN_STATUSES, default=CAMPAIGN_STATUS_MANAGER_READY)
    white_list = models.CharField(max_length=1028, null=True, help_text="If you are looking for company's employees "
                                                                        "you can choose positions that you are"
                                                                        " interested in. Separate values with commas.")

    class Meta:
        db_table = "campaign"
