from app.models import *
from app.utils import names
from random import *

try:
    account = list(filter(lambda x: x.num_connections > 30,
                          Account.objects.filter(status="FILLED")))
    if account:
        Job.objects.create(job_type="PC", status="NEW", account=choice(account), data={
            'search_name': choice(names.MALE_FIRST_NAMES), 'search_location': "Greater New York City", 'number_pages': 50})
        print("success")
except Exception as e:
    print(str(e))
