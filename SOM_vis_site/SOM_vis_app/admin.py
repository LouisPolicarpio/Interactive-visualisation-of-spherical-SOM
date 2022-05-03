from django.contrib import admin

from SOM_vis_app.models import CoOrdDome, GeoDome ,CoOrd2D ,Triangle

# Register your models here.
admin.site.register(GeoDome)
admin.site.register(CoOrdDome)
admin.site.register(CoOrd2D)
admin.site.register(Triangle)