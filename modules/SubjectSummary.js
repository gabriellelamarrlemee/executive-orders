function SubjectSummary(){
  var m = {t:50,r:50,b:50,l:50},
      plotHeight = 100,
      w,
      h;
  var _dispatcher = d3.dispatch();


  //Beginning of the exports section
  var exports = function(selection){
    var data = selection.datum();
    w = w || selection.node().clientWidth;
    h = h || selection.node().clientHeight - m.t - m.b;

    //Nesting the data
    var presidents = d3.nest()
      .key(function(d){return +d.presNumber;})
      .sortKeys((a, b) => a - b)
      .rollup(function(d){return d.length;})
      .entries(data);


    //Get the max number of orders
    var maxOrder = d3.max(presidents, function(d){return d.value});
    var totalPresidents = presidents.length;
    console.log(w/totalPresidents);

    //Scales
    var scaleX = d3.scaleOrdinal()
        .domain(presidents.map(function(d){return d.key;}))
        .range(d3.range(10, w, w/totalPresidents));
    var scaleY = d3.scaleLinear()
        .domain([0,maxOrder])
        .range([plotHeight,0]);

    //Draw plot
    var svg = selection.selectAll('svg')
        .data([0]);
    var svgEnter = svg.enter().append('svg')
        .attr('class','plot') //50
        .attr('width',w).attr('height',plotHeight);
    var plot = svgEnter.merge(svg);
    var plotExit = svg.exit().remove();

    var bars = plot.selectAll('.bars')
        .data(presidents)
        .enter()
        .append('rect')
        .attr('class','bars')
        .attr('x',function(d,i){return i*(w/presidents.length);})
        .attr('y',function(d){return scaleY(d.value)})
        .attr('height',function(d){return plotHeight-scaleY(d.value)})
        .attr('width', w/presidents.length - 2)
        .style('fill','#0b6190');

  }

  return exports;
}
