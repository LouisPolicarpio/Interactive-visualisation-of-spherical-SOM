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
def sphericalCordConvert(x,y,z):
    spherCodord = []

    radius  =  sqrt((x*x) + (y*y) + (z*z))
    
    lng = math.atan2(y,x)

    lat = math.atan2(z,sqrt(x*x+y*y).real)
    

    spherCodord.append(radius)
    spherCodord.append(lng)
    spherCodord.append(lat)
    
    
    return spherCodord

#    
def cartisanCordConvert(radius,azimuthAngle,polarAngle):
    x = radius * math.sin(polarAngle) * math.cos(azimuthAngle)
    y = radius * math.sin(polarAngle) * math.sin(azimuthAngle)
    z = radius * math.cos(polarAngle)
    
    print(x)
    print(y)
    print(z)
    return
    # cartisan = [x,y,z]
    # return cartisan

#Wagner’s transformation of this projection use a bounding
# check for range of angles 
# readuce to tesselation 
# reduce to cube
# visulisation
def wagnerTransform(boundParrallel,p,long, lat):
    k = sqrt(2*p*math.sin(boundParrallel/2)/math.pi).real
    m = math.sin(boundParrallel)
   

    #The result is between -pi/2 and pi/2.
    theta = math.asin(m * math.sin(lat) ).real 
    # print(theta)

    x = ((k/sqrt(m)) * (   (long  * math.cos(theta))/(math.cos(theta/2))  )   ).real  #
    # print((long  * math.cos(theta)))
    # print((math.cos(theta/2)))
    
   # print(x)
    print("-------------------")
    y = (2/(k * sqrt(m))) * math.sin(theta/2)

    coOrd = [round(x.real,5),round(y.real,5)]
    return coOrd


# def inverseWagnerTransform(boundParrallel,p,y, x):
#     k = sqrt(2*p*cmath.sin(boundParrallel/2)/cmath.pi)
#     m = cmath.sin(boundParrallel)

#     theta = 2 * cmath.asin( (y*k*sqrt(m)) / 2 )
#     long = (x*sqrt(m)*cmath.cos(theta/2)) /(k*cmath.cos(theta))

#     return


# p is the equator/central meridian ratio
# def lambertAzimuthalTransform(boundParrallel,boundingMeridian,p,long, lat):
    
#     m = cmath.sin(boundParrallel)
#     n = boundingMeridian/(cmath.pi)
#     #k is scalefactor
#     k = sqrt( (p * cmath.sin((boundParrallel/2)) ) / cmath.sin(boundingMeridian/2))
#     sinTheta = m * cmath.sin(lat)
#     theta = cmath.asin(sinTheta)

#     #transform method
#     x1 = (k/(sqrt(m*n))) 
#     x2 = ( (sqrt(2)*cmath.cos(theta)*cmath.sin(n*long)) / (sqrt(1+cmath.cos(theta)*cmath.cos(n*long))) )
#     x = x1 * x2

#     y1 = (1/(k * sqrt(m*n))) 
#     y2 = (sqrt(2)*sinTheta) / (sqrt(1+cmath.cos(theta)*cmath.cos(n*long))) 
#     y = y1*y2

#     coOrd = [x,y] 
#     return coOrd

    


# is the inverse projection converting Cartesian coordinates to longitude and latitude
# def inverseLambertAzimuthalTransform(boundParrallel, boundingMeridian, x , y, p):

#     m = cmath.sin(boundParrallel)
#     n = boundingMeridian/(cmath.pi)
#     #k is scalefactor
#     k = sqrt( (p * cmath.sin((boundParrallel/2)) ) / cmath.sin(boundingMeridian/2))

#     X = x * (sqrt(m*n))/k
#     Y = y * k * sqrt(m*n)
#     Z = sqrt(1 - ((X**2) + (Y**2))/4)

#     lat =  (1/n) * cmath.atan((Z*X)/(2*(Z**2)-1))
#     long = cmath.asin((Z*Y)/m)
    
#     longLat = [long,lat]
#     return longLat