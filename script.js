var dispatcher = d3.dispatch('update');

d3.queue()
    .defer(d3.csv,'./data/Executive_Orders.csv', parseOrders)
    .await(dataloaded);

function dataloaded(err, orders){

  var cf = crossfilter(orders);
  var ordersBySubject = cf.dimension(function(d){return d.subject;}, true);
  var ordersByPresNumber = cf.dimension(function(d){return d.presNumber;});
  var orderData = ordersByPresNumber.top(Infinity);
  var plot = d3.select('.canvas-n');
  var linkPlot = d3.select('.canvas-links-div');

  var orderlines = OrderLines();
  plot.datum(orderData).call(orderlines);

  //Make the buttons update data
  var buttons = d3.selectAll('.btn');

  // d3.select('.labor-btn').on('click',function(){
  //   console.log(this.id);
  //   if(!d3.select(this).classed('active')){
  //     console.log('checked');ordersBySubject.filter(this.id);} else{
  //       console.log('not checked'); ordersBySubject.filter(null);};
  //   dispatcher.call('update');
  //   });

  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  // buttons.selectAll('.school-type-btn').on('click',function(){
  //   console.log(this);
  //   var type = d3.select(this).select('div')._groups[0];
  //   console.log(type[0].id);
  //   if(!d3.select(this).classed('active')){
  //     console.log('checked'); schoolsByType.filter(type[0].id);} else{
  //       console.log('not checked'); schoolsByType.filter(null);};
  //   dispatcher.call('update');
  // });

  // buttons.select('.immigration-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  // buttons.select('.science-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  //   buttons.select('.energy-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  // buttons.select('.banking-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  // buttons.select('.commerce-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  // buttons.select('.environment-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  // buttons.select('.public-health-btn').on('click',function(){
  //   ordersBySubject.filter(null);
  //   ordersBySubject.filter(this.id);
  //   console.log(this.id);
  //   dispatcher.call('update');
  //   });
  //
  //Listen to global dispatcher events
  // dispatcher.on('update',update);
  // function update(){
  //   plot.datum(ordersBySubject.top(Infinity)).call(foregroundlines);
  // };

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
