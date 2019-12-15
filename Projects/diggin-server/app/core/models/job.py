from django.db import transaction
from app.base_model import BaseModel, models
from app.core.models.job_event import JobEvent
from django.contrib.postgres.fields import JSONField
from datetime import date, datetime, timedelta
import json
import django_rq
from django.utils import timezone
# from app.models import *
from app.core.models.proxy import *
from app.core.models.gmail import *
from app.utils import groups
from random import choice

from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

JOB_TYPE_PASS_CHECKER = "PWD"
JOB_TYPE_PROFILE_CRAWLER = "PC"
JOB_TYPE_BUILDER = "B"
JOB_TYPE_FILLER = "F"
JOB_TYPE_SEARCHER = "S"
JOB_TYPE_CAMPAIGN_CRAWLER_MANAGER = "CCM"
JOB_TYPE_CAMPAIGN_CRAWLER_WORKER = "CCW"
JOB_TYPE_VOTER = "V"
JOB_TYPE_CAMPAIGN_MESSENGER = "CM"
JOB_TYPE_VISITOR = "VIS"

JOB_TYPES = [
    (JOB_TYPE_PASS_CHECKER, "Password Changer"),
    (JOB_TYPE_PROFILE_CRAWLER, "Profile Crawler"),
    (JOB_TYPE_BUILDER, "Builder"),
    (JOB_TYPE_FILLER, "Filler"),
    (JOB_TYPE_SEARCHER, "Searcher"),
    (JOB_TYPE_CAMPAIGN_CRAWLER_MANAGER, "Campaign Crawler (Manager)"),
    (JOB_TYPE_CAMPAIGN_CRAWLER_WORKER, "Campaign Crawler (Worker)"),
    (JOB_TYPE_CAMPAIGN_MESSENGER, "Campaign Messenger"),
    (JOB_TYPE_VOTER, "Voter"),
    (JOB_TYPE_VISITOR, "Visitor"),
]

JOB_STATUS_NEW = "NEW"
JOB_STATUS_QUEUED = "QUEUED"
JOB_STATUS_STARTED = "STARTED"
JOB_STATUS_ENDED = "ENDED"
JOB_STATUSES = [
    (JOB_STATUS_NEW, "NEW"),
    (JOB_STATUS_QUEUED, "QUEUED"),
    (JOB_STATUS_STARTED, "STARTED"),
    (JOB_STATUS_ENDED, "ENDED"),
]




