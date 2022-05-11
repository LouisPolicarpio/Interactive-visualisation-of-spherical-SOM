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


function rotation(dome_svg, proj_svg,  triangles, zoom){
  
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


    var start;
    var end;
    var speed = [];
    document.getElementById("dome_display").onmousemove = function (e) {
        
        if (startX == null) {
            return;
        }
        if (startY == null) {
            return;
        }
        // start = performance.now();
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
        var r = [];
        //update all circles  in sphere 
        
        dome_svg.selectAll("circle").datum(function () {
            var currentCord = math.matrix([[this.getAttribute('cx')], [this.getAttribute('cy')], [this.getAttribute('cz')]]);
            var newCoords = rotationMatrix(theta, currentCord, posVect);
  
            
            var x = math.subset(newCoords, math.index(0, 0));
            var y = math.subset(newCoords, math.index(1, 0));
            var z = math.subset(newCoords, math.index(2, 0));
            var rad = this.getAttribute('r');


            this.setAttribute('cx', x);
            this.setAttribute('cy', y);
            this.setAttribute('cz', z);

            var spherCodord = sphericalCordConvert(x, y, z);
            // bounding parallel = 61.9 and an equator (convert 61.9 = 1.080359 to radian) / central meridian ratio p = 2.03  
            var newProjCoOrd = wagnerTransform(1.080359, 2.03, spherCodord[1], spherCodord[2]);
            // console.log(newProjCoOrd);
            newProjCoOrd = newProjCoOrd.map(function (x) { return x * (100); });

            newProj.push(newProjCoOrd );
            newDome.push([x ,y ,z]);
            r.push(rad)

        });

        //update all circles in proj
        var i = 0;
        proj_svg.selectAll("circle").datum(function () {

    
            var x = newProj[i][0];
            var y = newProj[i][1];
            var rad = r[i];
            //console.log(rad);
            this.setAttribute('cx', x );
            this.setAttribute('cy', y );
            if(rad != null)
                this.setAttribute('r', rad);
            
            i++;
        });


        for(let i = 0; i < triangles.length ; i ++){

            visibleTriangles(newProj, triangles[i][0], triangles[i][1], triangles[i][2], "projTri" +i) ;
            visibleTriangles(newDome, triangles[i][0], triangles[i][1], triangles[i][2], "domeTri" +i) ;
        }
        startY = e.clientY;
        startX = e.clientX;
    };

    document.addEventListener('keydown', keyPressed);

    function keyPressed(e) {
        if (e.code == "Enter") {
            console.log(speed.length);
            console.log("///////////////////////////////////////////////");

            speed_500 = speed.slice(0, 500);
           // console.log("speed array:" + speed_500);
            let sum_500 = speed_500.reduce((partialSum, a) => partialSum + a, 0);
            let len_500 = speed_500.length;
            console.log("sum :" + sum_500);
            console.log("len :" + len_500);
            console.log("mean :" + sum_500 / len_500);
            console.log("median : " + median(speed_500));
            console.log("mode : " + mode(speed_500));
            console.log("range : " + range(speed_500));

            console.log("///////////////////////////////////////////////");
            speed_1000 = speed.slice(0, 1000);
           // console.log("speed array:" + speed_1000);
            let sum_1000 = speed_1000.reduce((partialSum, a) => partialSum + a, 0);
            let len_1000 = speed_1000.length;
            console.log("sum :" + sum_1000);
            console.log("len :" + len_1000);
            console.log("mean :" + sum_1000 / len_1000);
            console.log("median : " + median(speed_1000));
            console.log("mode : " + mode(speed_1000));
            console.log("range : " + range(speed_1000));

            console.log("///////////////////////////////////////////////");
            speed_5000 = speed.slice(0, 5000);
           // console.log("speed array:" + speed_5000);
            let sum_5000 = speed_5000.reduce((partialSum, a) => partialSum + a, 0);
            let len_5000 = speed_5000.length;
            console.log("sum :" + sum_5000);
            console.log("len :" + len_5000);
            console.log("mean :" + sum_5000 / len_5000);
            console.log("median : " + median(speed_5000));
            console.log("mode : " + mode(speed_5000));
            console.log("range : " + range(speed_5000));

        }
    }

    //https://stackoverflow.com/questions/45309447/calculating-median-javascript
    function median(values) {
        if (values.length === 0) throw new Error("No inputs");

        values.sort(function (a, b) {
            return a - b;
        });

        var half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];

        return (values[half - 1] + values[half]) / 2.0;
    }

};

//https://jonlabelle.com/snippets/view/javascript/calculate-mean-median-mode-and-range-in-javascript
function mode(numbers) {
    // as result can be bimodal or multi-modal,
    // the returned result is provided as an array
    // mode of [3, 5, 4, 4, 1, 1, 2, 3] = [1, 3, 4]
    var modes = [], count = [], i, number, maxIndex = 0;

    for (i = 0; i < numbers.length; i += 1) {
        number = numbers[i];
        count[number] = (count[number] || 0) + 1;
        if (count[number] > maxIndex) {
            maxIndex = count[number];
        }
    }

    for (i in count)
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxIndex) {
                modes.push(Number(i));
            }
        }

    return modes;
}

//https://jonlabelle.com/snippets/view/javascript/calculate-mean-median-mode-and-range-in-javascript
function range(numbers) {
    numbers.sort();
    return [numbers[0], numbers[numbers.length - 1]];
}

function updateTriangles(x1, y1, x2, y2, visiblity, id ) {
    if (id === "projTri0_0" || id === "projTri0_1" || id === "projTri0_2" || id === "domeTri0_0" || id === "domeTri0_1" || id === "domeTri0_2" ){
        d3.select("#" + id)
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("visibility", visiblity)
            .style("stroke-width", 3)
            .style("stroke", "red");
    }else{
        d3.select("#" + id)
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("visibility", visiblity);
    }


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