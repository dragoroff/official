from app.models import *

try:
    accounts = Account.objects.filter(status="CREATED")
    for i in accounts:
        if i.gmail.status == "INUSE" and i.proxy.status == "INUSE":
            Job.objects.create(job_type="F", status="NEW", account=i)
            print("Success")
        else:
            print("Failed")
except Exception as e:
    print(str(e))
