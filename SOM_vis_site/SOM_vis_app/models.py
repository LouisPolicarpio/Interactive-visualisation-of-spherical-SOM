from django.db import models


# Create your models here.
class GeoDome(models.Model):
    name = models.CharField(max_length= 1000)

    def __str__(self):
        return self.name


class CoOrdDome(models.Model):
    geoDome = models.ForeignKey(GeoDome, on_delete=models.CASCADE)
    value = models.FloatField(default=0)
    coOrd = models.IntegerField(default=0)
    # x = 0, y=1, z=2
    xyz = models.IntegerField(default=0)




