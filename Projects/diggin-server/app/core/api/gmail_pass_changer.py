from django.views.decorators.csrf import csrf_exempt
from app.core.api.utils import *
from app.decorators import *
from django.core.exceptions import ObjectDoesNotExist
from app.models import *


@csrf_exempt
@accepts('post')
@json_request
def password_changed(request, job_id):
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("not found")

    email = job.account.gmail
    if email.status == EMAIL_STATUS_NEW:
        job.account.new_event(
            {"eventType": "password_changed", "password": job.data['new_password']})
        return api_response_ok()
    else:
        return api_response_fail("wrong status")
