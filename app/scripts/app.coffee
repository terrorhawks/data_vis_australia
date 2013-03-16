xy = d3.geo.mercator().scale(8500).translate([0,-1200])
path = d3.geo.path().projection(xy)

vis = d3.select("#vis").append("svg:svg").attr("width", 960).attr("height", 600)

d3.json "./australia_mapping.geojson", (json) ->
   vis.append("svg:g").attr("class", "tracts")
    .selectAll("path").data(json.features)
     .enter().append("svg:path").attr("d", path)
      .attr("fill-opacity", 0.5)
       .attr("fill", "#85C3C0")
        .attr("stroke", "#222")

