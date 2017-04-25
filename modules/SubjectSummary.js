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


    // need to plot data in a bar chart across time (time should be from first pres to last)
    // could also nest by president and count number of orders???

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

    // bars.append('rect')
    //     .attr('x',0)
    //     .attr('y',function(d){return scaleY(d.value)})
    //     .attr('width',w/totalPresidents-1)
    //     .attr('height',function(d){return plotHeight-scaleY(d.value)});
    //
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
    //
    // //Draw axis
    // var axisX = d3.axisBottom()
    //     .scale(scaleX)
    //     .tickFormat(function(d){var year = Math.floor(d/31540000000); return year;})
    //     .tickValues([0,31540000000,31540000000*2,31540000000*3,31540000000*4,31540000000*5,31540000000*6,31540000000*7,31540000000*8,31540000000*9,31540000000*10,31540000000*11,31540000000*12])
    //     .tickSizeInner(-80)
    //     .tickSizeOuter(0);
    //
    // var axisNode = plot.append('g').attr('class','axis')
    //     .attr('transform','translate(0,' + 100 + ')')
    //     .style("stroke-dasharray", ("2, 2"));
    // axisX(axisNode);

  }

  return exports;
}
