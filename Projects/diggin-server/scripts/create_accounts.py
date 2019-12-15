from app.models import *
import string
from random import *


try:
    proxies = Proxy.objects.filter(status=PROXY_STATUS_NEW)
    gmails = Gmail.objects.filter(status=EMAIL_STATUS_PASSCHANGED)
    characters = string.ascii_letters + string.punctuation + string.digits

    iterations = min(len(proxies), len(gmails))
    for i in range(iterations):
        password = "".join(choice(characters)
                           for x in range(randint(16, 24)))
        Account.objects.create(
            proxy=proxies[i], gmail=gmails[i], status="NEW", li_password=password)
except Exception as e:
    print(str(e))
