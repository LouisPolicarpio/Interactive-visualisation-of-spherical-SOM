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

class CoOrd2D(models.Model):
    geoDome = models.ForeignKey(GeoDome, on_delete=models.CASCADE)
    x = models.FloatField(default=0)
    y = models.FloatField(default=0)




