
var docEl = document.documentElement;
var divEl = document.getElementById('svg');

var dataset = [];

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

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

var svg = d3.select(divEl).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("http://127.0.0.1/d3js/sample2.csv", function(data)
{

  var nbGroupe = 0;
  var nbGenes = 0;
  console.log("colorfinal : ", color.domain()[0]);
  color.domain(data.map(function(d) { // liste des groupes (1/2/3/..)

     console.log("dgroupe : ", d.Groupe);

     return d.Groupe;
  })); //met les couleurs pour les groupes
  nbGroupe = color.domain().length;
  console.log("colorfinal : ", color.domain());
 // console.log("alreadyDone : ", alreadyDone);
  x.domain(d3.keys(data[0]).filter(function(key) {         //récupère le nom des gènes pour l'axe x
    if(key !== "Groupe" && key !== "genespatients"){
      //console.log("key: ", key);
      nbGenes++;
      return key;} }));

  var groupeTmp = "";
  var dataRanger = new Array();
  /*for(var i = 0; i < nbGenes; i++){
    dataRanger[i] = new Array();
  }*/
  data.forEach(function(d) {
      x.domain().map(function(name) {
      //console.log("name: ", name + ": " + d[name] + " / " + d.Groupe);
      var test = +d.Groupe;
        if(typeof  dataRanger[name] === 'undefined'){
          dataRanger[name] = new Array();
          for(var i = 0; i < nbGroupe; i++){
           dataRanger[name][i] = 0;
          }
        }

        dataRanger[name][test-1] += +d[name];

        //dataRanger[test-1][1] ;
          //data [1,2,3] = Object
          //Colone = Object {grpenum1: nbGeneDsGrpe , grpenum2: nbGeneDsGrpe, genesPatient: nomDuGene, total: total, nbGenes[0] = Object2}
          //Object2 = {name: nomDuGroupe, y0 : pixelStart, y1 : pixelFinish};
      });
  });


  console.log("dataranger: ", dataRanger);

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
          //  console.log("dataRanger key j-1 : ",dataRanger[key][j-1]);
            //console.log("dataObject", dataObject);
        }
        dataObject["total"] = cpt;
        dataObject["groupeGenes"] = key;
        dataFinal.push(dataObject);
        // console.log("test : ",dataObject[2]);
    }
    console.log("dataFinal : ", dataFinal);
    console.log("dataFinal[0].ages : ", dataFinal[0].ages);

     y.domain([0, d3.max(dataFinal, function(d) { return d.total; })]);

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



  //console.log("x: ", x[0]);
});
