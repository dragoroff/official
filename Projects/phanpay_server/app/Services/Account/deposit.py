from app.models import Events
from django.db import transaction
from kafka import KafkaProducer
from app.kafka_settings import *
from app.decorators import *
from app.utils import *
from app.enums import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
@accepts('post')
@json_request
def make_deposit(request, acc_id):
    amount = request.json.get('amount')
    if not amount:
        return api_response_fail('missing_args')

    producer = KafkaProducer(bootstrap_servers=[kafka_server], value_serializer=lambda x: json.dumps(x).encode('utf8'))
    data = {'from': acc_id, 'to': acc_id, 'amount': amount}
    state = {'event': EVENT_DEPOSIT_REQUESTED, 'data': data}
    with transaction.atomic():
        producer.send(kafka_topic, value=state)
        Events.objects.create(entityID=acc_id, event_type=EVENT_DEPOSIT_REQUESTED, data=data)
        return api_response_ok()
