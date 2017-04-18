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

    //Background order lines
    var background = plot.selectAll('.background-order') //issued 50 times
        .data(function(d){return d.values});
    var backgroundEnter = background.enter().append('g').attr('class','background-order');
    backgroundEnter.append('line').attr('class',(function(d){return 'B'+d.number + ' background-order-line' }))
    var backgroundUpdate = background.merge(backgroundEnter).select('line')
        .attr('x1',function(d){return scaleX(d.day);}).attr('x2',function(d){return scaleX(d.day);})
        .attr('y1',35).attr('y2',100)
        .style('stroke-width',1).style('stroke','#d1d3d4');
    var backgroundExit = background.exit().remove();

    //Foreground order lines
    var order = plot.selectAll('.order') //issued 50 times
        .data(function(d){return d.values});
    var linesEnter = order.enter().append('g').attr('class','order');
    linesEnter.append('line').attr('class',(function(d){return 'A'+d.number + ' order-line' }))
    var linesUpdate = order.merge(linesEnter).select('line')
        .attr('x1',function(d){return scaleX(d.day);}).attr('x2',function(d){return scaleX(d.day);})
        .attr('y1',35).attr('y2',100)
        .style('stroke-width',1).style('stroke','#3d3d3d').style('opacity',.5);

    linesEnter.append('circle')
           .attr('class',(function(d){return 'A'+d.number + ' order-circle' }))
           .attr('cy',20)
           .attr('cx',function(d){return scaleX(d.day);})
           .attr('r',4);

    var linesExit = order.exit().remove();

    var isClicked = false;

    //Hover actions
    d3.selectAll('.order').on('mouseover',function(d){
      title.text(d.title);
      president.text(d.president);
      content.text(d.content);
      references.text(d.references);
      subject.text(d.subject);
      if(!isClicked){
        d3.selectAll('.order-line').style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.5).attr('y1',35);
        d3.select(this).selectAll('.order-line').style('stroke', '#f04c23').style('opacity',1).style('stroke-width',3).transition().attr('y1',20);
        var linkedOrders = (d.references);

        //Create a highlight function
        if(linkedOrders != undefined){
          var highlightLinks = function(d){
            for(var i=0; i<d.length; i++){
              var link = d3.select('.A'+d[i]);
              link.style('stroke', '#a9b35a').style('stroke-width',3).style('opacity',1).transition().attr('y1',20);
            };
          };
        highlightLinks(linkedOrders);
        }
      }
    });

    //Click actions
    d3.selectAll('.order').on('click',function(d){
      isClicked = !isClicked;
      title.text(d.title);
      president.text(d.president);
      content.text(d.content);
      references.text(d.references);
      subject.text(d.subject);
      d3.select(this).selectAll('.order-line').style('stroke', '#f04c23').style('opacity',1).style('stroke-width',3).transition().attr('y1',20);
      d3.selectAll('.order-circle').style('visibility','hidden');
      d3.select(this).selectAll('.order-circle').style('visibility','visible').style('stroke-width',3).style('stroke', '#f04c23');
      var linkedOrders = (d.references);

      //Create a highlight function
      if(linkedOrders != undefined){
        var highlightLinks = function(d){
          for(var i=0; i<d.length; i++){
            var link = d3.selectAll('.A'+d[i]);
            link.style('stroke', '#a9b35a').style('stroke-width',3).style('visibility','visible').transition().attr('y1',20);
            //link.select('.order-circle').style('visibility','visible');
            // console.log(this);
            // d3.select(this).selectAll('.order-circle').style('visibility','visible');
          };
        };
      highlightLinks(linkedOrders);
      }
    });

    d3.selectAll('.order-line').on('mouseout',function(d){
      if(!isClicked){
        title.text('');
        president.text('');
        content.text('');
        references.text('');
        subject.text('');
        d3.selectAll('.order-line').style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.5).transition().attr('y1',35);
        d3.selectAll('.order-circle').style('visibility','hidden');
      }
    });

    // Button interaction
    d3.selectAll('.btn').on('click',function(){
      var subject = this.id,
          searchOrders = d3.selectAll('.order-line'),
          count = 0;
      //console.log(subject);
      if(!d3.select(this).classed('active')){
        searchOrders.each(function(d){
          d3.select(this).style('visibility','hidden');
          if(d.subject == subject) {
            d3.select(this).style('visibility','visible');
            count = count + 1;
            console.log(count);
          }
        });
      } else{ searchOrders.style('visibility','visible'); };
      console.log('final count '+count);
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
