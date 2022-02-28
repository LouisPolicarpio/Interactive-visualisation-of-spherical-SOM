from re import template
from django.urls import path
from django.views import *

from . import views

urlpatterns = [
    path('', views.somFormView.as_view()),
    
    # path('geo_dome', views.geo_dome, name='geo_dome'),
    # path('form/geo_dome', views.geo_dome, name='geo_dome'),
]