"""SOM_vis_site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/

"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('SOM_vis_app/', include('SOM_vis_app.urls')),
    path('', include('SOM_vis_app.urls')),
    path('admin/', admin.site.urls),
]