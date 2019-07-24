from app.models import Events
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@accepts('get')
def get_deposit_history(request, acc_id):
    data = []
    history = Events.objects.filter(entityID=acc_id).filter(event_type=EVENT_DEPOSIT_ACCEPTED)
    if not history:
        return api_response_ok("No Data")

    for i in history:
        state = {'amount': i.data['amount'], 'date': i.created_at.date()}
        data.append(state)

    return api_response_ok(data)
