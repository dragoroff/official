from app.models import Events
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@accepts('get')
def get_initial_info(request, acc_id):
    initial_info = Events.objects.filter(entityID=acc_id).filter(event_type__in=[EVENT_DEPOSIT_ACCEPTED, EVENT_INITIAL_DEPOSIT, EVENT_FEES_CHARGED,
                                                                                 EVENT_TRANSFER_ACCEPTED, EVENT_WITHDRAWAL_ACCEPTED, EVENT_INCOMING_PAYMENT])
    if not initial_info:
        return api_response_fail("not_enough_data")

    balance = sum([float(i.data['amount']) for i in initial_info])
    user = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(entityID=acc_id).first()
    state = {"name": user.data['name'], "balance": balance}
    return api_response_ok(state)
