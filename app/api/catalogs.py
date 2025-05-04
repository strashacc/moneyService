from django.http import HttpResponse, HttpRequest, JsonResponse
from ..models import *
from django.core import serializers
import json
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def catalogs(req: HttpRequest, catalog: str) : # /finance/catalogs
    if catalog == "status" :
        return status(req)
    elif catalog == "type" :
        return type(req)
    elif catalog == "category" :
        return category(req)
    elif catalog == "sub_category" :
        return subCategory(req)
    else :
        return HttpResponse("Not Found", status = 404)

def status(req: HttpRequest) : # /finance/catalogs/status
    if req.method == "GET" :
        statuses = Status.objects.all()
        return JsonResponse(serializers.serialize("json", statuses), safe=False)
    elif req.method == "POST" :
        obj = json.loads(req.body)
        status = Status(**obj)
        status.clean()
        status.save()
        return JsonResponse(json.dumps({"Status": "Success"}), safe=False)
    else :
        return HttpResponse("Method not supported", status = 405)

def type(req: HttpRequest) : # /finance/catalogs/type
    if req.method == "GET" :
        types = Type.objects.all()
        return JsonResponse(serializers.serialize("json", types), safe=False)
    elif req.method == "POST" :
        obj = json.loads(req.body)
        type = Type(**obj)
        type.clean()
        type.save()
        return JsonResponse(json.dumps({"Status": "Success"}), safe=False)
    else :
        return HttpResponse("Method not supported", status = 405)

def category(req: HttpRequest) : # /finance/catalogs/category
    if req.method == "GET" :
        params = dict(req.GET.lists())
        categories = Category.objects.all()
        if params.get("type") :
            if params.get("type")[0] == "any":
                categories = categories
            else :
                categories = categories.filter(type=params.get("type")[0])
        return JsonResponse(serializers.serialize("json", categories), safe=False)
    elif req.method == "POST" :
        obj = json.loads(req.body)
        if not (obj.get("type") and obj.get("name")) :
            return JsonResponse(json.dumps({"Status": "Error", "Message": "Все поля должны быть заполнены"}), safe=False)
        category = Category(
            name = obj.get("name"),
            type = Type.objects.get(name=obj.get("type"))
        )
        category.clean()
        category.save()
        return JsonResponse(json.dumps({"Status": "Success"}), safe=False)
    else :
        return HttpResponse("Method not supported", status = 405)

def subCategory(req: HttpRequest) : # /finance/catalogs/sub_category
    if req.method == "GET" :
        params = dict(req.GET.lists())
        subCategories = SubCategory.objects.all()
        if params.get("category") :
            subCategories = subCategories.filter(parent = params["category"][0])
        return JsonResponse(serializers.serialize("json", subCategories), safe=False)
    elif req.method == "POST" :
        obj = json.loads(req.body)
        if not (obj.get("category") and obj.get("name")) :
            return JsonResponse(json.dumps({"Status": "Error", "Message": "Все поля должны быть заполнены"}), safe=False)
        sub_category = SubCategory(
            name = obj.get("name"),
            parent = Category.objects.get(name = obj.get("category"))
        )
        sub_category.clean()
        sub_category.save()
        return JsonResponse(json.dumps({"Status": "Success"}), safe=False)
    elif req.method == "POST" :
        return
    else :
        return HttpResponse("Method not supported", status = 405)