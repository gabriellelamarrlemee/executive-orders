function SmallLines(){
  var m = {t:50,r:50,b:50,l:50},
      plotHeight = 30,
      w,
      h;
  var title = d3.select('.title'),
      president = d3.select('.president'),
      content = d3.select('.content'),
      references = d3.select('.refereced-orders'),
      subject = d3.select('.subject');

  //Beginning of the exports section
  var exports = function(selection){
    var data = selection.datum();
    w = w || selection.node().clientWidth - m.l - m.r;
    h = h || selection.node().clientHeight - m.t - m.b;

    //Get the extent of the terms
    var firstOrder = d3.min(data, function(d){return d.date});
    var latestOrder = d3.max(data, function(d){return d.date});

    console.log(firstOrder, latestOrder);

    //Scales
    var scaleX = d3.scaleLinear().domain([firstOrder,latestOrder]).range([10,w+m.r]);

    //Draw plot
    var svg = selection.selectAll('svg')
        .data([0]);
    var svgEnter = svg.enter().append('svg')
        .attr('class','plot') //50
        .attr('width',w+m.r).attr('height',plotHeight);
    var plot = svgEnter.merge(svg);
    var plotExit = svg.exit().remove();

    //Foreground order lines
    var smallOrder = plot.selectAll('.small-order') //issued 50 times
        .data(data);
    var smallLinesEnter = smallOrder.enter().append('g').attr('class',(function(d){return 'A'+d.number + ' C'+d.url + ' D'+d.url + ' small-order'}));
    smallLinesEnter.append('line').attr('class','small-order-line')
    var smallLinesUpdate = smallOrder.merge(smallLinesEnter).select('line')
        .attr('x1',function(d){return scaleX(d.date);}).attr('x2',function(d){return scaleX(d.date);})
        .attr('y1',0).attr('y2',10)
        .style('stroke-width',1).style('stroke','#787473').style('opacity',.1);
    var smallLinesExit = smallOrder.exit().remove();

    //Draw axis
    var axisX = d3.axisBottom().scale(scaleX)
        .tickFormat(d3.timeFormat("%Y"))
        .tickSizeOuter(0);

    var axisNode = plot.append('g').attr('class','axis')
        .attr('transform','translate(0,' + 12 + ')')
        .style("stroke-weight",0);
    axisX(axisNode);

  }

  return exports;
}
