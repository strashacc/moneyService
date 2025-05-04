from django.db import models
from django.forms import ValidationError
from django.utils import timezone
from datetime import date

class Status(models.Model) :
    name = models.CharField(null=False, unique=True, primary_key=True, max_length=32)
    def __str__(self):
        return self.name
    
class Type(models.Model) :
    name = models.CharField(null=False, unique=True, primary_key=True, max_length=32)
    def __str__(self):
        return self.name
    
class Category(models.Model) :
    name = models.CharField(null=False, unique=True, primary_key=True, max_length=64)
    type = models.ForeignKey(to=Type, null=False, on_delete=models.CASCADE)
    def __str__(self):
        return self.name

class SubCategory(models.Model) :
    name = models.CharField(null=False, unique=True, primary_key=True, max_length=64)
    parent = models.ForeignKey(to=Category, null=False, on_delete=models.CASCADE)
    def __str__(self):
        return str(self.parent) + "." + self.name

class Record(models.Model) :
    date_created = models.DateField(default=timezone.now)
    status = models.ForeignKey(to=Status, on_delete=models.PROTECT)
    type = models.ForeignKey(to=Type, on_delete=models.PROTECT, null=False)
    category = models.ForeignKey(to=Category, on_delete=models.PROTECT, null=False)
    sub_category = models.ForeignKey(to=SubCategory, on_delete=models.PROTECT, null=False)
    amount = models.PositiveIntegerField(null=False)
    comment = models.CharField(max_length=256)
    
    def clean(self):
        super().clean()
        if self.sub_category.parent.name != self.category.name :
            raise ValidationError("The subcategory should be a child of the selected category.")
        if self.category.type.name != self.type.name :
            raise ValidationError("The category should be of the selected type.")
        if self.date_created.toordinal() > date.today().toordinal() :
            raise ValidationError("The creation date should not exceed current date.")
        if int(self.amount) < 0 :
            raise ValidationError("Amount should be non-negative.")
    def __str__(self) :
        return self.comment