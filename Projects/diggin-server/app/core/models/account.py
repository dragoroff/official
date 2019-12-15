from app.base_model import BaseModel, models
from app.core.models.account_event import *
from django.contrib.postgres.fields import JSONField
from django.db import transaction
from app.core.models.gmail import *
from app.core.models.proxy import *
from app.core.models.job import Job, JOB_STATUS_NEW, JOB_TYPE_BUILDER
import os
import json
from random import shuffle
from datetime import datetime, timedelta
from django.db.models import Q
import math

ACCOUNT_STATUS_NEW = "NEW"
ACCOUNT_STATUS_EMAIL_VALID = "EMAILVALID"
ACCOUNT_STATUS_EMAIL_INVALID = "EMAILINVALID"
ACCOUNT_STATUS_CREATED = "CREATED"
ACCOUNT_STATUS_FILLED = "FILLED"
ACCOUNT_STATUS_BLOCKED = "BLOCKED"
ACCOUNT_STATUSES = [
    (ACCOUNT_STATUS_NEW, "NEW"),
    (ACCOUNT_STATUS_EMAIL_VALID, "EMAILVALID"),
    (ACCOUNT_STATUS_EMAIL_INVALID, "EMAILINVALID"),
    (ACCOUNT_STATUS_CREATED, "CREATED"),
    (ACCOUNT_STATUS_FILLED, "FILLED"),
    (ACCOUNT_STATUS_BLOCKED, "BLOCKED"),
]


class Account(BaseModel):
    proxy = models.ForeignKey(
        "Proxy", on_delete=models.PROTECT, related_name="accounts")
    gmail = models.OneToOneField("Gmail", on_delete=models.PROTECT)
    status = models.CharField(
        max_length=32, null=False, db_index=True, choices=ACCOUNT_STATUSES)
    num_connections = models.IntegerField(null=False, default=0, db_index=True)
    li_password = models.CharField(max_length=32, null=False)
    li_cookies = JSONField(null=False, default=dict)
    li_avatar = models.CharField(max_length=128, null=False, default=str)
    li_default_avatar = models.CharField(
        max_length=128, null=False, default="http://gunshot.phanatic.io/static/assets/default/default.jpg")
    last_job_start = models.DateTimeField(null=True, db_index=True)
    profile_details = models.ForeignKey(
        'ProfileInfoCombination', related_name="accounts", null=True, on_delete=models.PROTECT)
    plan = models.ForeignKey(
        "Plan", null=True, blank=True, related_name="accounts", on_delete=models.PROTECT)
    is_ready = models.BooleanField(null=False, default=False)

    class Meta:
        db_table = "account"
        ordering = ["-created_at"]

    def create_job(self, job_type: str, data=None, plan=None, campaign=None, campaign_company=None, campaign_people=None):
        if not data:
            data = {}

        return Job.objects.create(account=self, job_type=job_type, data=data, campaign=campaign, campaign_company=campaign_company, campaign_people=campaign_people, plan=plan)

    @staticmethod
    def build_accounts(limit, plan):
        if not Proxy.objects.filter(status=PROXY_STATUS_NEW).first() or not Account.objects.filter(status=ACCOUNT_STATUS_NEW).first():
            raise Exception("Any new Account or new Proxy")

        accounts = Account.objects.filter(status=ACCOUNT_STATUS_NEW)
        for ind, acc in enumerate(accounts[:limit]):
            try:
                proxy = Proxy.objects.filter(status=PROXY_STATUS_NEW).first()
                with transaction.atomic():
                    acc.proxy = proxy
                    acc.plan = plan
                    acc.save()
                    proxy.status = PROXY_STATUS_INUSE
                    proxy.save()
                    acc.create_job(job_type=JOB_TYPE_BUILDER, plan=plan).enqueue()
            except:
                continue

    @staticmethod
    def get_search_data():
        BASEDIR = os.getcwd()

        with open(f'{BASEDIR}/app/utils/search_data.json') as f:
            data = json.loads(f.read())
        with open(f'{BASEDIR}/app/utils/search_data.json', 'w') as w:
            json.dump(data[1:], w)

        if data:
            return False, data[0]
        else:
            return True, None

    def new_event(self, data: dict):
        #
        #  data examples:
        #
        #   {"eventType": "num_connections", "n": 34}
        #   {"eventType": "account_blocked"}
        #
        #
        # we're using db transaction so all db
        # updates will occur together, or not at all.
        with transaction.atomic():
            #
            AccountEvent.objects.create(account=self, data=data)
            #
            eventType = data.get("eventType")
            if eventType == "account_blocked":
                self.status = ACCOUNT_STATUS_BLOCKED
                self.save()
                self.proxy.status = PROXY_STATUS_BLOCKED
                self.proxy.save()
                self.gmail.status = EMAIL_STATUS_BLOCKED
                self.gmail.save()

            elif eventType == "account_fresh":
                self.status = ACCOUNT_STATUS_NEW
                self.save()

            elif eventType == "password_changed":
                new_password = data.get("password")
                self.gmail.status = EMAIL_STATUS_PASSCHANGED
                self.gmail.password = new_password
                self.gmail.save()
            #
            elif eventType == "email_invalid":
                self.status = ACCOUNT_STATUS_EMAIL_INVALID
                self.save()
                self.gmail.status = EMAIL_STATUS_DEAD
                self.gmail.save()
                self.proxy.status = PROXY_STATUS_NEW
                self.proxy.save()

            elif eventType == "created":
                cookies = data.get("cookies")
                self.li_cookies = cookies
                self.status = ACCOUNT_STATUS_CREATED
                self.save()
                self.gmail.status = EMAIL_STATUS_INUSE
                self.gmail.save()
                self.proxy.status = PROXY_STATUS_INUSE
                self.proxy.save()

            elif eventType == "filled":
                self.status = ACCOUNT_STATUS_FILLED
                self.save()

            elif eventType == "num_connections":
                n = data.get("n")
                if n is not None:
                    self.num_connections = n
                    self.save()

    def __str__(self):
        return self.gmail.email

    def as_dict(self):
        ret = super(Account, self).as_dict()
        ret['proxy'] = self.proxy.as_dict() if self.proxy else None
        ret['gmail'] = self.gmail.as_dict() if self.gmail else None
        ret['profile_details'] = self.profile_details.as_dict(
        ) if self.profile_details else None

        return ret


def get_available_account_for_job(sleep_hours=24):
    if sleep_hours < 24:
        accounts = [acc for acc in Account.objects.filter(
            Q(status=ACCOUNT_STATUS_FILLED) & Q(num_connections__gte=30))[:100]]

        shuffle(accounts)
        return accounts[0] if len(accounts) else None

    d = datetime.now() - timedelta(hours=sleep_hours)
    return Account.objects.filter(Q(status=ACCOUNT_STATUS_FILLED) & Q(num_connections__gte=30)).filter(Q(last_job_start__lte=d) | Q(last_job_start__isnull=True)).first()
