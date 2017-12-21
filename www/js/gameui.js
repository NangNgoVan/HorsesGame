var BoardUI = function(gameCtx, board, options){
  var bmd = gameCtx.add.bitmapData(options.size, options.size);
  var cellSize = options.size / 8;
  for(var i = 0; i < board.length; i++){
  	for(var j = 0; j < board[i].length; j++){
  	  if((i+j)%2 == 0) bmd.ctx.fillStyle = "#E3F2FD";
  	  else bmd.ctx.fillStyle = '#2979FF';
  	  bmd.ctx.fillRect(i*cellSize, j*cellSize, cellSize, cellSize);
  	}
  }
  return bmd;
}

var gameManager = new GameManager();

var horses;

var gameUI = new Phaser.Game(screen.width,  screen.height, Phaser.AUTO, 'game-area');

var mainState = {
  preload: function(){
    gameUI.load.image('BlackKnight', 'img/BlackKnight.png');
    gameUI.load.image('WhiteKnight', 'img/WhiteKnight.png');
  },
  create: function(){
  	gameUI.physics.startSystem(Phaser.Physics.ARCADE);
    gameUI.stage.backgroundColor = '#C5CAE9';
    this.boardSize = screen.width;
    this.cellSize = this.boardSize / 8;
    this.boardPosition = {y:(screen.height - screen.width)/2, x:0};
    var boardUI = BoardUI(gameUI, gameManager.boardGame.getState(), {size:this.boardSize});
    
    var title = gameUI.add.text(0,0,'Cờ điểm',{ font: 'bold 32px Arial', fill: '#000',
      boundsAlignH: 'center', boundsAlignV:'middle'});
    title.setTextBounds(0,0,screen.width,100);

    this.scoreBar = gameUI.add.text(0,0,'0-0',{ font: 'bold 32px Arial', fill: '#000',
      boundsAlignH: 'center', boundsAlignV:'middle'});
    this.scoreBar.setTextBounds(0,this.boardPosition.y-80,screen.width,100);

    this.board = gameUI.add.sprite(this.boardPosition.x,this.boardPosition.y, boardUI);
    
    var h = gameManager.boardGame.getHorses();
    this.horses = new Array(h.length);

    for(var i = 0; i < h.length; i++){
      var x = this.boardPosition.x+h[i][1]*this.cellSize+this.cellSize/2;
      var y = this.boardPosition.y+h[i][0]*this.cellSize+this.cellSize/2;
      if(h[i][2] == 1){
        this.horses[i] = new Horse(gameUI, x, y, 'BlackKnight', 1);
      }
      else if(h[i][2] == 2){
      	this.horses[i] = new Horse(gameUI, x, y, 'WhiteKnight', 2);
      }
      this.horses[i].scale.setTo(0.35*this.boardSize/400, 0.35*this.boardSize/400);
      gameUI.physics.arcade.enable(this.horses[i], Phaser.Physics.ARCADE);
    }
    // game handle
    this.player = gameManager.player;
    this.bot = gameManager.bot;
    this.turn = this.player;

    var ctx = this;
    this.currentHorse = null;
    this.currentCell = {x:-1,y:-1};
    gameUI.input.onDown.add(function(e){
      if(ctx.turn != ctx.player) return;
      ctx.currentCell = ctx.touchOnBoard(e.position.x,e.position.y);
      if(ctx.currentCell.x == -1 && ctx.currentCell.y == -1)return;
      if(gameManager.boardGame.getState()[ctx.currentCell.y][ctx.currentCell.x] == ctx.player.getType()){
      	ctx.currentHorse = ctx.getHorse(ctx.currentCell);
      	console.log(ctx.currentCell);
      	console.log(ctx.currentHorse);
      	return;
      }
      else {
      	if(ctx.currentHorse != null){
      	  var currentHorseCell = ctx.getCell(ctx.currentHorse);
      	  var moves = gameManager.boardGame.getMoves(currentHorseCell.y, currentHorseCell.x);
          var flag = false;
          for(var i = 0; i < moves.length; i++){
          	if(ctx.currentCell.y == moves[i][0] && ctx.currentCell.x == moves[i][1]) flag = true;
          }
          if(flag == false) return;
      	  var c = ctx.getCell(ctx.currentHorse);
      	  ctx.player.getMove(c.y,c.x,ctx.currentCell.y,ctx.currentCell.x);
          
      	  var destCell = {x: ctx.boardPosition.x+ctx.currentCell.x*ctx.cellSize+ctx.cellSize/2,
      	    y: ctx.boardPosition.y+ctx.currentCell.y*ctx.cellSize+ctx.cellSize/2}
          var move = gameUI.add.tween(ctx.currentHorse).to(destCell,
      	  	1000, Phaser.Easing.Circular.Out).start();
      	 
      	  move.onComplete.add(function(){
      	  	if(ctx.currentCell.y==0 && ctx.currentCell.x==3){
      	  	  ctx.currentCell = {x:0,y:7};
      	  	  var destCell = {x: ctx.boardPosition.x+ctx.cellSize/2,
      	  	  	y: ctx.boardPosition.y+7*ctx.cellSize+ctx.cellSize/2};
      	  	  var moveToConer = gameUI.add.tween(ctx.currentHorse).to({x:destCell.x,y:destCell.y},
      	  	  	1000,Phaser.Easing.Circular.Out).start();
      	  	  moveToConer.onComplete.add(function(){
                ctx.turn = ctx.bot;
      	  	    ctx.currentHorse = null;
      	  	    ctx.currentCell = {x:-1,y:-1};
      	  	    ctx.botMove();
      	  	  });
      	  	} else if(ctx.currentCell.y==0 && ctx.currentCell.x==4){
      	  	  ctx.currentCell = {x:7,y:7};
      	  	  var destCell = {x: ctx.boardPosition.x+7*ctx.cellSize+ctx.cellSize/2,
      	  	  	y: ctx.boardPosition.y+7*ctx.cellSize+ctx.cellSize/2}
      	  	  var moveToConer = gameUI.add.tween(ctx.currentHorse).to({x:destCell.x,y:destCell.y},
      	  	  	1000,Phaser.Easing.Circular.Out).start();
      	  	  moveToConer.onComplete.add(function(){
                ctx.turn = ctx.bot;
      	  	    ctx.currentHorse = null;
      	  	    ctx.currentCell = {x:-1,y:-1};
      	  	    ctx.botMove();
      	  	  });
      	  	} else {
      	      ctx.turn = ctx.bot;
      	  	  ctx.currentHorse = null;
      	  	  ctx.currentCell = {x:-1,y:-1};
      	  	  ctx.botMove();
      	  	};
      	  });
      	}
      }
    });
  },
  update: function(){
  	this.scoreBar.setText(this.player.score+'-'+this.bot.score);
  	for(var i = 0; i < this.horses.length; i++){
  	  if(this.horses[i] === this.currentHorse){
  	  	continue;
  	  }
  	  gameUI.physics.arcade.collide(this.currentHorse, this.horses[i], function(h1,h2){
  	  	var temp = this.getCell(h2);
  	  	if(temp.x == this.currentCell.x && temp.y == this.currentCell.y){
  	  	  this.horses.splice(i,1);
  	  	  h2.destroy();
  	  	}
  	  },null,this);
  	}
  },
  touchOnBoard: function(x1,y1){
    var hx = x1-this.boardPosition.x;
  	var hy = y1-this.boardPosition.y;
  	if(hx >= 0 && hx <= this.boardSize && hy >= 0 && hy <= this.boardSize){
  		return {x:Math.floor(hx/this.cellSize), y:Math.floor(hy/this.cellSize)};
  	}
  	return {x:-1,y:-1};
  },
  getCell: function(horse){
    var x = horse.x-this.boardPosition.x;
    var y = horse.y-this.boardPosition.y;
    return {x:Math.floor(x/this.cellSize), y:Math.floor(y/this.cellSize)};
  },
  getHorse: function(currentCell){
  	for(var i = 0; i < this.horses.length; i++){
  	  var h = this.getCell(this.horses[i]);
  	  if(h.x == currentCell.x && h.y == currentCell.y) return this.horses[i];
  	}
  	return null;
  },
  botMove(){
  	var solution = this.bot.getMove(this.player.score);
  	this.currentHorse = this.getHorse({x:solution[1],y:solution[0]});
  	this.currentCell = {x:solution[3],y:solution[2]};
  	var destCell = {x: this.boardPosition.x+this.currentCell.x*this.cellSize+this.cellSize/2,
      y: this.boardPosition.y+this.currentCell.y*this.cellSize+this.cellSize/2};
  	var move = gameUI.add.tween(this.currentHorse).to(destCell,
  	  1000, Phaser.Easing.Circular.Out).start();
    var ctx = this;
    move.onComplete.add(function(){
      if(ctx.currentCell.y==7 && ctx.currentCell.x==3){
      	ctx.currentCell = {x:0,y:0};
        var destCell = {x: ctx.boardPosition.x+ctx.cellSize/2,
          y: ctx.boardPosition.y+ctx.cellSize/2};
      	var moveToConer = gameUI.add.tween(ctx.currentHorse).to({x:destCell.x,y:destCell.y},
      	  1000,Phaser.Easing.Circular.Out).start();
      	moveToConer.onComplete.add(function(){
          ctx.turn = ctx.player;
      	  ctx.currentHorse = null;
      	  ctx.currentCell = {x:-1,y:-1};
        });
      } else if(ctx.currentCell.y==7 && ctx.currentCell.x==4){
      	ctx.currentCell = {x:7,y:0};
        var destCell = {x: ctx.boardPosition.x+7*ctx.cellSize+ctx.cellSize/2,
          y: ctx.boardPosition.y+ctx.cellSize/2}
      	var moveToConer = gameUI.add.tween(ctx.currentHorse).to({x:destCell.x,y:destCell.y},
      	  1000,Phaser.Easing.Circular.Out).start();
      	moveToConer.onComplete.add(function(){
          ctx.turn = ctx.player;
      	  ctx.currentHorse = null;
      	  ctx.currentCell = {x:-1,y:-1};
      	  });
      	} else {
      	  ctx.turn = ctx.player;
      	  ctx.currentHorse = null;
      	  ctx.currentCell = {x:-1,y:-1};
      	};
    });
  }
};

gameUI.state.add('main', mainState);
gameUI.state.start('main');
