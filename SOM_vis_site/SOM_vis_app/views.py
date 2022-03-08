from cmath import sqrt
from os import system
from tkinter import Y
from urllib import request
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView
import math

from numpy import mat


from SOM_vis_app.models import GeoDome , CoOrdDome
# from .forms import somForm
from geodome import GeodesicDome
# Create your views here.


# class somFormView(TemplateView):
#     template_name = 'form.html'

#     def get(self, request):
#         form = somForm()
#         return render(request, self.template_name, {'form':form})

def geo_dome_create(request):
    if request.method == 'POST':
        post = request.POST

        freq = int(post.get("freq"))
        domeOrds = GeodesicDome(freq).get_vertices()
        newName = post.get("name")

        
        #create dome 
        dome = GeoDome(name= newName)
        dome.save()


        # print(domeOrds)
        # print(domeOrds[0])
        # print(domeOrds[0][0])

        #store ords
        for i in range(len(domeOrds)):
            for j in range(len(domeOrds[i])):
                newOrd = domeOrds[i][j]
                newCoOrd = CoOrdDome( geoDome = dome,   value = newOrd,   coOrd = i, xyz = j)
                newCoOrd.save()
   


          
        #for each ord 
        #assign pk to created dome 
        #store ord 

    return render(request, "form.html")    

# def geo_dome_render(request):
#     freq = int(request.POST.get("freq"))
#     res = GeodesicDome(freq).get_vertices()
#     print(res)
#     return render(request, "form.html")   



# p is the equator/central meridian ratio
def wagnerLambertTransform(boundParrallel,boundingMeridian,p,long, lat):
    
    m = math.sin(boundParrallel)
    n = boundingMeridian/(math.pi)
    #k is scalefactor
    k = sqrt( (p * math.sin((boundParrallel/2)) ) / math.sin(boundingMeridian/2))
    sinTheta = m * math.sin(lat)
    theta = math.asin(sinTheta)

    #transform method
    x1 = (k/(sqrt(m*n))) 
    x2 = ( (sqrt(2)*math.cos(theta)*math.sin(n*long)) / (sqrt(1+math.cos(theta)*math.cos(n*long))) )
    x = x1 * x2

    y1 = (1/(k * sqrt(m*n))) 
    y2 = (sqrt(2)*sinTheta) / (sqrt(1+math.cos(theta)*math.cos(n*long))) 
    y = y1*y2

    coOrd = [x,y] 
 
    return coOrd


# is the inverse projection converting Cartesian coordinates to longitude and latitude
def inerseWagnerLambertTransform(boundParrallel, boundingMeridian, x , y, p):

    m = math.sin(boundParrallel)
    n = boundingMeridian/(math.pi)
    #k is scalefactor
    k = sqrt( (p * math.sin((boundParrallel/2)) ) / math.sin(boundingMeridian/2))

    X = x * (sqrt(m*n))/k
    Y = y * k * sqrt(m*n)
    Z = sqrt(1 - (pow(X,2) + pow(Y,2))/4)

    lat =  (1/n) * math.atan((Z*X)/(2*pow(Z,2)-1))
    long = math.asin((Z*Y)/m)
    
    longLat = [long,lat]
    return longLat