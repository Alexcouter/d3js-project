/** Bar chart **/

var docEl = document.documentElement;
var divEl = document.getElementById('svg');
//divEl.hide();

var width = divEl.clientWidth,
    height =  300;

var x = d3.scale.ordinal()
.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
.rangeRound([height, 0]);

var color = d3.scale.ordinal()
.range(["#98abc5", "#8a89a6", "#7b6888"]);

var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom");

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickFormat(d3.format(".2s"));


/* Main */

function updateWindow(){
    "use strict";
    width = divEl.clientWidth;
    height = 500;

    svg.attr("width", width).attr("height", height);
}

window.onresize = updateWindow;


/* Support envoi données */
d3.select("#upload-input").on("click", function(){
    document.getElementById("hidden-file-upload").click();
});
d3.select("#hidden-file-upload").on("change", function(){
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        //Vars fichiers
        var uploadFile = this.files[0];
        var filereader = new window.FileReader();

        filereader.onload = function(){
            //Fichier brut
            var txtRes = filereader.result;
            try{
                //TODO Lire les fichiers en CSV
                var data = d3.csv.parse(txtRes);
                callSvg(data);

            }catch(err){
                window.alert("Erreur de parsing \nerror message: " + err.message);
                return;
            }
        };
        filereader.readAsText(uploadFile);

    } else {
        alert("Navigateur incompatible, essayez avec Google chrome ou Firefox (dernières versions).");
    }
});


function callSvg(data){
    var nbGroupe = 0;
    var nbGenes = 0;

    color.domain(data.map(function(d) { // liste des groupes (1/2/3/..)

        console.log("dgroupe : ", d.Groupe);

        return d.Groupe;
    })); //met les couleurs pour les groupes
    nbGroupe = color.domain().length;
    //    console.log("colorfinal : ", color.domain());
    x.domain(d3.keys(data[0]).filter(function(key) {         //récupère le nom des gènes pour l'axe x
        if(key !== "Groupe" && key !== "genespatients"){
            //console.log("key: ", key);
            nbGenes++;
            return key;} }));

    var groupeTmp = "";
    var dataRanger = new Array();

    data.forEach(function(d) {
        x.domain().map(function(name) {
            var test = +d.Groupe;
            if(typeof  dataRanger[name] === 'undefined'){
                dataRanger[name] = new Array();
                for(var i = 0; i < nbGroupe; i++){
                    dataRanger[name][i] = 0;
                }
            }

            dataRanger[name][test-1] += +d[name];
        });
    });
    var dataFinal = new Array();

    for(var key in dataRanger){
        var dataObject = new Object();
        dataObject["ages"] = new Array();

        var cpt = 0;
        for(var j = 1; j < nbGroupe+1; j++){
            var ageObject = new Object();
            dataObject[j] = dataRanger[key][j-1];
            ageObject["name"] = j;
            ageObject["y0"] = cpt;
            cpt = cpt + dataRanger[key][j-1];
            ageObject["y1"] = cpt;
            dataObject["ages"][j-1] = ageObject;
        }
        dataObject["total"] = cpt;
        dataObject["groupeGenes"] = key;
        dataFinal.push(dataObject);
    }

    y.domain([0, d3.max(dataFinal, function(d) { return d.total; })]);

    /** SVG **/
    var svg = d3.select(divEl).append("svg")
    .attr("width", width)
    .attr("height", height);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Population");

    var state = svg.selectAll(".groupeGenes")
    .data(dataFinal)
    .enter().append("g")
    .attr("class", "g")
    .attr("transform", function(d) { return "translate(" + x(d.groupeGenes) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return y(d.y0) - y(d.y1); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
    .data(color.domain().slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

//BarCreator.prototype.setIdCt = function(idct){
//    this.idct = idct;
//};
//
//var BarCreator(svg){
//    var thisGraph = this;
//    thisGraph.idct = 0;
//
//    thisGraph.state = {
//        selectedBar: null,
//        mouseDownBar: null,
//        justDragged: false,
//        justScaleTransGraph: false,
//        selectedText: null
//    };
//
//    var xDisplay = svg.append('svg:xDisplay');
//    xDisplay.attr("class", "x axis")
//        .attr("transform", "translate(0," + height + ")")
//        .call(xAxis);
//
//    var yDisplay = svg.append('svg:yDisplay');
//    yDisplay.attr("class", 'y axis')
//        .call(yAxis);
//
//    thisGraph.svg = svg;
//
//    thisGraph.svgG = svg.append("g")
//        .classed(thisGraph.consts.graphClass, true);
//    var svgG = thisGraph.svgG;
//
//
//}
//
//
//BarCreator.prototype.consts =  {
//    selectedClass: "selected",
//    barClass: "barClass",
//    graphClass: "graph",
//};
//
//// call to propagate changes to graph
//BarCreator.prototype.updateGraph = function(){
//
//    var thisGraph = this,
//        consts = thisGraph.consts,
//        state = thisGraph.state;
//
//};

/* TODO :
Hover sur groupe
Zoom
D3.Behavior.zoom (mousewheel)
*/
