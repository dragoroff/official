from django.http import JsonResponse


def api_response_ok(ret_data=None):
    if ret_data is None:
        ret_data = {}
    return JsonResponse({"status": "OK", "data": ret_data})


def api_response_fail(error=None):
    ret_data = {'status': 'FAIL'}
    if error:
        ret_data['error'] = error

    print(ret_data)
    return JsonResponse(ret_data, status=400)