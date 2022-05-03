import re
from geodome import GeodesicDome
import numpy as np

dome = GeodesicDome(0)
res = dome.get_vertices()
arr = dome.get_triangles()
for i in arr:
    vector1 =  res[i[1]] - res[i[0]]
    vector2 = res[i[2]] - res[i[0]]
    result = np.cross(vector1, vector2)
    if result[1] >= 0 :
        print("+") 
    else:
        print("-")  
    
# print(res);
# print(arr);
