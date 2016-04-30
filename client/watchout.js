let play = () => {

  let h = window.innerHeight;
  let w = window.innerWidth;

  let svg = d3.select('.board')
              .append('svg')
              .attr('width', w + 'px')
              .attr('height', h + 'px');

  let playerCount = 0;
  let currentScore = 0;
  let highScore = 0;
  let collisions = 0;
  let enemyCount = 24;
  let colorScheme = ['red', 'yellow', 'blue', 'green'];

  let Player = function(playerID) {
    this.id = playerID;
    this.x = (w / 2);
    this.y = (h / 2);
    this.r = 15;
  };

  let Enemy = function(playerID) {
    this.id = playerID;
    this.x = Math.floor(w * Math.random());
    this.y = Math.floor(h * Math.random());
    this.collisionID = null;
    this.r = 15;
  };

  let heroVal = [new Player(playerCount)];
  let enemyVals = [];

  for (playerCount++; playerCount <= enemyCount; playerCount++) {
    enemyVals.push( new Enemy(playerCount) );
  }

  let drag = d3.behavior.drag()
               .on('drag', function(d, i) { 
                 d3.select(this).attr('cx', d3.event.x).attr('cy', d3.event.y);
               });

  let heroNode = svg.selectAll('circle').data(heroVal, d => d.id)
               .enter().append('circle')
               .attr('cx', d => d.x)
               .attr('cy', d => d.y)
               .attr('r', d => d.r)
               .style('fill', '#fff')
               .call(drag);
               // .attr('xlink:href', 'asteroid.png')
               // .attr('x', function(d, i) { return d.x; })
               // .attr('y', function(d, i) { return d.y; })
               // .attr('height', '50px')
               // .attr('width', '50px')

  let nodes = svg.selectAll('circle').data(enemyVals, d => d.id)
                .enter().append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', d => Math.max(d.r, Math.floor(Math.random() * 50)))
                .style('fill', () => colorScheme[ Math.floor(Math.random() * colorScheme.length) ]);

  let onCollision = () => {
    highScore = Math.max(highScore, currentScore);
    currentScore = 0;
    d3.select('.highscore').selectAll('span').data([highScore]).text( d => d );
    d3.select('.collisions').selectAll('span').data([collisions++]).text( d => d );
  };

  let checkCollision = (enemy, collidedCallback) => {
    let r = parseInt(enemy.attr('r')) + parseInt(heroNode.attr('r'));
    let xDiff = Math.pow(enemy.attr('cx') - heroNode.attr('cx'), 2);
    let yDiff = Math.pow(enemy.attr('cy') - heroNode.attr('cy'), 2);
    let dist = Math.sqrt(xDiff + yDiff);

    if (!enemy.attr('collisionID') && dist < r) {
      enemy.attr('collisionID', Math.random());
      onCollision();
    } else if (dist > r) {
      enemy.attr('collisionID', null);
    }
  };

  let tweenWithCollisionDetection = function(node) {
    let enemy = d3.select(this);
    let startPos = {
      x: parseInt(enemy.attr('cx')),
      y: parseInt(enemy.attr('cy'))
    };

    let endPos = {
      x: node.x,
      y: node.y
    };

    return (t) => {
      checkCollision(enemy, onCollision);

      let enemyNextPos = {
        x: startPos.x + (endPos.x - startPos.x) * t,
        y: startPos.y + (endPos.y - startPos.y) * t,
      };

      enemy.attr('cx', enemyNextPos.x)
           .attr('cy', enemyNextPos.y);
    };
  };

  // randomize enemy placement
  let relocate = val => {
    console.log(val);
    val.r = Math.max(15, Math.floor(Math.random() * 50));
    val.x = Math.min(w - val.r, Math.floor(w * Math.random()));
    val.y = Math.min(h - val.r, Math.floor(h * Math.random()));
    return val;
  };

    // step function/timeout
  let update = (svg, vals) => {
    vals = vals.map(relocate);
    svg.selectAll('circle')
       .data(vals, d => d.id)
       .transition().duration(1250).ease('back')
       .attr('r', d => d.r)
       .tween('custom', tweenWithCollisionDetection);

    setInterval( function() {
      d3.select('.current').selectAll('span').data([currentScore++]).text( d => d);
    }, 50);

    setTimeout( function() {
      update(svg, vals);
    }, 1250);
  };

  update(svg, enemyVals);
};

play();
