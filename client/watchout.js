// start slingin' some d3 here.


var h = window.innerHeight;
var w = window.innerWidth;
var svg = d3.select('.board')
            .append('svg')
            .attr('width', w + 'px')
            .attr('height', h + 'px')
            .style('border', '1px solid red');

var heroVal = [{id: 0, x: 250, y: 250}];

var values = [{id: 1, x: 10, y: 10}, 
              {id: 2, x: 20, y: 20}, 
              {id: 3, x: 30, y: 30}, 
              {id: 4, x: 40, y: 40}];

var heroNode = svg.selectAll('circle').data(heroVal, function(d) { return d.id; })
             .enter().append('ellipse')
             .attr('cx', function(d, i) { return d.x; })
             .attr('cy', function(d, i) { return d.y; })
             .attr('rx', 15)
             .attr('ry', 25); 

var nodes = svg.selectAll('circle').data(values, function(d) { return d.id; })
              .enter().append('circle')
              .attr('cx', function(d, i) { return d.x; })
              .attr('cy', function(d, i) { return d.y; })
              .attr('r', 25);

var drag = d3.behavior.drag()
             .on('drag', function(d, i) { 
               d.x += d3.event.dx;
               d.y += d3.event.dy;
               d3.select(this).attr('transform', function(d, i) {
                 return 'translate(' + [d.x, d.y] + ')';
               });
             });
// randomize enemy placement
var relocate = function (val) {
  val.x = Math.floor(w * Math.random());
  val.y = Math.floor(h * Math.random());
  return val;
};

// step function/timeout
var update = function(vals) {
  vals = vals.map(relocate);
  svg.selectAll('circle')
     .data(vals, function(d) { return d.id; })
     .transition().duration(1000).ease('linear')
     .attr('cx', function(d, i) { return d.x; })
     .attr('cy', function(d, i) { return d.y; })
     .attr('r', 25);

  setTimeout( function() {
    update(vals);
    console.log('stepped');
    console.log(vals);
    console.log(values);
  }, 1000);
};

update(values);

heroNode.on('click', function() {
  console.log('clicked!');
});

// click handler for moving the player

// collision detection