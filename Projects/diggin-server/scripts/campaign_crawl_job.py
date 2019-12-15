from app.models import *
from random import *

try:
    account = Account.objects.filter(status="FILLED")
    accounts = [acc for acc in account if acc.num_connections > 30]
    shuffle(accounts)
    campaign = Campaign.objects.filter(status="MANAGER_READY").first()

    # TODO: Check if the job has been ran today
    # for i in accounts:
    #     event = AccountEvent.objects.filter(account=i).first()
    #     if event != None:
    #         print(event.data)
    print(campaign)
    Job.objects.create(job_type="CC", status="NEW",
                       campaign=campaign, account=choice(accounts))
    print("Success")
except Exception as e:
    print(str(e))
