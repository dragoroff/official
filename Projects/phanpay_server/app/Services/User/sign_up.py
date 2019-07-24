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
def registration(request):
    data = request.json.get('data')
    if not data:
        return api_response_fail("missing_args")

    # Check if user exists
    user_exist = Events.objects.filter(event_type=EVENT_USER_SIGNED_UP).filter(data__email=data['email'])

    if user_exist:
        return api_response_fail("Email already in use")

    # By default not an admin
    data['status'] = 'user'
    producer = KafkaProducer(bootstrap_servers=[kafka_server], value_serializer=lambda x: json.dumps(x).encode('utf8'))

    with transaction.atomic():
        event_id = Events.objects.all().order_by('-id').first().id + 1
        state = {'event': EVENT_USER_SIGNED_UP, 'data': {'account_id': event_id}}
        producer.send(kafka_topic, value=state)
        Events.objects.create(data=data, entityID=event_id, event_type=EVENT_USER_SIGNED_UP)
        return api_response_ok()
