# Find accounts with gmail status = new and create changepass jobs for these accounts

from app.models import *
import string
from random import *

try:
    characters = string.ascii_letters + string.punctuation + string.digits
    accounts = Account.objects.filter(status="NEW")
    for i in accounts:
        if i.gmail.status == "NEW":
            new_password = "".join(choice(characters)
                                   for i in range(randint(16, 24)))
            Job.objects.create(job_type="PWD", status="NEW", account=i, data={
                'new_password': new_password})
except Exception as e:
    print(str(e))
