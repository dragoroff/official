from django.http import HttpResponse
import json


def _fail(status=401, headers=dict):
    return HttpResponse(status=status)


def accepts(http_method):
    def _wrapped_view_func(view_func):
        def _args_wrapper(request, *args, **kwargs):
            ret = view_func(request, *args, **kwargs) if request.method == http_method.upper() else _fail(status=404)
            return ret

        return _args_wrapper

    return _wrapped_view_func


def json_request(view_func):
    def _wrapped_view_func(request, *args, **kwargs):
        if request.body and len(request.body):
            try:
                j = json.loads(request.body)
            except json.JSONDecodeError:
                return _fail(status=400)
        else:
            j = {}
        setattr(request, "json", j)
        return view_func(request, *args, **kwargs)

    return _wrapped_view_func
