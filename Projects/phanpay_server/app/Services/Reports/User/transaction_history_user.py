from app.models import Events
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@accepts('get')
def get_transaction_history(request, acc_id):
    data = []
    history = Events.objects.filter(entityID=acc_id).filter(event_type__in=[EVENT_DEPOSIT_ACCEPTED, EVENT_INITIAL_DEPOSIT, EVENT_FEES_CHARGED,
                                                                            EVENT_TRANSFER_ACCEPTED, EVENT_WITHDRAWAL_ACCEPTED, EVENT_INCOMING_PAYMENT])
    if not history:
        return api_response_fail("not_enough_data")

    for i in history:
        if 'from' in i.data.keys():
            sender = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(id=i.data['from']).first().data['email']
            i.data['from'] = sender
        if 'to' in i.data.keys():
            recipient = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(id=i.data['to']).first().data['email']
            i.data['to'] = recipient

        i.data['event'] = i.event_type
        i.data['date'] = i.created_at.date()
        data.append(i.data)

    balance = sum([float(i['amount']) for i in data])
    state = {"state": data, "balance": balance}
    return api_response_ok(state)
