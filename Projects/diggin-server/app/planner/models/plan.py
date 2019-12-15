from app.base_model import BaseModel, models
from django.contrib.postgres.fields import JSONField
from app.models import *
from app.core.models.account import *
from app.core.models.job import *
import os
import string
from random import *
from django.db import transaction

DOMAIN = "http://gunshot.phanatic.io"
PLAN_STATUS_NEW = "NEW"
PLAN_STATUS_STARTED = "STARTED"
PLAN_STATUS_ENDED = "ENDED"

PLAN_STATUSES = [
    (PLAN_STATUS_NEW, "New"),
    (PLAN_STATUS_STARTED, "Started"),
    (PLAN_STATUS_ENDED, "Ended"),
]

DATADIR = os.getcwd()
path_img_used = 'static/assets/used'
not_used_images = os.path.join(DATADIR, 'static/assets/not_used')


class Plan(BaseModel):
    num_accounts = models.IntegerField(null=False)
    # num of CONNECTIONS that an account should have in order to be READY.
    ready_threshold = models.IntegerField(null=False)
    status = models.CharField(
        max_length=32, null=False, default=PLAN_STATUS_NEW, choices=PLAN_STATUSES)
    location = models.ManyToManyField(SearcherLocation, related_name="name_location")
    iter_num = models.IntegerField(default=5, null=False)
    events = JSONField(null=False, default=list)

    @property
    def duration(self):
        return abs((self.created_at.date() - datetime.now().date()).days)

    @property
    def dead_accounts(self):
        return self.accounts.filter(Q(proxy__status__in=[PROXY_STATUS_BLOCKED, PROXY_STATUS_DEAD])
                                    | Q(gmail__status__in=[EMAIL_STATUS_DEAD, EMAIL_STATUS_BLOCKED])).count()

    @property
    def built(self):
        return self.accounts.filter(status=ACCOUNT_STATUS_CREATED).count()

    @property
    def filled(self):
        return self.accounts.filter(status=ACCOUNT_STATUS_FILLED).count()

    @property
    def ready(self):
        return self.accounts.filter(is_ready=True).count()

    class Meta:
        db_table = "plan"

    @staticmethod
    def mark_as_ready(account):
        account.is_ready = True
        account.save()

    @staticmethod
    def create_plan(num_accounts: int, ready_threshold: int):
        # First check if there are any accounts in status NEW
        avail_new_accounts = Plan.new_accounts_ready_to_build()
        if avail_new_accounts < num_accounts:
            unused_n = Plan.get_unused_accounts_n()
            if unused_n < num_accounts - avail_new_accounts:
                return None

        return Plan.objects.create(num_accounts=num_accounts, ready_threshold=ready_threshold)

    @staticmethod
    def new_accounts_ready_to_build():
        return min(Account.objects.filter(status=ACCOUNT_STATUS_NEW).count(), Proxy.objects.filter(status=PROXY_STATUS_NEW).count())

    def start(self):
        if self.status != PLAN_STATUS_NEW:
            raise Exception("Already started")

        with transaction.atomic():
            avail_accounts = self.new_accounts_ready_to_build()

            if not avail_accounts:
                self.create_accounts(self.num_accounts)
            elif avail_accounts >= self.num_accounts:
                Account.build_accounts(self.num_accounts, self)
            else:
                Account.build_accounts(avail_accounts, self)
                # create new accounts for this plan, using unused resources (gmails / proxies / pictures / profiles).
                self.create_accounts(self.num_accounts-avail_accounts)

            # mark as started
            self.status = PLAN_STATUS_STARTED
            self.save()

    def create_accounts(self, quantity):
        if self.accounts.count():
            raise Exception("Accounts already created")
        #
        for i in range(quantity):
            # 1. create account + fill with profile data + proxy + gmail + pic.
            try:
                gmails_inuse_ids = [
                    acc.gmail_id for acc in Account.objects.all()]
                proxies_inuse_ids = [
                    acc.proxy.id for acc in Account.objects.all()]

                # check if somebody has already used this Email or Proxy
                proxy = [proxy for proxy in Proxy.objects.filter(
                    status=PROXY_STATUS_NEW) if proxy.id not in proxies_inuse_ids][0]
                gmail = [email for email in Gmail.objects.filter(
                    status=EMAIL_STATUS_PASSCHANGED) if email.id not in gmails_inuse_ids][0]

                if not proxy or not gmail:
                    raise Exception("Not enough gmails or proxies")

                # create password
                characters = string.ascii_letters + string.punctuation + string.digits
                password = "".join(choice(characters)
                                   for x in range(randint(16, 24)))

                # get profile details and avatar
                profile = ProfileInfoCombination.get_unused_profiles()[0]
                avatar = self.get_avatar(profile)

                account = Account.objects.create(
                    proxy=proxy, gmail=gmail, status=ACCOUNT_STATUS_NEW, li_password=password, profile_details=profile, li_avatar=avatar, plan=self)

                # 2. create (+enqueue) builder job for account.
                # (when builder reports DONE to api, filler jobs will be created - TBD)
                account.create_job(job_type=JOB_TYPE_BUILDER, plan=self).enqueue()

            except Exception as e:
                print(str(e))


    @staticmethod
    def get_unused_accounts_n():

        unused_gmails_n = Gmail.objects.filter(
            status=EMAIL_STATUS_PASSCHANGED).count()
        unused_proxy_n = Proxy.objects.filter(status=PROXY_STATUS_NEW).count()
        unused_profiles_n = len(ProfileInfoCombination.get_unused_profiles())

        unused_images_n = min(len(os.listdir(
            f'{not_used_images}/man')), len(os.listdir(f'{not_used_images}/woman')))

        return min(unused_gmails_n, unused_proxy_n, unused_profiles_n, unused_images_n)

    @staticmethod
    def get_avatar(profile):

        gender = 'man' if profile.is_male else 'woman'
        img = choice(os.listdir(f'{not_used_images}/{gender}'))
        os.rename(f'{not_used_images}/{gender}/{img}',
                  f'{DATADIR}/{path_img_used}/{img}')

        avatar = f'{DOMAIN}/{path_img_used}/{img}'
        return avatar
