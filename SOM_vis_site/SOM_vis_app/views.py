from asyncio import events
from cmath import sqrt
from os import system
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
            return render(request, "dispDome.html",{'geoDome_list' : geoDome_list, 'Ord_list': Ord_list})          
        elif post['action'] == 'ConvertTo2D':
            projList = create2dProj(Ord_list) 
            return render(request, "dispDome.html",{'geoDome_list' : geoDome_list, 'Ord_list': projList})      
            


    return render(request, "dispDome.html",{'geoDome_list' : geoDome_list})


def create2dProj(Ord_list):   
    #create dome 
    geoDomekey = Ord_list[0].geoDome

    CoOrd2D.objects.filter(geoDome = geoDomekey).delete()            
    projArr = []
    for i in range(len(Ord_list)):

            spherCodord = sphericalCordConvert(Ord_list[i].x, Ord_list[i].y, Ord_list[i].z) 
            #bounding parallel = 61:9' and an equator/central meridian ratio p = 2:03 
            coOrd = wagnerTransform(float(61.9),float(2.03),spherCodord[1], spherCodord[2])
            proj = CoOrd2D( geoDome = geoDomekey, x = coOrd[0], y = coOrd[1])

            projArr.append(proj)
    CoOrd2D.objects.bulk_create(projArr)    
        

    projList = CoOrd2D.objects.filter(geoDome = geoDomekey)
    return projList  

# 0 = radius, 1 = polarAngle = lon,  2 = azimuthAngle = lat  
def sphericalCordConvert(x,y,z):
    spherCodord = []

    radius  =  sqrt((x**2) + (y**2) + (z**2))
    polarAngle = cmath.acos(z/radius)
    if( x != 0):
        azimuthAngle  = cmath.atan(y/x) 
    else:
        azimuthAngle = 90
    spherCodord.append(radius)
    spherCodord.append(polarAngle)
    spherCodord.append(azimuthAngle)

    return spherCodord

#Wagner’s transformation of this projection use a bounding
def wagnerTransform(boundParrallel,p,long, lat):
    k = sqrt(2*p*cmath.sin(boundParrallel/2)/cmath.pi)
    m = cmath.sin(boundParrallel)

    theta = cmath.asin(m * cmath.sin(lat) )

    x = (k/sqrt(m)) * ((long  * cmath.cos(theta))/(cmath.cos(theta/2)))
    y = (2/(k * sqrt(sqrt(m)))) * cmath.sin(theta/2)

    coOrd = [round(x.real,5),round(y.real,5)]
    return coOrd

def inverseWagnerTransform(boundParrallel,p,y, x):
    k = sqrt(2*p*cmath.sin(boundParrallel/2)/cmath.pi)
    m = cmath.sin(boundParrallel)

    theta = 2 * cmath.asin( (y*k*sqrt(m)) / 2 )
    long = (x*sqrt(m)*cmath.cos(theta/2)) /(k*cmath.cos(theta))

    return


# p is the equator/central meridian ratio
def lambertAzimuthalTransform(boundParrallel,boundingMeridian,p,long, lat):
    
    m = cmath.sin(boundParrallel)
    n = boundingMeridian/(cmath.pi)
    #k is scalefactor
    k = sqrt( (p * cmath.sin((boundParrallel/2)) ) / cmath.sin(boundingMeridian/2))
    sinTheta = m * cmath.sin(lat)
    theta = cmath.asin(sinTheta)

    #transform method
    x1 = (k/(sqrt(m*n))) 
    x2 = ( (sqrt(2)*cmath.cos(theta)*cmath.sin(n*long)) / (sqrt(1+cmath.cos(theta)*cmath.cos(n*long))) )
    x = x1 * x2

    y1 = (1/(k * sqrt(m*n))) 
    y2 = (sqrt(2)*sinTheta) / (sqrt(1+cmath.cos(theta)*cmath.cos(n*long))) 
    y = y1*y2

    coOrd = [x,y] 
    return coOrd

    


# is the inverse projection converting Cartesian coordinates to longitude and latitude
def inverseLambertAzimuthalTransform(boundParrallel, boundingMeridian, x , y, p):

    m = cmath.sin(boundParrallel)
    n = boundingMeridian/(cmath.pi)
    #k is scalefactor
    k = sqrt( (p * cmath.sin((boundParrallel/2)) ) / cmath.sin(boundingMeridian/2))

    X = x * (sqrt(m*n))/k
    Y = y * k * sqrt(m*n)
    Z = sqrt(1 - ((X**2) + (Y**2))/4)

    lat =  (1/n) * cmath.atan((Z*X)/(2*(Z**2)-1))
    long = cmath.asin((Z*Y)/m)
    
    longLat = [long,lat]
    return longLat