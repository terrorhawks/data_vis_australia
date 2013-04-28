require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    d3: '../components/d3/d3',
    topojson: '../components/topojson/topojson',
    queue: '../components/queue-async/queue'
  },
  shim: {
    d3: {
      exports: 'd3'
    },
    topojson: {
      exports: 'topojson'
    },
    queue: {
      exports: 'queue'
    }
  }
});

require(['app', 'jquery', 'd3', 'topojson', 'queue'], function (app, $) {
  'use strict';

  $(document).ready(function(){
    $(document).mousemove(function(e){
      var cpos = { top: e.pageY + 10, left: e.pageX + 10 };
      $('#besideMouse').offset(cpos);
    });
  });

  var centered;
  var width = 750, height = 750;
  var mainlandWidth = 236;
  var leftMargin = 186;
  var rightMargin = 64;

  var allAus = mainlandWidth + leftMargin + rightMargin;
  var translateWidth = width / (allAus / mainlandWidth);

  var rateById = d3.map();

  var quantize = d3.scale.quantize()
    .domain([0, 7])
    .range(d3.range(9).map(function(i) {return "q" + i + "-9"; }));

  var projection = d3.geo.albers()
    .translate([translateWidth, height / 2])
    .scale(1100)
    .rotate([-132.5, 0])
    .center([0, -26.5]) // Center of Australia, accounting for tasmania
    .parallels([-36, -18]);

  var path = d3.geo.path()
    .projection(projection);

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var g = svg.append("g");

  queue()
    .defer(d3.json, "data/austrailia_postcodes_topo.json")
    .defer(d3.csv, "data/postcode_avg_income.csv")
    .await(start);

  function start(error, geo, postcodeIncome) {
    //setup map for postcode income
    for (var i = 0; i < postcodeIncome.length; i++) {
      rateById.set('POA' + postcodeIncome[i].postcode, postcodeIncome[i].rate);
    }

    var postcodesGeo = topojson.object(geo, geo.objects.postcodesgeo).geometries;
    var seaBordersGeo = topojson.mesh(geo, geo.objects.states, function (a, b) { return a === b; });
    var stateBordersGeo = topojson.mesh(geo, geo.objects.states, function (a, b) { return a !== b; });

    g.append("path")
      .datum(seaBordersGeo)
      .attr("class", "sea-border")
      .attr("d", path);

    var feature = g.selectAll("path.feature")
      .data(postcodesGeo)
      .enter().append("path")
      .attr("class", function(d) { 
        var rate = rateById.get(d.id);
        if (rate) {
          return quantize(rate);
        } else {
          return "unknown";
        }
      })
      .attr("d", path)
      .on("click", click)
      .on("mouseover", showPostCode);

    g.append("path")
      .datum(stateBordersGeo)
      .attr("class", "state-border")
      .attr("d", path);

  };

  function showPostCode(d) {
    $('#besideMouse').text(d.id.substring(3));
  }

  function click(d) {
    var x, y, k;

    if (d && centered !== d) {
      var centroid = path.centroid(d);
      x = centroid[0];
      y = centroid[1];
      k = 50;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    g.selectAll("path")
    .classed("active", centered && function(d) { return d === centered; });
    g.transition()
    .duration(1000)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
  }
});
