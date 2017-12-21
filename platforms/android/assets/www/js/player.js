/**
 * Player class
 */
function Player(boardGame, type) {
  this.score = 0;
  var horseType = type;
  this.boardGame = boardGame;
  this.getType = function(){
    return horseType;
  }
}

Player.prototype.getMove = function(x1, y1, x2, y2){
  // call getMove method inside the class Board
  // update score
  var board = this.boardGame.getState();
  if(board[x1][y1] == board[x2][y2]) return;
  if(board[x2][y2] != 0) this.score += 1;
  this.score += this.boardGame.getScoreCell(x2, y2, this.getType());
  // move
  this.boardGame.getMove(x1, y1, x2, y2, this.getType());
  //print
  console.log('-----');
  this.boardGame.print();
}


/**
 * Bot class extends Player class
 */
function Bot(boardGame, type){
  // call parent's constructor method
  Player.call(this, boardGame, type);

  function checkCell(x, y){
    if(x >= 0 && x <= 7 && y >= 0 && y <= 7) return true;
    return false;
  }
  
  var tempState;
  var step = 0;
  this.ply = 3;
  this.solution = [0,0,0,0];

  this.getStep = function(){
  	return step;
  }

  var dx = [-2, -2, -1, 1, 2, 2, 1, -1];
  var dy = [-1, 1, 2, 2, 1, -1, -2, -2];
  var barrierX = [-1, 0, 1, 0];
  var barrierY = [0, 1, 0, -1];

  function print(tempState){
    for(var i = 0; i < tempState.length; i++){
    var str = i + ": ";
   for(var j = 0; j < 8; j++){
     str += tempState[i][j]+" ";
   }
   console.log(str);
   }
 }

  this.estimateSolution = function(tempState, ply, myScore, yourScore, type){
    if(type == 1) {
      var m1 = myScore;
      var n1 = yourScore;
      var h = -9999999;
      if(ply == 0) {
        h = m1-n1;
        return h;
      }
      for(var i = 0; i < tempState.length; i++){
        for(var j = 0; j < tempState[i].length; j++){
          if(tempState[i][j] == 0) continue;
          if(tempState[i][j] != 1) continue;
            for(var k = 0; k < 4; k++){
              var dbarrierX = i+barrierX[k];
              var dbarrierY = j+barrierY[k];
              // check the cell inside the board
              if(checkCell(dbarrierX, dbarrierY) && tempState[dbarrierX][dbarrierY] == 0){
                for(var m = 0; m <= 1; m++){
                  var di = i+dx[2*k+m];
                  var dj = j+dy[2*k+m];
                  tempState[i][j] = 0; // prepare move
                  if(checkCell(di, dj)) {
                    var temp = tempState[di][dj];
                    var stepScore = 0;
                    var leftTop = tempState[0][0];
                    var rightTop = tempState[0][7];
                    var leftBottom = tempState[7][0];
                    var rightBottom = tempState[7][7];
                    if(temp == 1) continue;
                    if(temp == 0){
                      tempState[di][dj] = 1;
                    };
                    if(temp != 0){
                      stepScore+=1; // plus score with 1
                      tempState[di][dj] = 1
                    };
                    if(di == 7 && dj == 3){
                      stepScore += 2;
                      tempState[0][0] = tempState[di][dj];
                      tempState[di][dj] = 0;
                    }
                    else if(di == 7 && dj == 4){
                      stepScore += 1;
                      tempState[0][7] = tempState[di][dj];
                      tempState[di][dj] = 0;
                    };
                    m1 += stepScore;
                    var v = this.estimateSolution(tempState, ply-1, m1, n1, 2);
                    if(h<v){
                      if(ply == this.ply) this.solution = [i,j,di,dj];
                      h = v;
                    };
                    tempState[di][dj] = temp;
                    m1 -= stepScore;
                    if(di == 7 && dj == 3){
                      tempState[0][0] = leftTop;
                    }
                    else if(di == 7 && dj == 4){
                      tempState[0][7] = rightTop;
                    };
                };
                tempState[i][j] = 1;
              };
            };
          };
        };
      };
      return h;
    }
    else if(type == 2){
      var m1 = myScore;
      var n1 = yourScore;
      var h = 9999999;
      if(ply == 0) {
        h = m1-n1;
        return h;
      }
      for(var i = 0; i < tempState.length; i++){
        for(var j = 0; j < tempState[i].length; j++){
          if(tempState[i][j] == 0) continue;
          if(tempState[i][j] != 2) continue;
          for(var k = 0; k < 4; k++){
            var dbarrierX = i+barrierX[k];
            var dbarrierY = j+barrierY[k];
            // check the cell inside the board
            if(checkCell(dbarrierX, dbarrierY) && tempState[dbarrierX][dbarrierY] == 0){
              for(var m = 0; m <= 1; m++){
                var di = i+dx[2*k+m];
                var dj = j+dy[2*k+m];
                tempState[i][j] = 0; // prepare move
                if(checkCell(di, dj)) {
                  var temp = tempState[di][dj];
                  var stepScore = 0;
                  var leftTop = tempState[0][0];
                  var rightTop = tempState[0][7];
                  var leftBottom = tempState[7][0];
                  var rightBottom = tempState[7][7];
                  if(temp == 2) continue;
                  if(temp == 0){
                    tempState[di][dj] = 2;
                  }
                  if(temp != 0){
                    stepScore+=1; // plus score with 1
                    tempState[di][dj] = 2;
                  };
                  if(di == 0 && dj == 3){
                    stepScore += 1;
                    tempState[7][0] = tempState[di][dj];
                    tempState[di][dj] = 0;
                  }
                  else if(di == 0 && dj == 4){
                    stepScore += 2;
                    tempState[7][7] = tempState[di][dj];
                    tempState[di][dj] = 0;
                  }
                  n1 += stepScore;
                  var v = this.estimateSolution(tempState, ply-1, m1, n1, 1);
                  h = (h>v)?v:h;
                  tempState[di][dj] = temp;
                  n1 -= stepScore;
                  if(di == 0 && dj == 3){
                    tempState[7][0] = leftBottom;
                  }
                  else if(di == 0 && dj == 4){
                    tempState[7][7] = rightBottom;
                  }
                };
                tempState[i][j] = 2;
              };
            };
          };
        };
  	  };
  	  return h;
  	};
  };
}

Player.prototype = Object.create(Player.prototype);
Player.prototype.constructor = Player;

/**
 * override getMove method of the Player class
 * parameter is score's enemy
 * 
 */
Bot.prototype.getMove = function(enemyScore){
	this.solution = [0,0,0,0];
	this.estimateSolution(this.boardGame.copyState(), this.ply, this.score, enemyScore, this.getType());
	//this.solution = [0,1,7,3];
	// call getMove method's Player class
	Player.prototype.getMove.call(this, this.solution[0], this.solution[1], this.solution[2], this.solution[3]);
	return this.solution;
}
