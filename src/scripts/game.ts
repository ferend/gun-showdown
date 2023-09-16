import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

export default class Game extends Phaser.Scene
{

    constructor ()
    {
        super('game');
    }


    create ()
    {
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        width: 1920,
        height: 1080
    },
    scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      //gravity: { y: 400 }
    }
  }
};



const game = new Phaser.Game(config);