class Job(BaseModel):
    job_type = models.CharField(
        max_length=32, null=False, db_index=True, choices=JOB_TYPES)
    status = models.CharField(
        max_length=32, null=False, db_index=True, choices=JOB_STATUSES, default=JOB_STATUS_NEW)
    campaign = models.ForeignKey(
        "Campaign", null=True, blank=True, on_delete=models.PROTECT, related_name="jobs")
    campaign_people = models.ForeignKey(
        "CampaignPeople", null=True, blank=True, on_delete=models.PROTECT, related_name="jobs")
    campaign_company = models.ForeignKey(
        "CampaignCompany", null=True, blank=True, on_delete=models.PROTECT, related_name="jobs")
    account = models.ForeignKey(
        "Account", on_delete=models.PROTECT, related_name="jobs")
    data = JSONField(null=False, default=dict)
    plan = models.ForeignKey(
        "Plan", null=True, blank=True, related_name="jobs", on_delete=models.PROTECT)
    scheduled_to = models.DateTimeField(null=False, default=timezone.now)

    class Meta:
        db_table = "job"
        ordering = ["-created_at"]

    def new_event(self, data: dict):
        # we're using db transaction so all db
        # updates will occur together, or not at all.
        with transaction.atomic():
            JobEvent.objects.create(job=self, data=data)

    def get_queue_name(self):
        if self.job_type == JOB_TYPE_PASS_CHECKER:
            return "pass_checker"
        if self.job_type == JOB_TYPE_PROFILE_CRAWLER:
            return "profile_crawler"
        if self.job_type == JOB_TYPE_BUILDER:
            return "builder"
        if self.job_type == JOB_TYPE_FILLER:
            return "filler"
        if self.job_type == JOB_TYPE_SEARCHER:
            return "searcher"
        if self.job_type in [JOB_TYPE_CAMPAIGN_CRAWLER_MANAGER, JOB_TYPE_CAMPAIGN_CRAWLER_WORKER]:
            return "campaign_crawler"
        if self.job_type == JOB_TYPE_CAMPAIGN_MESSENGER:
            return "campaign_messenger"
        if self.job_type == JOB_TYPE_VOTER:
            return "voter"
        if self.job_type == JOB_TYPE_VISITOR:
            return "visitor"
        return None

    def enqueue(self) -> tuple:
        if self.status != JOB_STATUS_NEW:
            return False, "already_started"

        if self.scheduled_to is not None and self.scheduled_to > datetime.now():
            return False, "scheduled_to_future"

        qn = self.get_queue_name()
        print(f">> [.....] Queueing [{qn}]")
        try:
            django_rq.get_queue(qn).enqueue(
                'app.jobs.run_driver',
                job=str(self.id)
            )
            self.status = JOB_STATUS_QUEUED
            self.save()
            return True, None
        except Exception as e:
            return False, str(e)

    def create_planned_job(self):

        # not all jobs has a plan.
        if self.plan is None:
            return

        if len(self.data) == 0:
            self.plan.events.append({
                "type": "AccountStoppedPlan",
                "reason": "Not Enough DATA",
                "data": self.data
            })
            return

        if self.account.proxy.status in [PROXY_STATUS_BLOCKED, PROXY_STATUS_DEAD]:
            self.plan.events.append({
                "type": "AccountStoppedPlan",
                "reason": "Proxy",
                "status": self.account.proxy.status
            })
            return

        if self.account.gmail.status in [EMAIL_STATUS_BLOCKED, EMAIL_STATUS_DEAD]:
            self.plan.events.append({
                "type": "AccountStoppedPlan",
                "reason": "Email",
                "status": self.account.gmail.status
            })
            return


        new_job_type = None
        new_job_schedule = datetime.now()

        if self.job_type == JOB_TYPE_BUILDER:
            print("changed to filler")
            new_job_type = JOB_TYPE_FILLER

        elif self.job_type == JOB_TYPE_FILLER:
            new_job_type = JOB_TYPE_SEARCHER

        elif self.job_type == JOB_TYPE_SEARCHER:
            if self.account.num_connections >= self.plan.ready_threshold:
                self.plan.events.append({
                    "type": "AccountIsReady",
                    "data": self.account_id
                })
                self.plan.mark_as_ready(self.account)
                return

            new_job_type = JOB_TYPE_SEARCHER
            new_job_schedule = new_job_schedule + timedelta(1)
            used_locations = [job.data['search_location'] for job in Job.objects.filter(plan=self.plan)]
            used_names = [job.data['search_name'] for job in Job.objects.filter(plan=self.plan)]

            for data in self.plan.location.all():
                if data.location not in used_locations:
                    first_name = data.first_names[0]
                    location = data.location
                    break

                for name in data.first_names:
                    if name not in used_names:
                        first_name = name
                        location = data.location
                        break

        if new_job_type is None:
            return

        new_data = {
            'search_name': first_name,
            'search_location': location,
            "groups": choice(groups.list_groups),
            "iter_number": self.plan.iter_num
        }

        Job.objects.create(
            job_type=new_job_type,
            account=self.account,
            data=new_data,
            campaign=self.campaign,
            plan=self.plan,
            scheduled_to=new_job_schedule
        )
            # .enqueue()

    def as_dict(self):
        ret = super(Job, self).as_dict()
        ret['campaign'] = self.campaign.as_dict() if self.campaign else None
        ret['account'] = self.account.as_dict() if self.account else None
        return ret


def _json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type %s not serializable" % type(obj))
