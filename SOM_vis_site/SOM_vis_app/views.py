from os import system
from urllib import request
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView

from SOM_vis_app.models import GeoDome , CoOrd
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

        #store ords
        for triangle in domeOrds:
            for ord in domeOrds[triangle]:
                newOrd = CoOrd

          
        #for each ord 
        #assign pk to created dome 
        #store ord 

        


        print(domeOrds[1][1])
        return render(request, "form.html")
    return render(request, "form.html")    

def geo_dome_render(request):
    freq = int(request.POST.get("freq"))
    res = GeodesicDome(freq).get_vertices()
    print(res)
    return render(request, "form.html")   