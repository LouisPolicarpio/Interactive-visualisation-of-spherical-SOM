// 0 = radius, 1 = azimuthAngle = lng,  2 = polarAngle = lat  all agles in radian 
//https://stackoverflow.com/questions/5674149/3d-coordinates-on-a-sphere-to-latitude-and-longitude
function sphericalCordConvert(x, y, z) {
    var spherCodord = [];

    radius = Math.sqrt((x * x) + (y * y) + (z * z));
    lng = Math.atan2(y, x);
    lat = Math.atan2(z, Math.sqrt(x * x + y * y));

    spherCodord.push(radius);
    spherCodord.push(lng);
    spherCodord.push(lat);

    return spherCodord
}



//Wagner’s transformation of this projection use a bounding
function wagnerTransform(boundParrallel, p, long, lat) {
    let k = Math.sqrt(2 * p * Math.sin(boundParrallel / 2) / math.pi);
    let m = Math.sin(boundParrallel);

    //The result is between -pi/2 and pi/2.
    let theta = Math.asin(m * Math.sin(lat));
    let wagnerX = ((k / Math.sqrt(m)) * ((long * Math.cos(theta)) / (Math.cos(theta / 2))));

    let wagnerY = (2 / (k * Math.sqrt(m))) * Math.sin(theta / 2);

    var wagnerCoOrd = [wagnerX, wagnerY];
    return wagnerCoOrd;
}
