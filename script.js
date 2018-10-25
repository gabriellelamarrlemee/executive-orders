var width = document.body.clientWidth,
    height = document.body.clientHeight;

d3.select('.intro-page').style('width',width).style('height',height);
window.onscroll = function() {headerShadow()};
  function headerShadow() {
      if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
          d3.select(".header").style('box-shadow','0px 5px 8px #cccccc');
      } else {
        d3.select('.header').style('box-shadow','none')
      };
  };

d3.queue()
    .defer(d3.csv,'./data/Executive_Orders.csv', parseOrders)
    .await(dataloaded);

function dataloaded(err, orders){



  var cf = crossfilter(orders);
  var ordersBySubject = cf.dimension(function(d){return d.subject;}, true);
  var ordersByPresNumber = cf.dimension(function(d){return d.presNumber;});
  var orderData = ordersByPresNumber.top(Infinity);
  var plot = d3.select('.canvas-n');
  var headerPlot = d3.select('.canvas');
  var linkPlot = d3.select('.canvas-links-div');

  var orderlines = OrderLines();
  var smalllines = SmallLines();

  plot.datum(orderData).call(orderlines);
  headerPlot.datum(orders).call(smalllines);

  d3.select('#Intro').on('click',function(){
    d3.select('.intro-page').style('visibility','hidden').style('position','absolute');
    d3.select('.header').style('visibility','visible');
    d3.select('.container-fluid *').style('visibility','visible');
  })

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
    references:d.References?(d.References).split(','):undefined,
    start:new Date(d.Start),
		end:new Date(d.End),
		party:d.Party,
    term:(new Date(d.End)) - (new Date(d.Start)),
    day:(new Date(d.Date)) - (new Date(d.Start)),
    presNumber:+d.PresOrder,
    subject:d.Subject?(d.Subject).split(','):'undefined',
	}
}
