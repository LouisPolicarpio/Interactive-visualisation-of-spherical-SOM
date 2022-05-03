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

function projLines(x1, y1, x2, y2, svg) {
    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2);
}

function getTriangles(ords, triangle) {
    vector1 = math.matrix(ords[triangle[1]]) - math.matrix(ords[triangle[0]]);
    vector2 = math.matrix(ords[triangle[2]]) - math.matrix(ords[triangle[0]]);
    result = np.cross(vector1, vector2);
    if (result[2] > 0) {
        draw = True
    }
    return
}