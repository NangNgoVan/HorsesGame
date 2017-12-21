function Board() {
  var board;
  var blackKnight;
  var whiteKnight;
  var horses = [[0,0,1], [0,1,1], [0,2,1], [0,5,1], [0,6,1], [0,7,1],
                [7,0,2], [7,1,2], [7,2,2], [7,5,2], [7,6,2], [7,7,2]];
  function init() {
    board = new Array(8);
    for(var i = 0; i < board.length; i++){
      board[i] = new Array(8);
      for(var j = 0; j < board[i].length; j++){
        board[i][j] = 0;
      }
    };
    for(var i = 0; i < horses.length; i++){
  	  board[horses[i][0]][horses[i][1]] = horses[i][2];
    }
  }
  // constructor
  init();
  //
  this.getHorses = function(){
  	return horses;
  }

  // get current state
  this.getState = function(){
  	return board;
  };
  // set state
  this.setState = function(newState){
  	board = newState;
  }
  // reset board
  this.reset = function(){
  	init();
  };
  // move
  this.getMove = function(x1, y1, x2, y2, type){
    if(board[x1][y1] == 0 || !insideBoard(x1, y1)) return;
    if(!insideBoard(x2, y2)) return;
    if(board[x2][y2] == board[x1][y1]) return;
    if(type == 1){
      if(x2==7&&y2==3){x2=0;y2=0};
      if(x2==7&&y2==4){x2=0;y2=7};
    }
    else if(type == 2){
      if(x2==0&&y2==3){x2=7;y2=0};
      if(x2==0&&y2==4){x2=7;y2=7};
    }
    board[x2][y2] = board[x1][y1];
    board[x1][y1] = 0;
  }
  // check cell inside board
  function insideBoard(x, y){
    if(x >= 0 && x <= 7 && y >= 0 && y <= 7) return true;
    return false;
  }
  // get score cell
  this.getScoreCell = function(x, y, type){
    if(type == 1){
      if(x==7 && y==3) return 2;
      if(x==7 && y==4) return 1;
    }
    else if(type == 2){
      if(x==0 && y==3) return 1;
      if(x==0 && y==4) return 2;
    }
    return 0;
  }
  // copy state method
  this.copyState = function(){
    var arr = new Array(8);
    for(var i = 0; i < arr.length; i++){
      arr[i] = new Array(8);
      for(var j = 0; j < arr[i].length; j++){
        arr[i][j] = board[i][j];
      }
    }
    return arr;
  }

  function checkCell(x, y){
    if(x >= 0 && x <= 7 && y >= 0 && y <= 7) return true;
    return false;
  }
  // get moves legal from board[x][y]
  var dx = [-2, -2, -1, 1, 2, 2, 1, -1];
  var dy = [-1, 1, 2, 2, 1, -1, -2, -2];
  var barrierX = [-1, 0, 1, 0];
  var barrierY = [0, 1, 0, -1];
  this.getMoves = function(x, y){
  	var moves = [];
    for(var i = 0; i<= 4; i++){
      var dxi = x+barrierX[i];
      var dyi = y+barrierY[i];
      if(checkCell(dxi,dyi) && board[dxi][dyi] == 0){
        for(var m=0; m<=1; m++){
          var dxm = x+dx[2*i+m];
          var dym = y+dy[2*i+m];
          if(checkCell(dxm,dym) && board[dxm][dym] != board[x][y])
            moves.push([dxm, dym]);
        }
      }
    }
    return moves;
  }
}

Board.prototype.print = function() {
  var board = this.getState();
  for(var i = 0; i < board.length; i++){
    var str = i + ": ";
    for(var j = 0; j < 8; j++){
      str += board[i][j]+" ";
    }
    console.log(str);
  }
}
