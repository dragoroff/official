from django.contrib import admin
from app.models import *
from django.utils.safestring import mark_safe
import string
from random import *
from app.utils import names, groups
from app.core.models.account import get_available_account_for_job
import pandas as pd
from django.http import HttpResponse
from io import BytesIO


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("id", "job_type", "account_url", "campaign_keyword", "campaign_people", "campaign_company",
                    "status", "events", "created_at")
    actions = ['enqueue', 'duplicate']
    list_filter = ['status', 'job_type']

    @mark_safe
    def events(self, obj):
        count = obj.events.count()
        return f'<a href="/root/app/jobevent/?job_id={obj.id}">{count}</a>' if count else "-"

    @mark_safe
    def account_url(self, obj):
        return f'<a href="/root/app/account/{obj.account.id}">{obj.account.gmail}</a>'

    @mark_safe
    def campaign_keyword(self, obj):
        return f'<a href="/root/app/campaign/{obj.campaign.id}">{obj.campaign.keyword}</a>' if obj.campaign else "-"

    def enqueue(self, request, queryset):
        success_n = 0
        error_n = 0
        for job in queryset:
            success, err = job.enqueue()
            if success:
                success_n += 1
            else:
                error_n += 1

        self.message_user(request, f'Success: {success_n} / Error: {error_n}')

    def duplicate(self, request, queryset):
        success_n = 0
        error_n = 0
        for job in queryset:
            try:
                acc = Account.objects.get(id=job.account.id)
                acc.create_job(job_type=job.job_type,
                               campaign=job.campaign,
                               campaign_company=job.campaign_company,
                               campaign_people=job.campaign_people,
                               data=job.data)
                success_n += 1
            except Exception as e:
                error_n += 1
                print(str(e))
        self.message_user(request, f'Success: {success_n} / Error: {error_n}')


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ("id", "gmails", "proxies",
                    "status", "events", "created_at", "li_cookies")
    list_filter = ["status"]
    actions = ['ChangePassword', 'Crawl', 'Build', 'Fill', 'Search']

    @mark_safe
    def events(self, obj):
        count = obj.events.count()
        return f'<a href="/root/app/accountevent/?account_id={obj.id}">{count}</a>' if count else "-"

    @mark_safe
    def gmails(self, obj):
        return f'<a href="/root/app/gmail/{obj.gmail.id}">{obj.gmail}</a>'

    @mark_safe
    def proxies(self, obj):
        return f'<a href="/root/app/proxy/{obj.proxy.id}">{obj.proxy}</a>'

    def ChangePassword(self, request, queryset):
        success = 0
        fail = 0
        message = []
        characters = string.ascii_letters + string.punctuation + string.digits
        for acc in queryset:
            if acc.status != ACCOUNT_STATUS_NEW:
                fail += 1
                message.append('Account is not NEW')
            elif acc.gmail.status != EMAIL_STATUS_NEW:
                fail += 1
                message.append('Gmail is not NEW')
            else:
                new_password = "".join(choice(characters)
                                       for i in range(randint(16, 24)))
                acc.create_job(job_type=JOB_TYPE_PASS_CHECKER,
                               data={'new_password': new_password})
                success += 1
        return self.message_user(request, f'Success: {success}, Failed: {fail}, Error Message: {message}')

    def Crawl(self, request, queryset):
        success = 0
        fail = 0
        message = []
        for acc in queryset:
            print(acc)
            if acc.status != ACCOUNT_STATUS_FILLED:
                fail += 1
                message.append('Account is not FILLED')
            elif acc.num_connections < 30:
                fail += 1
                message.append('Account must have at least 30 conns')
            else:
                acc.create_job(job_type=JOB_TYPE_PROFILE_CRAWLER, data={
                    'search_name': choice(names.MALE_FIRST_NAMES), 'search_location': "Greater New York City", 'number_pages': 50})
                success += 1
        return self.message_user(request, f'Success: {success}, Failed: {fail}, Error Message: {message}')

    def Build(self, request, queryset):
        success = 0
        fail = 0
        message = []
        for acc in queryset:
            if acc.status != ACCOUNT_STATUS_NEW:
                fail += 1
                message.append('Account is not NEW')
            elif acc.gmail.status != EMAIL_STATUS_PASSCHANGED:
                fail += 1
                message.append('Gmail should be with status PASSCHANGED')
            elif acc.proxy.status != PROXY_STATUS_INUSE:
                fail += 1
                message.append('Proxy should be with status INUSE')
            elif not acc.profile_details:
                fail += 1
                message.append('Profile must contain info')
            else:
                acc.create_job(job_type=JOB_TYPE_BUILDER, data={})
                success += 1
        return self.message_user(request, f'Success: {success}, Failed: {fail}, Error Message: {message}')

    def Fill(self, request, queryset):
        success = 0
        fail = 0
        message = []
        for acc in queryset:
            if acc.status != ACCOUNT_STATUS_CREATED:
                fail += 1
                message.append('Account is not CREATED')
            elif acc.gmail.status != EMAIL_STATUS_INUSE or acc.proxy.status != PROXY_STATUS_INUSE:
                fail += 1
                message.append('Gmail and Proxy should be with status INUSE')
            else:
                acc.create_job(job_type=JOB_TYPE_FILLER, data={})
                success += 1
        return self.message_user(request, f'Success: {success}, Failed: {fail}, Error Message: {message}')

    def Search(self, request, queryset):
        success = 0
        fail = 0
        message = []
        for acc in queryset:
            if acc.status != ACCOUNT_STATUS_FILLED:
                fail += 1
                message.append('Account is not FILLED')
            elif acc.gmail.status != EMAIL_STATUS_INUSE or acc.proxy.status != EMAIL_STATUS_INUSE:
                fail += 1
                message.append('Gmail and Proxy should be with status INUSE')
            else:

                error, data = acc.get_search_data()
                if not error:
                    acc.create_job(job_type=JOB_TYPE_SEARCHER,
                                   data={'iter_number': 5, 'search_name': data['first_name'], 'search_location': data['location'], 'groups': choice(groups.list_groups)})
                    success += 1
                else:
                    fail += 1
                    message.append('Failed to get search info')
        return self.message_user(request, f'Success: {success}, Failed: {fail}, Error Message: {message}')


