import 'phaser'
import {gameConfig} from "./backend/gameConfig";

class Game extends Phaser.Scene
{

    constructor ()
    {
        super('game');
    }
    
}


const game = new Phaser.Game(gameConfig);