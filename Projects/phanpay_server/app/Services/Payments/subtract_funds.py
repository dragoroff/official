from app.models import Events
from django.db import transaction
from kafka import KafkaProducer
import json
from app.enums import *
from app.kafka_settings import *


def subtract(event, data):
    # Don't permit for total amount to fall below 0 NIS
    all_events = Events.objects.filter(entityID=data['from']).filter(event_type__in=[EVENT_DEPOSIT_ACCEPTED, EVENT_INITIAL_DEPOSIT, EVENT_FEES_CHARGED,
                                                                                     EVENT_TRANSFER_ACCEPTED, EVENT_WITHDRAWAL_ACCEPTED, EVENT_INCOMING_PAYMENT])
    balance = sum([int(i.data['amount']) for i in all_events])
    if balance - int(data['amount']) < 0:
        state = {'id': data['from'], 'Reason': 'Not Enough Funds'}
        Events.objects.create(entityID=data['from'], event_type=EVENT_OPERATION_DECLINED, data=state)
    else:
        if event == EVENT_TRANSFER_REQUESTED:
            send_events(EVENT_TRANSFER_ACCEPTED, data)
        if event == EVENT_WITHDRAWAL_REQUESTED:
            send_events(EVENT_WITHDRAWAL_ACCEPTED, data)


def send_events(event, data):
    producer = KafkaProducer(bootstrap_servers=[kafka_server], value_serializer=lambda x: json.dumps(x).encode('utf8'))
    state = {'event': event, 'data': data}
    with transaction.atomic():
        print("state", state)
        producer.send(kafka_topic, value=state)
        data['amount'] = -int(data['amount'])
        Events.objects.create(entityID=data['from'], event_type=event, data=data)

