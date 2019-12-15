from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from app.core.api.utils import *
from app.decorators import *
from app.models import *
from django.db import transaction
from datetime import datetime, timedelta


@accepts("get")
def get_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    return api_response_ok({"job": job.as_dict()})


@csrf_exempt
@accepts('post')
def start_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    if job.status != JOB_STATUS_QUEUED:
        return api_response_fail("wrong_status")
    job.status = JOB_STATUS_STARTED
    with transaction.atomic():
        job.save()
        job.account.new_event(
            {"eventType": "start_job", "job_id": str(job_id)})
        job.account.last_job_start = datetime.now()
        job.account.save()
        return api_response_ok()


@csrf_exempt
@accepts('post')
def end_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    if job.status != JOB_STATUS_STARTED:
        return api_response_fail("wrong_status")
    job.status = JOB_STATUS_ENDED
    with transaction.atomic():
        job.save()
        job.account.new_event({"eventType": "end_job", "job_id": str(job_id)})

        if job.plan:
            # in case of end_job(BUILDER) + plan,
            # we'd like to create next filler job for this account.
            #
            # in case of end_job(FILLER) + plan,
            # we'd like to schedule new searcher jobs.
            #
            # in case of end_job(SEARCHER) + plan,
            # we'd like to schedule new searcher jobs, if ready_threshold isn't reached.
            try:
                # this may fail, but we don't want
                # to fail the 'end job' request as well.
                job.create_planned_job()
            except Exception as e:
                print(str(e))

        return api_response_ok()


@csrf_exempt
@accepts('post')
@json_request
def update_cookies(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    #
    cookies = request.json.get("cookies")
    if not cookies:
        return api_response_fail("missing_args")
    #
    job.account.li_cookies = cookies
    with transaction.atomic():
        job.account.save()
        job.account.new_event({"eventType": "update_li_cookies"})
        return api_response_ok()


@csrf_exempt
@accepts('post')
@json_request
def report_dead_proxy(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    #
    with transaction.atomic():
        p = job.account.proxy
        if p.status not in [PROXY_STATUS_BLOCKED, PROXY_STATUS_DEAD]:
            p.status = PROXY_STATUS_DEAD
            p.save()
        #
        job.account.new_event({"eventType": "report_dead_proxy"})
        #
        # Find a new proxy and assign to account
        new_proxy = Proxy.objects.filter(status=PROXY_STATUS_NEW).first()
        if not new_proxy:
            return api_response_fail("missing_proxies")

        job.account.proxy = new_proxy
        #
        #  Now proxy in use, so change
        #  status for proxy from NEW to INUSE
        new_proxy.status = PROXY_STATUS_INUSE
        new_proxy.save()
        #
        job.account.save()
        #
        # Relaunch job
        job.status = JOB_STATUS_NEW
        job.save()
        return api_response_ok()


@csrf_exempt
@accepts('post')
@json_request
def report_dead_email(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")

    job.account.new_event({"eventType": "email_invalid"})
    return api_response_ok()


@csrf_exempt
@accepts('post')
@json_request
def job_event(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    #
    job.new_event(request.json.get("data", {}))
    return api_response_ok()


@csrf_exempt
@accepts('post')
@json_request
def account_event(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not_found")
    #
    job.account.new_event(request.json.get("data", {}))
    return api_response_ok()
