// start slingin' some d3 here.


var h = window.innerHeight;
var w = window.innerWidth;
var svg = d3.select('.board')
            .append('svg')
            .attr('width', w + 'px')
            .attr('height', h + 'px')
            .style('border', '1px solid red');

var heroVal = [{id: 0, x: 250, y: 250}];

var values = [{id: 1, x: 10, y: 10, collisionID: null}, 
              {id: 2, x: 20, y: 20, collisionID: null}, 
              {id: 3, x: 30, y: 30, collisionID: null}, 
              {id: 4, x: 40, y: 40, collisionID: null}];

var currentScore = 0;
var highScore = 0;
var collisions = 0;
              
var hasCollided = false;

var drag = d3.behavior.drag()
             .on('drag', function(d, i) { 
              // collision check
               d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
             });

var heroNode = svg.selectAll('circle').data(heroVal, function(d) { return d.id; })
             .enter().append('circle')
             .attr('cx', function(d, i) { return d.x; })
             .attr('cy', function(d, i) { return d.y; })
             .attr('r', 15)
             .attr('class', 'hero')
             .call(drag);

var nodes = svg.selectAll('circle').data(values, function(d) { return d.id; })
              .enter().append('circle')
              .attr('cx', function(d, i) { return d.x; })
              .attr('cy', function(d, i) { return d.y; })
              .attr('r', 25)
              .style('fill', 'red');


// initialize
// set random starting points
var onCollision = function() {
  highScore = Math.max(highScore, currentScore);
  currentScore = 0;
  d3.select('.highscore').selectAll('span').data([highScore]).text( function(d) {
    return d;
  });
  d3.select('.collisions').selectAll('span').data([collisions++]).text( function(d) {
    return d;
  });
};

var checkCollision = function(enemy, collidedCallback) {
  
  var r = parseInt(enemy.attr('r')) + parseInt(heroNode.attr('r'));
  var xDiff = Math.pow(enemy.attr('cx') - heroNode.attr('cx'), 2);
  var yDiff = Math.pow(enemy.attr('cy') - heroNode.attr('cy'), 2);
  var dist = Math.sqrt(xDiff + yDiff);

  if (!enemy.attr('collisionID') && dist < r) {
    enemy.attr('collisionID', Math.random());
    onCollision();
  } else if (dist > r) {
    enemy.attr('collisionID', null);
  }
};
 

// what if each collision generated an id? 
var tweenWithCollisionDetection = function(node) {

  var enemy = d3.select(this);
  var startPos = {
    x: parseInt(enemy.attr('cx')),
    y: parseInt(enemy.attr('cy'))
  };
  // console.log('startPos: ', startPos);
  var endPos = {
    x: node.x,
    y: node.y
  };
  // console.log('endPos: ', endPos);

  return function(t) {
    checkCollision(enemy, onCollision);

    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t,
    };

    enemy.attr('cx', enemyNextPos.x)
         .attr('cy', enemyNextPos.y);
  };
};

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
     .tween('custom', tweenWithCollisionDetection);

  setInterval( function() {
    // console.log(currentScore);
    d3.select('.current').selectAll('span').data([currentScore++]).text( function(d) {
      return d;
    });
  }, 50);
 
  setTimeout( function() {
    update(vals);
  }, 1000);
};

// update as you're dragging
// must constantly check location of enemy objects and protagonist w/in a tolerance 
// must trigger when positions coincide

  

    // set random sizes to asteroids 
// reset score





update(values);

//TODO:
// collision detection
// scoring
// skin androids
// initialize function