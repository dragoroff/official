import pandas as pd
from app.models import *


def create_gmails_from_xlsx(source_file):
    df = pd.read_excel(source_file)

    ret = {'success': False}
    try:
        if df.shape[0] < 1:
            ret['errors'] = "Spreadsheet should have at least 1 row"
        else:
            emails = []
            errors = []
            for i in range(len(df.index)):
                email = df['Email'][i]
                password = df['Password'][i]
                recovery = df['Recovery'][i]
                phone = df['Phone'][i]
                if email and password and recovery and phone:
                    if '@gmail.com' not in email:
                        email += '@gmail.com'
                    email_account = Gmail.objects.filter(email=email).first()
                    if email_account:
                        errors.append("Email is already exists")
                    else:
                        Gmail.objects.create(
                            email=email, password=password, phone=phone, recovery_email=recovery, status="NEW")
                        emails.append({
                            "email": email,
                            "password": password,
                            "phone": phone,
                            "recovery": recovery
                        })
                else:
                    errors.append("One of the arguments is missing")

                ret['success'] = True
                ret['emails'] = emails
                ret['errors'] = errors
    except:
        ret['errors'] = "The columns must be suitable to the requirement above"

    return ret


def create_proxies_from_xlsx(source_file):
    df = pd.read_excel(source_file, header=None)
    df.columns = ['Proxy', 'Location', 'Date', 'Status']
    ret = {'success': False}
    try:
        if df.shape[0] < 1:
            ret['errors'] = "Spreadsheet should have at least 1 row"
        else:
            proxies = []
            errors = []
            for i in range(len(df.index)):
                proxy = df['Proxy'][i].split(":")[0]
                location = df['Location'][i]
                port = df['Proxy'][i].split(":")[1]
                if proxy and location and port:
                    proxy_exist = Proxy.objects.filter(
                        ip=proxy).filter(port=port).first()
                    if proxy_exist:
                        errors.append(f'{proxy}:{port}')

                    else:
                        Proxy.objects.create(
                            ip=proxy, port=port, location=location, status="NEW")
                        proxies.append({
                            "ip": proxy,
                            "port": port,
                            "location": location
                        })
                else:
                    errors.append("One of the arguments is missing")

                ret['success'] = True
                ret['proxies'] = proxies
                ret['errors'] = errors
    except:
        ret['errors'] = "The columns must be suitable to the requirement above"

    return ret
