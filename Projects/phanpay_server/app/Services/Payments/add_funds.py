from app.models import Events
from app.enums import *


def add_funds(event, data):
    if not event or not data:
        raise Exception('missing_data')

    if event == EVENT_USER_SIGNED_UP:
        Events.objects.create(entityID=data['account_id'], event_type=EVENT_INITIAL_DEPOSIT, data={"amount": 1000})
    elif event == EVENT_TRANSFER_ACCEPTED:
        Events.objects.create(entityID=data['to'], event_type=EVENT_INCOMING_PAYMENT, data=data)
    elif event == EVENT_DEPOSIT_REQUESTED:
        Events.objects.create(entityID=data['to'], event_type=EVENT_DEPOSIT_ACCEPTED, data=data)
