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
  type: Phaser.CANVAS,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
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