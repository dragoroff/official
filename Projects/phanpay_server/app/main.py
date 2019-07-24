def kafka_consumers():
    from kafka import KafkaConsumer
    from app.kafka_settings import kafka_topic
    from app.enums import EVENT_USER_SIGNED_UP, EVENT_TRANSFER_REQUESTED, EVENT_TRANSFER_ACCEPTED, \
        EVENT_WITHDRAWAL_REQUESTED, EVENT_WITHDRAWAL_ACCEPTED, EVENT_DEPOSIT_REQUESTED
    import json
    from app.Services.Payments.subtract_funds import subtract
    from app.Services.Payments.add_funds import add_funds
    from app.Services.Payments.charge_fees import charge_fees
    from django.db import transaction

    consumer = KafkaConsumer(auto_offset_reset='earliest', enable_auto_commit=True,
                             group_id="consumers", auto_commit_interval_ms=1000,
                             value_deserializer=lambda x: json.loads(x.decode('utf-8')))

    consumer.subscribe([kafka_topic])
    for msg in consumer:
        if not msg.value['event'] or not msg.value['data']:
            raise Exception('missing_data')

        event = msg.value['event']
        data = msg.value['data']

        if event == EVENT_USER_SIGNED_UP:
            add_funds(event, data)
        if event in [EVENT_TRANSFER_REQUESTED, EVENT_WITHDRAWAL_REQUESTED]:
            subtract(event, data)
        if event in [EVENT_TRANSFER_ACCEPTED, EVENT_DEPOSIT_REQUESTED]:
            with transaction.atomic():
                add_funds(event, data)
                charge_fees(event, data)
        if event == EVENT_WITHDRAWAL_ACCEPTED:
            charge_fees(event, data)


kafka_consumers()

