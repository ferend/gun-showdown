import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

export default class Game extends Phaser.Scene
{

    constructor ()
    {
        super('game');
    }

    preload ()
    {
        this.load.image('Background', 'assets/Background.png');
    }

    create ()
    {
        const bg = this.add.image(0, 0, 'Background').setOrigin(0).setDisplaySize(game.scale.width,game.scale.height);
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: 800,
        height: 600
    },
    scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 400 }
    }
  }
};



const game = new Phaser.Game(config);