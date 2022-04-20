from asyncio import events
from cmath import sqrt
from math import degrees
import math
from os import system
from re import M
from tkinter import Y
from turtle import update
from urllib import request
from django.shortcuts import redirect, render
from django.http import HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView
import cmath

from numpy import angle, mat


from SOM_vis_app.models import GeoDome , CoOrdDome, CoOrd2D
from geodome import GeodesicDome




def geo_dome_create(request):
    if request.method == 'POST':
        post = request.POST

        freq = int(post.get("freq"))
        domeOrds = GeodesicDome(freq).get_vertices()
        newName = post.get("name")

        #create dome 
        dome = GeoDome(name= newName)
        dome.save()

        #store ords
        ordArr = []
        for i in range(len(domeOrds)):
            newCoOrd = CoOrdDome( geoDome = dome,  x = domeOrds[i][0], y = domeOrds[i][1], z = domeOrds[i][2] )
            ordArr.append(newCoOrd)
        CoOrdDome.objects.bulk_create(ordArr)    
        return redirect("disp")  
        
    return render(request, "form.html")  

def geo_dome_disp(request):
    geoDome_list = GeoDome.objects.all()
    if request.method == 'POST':
        post = request.POST
        dome = post.get("geoDome_list")
        Ord_list = CoOrdDome.objects.filter(geoDome = dome)
        
        if post.get('action') == 'ViewDetails':
            projList = create2dProj(Ord_list) 
            return render(request, "dispDome.html",{'geoDome_list' : geoDome_list, 'Ord_list': Ord_list, 'Proj_list': projList})  
               
    return render(request, "dispDome.html",{'geoDome_list' : geoDome_list})


def create2dProj(Ord_list):   
    #create dome 
    geoDomekey = Ord_list[0].geoDome

    CoOrd2D.objects.filter(geoDome = geoDomekey).delete()            
    projArr = []
    for i in range(len(Ord_list)):

            spherCodord = sphericalCordConvert(Ord_list[i].x, Ord_list[i].y, Ord_list[i].z) 
            #bounding parallel = 61.9 and an equator/central meridian ratio p = 2:03 
            #need to convert 61.9 = 1.080359 to radian 
            coOrd = wagnerTransform(1.080359,2.03,spherCodord[1], spherCodord[2])

            proj = CoOrd2D( geoDome = geoDomekey, x = coOrd[0], y = coOrd[1])

            projArr.append(proj)
    CoOrd2D.objects.bulk_create(projArr)    
        

    projList = CoOrd2D.objects.filter(geoDome = geoDomekey)
    return projList  



# 0 = radius, 1 = azimuthAngle = lng,  2 = polarAngle = lat  all agles in radian 
# reverse to get cartisian
# https://stackoverflow.com/questions/5674149/3d-coordinates-on-a-sphere-to-latitude-and-longitude
def sphericalCordConvert(x,y,z):
    spherCodord = []

    radius  =  sqrt((x*x) + (y*y) + (z*z))
    lng = math.atan2(y,x)
    lat = math.atan2(z,sqrt(x*x+y*y).real)
    

    spherCodord.append(radius)
    spherCodord.append(lng)
    spherCodord.append(lat)
    
    return spherCodord


#Wagner’s transformation of this projection use a bounding
def wagnerTransform(boundParrallel,p,long, lat):
    k = sqrt(2*p*math.sin(boundParrallel/2)/math.pi).real
    m = math.sin(boundParrallel)
   

    #The result is between -pi/2 and pi/2.
    theta = math.asin(m * math.sin(lat) ).real 


    x = ((k/sqrt(m)) * (   (long  * math.cos(theta))/(math.cos(theta/2))  )   ).real  #

    y = (2/(k * sqrt(m))) * math.sin(theta/2)

    coOrd = [round(x.real,5),round(y.real,5)]
    return coOrd


