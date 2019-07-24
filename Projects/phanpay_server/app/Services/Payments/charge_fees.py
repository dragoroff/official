from app.enums import *
from app.models import Events


def charge_fees(event, data):
    if not event or not data:
        raise Exception('missing_data')

    if event == EVENT_TRANSFER_ACCEPTED:
        fees = 0.01
    elif event == EVENT_WITHDRAWAL_ACCEPTED:
        fees = 0.03
    elif event == EVENT_DEPOSIT_REQUESTED:
        fees = 0.05

    print(data)
    data['amount'] = -abs(int(data['amount'])) * fees
    Events.objects.create(entityID=data['from'], event_type=EVENT_FEES_CHARGED, data=data)

