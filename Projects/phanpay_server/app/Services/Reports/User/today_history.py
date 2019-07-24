from app.models import Events
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt
from pytz import timezone
from datetime import datetime, timedelta
jerusalem = timezone('Asia/Jerusalem')


@csrf_exempt
@accepts('get')
@json_request
def current_payment_history(request, acc_id):
    data = []
    if not acc_id:
        return api_response_fail("missing_args")

    today = datetime.utcnow().date()
    start = datetime(today.year, today.month, today.day, tzinfo=jerusalem)
    end = start + timedelta(1)

    history = Events.objects.filter(event_type__in=[EVENT_DEPOSIT_ACCEPTED, EVENT_INITIAL_DEPOSIT, EVENT_FEES_CHARGED, EVENT_OPERATION_DECLINED,
                                                    EVENT_TRANSFER_ACCEPTED, EVENT_WITHDRAWAL_ACCEPTED, EVENT_INCOMING_PAYMENT])\
                            .filter(entityID=acc_id).filter(created_at__gte=start).filter(created_at__lte=end).order_by("created_at")

    if not history:
        return api_response_ok("no_history_detected")

    for i in history:
        if 'from' in i.data.keys():
            sender = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(id=i.data['from']).first().data['email']
            i.data['from'] = sender
        if 'to' in i.data.keys():
            recipient = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(id=i.data['to']).first().data['email']
            i.data['to'] = recipient
        state = {"event": i.event_type, "data": i.data}
        data.append(state)

    return api_response_ok(data)
