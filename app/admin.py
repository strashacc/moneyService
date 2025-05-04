from django.contrib import admin
from .models import Record, Type, Category, SubCategory, Status

# Register your models here.
admin.site.register([Record,
                     Type, 
                     Category, 
                     SubCategory, 
                     Status])