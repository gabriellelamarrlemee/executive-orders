function OrderLines(){
  var m = {t:50,r:50,b:50,l:50},
      plotHeight = 150,
      w,
      h;
  var title = d3.select('.title'),
      president = d3.select('.president'),
      content = d3.select('.content'),
      references = d3.select('.refereced-orders'),
      subject = d3.select('.subject'),
      url = d3.select('.url'),
      subjectOrders = d3.select('.total-subject-orders');
  // var _dispatcher = d3.dispatch();
  var dispatcher = d3.dispatch('update');


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
    var scaleX = d3.scaleLinear().domain([0,maxTerm]).range([m.l,w-60]);

    //Draw plots
    var svg = selection.selectAll('svg').data(presidents);
    var svgEnter = svg.enter().append('svg').attr('class','background').attr('width',w).attr('height',plotHeight);
    var plot = svgEnter.merge(svg);
    var plotExit = svg.exit().remove();

    //Add president name and dates header
    plot.each(function(d){
      var formatDate = d3.timeFormat('%Y');
      var president = d.values[0].president,
          start = formatDate(d.values[0].start),
          end = formatDate(d.values[0].end),
          total = d.values.length;
      d3.select(this).append('g').attr('class','president-name')
        .attr('transform','translate('+ 50 + ',' + 0 + ')')
        .append('text').text(president + ': ' + start + ' – ' + end);
      d3.select(this).append('g').attr('class','total')
        .attr('transform','translate('+ (scaleX(maxTerm) + 6) + ',' + 60 + ')')
        .append('text').html(total+'<br/>'+' total');
    });

    //Background order lines
    var background = plot.selectAll('.background-order') //issued 50 times
        .data(function(d){return d.values});
    var backgroundEnter = background.enter().append('g').attr('class','background-order');
    backgroundEnter.append('line').attr('class',(function(d){return 'B'+d.number + ' background-order-line' }))
    var backgroundUpdate = background.merge(backgroundEnter).select('line')
        .attr('x1',function(d){return scaleX(d.day);}).attr('x2',function(d){return scaleX(d.day);})
        .attr('y1',30).attr('y2',100)
        .style('stroke-width',1).style('stroke','#d1d3d4');
    var backgroundExit = background.exit().remove();

    //Foreground order lines
    var order = plot.selectAll('.order') //issued 50 times
        .data(function(d){return d.values});
    var linesEnter = order.enter().append('g').attr('class',(function(d){return 'A'+d.number + ' C'+d.url + ' order' }));
    linesEnter.append('line').attr('class','order-line')
    var linesUpdate = order.merge(linesEnter).select('line')
        .attr('x1',function(d){return scaleX(d.day);}).attr('x2',function(d){return scaleX(d.day);})
        .attr('y1',30).attr('y2',100)
        .style('stroke-width',1).style('stroke','#3d3d3d').style('opacity',.5);
    linesEnter.append('circle')
           .attr('class','order-circle')
           .attr('cy',20)
           .attr('cx',function(d){return scaleX(d.day);})
           .attr('r',4)
           .style('fill','#e8e8e8');
    var linesExit = order.exit().remove();

    //Subject order lines
    var subjectOrder = plot.selectAll('.subject-order') //issued 50 times
        .data(function(d){return d.values});
    var subjectOrderEnter = subjectOrder.enter().append('g').attr('class',(function(d){return 'C'+d.number + ' D'+d.url + ' subject-order' }));
    subjectOrderEnter.append('line').attr('class','subject-order-line')
    var subjectOrderUpdate = subjectOrder.merge(subjectOrderEnter).select('line')
        .attr('x1',function(d){return scaleX(d.day);}).attr('x2',function(d){return scaleX(d.day);})
        .attr('y1',30).attr('y2',100)
        .style('stroke-width',1).style('stroke','#3d3d3d').style('opacity',.5).style('visibility','hidden');
    subjectOrderEnter.append('circle')
           .attr('class','subject-order-circle')
           .attr('cy',20)
           .attr('cx',function(d){return scaleX(d.day);})
           .attr('r',4)
           .style('fill','#e8e8e8');
    var subjectOrderExit = subjectOrder.exit().remove();


    var OrderIsClicked = false;
    // var btnIsClicked = false;
    var orderSelect = d3.selectAll('.order');
    var orderSelectAll = d3.selectAll('.order, .order *');
    var btnSelectAll = d3.selectAll('.btn, .btn *');
    var subjectOrderSelectAll = d3.selectAll('.subject-order, .subject-order *');





    // FOREGROUND LINE HOVER AND CLICK EVENTS

    //Hover actions
    orderSelect.on('mouseover',function(d){
      title.text(d.title);
      president.text(d.president);
      content.text(d.content);
      references.text(d.references);
      subject.text(d.subject);
      d3.select(this).style('cursor','pointer');
      d3.selectAll('.order-circle').style('fill','#e8e8e8');
      d3.select(this).selectAll('.order-circle').style('fill','#3d3d3d');
      var hoveredOrder = d3.selectAll('.C'+d.url);
      var linkedOrders = (d.references);
      if(!OrderIsClicked){
        d3.selectAll('.order-line').style('stroke-width',1).style('stroke', '#3d3d3d').style('opacity',.5).attr('y1',30);
        hoveredOrder.selectAll('.order-line').style('stroke', '#22bfd2').style('opacity',1).style('stroke-width',3)
          .style('visibility','visible').transition().attr('y1',20);
        hoveredOrder.selectAll('.small-order-line').style('stroke', '#22bfd2').style('opacity',1).style('stroke-width',3);

        //Create a highlight function
        if(linkedOrders != undefined){
          var highlightLinks = function(d){
            for(var i=0; i<d.length; i++){
              var link = d3.selectAll('.A'+d[i]);
              link.selectAll('.order-line').style('stroke', '#ccdc29').style('stroke-width',2)
                  .style('opacity',1).style('visibility','visibility').transition().attr('y1',20);
              link.selectAll('.small-order-line').style('stroke', '#ccdc29').style('opacity',1).style('stroke-width',3);
            };
          }; highlightLinks(linkedOrders);
        }
      }
    });

    //Click actions
    orderSelect.on('click',function(d){
      OrderIsClicked = !OrderIsClicked;
      title.text(d.title);
      president.text(d.president);
      content.text(d.content);
      references.text(d.references);
      subject.text(d.subject);
      url.text(d.url);
      var hoveredOrder = d3.selectAll('.C'+d.url);
      d3.selectAll('.order-line').style('visibility','hidden');
      d3.select(this).selectAll('.order-line').style('stroke', '#22bfd2').style('opacity',1).style('stroke-width',3)
        .style('visibility','visible').transition().attr('y1',20);
      d3.selectAll('.order-circle').style('visibility','hidden');
      d3.select(this).selectAll('.order-circle').style('visibility','visible').style('stroke-width',3).style('stroke', '#22bfd2');
      hoveredOrder.selectAll('.small-order-line').style('stroke', '#22bfd2').style('opacity',1).style('stroke-width',3);
      var linkedOrders = (d.references);

      //Create a highlight function
      if(linkedOrders != undefined){
        var highlightLinks = function(d){
          for(var i=0; i<d.length; i++){
            var link = d3.selectAll('.A'+d[i]);
            link.selectAll('.order-line').style('stroke', '#ccdc29').style('opacity',1).style('stroke-width',3)
                .style('visibility','visible').transition().attr('y1',20);
            link.selectAll('.order-circle').style('stroke', '#ccdc29').style('stroke-width',3)
                .style('visibility','visible');
            link.selectAll('.small-order-line').style('stroke', '#ccdc29').style('opacity',1).style('stroke-width',3);
          };
        };
      highlightLinks(linkedOrders);
      }
    });

    orderSelect.on('mouseout',function(d){
      if(!OrderIsClicked){
        title.text('');
        president.text('');
        content.text('');
        references.text('');
        subject.text('');
        url.text('');
        d3.selectAll('.order-line').style('stroke-width',1).style('stroke', '#3d3d3d')
          .style('opacity',.5).style('visibility','visible').transition().attr('y1',30);
        d3.selectAll('.order-circle').style('visibility','hidden');
        d3.selectAll('.small-order-line').style('stroke-width',1).style('stroke', '#787473').style('opacity',.1);
      }
    });


    // BACKGROUND CLICK EVENTS

    function equalToEventTarget(){
      return this == d3.event.target;
    }

    d3.select('body').on('click',function(){
      var outside = orderSelectAll.filter(equalToEventTarget).empty() && btnSelectAll.filter(equalToEventTarget).empty() && subjectOrderSelectAll.filter(equalToEventTarget).empty();
      if(outside){
        d3.selectAll('.order-circle').style('fill','#e8e8e8');
        title.text('');
        president.text('');
        content.text('');
        references.text('');
        subject.text('');
        url.text('');
        d3.selectAll('.order-line')
          .style('stroke-width',1)
          .style('stroke', '#3d3d3d')
          .style('opacity',.5)
          .transition().style('visibility','visible')
          .transition().attr('y1',30);
        d3.selectAll('.order-circle')
          .transition().style('visibility','hidden');
      }
    });




    // BUTTON CLICK EVENTS - make the top lines visible

    d3.selectAll('.subject-btn').on('click',function(){
      var subject = this.id,
          searchOrders = d3.selectAll('.subject-order, .small-order'),
          count = 0,
          subjectData = [];
      subjectOrders.text('');
      d3.selectAll('.small-order-line').style('stroke', '#787473').style('stroke-width',1).style('opacity',.1).style('visibility','visible');
      if(!d3.select(this).classed('active')){
        d3.selectAll('.order-line').style('visibility','hidden');
        searchOrders.each(function(d){
          if(d.subject == subject) {
            subjectData.push(d);
            d3.select(this).select('line').style('stroke', '#0b6190').style('stroke-width',2).style('opacity',1).style('visibility','visible');
            count = count + 1;
          }
        });

        //Hover actions
        searchOrders.on('mouseover',function(d){
          console.log('mouseover');
          title.text(d.title);
          president.text(d.president);
          content.text(d.content);
          references.text(d.references);
          // subject.text(d.subject); -- this isn't working. fix later
          d3.select(this).style('cursor','pointer');
          d3.selectAll('.subject-order-circle').style('fill','#e8e8e8');
          d3.select(this).selectAll('.subject-order-circle').style('fill','#3d3d3d');
          var hoveredOrder = d3.selectAll('.D'+d.url);
          var linkedOrders = (d.references);
          if(!OrderIsClicked){
            d3.selectAll('.subject-order-line').style('stroke-width',2).style('stroke', '#0b6190').attr('y1',30);
            hoveredOrder.selectAll('.subject-order-line').style('stroke', '#22bfd2').style('stroke-width',3).transition().attr('y1',20);
            hoveredOrder.selectAll('.small-order-line').style('stroke', '#22bfd2').style('opacity',1).style('stroke-width',3);

            //Create a highlight function
            if(linkedOrders != undefined){
              var highlightLinks = function(d){
                for(var i=0; i<d.length; i++){
                  var link = d3.selectAll('.C'+d[i]);
                  link.each(function(d){
                    if(d.subject == subject){
                      link.selectAll('.subject-order-line').style('stroke', '#ccdc29').style('stroke-width',2).transition().attr('y1',20);
                      link.selectAll('.small-order-line').style('stroke', '#ccdc29').style('opacity',1).style('stroke-width',3);
                    }
                  });
              };}; highlightLinks(linkedOrders);
            }
          }
        });

        //Click actions
        searchOrders.on('click',function(d){
          console.log('click');
          OrderIsClicked = !OrderIsClicked;
          title.text(d.title);
          president.text(d.president);
          content.text(d.content);
          references.text(d.references);
          // subject.text(d.subject);
          d3.selectAll('.subject-order-line').style('visibility','hidden');
          d3.select(this).selectAll('.subject-order-line').style('stroke', '#22bfd2').style('stroke-width',3).style('visibility','visible').transition().attr('y1',20);
          d3.selectAll('.subject-order-circle').style('visibility','hidden');
          d3.select(this).selectAll('.subject-order-circle').style('visibility','visible').style('stroke-width',3).style('stroke', '#22bfd2');
          var linkedOrders = (d.references);

          //Create a highlight function
          if(linkedOrders != undefined){
            var highlightLinks = function(d){
              for(var i=0; i<d.length; i++){
                var link = d3.selectAll('.C'+d[i]);
                link.each(function(d){
                  if(d.subject == subject){
                    link.selectAll('.subject-order-line').style('stroke', '#ccdc29').style('stroke-width',2).style('visibility','visible').transition().attr('y1',20);
                    link.selectAll('.subject-order-circle').style('stroke', '#ccdc29').style('stroke-width',3).style('visibility','visible');
                  }
                });
              };
            };
          highlightLinks(linkedOrders);
          }
        });

        //Mouseout actions
        searchOrders.on('mouseout',function(d){
          console.log('mouseout');
          if(!OrderIsClicked){
            title.text('');
            president.text('');
            content.text('');
            references.text('');
            // subject.text('');
            searchOrders.selectAll('.subject-order-line').style('visibility','hidden');
            d3.selectAll('.subject-order-circle').style('visibility','hidden');
            searchOrders.each(function(d){
              if(d.subject == subject) {
                d3.select(this).select('.subject-order-line').style('stroke', '#0b6190').style('stroke-width',2).style('opacity',1).style('visibility','visible').transition().attr('y1',30);
                d3.select(this).select('.small-order-line').style('stroke', '#0b6190').style('stroke-width',2).style('opacity',1).style('visibility','visible');
              }
            });
          }
        });

        var sidebarPlot = d3.select('.canvas-s');
        var summary = SubjectSummary();
        //Send only matching data to the sidebar plot
        // sidebarPlot.datum(subjectData).call(summary);
        subjectOrders.text('Total '+subject+' orders: '+count/2);

      } else{
        d3.selectAll('.order-line').style('visibility','visible');
        searchOrders.selectAll('.subject-order-line').style('visibility','hidden');
      };

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
