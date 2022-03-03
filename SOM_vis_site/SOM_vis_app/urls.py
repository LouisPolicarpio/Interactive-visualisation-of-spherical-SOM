from re import template
from django.urls import path
from django.views import *

from . import views

urlpatterns = [
    # path('', views.somFormView.as_view()),
    
    path('', views.geo_dome_create, name='geo_dome'),
    path('form', views.geo_dome_render, name='geo_dome_render'),
]