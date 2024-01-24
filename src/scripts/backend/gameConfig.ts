import PreloadScene from "../scenes/preloadScene";
import MainScene from "../scenes/mainScene";

export const gameConfig = {
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