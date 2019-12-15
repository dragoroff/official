from django.views.decorators.csrf import csrf_exempt
from app.decorators import *
from app.models import Plan, SearcherLocation
from django.db import transaction


@csrf_exempt
@accepts('post')
def create_plan(request):
    num_accounts = int(request.POST['accounts'])
    threshold = int(request.POST['threshold'])
    data = request.POST.getlist('locations')

    if num_accounts < 0 or threshold < 0:
        return "Only positive numbers are accepted", None

    if not data:
        return "You should choose one of the locations", None

    list_locations = [SearcherLocation.objects.get(location=city) for city in data]

    with transaction.atomic():
        plan = Plan.create_plan(num_accounts, threshold)
        for location in list_locations:
            plan.location.add(location)
            plan.save()

    if not plan:
        return "Not enough pictures / profile combinations", None

    return None, num_accounts
