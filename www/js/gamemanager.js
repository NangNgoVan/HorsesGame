// GameManager class
function GameManager(){
	// create new board
	this.boardGame = new Board();

	// create bot autoplay
	this.bot = new Bot(this.boardGame, 1);

	// create player
	this.player = new Player(this.boardGame, 2);
}