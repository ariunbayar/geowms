from django.contrib import admin
from geoportal_app.models import *
# Register your models here.

class MyUserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_active', 'last_login']

admin.site.register(Page)
admin.site.register(User, MyUserAdmin)
admin.site.register(Role)