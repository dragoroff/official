from app.models import Events
from django.views.decorators.csrf import csrf_exempt
from app.decorators import *
from app.utils import *
from app.enums import *


@csrf_exempt
@accepts('post')
@json_request
def login(request):
    data = request.json.get('data')
    if not data:
        return api_response_fail("missing_args")

    user = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(data__email=data['email']).first()

    if not user:
        return api_response_fail("Nonexistent user")

    if data['password'] != user.data['password']:
        return api_response_fail("Incorrect password")

    Events.objects.create(entityID=user.id, data=data, event_type=EVENT_USER_SIGNED_IN)
    return api_response_ok({'user_id': user.id, 'status': user.data['status']})
