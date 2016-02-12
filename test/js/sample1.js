// var dataset;

// d3.csv("http://127.0.0.1/d3js/sample.csv"
// 	, function(data){
// // dataset = data.map(function(d) {
// // 	return [+d["x-coordinate"], +d["y-coordinate"]];
//   console.log(data[0]);
// });

// var patient_csv = function()
// {
//     d3.csv("http://127.0.0.1/d3js/sample.csv", function(patient)
//     {
//         data = patient.map(function(d)
//         {

//             var objectToInspect;

//             objectToInspect = d;

//             console.log("getOwnPropertyNames", Object.getOwnPropertyNames(objectToInspect));  //écrit les attributs, plus qu'a les foutre dans un tableau



//         })

//     })
// };


//Taille graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
//Axes
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);
//Axes styles
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format("d"));
//Creation svg
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g1")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 // var groupe = svg.selectAll(".groupe")
 // 	.data(data)
 // 	.enter().append("g1")
 // 	.attr("class", "g1")
 // 	.attr("transform", function(d) {
 // 		return "translate(" + x(d.State) + ",0)";
 // 	});

 // groupe.selectAll("rect")
 //      .data(function(d) { return d.ages; })
 //    .enter().append("rect")
 //      .attr("width", x.rangeBand())
 //      .attr("y", function(d) { return y(d.y1); })
 //      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
 //      .style("fill", function(d) { return color(d.name); });


// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
