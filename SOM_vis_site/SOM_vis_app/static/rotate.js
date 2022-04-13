

//mouseDown 

//onDrag
var totalMovement = 0;
var lastX = -1;
var lastY = -1;
var startX = -1;
var startY = -1;


object.onmousedown = function () {
    startX = clientX;
    startY = clientY;
    lastX = clientX;
    lastY = clientY;

   // rotationMatrix(theta, x, y, z) 
};

object.mousemove = function () {
    if (startX == -1) {
        return;
    }
    if (startY == -1) {
        return;
    }

    totalMovement += Math.sqrt(Math.pow(lastY - event.clientY, 2) + Math.pow(lastX - event.clientX, 2));

    $('span').text('From your starting point (' + startX + 'x' + startY + ') you moved:   ' + totalMovement);

    lastX = event.clientX;
    lastY = event.clientY;
};

object.mouseup = function () {
    startX = -1;
    startY = -1;
    totalMovement = 0;
    lastX = 0;
    lastY = 0;
}




function rotationMatrix(theta,x,y,z){

    var r = [3][3];

    r[0][0] = Math.cos(theta) + Math.pow(x, 2) * (1 - Math.cos(theta));
    r[0][1] = y * x * (1 - Math.cos(theta)) + z * Math.sin(theta);
    r[0][2] = z*x*(1-Math.cos(theta) - y * Math.sin(theta));

    r[1][0] = x*y*(1-Math.cos(theta)) + z*Math.sin(theta);
    r[1][1] = Math.cos(theta)+Math.pow(y,2)*(1-Math.cos(theta));
    r[1][2] = y * z * (1 - Math.cos(theta) - x * Math.sin(theta));

    r[2][0] = z * x * (1 - Math.cos(theta)) - z * Math.sin(theta);
    r[2][1] = z * y * (1 - Math.cos(theta)) + x * Math.sin(theta);
    r[2][2] = Math.cos(theta) + Math.pow(z, 2) * (1 - Math.cos(theta));

    var coord = [1][3];
    coord[0][0] = x;
    coord[0][1] = y;
    coord[0][2] = z;

    return matrixMultiply(r, coord);

}


// https://stackoverflow.com/questions/27205018/multiply-2-matrices-in-javascript
function matrixMultiply(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            m[r][c] = 0;             // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
            }
        }
    }
    return m;
}