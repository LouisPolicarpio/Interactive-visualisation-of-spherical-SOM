from django.db import models


# Create your models here.
class GeoDome(models.Model):
    name = models.CharField(max_length= 1000)

    def __str__(self):
        return self.name


class CoOrdDome(models.Model):
    geoDome = models.ForeignKey(GeoDome, on_delete=models.CASCADE)
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    z = models.FloatField(default=0)
    colour = models.CharField(max_length=100000, default=0)

class Triangle(models.Model):
    geoDome = models.ForeignKey(GeoDome, on_delete=models.CASCADE)
    point1 = models.IntegerField(default=0)
    point2 = models.IntegerField(default=0)
    point3 = models.IntegerField(default=0)


class CoOrd2D(models.Model):
    geoDome = models.ForeignKey(GeoDome, on_delete=models.CASCADE)
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    colour = models.CharField(max_length=100000, default=0)



