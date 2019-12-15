from django.views.decorators.csrf import csrf_exempt
from app.core.api.utils import *
from app.decorators import *
from django.core.exceptions import ObjectDoesNotExist
from app.models import *
from random import shuffle
from datetime import timedelta, datetime
from django.db.models import Q
from app.core.models.account import get_available_account_for_job
import math


@csrf_exempt
@accepts("post")
@json_request
def update_campaign_people_status(request, job_id):
    status = request.json.get("status")
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("object doesn't exist")

    with transaction.atomic():
        if status in [CAMPAIGN_STATUS_MANAGER_DONE, CAMPAIGN_STATUS_MANAGER_IN_PROGRESS, CAMPAIGN_STATUS_WORKER_DONE,
                      CAMPAIGN_STATUS_WORKER_IN_PROGRESS]:
            job.campaign_people.status = status
            job.campaign_people.save()

            CampaignPeopleEvent.create_event(
                campaign=job.campaign_people, data={"status": status})
            return api_response_ok()

    return api_response_fail("didn't succeed to save to db")


@csrf_exempt
@accepts("post")
@json_request
def add_campaign_people_data(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("object doesn't exist")

    results = request.json.get("results")
    if not results:
        return api_response_fail("no data provided")

    CampaignPeopleData.add_data(data=results['data'], campaign=job.campaign_people)
    return api_response_ok()


@csrf_exempt
@accepts("post")
@json_request
def create_campaign_people_worker_job(request, job_id):
    total_pages = request.json.get("total_pages")
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("job not found")

    limit = int(job.data["limit"])
    for num in range(math.ceil(int(total_pages)/limit)):
        page_num = (limit + 1) + (num*limit)
        acc = get_available_account_for_job()
        if acc is None:
            return api_response_fail("no available account for job")

        job.campaign_people.page_num = page_num
        job.campaign_people.limit = limit

        data = job.campaign_people.as_dict()

        with transaction.atomic():
            job = acc.create_job(
                job_type=JOB_TYPE_CAMPAIGN_CRAWLER_WORKER, data=data, campaign_people=job.campaign_people)

            acc.last_job_start = datetime.now()
            acc.save()

            job.enqueue()
    return api_response_ok()
