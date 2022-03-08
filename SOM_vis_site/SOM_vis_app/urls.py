from re import template
from django.shortcuts import redirect
from django.urls import path
from django.views import *

from . import views

urlpatterns = [
    path('form/', views.geo_dome_create, name='form'),
    path('disp/', views.geo_dome_disp, name='disp'),
    path('', lambda req: redirect('/form/')),
   

]