from app.models import Events
from django.views.decorators.csrf import csrf_exempt
from app.decorators import *
from django.db import transaction
from app.utils import *
from kafka import KafkaProducer
import json
from app.enums import *
from app.kafka_settings import *


@csrf_exempt
@accepts('post')
@json_request
def transfer_funds(request, acc_id):
    req_data = request.json.get('data')
    if not req_data:
        return api_response_fail('missing_args')

    recipient = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(data__email=req_data['to']).first()
    if not recipient:
        return api_response_fail("User doesn't exist")

    data = {
        'from': acc_id,
        'to': recipient.id,
        'amount': req_data['amount']
    }
    producer = KafkaProducer(bootstrap_servers=[kafka_server], value_serializer=lambda x: json.dumps(x).encode('utf8'))
    state = {'event': EVENT_TRANSFER_REQUESTED, 'data': data}
    with transaction.atomic():
        producer.send(kafka_topic, value=state)
        Events.objects.create(data=data, event_type=EVENT_TRANSFER_REQUESTED, entityID=data['from'])
        return api_response_ok()
