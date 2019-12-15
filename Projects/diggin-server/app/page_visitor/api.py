from django.views.decorators.csrf import csrf_exempt
from app.core.api.utils import *
from app.decorators import *
from django.core.exceptions import ObjectDoesNotExist
from app.models import *


@csrf_exempt
@accepts("post")
@json_request
def update_visitor_status(request, job_id):
    status = request.json.get("status")
    try:
        job = Job.objects.get(id=job_id)
    except ObjectDoesNotExist:
        return api_response_fail("object doesn't exist")

    page_vis = PageVisitor.objects.get(id=job.data["id"])
    print(page_vis)
    if not page_vis:
        return api_response_fail(error="Cannot find page_visitor campaign")

    with transaction.atomic():
        if status in [PAGE_VISITOR_STATUS_STARTED, PAGE_VISITOR_STATUS_ENDED]:
            page_vis.status = status
            page_vis.save()

            VisitorEvent.objects.create(
                visitor=page_vis, event={"status": status})
            return api_response_ok()

    return api_response_fail("didn't succeed to save to db")

