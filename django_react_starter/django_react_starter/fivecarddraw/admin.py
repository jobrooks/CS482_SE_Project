from django.contrib import admin
from .models import fivecarddraw

class fivecarddrawAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

# Register your models here.

admin.site.register(fivecarddraw, fivecarddrawAdmin)