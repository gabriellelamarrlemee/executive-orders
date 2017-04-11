function OrderLines(){
  var m = {t:50,r:50,b:50,l:50},
      plotHeight = 150,
      w,
      h;
  var title = d3.select('.title'),
      president = d3.select('.president'),
      content = d3.select('.content'),
      references = d3.select('.refereced-orders'),
      subject = d3.select('.subject');
  var _dispatcher = d3.dispatch();



  //Beginning of the exports section
  var exports = function(selection){
    var data = selection.datum();
    w = w || selection.node().clientWidth - m.l - m.r;
    h = h || selection.node().clientHeight - m.t - m.b;
    //Nesting the data
    var presidents = d3.nest()
      .key(function(d){return +d.presNumber;})
      .sortKeys((a, b) => b - a)
      .entries(data);

    console.log(presidents);
    //Get the extent of the terms
    var maxTerm = d3.max(data, function(d){return d.term});
    //Scales
    var scaleX = d3.scaleLinear().domain([0,maxTerm]).range([m.l,w-m.r]);

    //Draw plots
    var svg = selection.selectAll('svg')
        .data(presidents);
    var svgEnter = svg.enter().append('svg')
        .attr('class','background') //50
        .attr('width',w).attr('height',plotHeight);
    var plot = svgEnter.merge(svg);
    var plotExit = svg.exit().remove();

    //Add president name and dates header
    plot.each(function(d){
      var formatDate = d3.timeFormat('%Y');
      var president = d.values[0].president,
          start = formatDate(d.values[0].start),
          end = formatDate(d.values[0].end),
          total = d.values.length;
      d3.select(this)
        .append('g').attr('class','president-name')
        .attr('transform','translate('+ 50 + ',' + 0 + ')')
        .append('text').text(president + ': ' + start + ' – ' + end);
      d3.select(this)
        .append('g').attr('class','total')
        .attr('transform','translate('+ (scaleX(maxTerm) + 16) + ',' + 60 + ')')
        .append('text').text(total);
    });

    //Draw order lines -- ***If the order was revoked, can the line be made shorter and grayed out?***
    var order = plot.selectAll('.order') //issued 50 times
        .data(function(d){return d.values});
    var linesEnter = order.enter().append('g').attr('class','order');
    linesEnter.append('line').attr('class',(function(d){return 'A'+d.number + ' order-line' }))
    var linesUpdate = order.merge(linesEnter).select('line')
        .attr('x1',function(d){return scaleX(d.day);})
        .attr('x2',function(d){return scaleX(d.day);})
        .attr('y1',20)
        .attr('y2',100)
        .style('stroke-width',1)
        .append('circle')
           .attr('class',(function(d){return 'A'+d.number + ' order-circle' }))
           .attr('cy',20)
           .attr('cx',function(d){return scaleX(d.day);})
           .attr('r',6);
    var linesExit = order.exit().remove();

    //Draw orders circles
    // var circles = order.append('circle')
    //    .attr('class',(function(d){return 'A'+d.number + ' order-circle' }))
    //    .attr('cy',20)
    //    .attr('cx',function(d){return scaleX(d.day);})
    //    .attr('r',6);

    // //Draw linked data ** THIS IS NOT WORKING
    // var drawLinks = function(d){
    //   var orderLink = linkPlot.selectAll('.connecting-line') //issued 50 times
    //       .data(d)
    //       .enter().append('g').style('position','absolute')
    //       .attr('transform','translate('+0+','+0+')');
    //   var lineLink = orderLink.append('line').attr('class', 'connecting-line')
    //       .attr('x1',function(d){return d.x1})
    //       .attr('x2',function(d){return d.x2})
    //       .attr('y1',function(d){return d.y1})
    //       .attr('y2',function(d){return d.y2})
    //       .style('stroke-width',1)
    //       .style('stroke','#d89af9');
    // }

    //Hover actions
    d3.selectAll('.order').on('mouseover',function(d){
      title.text(d.title);
      president.text(d.president);
      content.text(d.content);
      references.text(d.references);
      subject.text(d.subject);
      d3.select(this).selectAll('.order-line').style('stroke', '#bc4af9').style('stroke-width',3);
      d3.select(this).selectAll('.order-circle').style('visibility','visible');
      var linkedOrders = (d.references);
      var orderLocation = this.getBoundingClientRect(),
          orderY = orderLocation.top,
          orderX = orderLocation.right;

      //Create a highlight function
      if(linkedOrders != undefined){
        var highlightLinks = function(d){
          for(var i=0; i<d.length; i++){
            var link = d3.select('.A'+d[i]),
                linkIntro = link._groups[0],
                linkIntroB = linkIntro[0];
            console.log(linkIntroB)
            link.style('stroke', '#d89af9').style('stroke-width',3);
            //make a line connect the original order and the linked order
            var linkLocation = linkIntroB.getBoundingClientRect(),
                linkY = linkLocation.top,
                linkX = linkLocation.right;
            var linkData = [{
                x1:orderX,
                y1:orderY,
                x2:linkX,
                y2:linkY}];

            var linkDataSpecific = linkData[0];
            console.log(linkDataSpecific);
            //drawLinks(linkData);
            selection.append('rect').attr('width',200).attr('height',200).attr('background-color','black');
            selection.selectAll('.connecting-line')
                .data(linkDataSpecific)
                .enter()
                .append('g')
                .append('line')
                .attr('class','connecting-line')
                .attr('x1',d.x1)
                .attr('x2',d.x2)
                .attr('y1',d.y1)
                .attr('y2',d.y2)
                .style('stroke-width',2)
                .style('stroke','#d89af9');
                //.style('z-index',1);
            //maybe append a dot the the top of the new
          };
        };
      highlightLinks(linkedOrders);
    }
  });

  d3.selectAll('.order-line').on('mouseout',function(d){
    title.text('');
    president.text('');
    content.text('');
    references.text('');
    subject.text('');
    d3.selectAll('.order-line').style('stroke-width',1).style('stroke', '#3d3d3d');
    d3.selectAll('.order-circle').style('visibility','hidden');
  });

  var buttons = d3.selectAll('.btn');
  buttons.select('.labor-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.immigration-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.science-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.energy-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.banking-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.commerce-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.environment-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });
  buttons.select('.public-health-btn').on('click',function(){
    var subject = this.id,
        searchOrders = d3.selectAll('.order-line');
    searchOrders.each(function(d){
      d3.select(this).style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.2)
      if(d.subject == subject) {d3.select(this).style('stroke-width',3).style('stroke', '#d89af9').style('opacity',1);}
    });
  });

  //Draw axis
  var axisX = d3.axisBottom()
      .scale(scaleX)
      .tickFormat(function(d){var year = Math.floor(d/31540000000); return year;})
      .tickValues([0,31540000000,31540000000*2,31540000000*3,31540000000*4,31540000000*5,31540000000*6,31540000000*7,31540000000*8,31540000000*9,31540000000*10,31540000000*11,31540000000*12])
      .tickSizeInner(-80)
      .tickSizeOuter(0);

  var axisNode = plot.append('g').attr('class','axis')
      .attr('transform','translate(0,' + 100 + ')')
      .style("stroke-dasharray", ("2, 2"));
  axisX(axisNode);

  }
  return exports;
}