@admin.register(Proxy)
class ProxyAdmin(admin.ModelAdmin):
    list_display = ('ip', 'port', 'status', 'location')
    list_filter = ['status', 'location']
    actions = ['create_list', 'export_xls']

    def create_list(self, request, queryset):
        errors = {}
        now = datetime.now()
        filename = f'exported_proxies_{now.day}-{now.month}-{now.year}.xlsx'
        temp_file = BytesIO()
        writer = pd.ExcelWriter(temp_file,
                                engine="openpyxl", sheet_name="Proxies")
        proxies = pd.DataFrame(columns=['proxy'])

        try:
            for ind, query in enumerate(queryset):
                proxies.loc[ind] = query

            proxies.to_excel(writer, index=False)

            writer.save()
            writer.close()
        except Exception as e:
            print(str(e))
            errors['error'] = str(e)

        temp_file.seek(0)

        try:
            response = HttpResponse(
                temp_file.read(), content_type='application/ms-excel')
            response['Content-Disposition'] = f'attachment; filename={filename}'
        except Exception as e:
            print(str(e))
            errors['error'] = str(e)

        if 'error' in errors.keys():
            return self.message_user(request, errors['error'])
        else:
            return response

    create_list.short_description = "Download as .xlsx"


@admin.register(Gmail)
class GmailAdmin(admin.ModelAdmin):
    list_display = ("email", "status", "password", "phone", "recovery_email")
    list_filter = ['status']


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("keyword", "status", "get_people",
                    "get_companies", "get_groups")
    list_filter = ['keyword', 'status']
    actions = ['create_job_campaign']

    def create_job_campaign(self, request, queryset):
        success_n = 0
        fail_n = 0
        messages = []
        try:
            campaigns = [
                camp for camp in queryset if camp.status == CAMPAIGN_STATUS_MANAGER_READY]

            if not campaigns:
                fail_n += 1
                messages.append("Inappropriate status of campaign")

            account = get_available_account_for_job()
            if account is None:
                self.message_user(request, "No available account found")
                return

            for camp in campaigns:
                try:
                    data = camp.as_dict()
                    data['limit'] = 5
                    account.create_job(
                        job_type=JOB_TYPE_CAMPAIGN_CRAWLER_MANAGER, data=data, campaign=camp)
                    success_n += 1
                except:
                    fail_n += 1
                    messages.append("Can not create job")
        except Exception as e:
            print(str(e))

        return self.message_user(request, f'Success: {success_n} Fail: {fail_n} Messages: {messages}')

    create_job_campaign.short_description = "Create Job"


@admin.register(CampaignEvent)
class CampaignEventAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "created_at")


@admin.register(CampaignData)
class CampaignDataAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "created_at")
    list_filter = ['data']


@admin.register(JobEvent)
class JobEventAdmin(admin.ModelAdmin):
    list_display = ("id", "job_id", "data", "created_at")


@admin.register(AccountEvent)
class AccountEventAdmin(admin.ModelAdmin):
    list_display = ("id", "account", "data", "created_at")


@admin.register(ProfileInfo)
class ProfileInfoAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "created_at")


@admin.register(ProfileInfoCombination)
class ProfileInfoCombinationAdmin(admin.ModelAdmin):
    list_display = ("id", "first_name", "last_name", "skills", "summary")


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "num_accounts", "ready_threshold",
                    "created_at", "duration", "dead_accounts", "built", "filled", "ready")
    actions = ['start', ]

    def start(self, request, queryset):
        success = 0
        for plan in queryset:
            plan.start()
            success += 1

        return self.message_user(request, f"Success: {success}")


