require.config({
    paths: {
      jquery: '../components/jquery/jquery',
      bootstrap: 'vendor/bootstrap',
      d3: '../components/d3/d3',
      simplemap: 'vendor/simple-map-d3'
    },
    shim: {
      bootstrap: {
        deps: ['jquery'],
        exports: 'jquery'
      },
      d3: {
        exports: 'd3'
      },
      SimpleMapD3: {
        exports: 'simplemap'
      }
    }
});

require(['app', 'jquery', 'bootstrap', 'd3', 'simplemap'], function (app, $) {
    'use strict';
    var map1 = SimpleMapD3({
      container: '.map',
      datasource: 'australia_mapping.geojson',
      colorOn: true,
      colorProperty: 'id'
    });
    //var path, vis, xy;

    //xy = d3.geo.mercator().scale(1).translate([-24.994167,134.866944]);

    //path = d3.geo.path().projection(xy);

    //vis = d3.select("#vis").append("svg:svg");

    //d3.json("australia_mapping.geojson", function(json) {
        //return vis.append("svg:g")
            //.attr("class", "tracts")
            //.selectAll("path")
            //.data(json.features)
            //.enter().append("path")
            //.attr("d", path)
            //.attr("stroke", "#222")
            //.attr('stroke-width', '1')
            //.attr("fill-opacity", 0.5)
            //.attr("fill", "#85C3C0")
            //.attr("stroke", "#222");
    //});
});
