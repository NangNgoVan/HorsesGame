Horse = function(game, x, y, name, type){
  Phaser.Sprite.call(this, game, x, y, name);
  this.type = type;
  this.anchor.setTo(0.5, 0.5);
  game.add.existing(this);
}

Horse.prototype = Object.create(Phaser.Sprite.prototype);
Horse.prototype.constructor = Horse;