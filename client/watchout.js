var play = function () {

  var h = window.innerHeight;
  var w = window.innerWidth;

  var svg = d3.select('.board')
              .append('svg')
              .attr('width', w + 'px')
              .attr('height', h + 'px');

  // debugger;
  var playerCount = 0;
  var currentScore = 0;
  var highScore = 0;
  var collisions = 0;
  var enemyCount = 12;

  var Player = function(playerID) {
    this.id = playerID;
    // debugger;
    this.x = (w / 2);
    this.y = (h / 2);
  };

  var Enemy = function(playerID) {
    this.id = playerID;
    this.x = Math.floor(w * Math.random());
    this.y = Math.floor(h * Math.random());
    this.collisionID = null;
  };

  var heroVal = [new Player(playerCount)];
  var enemyVals = [];

  for (playerCount++; playerCount <= enemyCount; playerCount++) {
    enemyVals.push( new Enemy(playerCount) );
  }

  var drag = d3.behavior.drag()
               .on('drag', function(d, i) { 
                 d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
               });

  var heroNode = svg.selectAll('circle').data(heroVal, function(d) { return d.id; })
               .enter().append('circle')
               .attr('cx', function(d, i) { return d.x; })
               .attr('cy', function(d, i) { return d.y; })
               .attr('r', 15)
               .call(drag);
               //  .attr('xlink:href', 'asteroid.png')
               // .attr('x', function(d, i) { return d.x; })
               // .attr('y', function(d, i) { return d.y; })
               // .attr('height', '50px')
               // .attr('width', '50px')

  var nodes = svg.selectAll('circle').data(enemyVals, function(d) { return d.id; })
                .enter().append('circle')
                .attr('cx', function(d, i) { return d.x; })
                .attr('cy', function(d, i) { return d.y; })
                .attr('r', 25)
                .style('fill', 'red');

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
    // debugger;
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

    var endPos = {
      x: node.x,
      y: node.y
    };

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
  var update = function(svg, vals) {
    vals = vals.map(relocate);
    svg.selectAll('circle')
       .data(vals, function(d) { return d.id; })
       .transition().duration(1000).ease('linear')
       .tween('custom', tweenWithCollisionDetection);

    setInterval( function() {
      d3.select('.current').selectAll('span').data([currentScore++]).text( function(d) {
        return d;
      });
    }, 50);

    setTimeout( function() {
      update(svg, vals);
    }, 1000);
  };

  update(svg, enemyVals);
};

play();


//TODO:
// skin androids