from app.models import *

try:
    accounts = Account.objects.filter(status="NEW")
    for i in accounts:
        if i.gmail.status == "PASSCHANGED":
            Job.objects.create(job_type="B", status="NEW", account=i)
            print("Success")
        else:
            print("Failed")
except Exception as e:
    print(str(e))
