from app.models import Events
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt
from pytz import timezone
from datetime import datetime
jerusalem = timezone('Asia/Jerusalem')


@csrf_exempt
@accepts('get')
@json_request
def get_deposits_per_date(request, from_date, to_date):
    if not from_date or not to_date:
        return api_response_fail("missing_args")

    date_from = list(map(lambda x: int(x), from_date.split("-")))
    date_to = list(map(lambda x: int(x), to_date.split("-")))
    from_date = datetime(date_from[0], date_from[1], date_from[2], tzinfo=jerusalem)
    to_date = datetime(date_to[0], date_to[1], date_to[2], tzinfo=jerusalem)

    deposits = Events.objects.filter(event_type=EVENT_DEPOSIT_ACCEPTED).filter(created_at__gte=from_date).filter(created_at__lte=to_date)
    if not deposits:
        return api_response_ok("no_deposits_detected")

    balance = sum([float(i.data['amount']) for i in deposits])
    return api_response_ok({'amount': balance, 'number': deposits.count()})


@csrf_exempt
@accepts('get')
@json_request
def get_withdrawals_per_date(request, from_date, to_date):
    if not from_date or not to_date:
        return api_response_fail("missing_args")

    date_from = list(map(lambda x: int(x), from_date.split("-")))
    date_to = list(map(lambda x: int(x), to_date.split("-")))
    from_date = datetime(date_from[0], date_from[1], date_from[2], tzinfo=jerusalem)
    to_date = datetime(date_to[0], date_to[1], date_to[2], tzinfo=jerusalem)

    withdrawals = Events.objects.filter(event_type=EVENT_WITHDRAWAL_ACCEPTED).filter(created_at__gte=from_date).filter(created_at__lte=to_date)
    if not withdrawals:
        return api_response_ok("no_withdrawals_detected")

    balance = sum([abs(float(i.data['amount'])) for i in withdrawals])
    return api_response_ok({'amount': balance, 'number': withdrawals.count()})