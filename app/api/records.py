from django.http import HttpRequest, JsonResponse
from ..models import *
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime


@csrf_exempt
def records(req: HttpRequest) : # /finance/records
    print("request accepted")
    if req.method == "GET" :
        return getRecords(req)
    elif req.method == "POST" :
        return createRecord(req)
    elif req.method == "PATCH" :
        return updateRecord(req)
    
def getRecords(req: HttpRequest) :
    params = dict(req.GET.lists())
    sort = {
        "date_created": -1
    }
    filters = {
        "date_created__gte": params.get("from")[0] if params.get("from") and params.get("from")[0] != "" else "0001-01-01",
        "date_created__lte": params.get("to")[0] if params.get("to") and params.get("to")[0] != "" else "9999-12-31",
    }
    for i in params :
        if params.get(i)[0] == "1" or params.get(i)[0] == "-1":
            sort[i] = int(params.get(i)[0])
        elif params.get(i)[0] == "any":
            continue
        elif not (i == "from" or i == "to") :
            filters[i] = params.get(i)[0]
    try :
        records = Record.objects.filter(**filters)
        for i in sort :
            records = records.order_by(i) if sort[i] == 1 else records.order_by(i).reverse()
        records = serializers.serialize("json", records.all())
        return JsonResponse(records, safe=False)
    except :
        return JsonResponse(json.dumps({"Error": "Bad Request"}), status = 400, safe=False)
    
def getRecord(req: HttpRequest, id: str) :
    record = serializers.serialize("json", Record.objects.filter(pk = int(id)))
    return JsonResponse(record, safe=False)

def createRecord(req: HttpRequest) :
    try :
        obj = json.loads(req.body)
        record = Record(
            status = Status.objects.get(name=obj["status"]),
            type = Type.objects.get(name=obj["type"]),
            category = Category.objects.get(name=obj["category"]),
            sub_category = SubCategory.objects.get(name=obj["sub_category"]),
            amount = obj["amount"],
            comment = obj["comment"]
        )
        record.clean()
        record.save()
    except :
        return JsonResponse(json.dumps({"Status": "Error"}), safe=False)
    return JsonResponse(json.dumps({"Status": "Success"}), safe=False)

def updateRecord(req: HttpRequest) :
    print(req.body)
    obj = json.loads(req.body)
    try :
        record = Record.objects.get(pk = obj["id"])
        record.date_created = datetime.strptime(obj["date_created"], "%Y-%m-%d")
        record.status = Status.objects.get(name = obj["status"])
        record.type = Type.objects.get(name = obj["type"])
        record.category = Category.objects.get(name = obj["category"])
        record.sub_category = SubCategory.objects.get(name = obj["sub_category"])
        record.amount = obj["amount"]
        record.comment = obj["comment"]
        record.clean()
        record.save()
        print(record.date_created)
        if not Record :
            return JsonResponse(json.dumps({"Status": "Error"}))
        return JsonResponse(json.dumps({"Status": "Success"}), safe=False)
    except :
        return JsonResponse(json.dumps({"Status": "Error"}))