from app.models import *
import os
import json

try:
    BASEDIR = os.getcwd()
    accounts = Account.objects.filter(status="FILLED")

    if accounts:
        with open(f'{BASEDIR}/app/utils/search_data.json') as f:
            data = json.loads(f.read())
        with open(f'{BASEDIR}/app/utils/search_data.json', 'w') as w:
            json.dump(data[1:], w)

        for i in accounts:
            Job.objects.create(job_type="S", status="NEW",
                               account=i, data={'iter_number': 5, 'search_name': data[0]['first_name'], 'search_location': data[0]['location']})

except Exception as e:
    print(str(e))
