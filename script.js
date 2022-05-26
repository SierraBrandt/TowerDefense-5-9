  
var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d")
var enemies = []
var time = 0
var spawntime = 20
var turns = [[220, 120],[220, 420],[420, 420],[420, 120],[canvas.width+5, 120]]

setInterval(updateGame, 30)

function getDistance(x1,y1,x2,y2){
    var distance = Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
    return distance;
}

function drawTrack(){
  // Create background
  ctx.fillStyle = "green"
  ctx.fillRect(0,0, canvas.width, canvas.height)
  //Create track
  ctx.fillStyle = "brown"
  ctx.fillRect(0, 100, 200, 40)
  ctx.fillRect(200, 100, 40, 340)
  ctx.fillRect(200, 400, 200, 40)
  ctx.fillRect(400, 100, 40, 340)
  ctx.fillRect(400, 100, 200, 40)
}

function getXYSpeed(speed,startX,startY,endX,endY){
    // get distance between the two points
    var distance = getDistance(startX,startY,endX,endY);
    var xDif = endX-startX;
    var yDif = endY-startY;
    // create unit vector and multiply both components by speed of shot
    var sv = [speed*(xDif/distance),speed*(yDif/distance)];
    return sv;
}

function updateGame(){
  drawTrack()
  time += 1
  //Draw enemies
  drawEnemies()
  //Check to add more enemies
  checkAdd()
  
}

function enemy(){
  this.x = -20
  this.y = 120
  this.dx = 2
  this.dy = 0
  this.nextTurn = 0
  this.updatePosition = function(){
    this.draw()
    if(this.checkTurn()){
      //health -= 1
      return true
    }
    this.x += this.dx
    this.y += this.dy
  }
  
  this.draw = function(){
    ctx.beginPath()
    ctx.fillStyle = "blue"
    ctx.arc(this.x, this.y, 10, 0, 2*Math.PI)
    ctx.fill()
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"
    ctx.stroke()
    ctx.closePath()
  }

  this.checkTurn = function(){
    var distance = getDistance(this.x, this.y, turns[this.nextTurn][0], turns[this.nextTurn][1])
    if (distance <= 5){
      this.nextTurn++
      if (this.nextTurn == turns.length){
        return true
      }
      this.changeSpeed()
        
    }
  }
  
  this.changeSpeed = function(){
    //Changes the speed of the enemy to the correct next corner
    var newSpeed = getXYSpeed(2, this.x, this.y,turns[this.nextTurn][0],turns[this.nextTurn][1])

    this.dx = newSpeed[0]
    this.dy = newSpeed[1]
  }
  
}

function drawEnemies(){
  for(var i = enemies.length-1; i >=0; i--){
    if(enemies[i].updatePosition()){
      enemies.splice(i, 1)
    }
  }
}

function checkAdd(){
  if(time % spawntime == 0){
    enemies.push(new enemy())
  }
}