from app.models import Events
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@accepts('get')
def get_fees_history(request):
    data = []
    history = Events.objects.filter(event_type=EVENT_FEES_CHARGED)
    if not history:
        return api_response_ok("No Data")

    for i in history:
        if 'to' in i.data.keys():
            temp_state = {'from': i.data['from'], 'to': i.data['to'], 'amount': abs(i.data['amount']), 'date': i.created_at.date()}
        else:
            temp_state = {'from': i.data['from'], 'amount': abs(i.data['amount']), 'date': i.created_at.date()}
        data.append(temp_state)

    balance = sum([abs(float(i['amount'])) for i in data])
    state = {
        'state': data,
        'balance': balance
    }

    return api_response_ok(state)
