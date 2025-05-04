from django.shortcuts import render
from django.http import HttpRequest
from .models import *
from django.db.models import Q

def index(req) :    # /finance
    return render(req, 'homepage.html')


def recordForm(req: HttpRequest) : # /finance/recordform
    if req.method == "GET" :
        return render(req, 'recordForm.html')

def updateRecord(req: HttpRequest, id: str) : # /finance/recordform/<str:id>
    context = {"id": id}
    return render(req, 'recordForm.html', context)

def catalogs(req: HttpRequest) : # /finance/catalogs/
    return render(req, 'catalogs.html')