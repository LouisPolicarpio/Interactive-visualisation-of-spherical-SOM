//returns the new cords of point after rotation 
function rotationMatrix(theta, coord, pVect) {
    var x = math.subset(pVect, math.index(0));
    var y = math.subset(pVect, math.index(1));
    var z = math.subset(pVect, math.index(2)); 


    var sum = Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    
    if(sum === 0){
        x = 0
        y = 0
        z = 0

    }else{
        x = math.subset(pVect, math.index(0)) / sum;
        y = math.subset(pVect, math.index(1)) / sum;
        z = math.subset(pVect, math.index(2)) / sum;

    }



    //https://stackoverflow.com/questions/6721544/circular-rotation-around-an-arbitrary-axis
    var r = math.matrix([
        [
            Math.cos(theta) + Math.pow(x, 2) * (1 - Math.cos(theta)),
            x * y * (1 - Math.cos(theta)) - z * Math.sin(theta),
            x * z * (1 - Math.cos(theta)) + y * Math.sin(theta)

        ], [
            y * x * (1 - Math.cos(theta)) + z * Math.sin(theta),
            Math.cos(theta) + Math.pow(y, 2) * (1 - Math.cos(theta)),
            y * z * (1 - Math.cos(theta)) - x * Math.sin(theta)


        ], [
            z * x * (1 - Math.cos(theta)) - y * Math.sin(theta),
            z * y * (1 - Math.cos(theta)) + x * Math.sin(theta),
            Math.cos(theta) + Math.pow(z, 2) * (1 - Math.cos(theta))
        ]
    ]);

    var res = math.multiply(r, coord);
    return res;
}


function rotation(dome_svg, proj_svg,  triangles){


    //init start vals 
    var startX = null;
    var startY = null;

    

    document.getElementById("dome_display").onmousedown = function (e) {
        //set start to  click pos 
        startX = e.clientX;
        startY = e.clientY;
    };

    document.getElementById("dome_display").onmouseup = function (e) {
        startX = null;
        startY = null;
    };

    document.getElementById("dome_display").onmousemove = function (e) {
        if (startX == null) {
            return;
        }
        if (startY == null) {
            return;
        }

        //distance vextor
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;


        var vector = math.matrix([dx, dy, 0]);


        //vector len
        var dist = parseFloat(Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2)));

        //angle 
        var axis = math.matrix([0, 0, -1]);
        var posVect = (math.cross(vector, axis));


        //between 0 and 2pi
        var theta = Math.min(Math.max(parseFloat(dist / 200), 0), 2 * Math.PI);

        var newProj = [];
        var newDome = [];
        //update all circles  in sphere 
        dome_svg.selectAll("circle").datum(function () {
            var currentCord = math.matrix([[this.getAttribute('cx')], [this.getAttribute('cy')], [this.getAttribute('cz')]]);
            var newCoords = rotationMatrix(theta, currentCord, posVect);
  
            
            var x = math.subset(newCoords, math.index(0, 0));
            var y = math.subset(newCoords, math.index(1, 0));
            var z = math.subset(newCoords, math.index(2, 0));


            this.setAttribute('cx', x);
            this.setAttribute('cy', y);
            this.setAttribute('cz', z);

            var spherCodord = sphericalCordConvert(x, y, z);
            // bounding parallel = 61.9 and an equator (convert 61.9 = 1.080359 to radian) / central meridian ratio p = 2.03  
            var newProjCoOrd = wagnerTransform(1.080359, 2.03, spherCodord[1], spherCodord[2]);
            // console.log(newProjCoOrd);
            newProjCoOrd = newProjCoOrd.map(function (x) { return x * 100; });

            newProj.push(newProjCoOrd );
            newDome.push([x ,y ,z ]);

        });

        //update all circles in proj
        var i = 0;
        proj_svg.selectAll("circle").datum(function () {

    
            var x = newProj[i][0];
            var y = newProj[i][1];

            this.setAttribute('cx', x );
            this.setAttribute('cy', y );
            
            i++;
        });


        for(let i = 0; i < triangles.length ; i ++){

            visibleTriangles(newProj, triangles[i][0], triangles[i][1], triangles[i][2], "projTri" +i) ;
            visibleTriangles(newDome, triangles[i][0], triangles[i][1], triangles[i][2], "domeTri" +i) ;
        }
        startY = e.clientY;
        startX = e.clientX;
    };


};

function updateTriangles(x1, y1, x2, y2, visiblity, id ) {
    d3.select("#"+id)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("visibility", visiblity);
}

function visibleTriangles(ords, p1, p2, p3, id) {
    var vector1 = math.subtract(math.matrix(ords[p1]), math.matrix(ords[p2]));
    var vector2 = math.subtract(math.matrix(ords[p1]), math.matrix(ords[p3]));

    if (ords[0].length == 3) {
        var result = math.cross(vector1, vector2);
        result = math.dot(result, [0, 0, 1]);
        if (result > 0) {
            updateTriangles(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "visible", id + "_0");
            updateTriangles(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "visible", id + "_1");
            updateTriangles(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "visible", id + "_2");
        }else{
            updateTriangles(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "hidden", id + "_0");
            updateTriangles(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "hidden", id + "_1");
            updateTriangles(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "hidden", id + "_2");
        }

    } else {
        var result = math.det([vector1, vector2]);

        if (result > 0) {
            updateTriangles(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "visible", id + "_0");
            updateTriangles(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "visible", id + "_1");
            updateTriangles(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "visible", id + "_2");
        }else{
            updateTriangles(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "hidden", id + "_0");
            updateTriangles(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "hidden", id + "_1");
            updateTriangles(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "hidden", id + "_2");
        }
    }

}