from django.db import models

# Create your models here.
class GeoDome(models.Model):
    name = models.CharField(max_length= 1000)

    def __str__(self):
        return self.name

class CoOrd(models.Model):
    geoDome = models.ForeignKey(GeoDome, on_delete=models.CASCADE)
    coOrd = models.IntegerField(default=0)
    triangle = models.IntegerField(default=0)




