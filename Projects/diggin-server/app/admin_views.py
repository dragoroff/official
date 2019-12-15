from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponseForbidden
from app import tools as tools
# from app import utils as utils
from app.models import *
# from app.utils import api_response_ok as ok
# from app.utils import api_response_fail as fail
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from app.admins.api import *

def has_permission(request):
    return request.user.is_authenticated and request.user.is_staff

@csrf_exempt
def add_planner(request):
    params = {}
    if not has_permission(request):
        print("Not allowed to enter")

    if request.method == 'POST':
        error, accounts = create_plan(request)
        params['num_accounts'] = accounts
        params['error'] = error
        params['step'] = '1' if error else '2'
    else:
        params['step'] = '1'

    return render(request, 'admin/planner/plan.html', params)

def upload_gmails(request):

    params = {}
    if request.method == 'POST':
        if 'fuXlsx' in request.FILES:
            upl_file = request.FILES['fuXlsx']
            res = tools.create_gmails_from_xlsx(source_file=upl_file)
            params.update(res)
            params['step'] = '2' if res['success'] else '1'
    else:
        params['step'] = '1'

    return render(request, 'admin/gmail/upload_emails.html', params)


def upload_proxies(request):

    params = {}
    if request.method == 'POST':
        if 'fuXlsx' in request.FILES:
            upl_file = request.FILES['fuXlsx']
            res = tools.create_proxies_from_xlsx(source_file=upl_file)
            params.update(res)
            params['step'] = '2' if res['success'] else '1'
    else:
        params['step'] = '1'

    return render(request, 'admin/proxy/upload_proxies.html', params)


def load_photos(request):

    # params = {}
    # if request.method == 'POST':
    #     if 'fuXlsx' in request.FILES:
    #         upl_file = request.FILES['fuXlsx']
    #         res = tools.create_proxies_from_xlsx(source_file=upl_file)
    #         params.update(res)
    #         params['step'] = '2' if res['success'] else '1'
    # else:
    #     params['step'] = '1'

    return render(request, 'admin/images/upload_images.html')
