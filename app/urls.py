from django.urls import path
from . import views
from .api import records, catalogs

urlpatterns = [
    path("", views.index, name="index"),
    path("records/<str:id>", records.getRecord, name="getRecord"),
    path("records", records.records, name="getRecords"),
    path("catalogs/<str:catalog>", catalogs.catalogs, name="catalogs"),
    path("catalogs/", views.catalogs, name="catalogsView"),
    path("recordForm/<str:id>", views.updateRecord, name="updateRecord"),
    path("recordForm/", views.recordForm, name="createRecord"),
]