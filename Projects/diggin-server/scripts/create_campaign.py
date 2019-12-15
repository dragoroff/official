from app.models import *

try:
    keyword = "AWS"
    targets = ["Companies", "Groups", "People"]
    Campaign.objects.create(keyword=keyword, status="MANAGER_READY",
                            targets=targets)
    print("Success")
except Exception as e:
    print(str(e))
