from django.views.decorators.csrf import csrf_exempt
from app.core.api.utils import *
from app.decorators import *
from app.models import *


@csrf_exempt
@accepts('post')
@json_request
def profile_result(request):
    data = request.json.get("results")
    if not data:
        return api_response_fail("no data provided")
    ProfileInfo.create_info(data)
    return api_response_ok()
