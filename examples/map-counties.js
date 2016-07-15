var fs = require('fs');
var d3 = require('d3');
var topojson = require('topojson');
var topo = require('./data/va-counties.json');
var D3Node = require('./../index');

// adapted from: http://bl.ocks.org/mbostock/7061976

var markup = '<div id="container"><h2>Map of Virginia</h2>' +
  '<style>.county-border {fill: none;stroke: #fff;stroke-width: 1.01px;stroke-linejoin: round; stroke-linecap: round;}</style>'+
  '<div id="chart"></div></div>';

var options = {selector:'#chart'};
options.container = markup;

var d3n = new D3Node(options);

var width = 960,
  height = 500;

var projection = d3.geo.conicConformal()
  .parallels([38 + 02 / 60, 39 + 12 / 60])
  .rotate([78 + 30 / 60, 0])
  .scale(8000)
  .translate([0, 0]);

var path = d3.geo.path()
  .projection(projection);

var svg = d3n.d3Element.append('svg')
  .attr("width", width)
  .attr("height", height);


var state = topojson.feature(topo, topo.objects.states),
  bounds = path.bounds(state);

projection
  .translate([width / 2 - (bounds[0][0] + bounds[1][0]) / 2, height / 2 - (bounds[0][1] + bounds[1][1]) / 2]);

svg.append("path")
  .datum(state)
  .attr("class", "state")
  .attr("d", path)
  .style('fill','#ccc');

svg.append("path")
  .datum(topojson.mesh(topo, topo.objects.counties, function (a, b) {
    return a !== b;
  }))
  .attr("class", "county-border")
  .attr("d", path);

fs.writeFile('examples/map-counties.html', d3n.html(), function () {
  console.log('Done. Open "example/map-counties.html" in your browser');
});
