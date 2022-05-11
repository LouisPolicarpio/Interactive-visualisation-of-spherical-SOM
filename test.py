from geodome import GeodesicDome


dome = GeodesicDome(6)
res = dome.get_vertices()
arr = dome.get_triangles()

    
print(res.size/3)
print(arr.size/3)
print(arr.size)

