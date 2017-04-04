var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas-n').offsetWidth - m.l - m.r,
    h = document.body.clientHeight - m.t - m.b;

var title = d3.select('.title'),
    president = d3.select('.president'),
    content = d3.select('.content'),
    references = d3.select('.refereced-orders'),
    subject = d3.select('.subject');

var plotHeight = 150;
var circleY = 50;

d3.queue()
    .defer(d3.csv,'./data/Executive_Orders.csv', parseOrders)
    .await(dataloaded);

function dataloaded(err, orders){

  //Nesting the FULL data
  var presidents = d3.nest().key(function(d){return d.presNumber;}).entries(orders);

  //Get the extent of the terms
  var maxTerm = d3.max(orders, function(d){return d.term});

  //Scales
  var scaleX = d3.scaleLinear().domain([0,maxTerm]).range([m.l,w-m.r]);

  var plot = d3.select('.canvas-n');
  var termPlot = plot.selectAll('svg')
      .data(presidents)
      .enter()
      .append('svg').attr('class','background') //50
      .attr('width',w).attr('height',plotHeight)
      .append('g'); // --> an array of 50

  var circles = termPlot.selectAll('.order') //issued 50 times
      .data(function(d){return d.values})
      .enter()
      .append('circle').attr('class', (function(d){return 'A'+d.number + ' order' }))
      .attr('cx',function(d){return scaleX(d.day);})
      .attr('cy',function(d){return d.y})
      .attr('r',3);

  //set up the force simulation
  termPlot.each(function(d){
    newData = d.values;
    var simulation = d3.forceSimulation(newData)
        .force('force',d3.forceManyBody().strength(0))
        //.force('positionX',d3.forceX().x(function(d){return scaleX(d.day);}))
        .force('positionY',d3.forceY().y(plotHeight/2))
        .force('collide',d3.forceCollide(6))
        .on('tick',function(){
          console.log(this.alpha());
          circles.attr('cx',function(d){return scaleX(d.day);})
                 .attr('cy',function(d){return d.y})
                 .attr('r',3);
        })
        .on('end',function(){console.log('Force simulation stopped')});

  });

  //trigger sidebar population and highlight linked orders on click
  circles.on('click',function(d){
    //console.log(this.cx.baseVal.value);
    title.text(d.title);
    president.text(d.president);
    content.text(d.content);
    references.text(d.references);
    subject.text(d.subject);

    var linkedOrders = (d.references);
    var highlightData = function(d){
      //remove any highlights
      d3.selectAll('.order').classed('active',false);
      for(var i=0; i<d.length; i++){
        d3.select('.A'+d[i]).classed('active',true);
      };
    };

    highlightData(linkedOrders);

  });

  //  add in an axis for years, start date, etc. **
  var axisX = d3.axisBottom()
      .scale(scaleX)
      //.tickFormat() //finish this to make them dates?
      //.tickValues() //finish this to insert every year?
      .tickSize(-plotHeight);

  var axisNode = termPlot.append('g').attr('class','axis')
      .attr('transform','translate(0,' + plotHeight + ')')
  axisX(axisNode);

  };


function parseOrders(d){
	return {
		url:d.URL,
		number:d.Number,
    president:d.President,
    title:d['Short Title'],
		date:new Date(d.Date),
		content:d.Content,
    overflow:d.Overflow,
    references:(d.References).split(','),
    start:new Date(d.Start),
		end:new Date(d.End),
		party:d.Party,
    term:(new Date(d.End)) - (new Date(d.Start)),
    day:(new Date(d.Date)) - (new Date(d.Start)),
    presNumber:d.PresOrder,
    subject:(d.Subject).split(','),
    //y:(25)*Math.random()
    y:50
	}
}