@admin.register(SearcherLocation)
class SearcherLocationAdmin(admin.ModelAdmin):
    list_display = ("id", "location", "first_names")


@admin.register(CampaignCompany)
class CampaignCompanyAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "keyword", "positions_white_list", "max_people", "max_companies")
    empty_value_display = '-'
    actions = ['create_job_campaign_company']

    def create_job_campaign_company(self, request, queryset):
        success_n = 0
        fail_n = 0
        messages = []
        try:
            campaigns = [
                camp for camp in queryset if camp.status == CAMPAIGN_STATUS_MANAGER_READY]

            if not campaigns:
                fail_n += 1
                messages.append("Inappropriate status of campaign")

            account = get_available_account_for_job()
            if account is None:
                self.message_user(request, "No available account found")
                return

            for camp in campaigns:
                try:
                    data = camp.as_dict()
                    data['limit'] = 5
                    account.create_job(
                        job_type=JOB_TYPE_CAMPAIGN_CRAWLER_MANAGER, data=data, campaign_company=camp)
                    success_n += 1
                except:
                    fail_n += 1
                    messages.append("Can not create job")
        except Exception as e:
            print(str(e))

        return self.message_user(request, f'Success: {success_n} Fail: {fail_n} Messages: {messages}')

    create_job_campaign_company.short_description = "Create Job"


@admin.register(CampaignPeople)
class CampaignPeopleAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "keyword", "company", "industry", "mail_builder", "max_pages")
    empty_value_display = '-'

    actions = ['create_job_campaign_people']

    def create_job_campaign_people(self, request, queryset):
        success_n = 0
        fail_n = 0
        messages = []
        try:
            campaigns = [
                camp for camp in queryset if camp.status == CAMPAIGN_STATUS_MANAGER_READY]

            if not campaigns:
                fail_n += 1
                messages.append("Inappropriate status of campaign")

            account = get_available_account_for_job()
            if account is None:
                self.message_user(request, "No available account found")
                return

            for camp in campaigns:
                try:
                    data = camp.as_dict()
                    data['limit'] = 5
                    account.create_job(
                        job_type=JOB_TYPE_CAMPAIGN_CRAWLER_MANAGER, data=data, campaign_people=camp)
                    success_n += 1
                except:
                    fail_n += 1
                    messages.append("Can not create job")
        except Exception as e:
            print(str(e))

        return self.message_user(request, f'Success: {success_n} Fail: {fail_n} Messages: {messages}')

    create_job_campaign_people.short_description = "Create Job"


@admin.register(CampaignPeopleData)
class CampaignPeopleDataAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "campaign", "created_at", "campaign_events")

    @mark_safe
    def campaign_events(self, obj):
        count = obj.campaign_events.count()
        return f'<a href="/root/app/campaignpeopledataevent/?campaign_id={obj.id}">{count}</a>' if count else "-"


@admin.register(CampaignCompanyData)
class CampaignCompanyDataAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "campaign", "created_at", "campaign_events")

    @mark_safe
    def campaign_events(self, obj):
        count = obj.campaign_events.count()
        return f'<a href="/root/app/campaigncompanydataevent/?campaign_id={obj.id}">{count}</a>' if count else "-"


@admin.register(CampaignCompanyDataEvent)
class CampaignCompanyDataEventAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "campaign", "created_at")


@admin.register(CampaignPeopleDataEvent)
class CampaignPeopleDataEventAdmin(admin.ModelAdmin):
    list_display = ("id", "data", "campaign", "created_at")


@admin.register(PageVisitor)
class PageVisitorAdmin(admin.ModelAdmin):
    list_display = ("id", "status", "target_url", "url_list", "created_at")
    actions = ['create_job']

    def create_job(self, request, queryset):
        success_n = 0
        fail_n = 0
        messages = []
        try:
            jobs = [
                j for j in queryset if j.status == PAGE_VISITOR_STATUS_NEW]

            if not jobs:
                fail_n += 1
                messages.append("Inappropriate status of job")

            account = get_available_account_for_job()
            if account is None:
                self.message_user(request, "No available account found")
                return

            for j in jobs:
                try:
                    data = j.as_dict()
                    account.create_job(job_type=JOB_TYPE_VISITOR, data=data)
                    success_n += 1
                except:
                    fail_n += 1
                    messages.append("Can not create job")
        except Exception as e:
            print(str(e))

        return self.message_user(request, f'Success: {success_n} Fail: {fail_n} Messages: {messages}')

    create_job.short_description = "Create Job"


@admin.register(VisitorEvent)
class VisitorEventAdmin(admin.ModelAdmin):
    list_display = ("id", "visitor", "event", "created_at")
