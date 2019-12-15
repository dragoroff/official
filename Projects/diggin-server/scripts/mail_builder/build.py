def generate_email(campaign_id, case):
    print("[EXECUTION STARTED]...")

    from app.models import CampaignCompanyData, CampaignPeopleData, CampaignPeopleDataEvent, CampaignCompanyDataEvent

    PEOPLE = "PEOPLE"
    COMPANY = "COMPANY"

    if case == PEOPLE:
        campaign = CampaignPeopleData.objects.filter(campaign=campaign_id)
        table = CampaignPeopleDataEvent
    elif case == COMPANY:
        campaign = CampaignCompanyData.objects.filter(campaign=campaign_id)
        table = CampaignCompanyDataEvent
    else:
        return

    if not campaign:
        print("[ERROR]: Can't find campaign ", campaign_id)
        return

    for i in campaign:
        if 'domain' not in i.data or not i.data['domain']:
            print("[ERROR]: No domain provided")
            if 'company' not in i.data:
                continue
            else:
                company = i.data["company"]
                err, domain = search_domain_locally(company)
                if err:
                    ev = table.objects.create(campaign=i, data={"Error": err})
                    print("[ERROR]:", ev.id)
                    continue
                else:
                    comp_domain = domain
        else:
            comp_domain = i.data['domain']

        domain = clean_domain(comp_domain)
        if 'employees' not in i.data:
            print("[ERROR]: No employees exist")
            pass

        data = i.data if case == PEOPLE else i.data['employees']
        for p in data:
            if type(p) is not dict and 'name' in p:
                name = data[p]
                print("NAME", name)
                p = data
            elif type(p) is dict and 'name' in p:
                name = p['name']
                print("NAME", name)
            else:
                continue

            first = name.split(" ")[0]
            try:
                last = name.split(" ")[1]
            except:
                last = ""

            if first != "LinkedIn" and last != "Member":
                result = check_email(first, last, domain)
                print(result)
                if len(result) > 0:
                    p["generated_email"] = result.replace("\n", "")
                else:
                    p["generated_email"] = ""

                i.save()
                print("[SUCCESS]")


def clean_domain(dom):
    options = ["https://www.", "http://www.", "https://", "http://", "www."]
    website = dom
    for o in options:
        opt_index = dom.find(o)
        if opt_index != -1:
            website = dom.split(o)[1]

    return website


def check_email(first, last, domain):
    import subprocess

    path = "./scripts/mail_builder/emailBuilder.js"
    cmd = "require(\"{}\").buildEmail(\"{}\",\"{}\",\"{}\")".format(path, first, last, domain)
    process = subprocess.run(['node', '-e', cmd], stdout=subprocess.PIPE)
    return process.stdout.decode('utf-8')


def search_domain_locally(company):
    import pandas as pd
    import os
    cur_dir = os.path.dirname(os.path.realpath(__file__))
    data = pd.read_excel(f'{cur_dir}/utils/domains.xlsx')

    for i, comp in enumerate(data['Company']):
        if comp == company:
            return None, data.loc[i][1]
        else:
            continue

    return f'No domain was found for {company}', None
