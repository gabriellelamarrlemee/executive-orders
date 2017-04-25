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
  // var _dispatcher = d3.dispatch();

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
        // .tickValues([1830,1850,1870]);
        // .tickSizeInner(-80)
        .tickSizeOuter(0);

    var axisNode = plot.append('g').attr('class','axis')
        .attr('transform','translate(0,' + 12 + ')')
        .style("stroke-weight",0);
    axisX(axisNode);


    // var isClicked = false;
    // var orderSelect = d3.selectAll('.order');
    // var orderSelectAll = d3.selectAll('.order, .order *');
    //
    // //Hover actions
    // orderSelect.on('mouseover',function(d){
    //   title.text(d.title);
    //   president.text(d.president);
    //   content.text(d.content);
    //   references.text(d.references);
    //   subject.text(d.subject);
    //   d3.select(this).style('cursor','pointer');
    //   d3.select(this).selectAll('.order-circle')
    //     .style('fill','#3d3d3d');
    //   if(!isClicked){
    //     d3.selectAll('.order-line')
    //       .style('stroke-width',1)
    //       .style('stroke', '#3d3d3d')
    //       .style('opacity',.5)
    //       .attr('y1',35);
    //     d3.select(this).selectAll('.order-line')
    //       .style('stroke', '#22bfd2')
    //       .style('opacity',1)
    //       .style('stroke-width',3)
    //       .style('visibility','visible')
    //       .transition().attr('y1',20);
    //     var linkedOrders = (d.references);
    //
    //     //Create a highlight function
    //     if(linkedOrders != undefined){
    //       var highlightLinks = function(d){
    //         for(var i=0; i<d.length; i++){
    //           var link = d3.select('.A'+d[i]);
    //           link.style('stroke', '#ccdc29')
    //               .style('stroke-width',3)
    //               .style('opacity',1)
    //               .style('visibility','visibility')
    //               .transition().attr('y1',20);
    //         };
    //       };
    //     highlightLinks(linkedOrders);
    //     }
    //   }
    // });
    //
    // //Click actions
    // orderSelect.on('click',function(d){
    //   isClicked = !isClicked;
    //   title.text(d.title);
    //   president.text(d.president);
    //   content.text(d.content);
    //   references.text(d.references);
    //   subject.text(d.subject);
    //   d3.selectAll('.order-line')
    //     .style('visibility','hidden');
    //   d3.select(this).selectAll('.order-line')
    //     .style('stroke', '#22bfd2')
    //     .style('opacity',1)
    //     .style('stroke-width',3)
    //     .transition().attr('y1',20)
    //     .style('visibility','visible');
    //   d3.selectAll('.order-circle')
    //     .style('visibility','hidden');
    //   d3.select(this).selectAll('.order-circle')
    //     .style('visibility','visible')
    //     .style('stroke-width',3)
    //     .style('stroke', '#22bfd2');
    //   var linkedOrders = (d.references);
    //
    //   //Create a highlight function
    //   if(linkedOrders != undefined){
    //     var highlightLinks = function(d){
    //       for(var i=0; i<d.length; i++){
    //         var link = d3.selectAll('.A'+d[i]);
    //         link.style('stroke', '#ccdc29')
    //             .style('stroke-width',3)
    //             .style('visibility','visible')
    //             .transition().attr('y1',20);
    //         //link.select('.order-circle').style('visibility','visible');
    //         // console.log(this);
    //         // d3.select(this).selectAll('.order-circle').style('visibility','visible');
    //       };
    //     };
    //   highlightLinks(linkedOrders);
    //   }
    // });
    //
    // orderSelect.on('mouseout',function(d){
    //   d3.selectAll('.order-circle')
    //     .style('fill','#e8e8e8');
    //   if(!isClicked){
    //     title.text('');
    //     president.text('');
    //     content.text('');
    //     references.text('');
    //     subject.text('');
    //     d3.selectAll('.order-line')
    //       .style('stroke-width',1)
    //       .style('stroke', '#3d3d3d')
    //       .style('opacity',.5)
    //       .style('visibility','visible')
    //       .transition().attr('y1',35);
    //     d3.selectAll('.order-circle')
    //       .style('visibility','hidden');
    //   }
    // });
    //
    // function equalToEventTarget(){
    //   return this == d3.event.target;
    // }
    //
    // d3.select('body').on('click',function(){
    //   var outside = orderSelectAll.filter(equalToEventTarget).empty();
    //   if(outside){
    //     d3.selectAll('.order-circle').style('fill','#e8e8e8');
    //     title.text('');
    //     president.text('');
    //     content.text('');
    //     references.text('');
    //     subject.text('');
    //     d3.selectAll('.order-line')
    //       .style('stroke-width',1)
    //       .style('stroke', '#3d3d3d')
    //       .style('opacity',.5)
    //       .transition().style('visibility','visible')
    //       .transition().attr('y1',35);
    //     d3.selectAll('.order-circle')
    //       .transition().style('visibility','hidden');
    //   }
    // });
    //
    //
    // // Button interaction
    // d3.selectAll('.btn').on('click',function(){
    //   var subject = this.id,
    //       searchOrders = d3.selectAll('.order-line'),
    //       count = 0;
    //   //console.log(subject);
    //   if(!d3.select(this).classed('active')){
    //     searchOrders.each(function(d){
    //       d3.select(this).style('visibility','hidden');
    //       if(d.subject == subject) {
    //         d3.select(this).style('visibility','visible');
    //         count = count + 1;
    //         console.log(count);
    //       }
    //     });
    //   } else{ searchOrders.style('visibility','visible'); };
    //   console.log('final count '+count);
    //   });
    //

  }

  return exports;
}
