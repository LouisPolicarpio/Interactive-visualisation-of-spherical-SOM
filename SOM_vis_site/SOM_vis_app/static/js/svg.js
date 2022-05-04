function create_svgs(){
    //create svg
    var width = 700;
    var height = 700;
    var dome_svg = d3.select("#dome_display").append("svg")
        .attr("viewBox", "-350 -350 700 700")
        .attr("width", width)
        .attr("height", height);

    var proj_svg = d3.select("#dome_display").append("svg")
        .attr("viewBox", "-350 -350 700 700")
        .attr("width", width)
        .attr("height", height);

    return [dome_svg, proj_svg]; 
}

// projection points
function proj(x, y, z, col, svg) {
    if (z != null) {
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("cz", z)
            .attr("r", 2)
            .attr("fill", col);
        dome_vertices.push[[x, y, z]];

    } else {
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 2)
        proj_vertices.push[[x, y]];
    }
}

function projLines(x1, y1, x2, y2, visiblity , id, svg) {
    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("visibility", visiblity)
        .attr("id", id);
}



function getTriangles(ords, p1, p2, p3, id, svg) {
    
    var vector1 = math.subtract(math.matrix(ords[p1]) , math.matrix(ords[p2]));
    var vector2 = math.subtract(math.matrix(ords[p1]) , math.matrix(ords[p3]));
    

    if(ords[0].length == 3 ){
        var result = math.cross(vector1, vector2);
        result = math.dot(result,[0,0,1]);

        if (result > 0) {
            projLines(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "visible", id +"_0" ,svg);
            projLines(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "visible", id + "_1", svg);
            projLines(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "visible", id + "_2", svg);
        }else{
            projLines(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "hidden",  id + "_0", svg);
            projLines(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "hidden",  id + "_1", svg);
            projLines(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "hidden",  id + "_2", svg);
        }
    }else{
        var result = math.det([vector1, vector2]);

        if( result > 0){
            projLines(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "visible", id + "_0", svg);
            projLines(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "visible", id + "_1", svg);
            projLines(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "visible", id + "_2", svg);
        }else{
            projLines(ords[p1][0], ords[p1][1], ords[p2][0], ords[p2][1], "hidden", id + "_0", svg);
            projLines(ords[p2][0], ords[p2][1], ords[p3][0], ords[p3][1], "hidden", id + "_1", svg);
            projLines(ords[p3][0], ords[p3][1], ords[p1][0], ords[p1][1], "hidden", id + "_2", svg);
        }
    }

}