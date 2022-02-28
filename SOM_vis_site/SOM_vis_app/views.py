from urllib import request
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView

from .forms import somForm
# from geodome import GeodesicDome
# Create your views here.


class somFormView(TemplateView):
    template_name = 'form.html'

    def get(self, request):
        form = somForm()
        return render(request, self.template_name, {'form':form})

# def geo_dome(request):
#     freq = int(request.POST['freq'])
#     res =  res = GeodesicDome(freq).get_vertices()
#     return render(request, "geo_dome.html", {'result' : res})