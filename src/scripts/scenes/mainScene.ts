//import PhaserLogo from '../objects/phaserLogo'
//import FpsText from '../objects/fpsText'
import * as Phaser from 'phaser';
import io from 'socket.io-client';

export default class MainScene extends Phaser.Scene {

  private scoreText: Phaser.GameObjects.Text;
  private socket: any;
  public isPlayerA: boolean;
  private startButton: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' })
  }


  create() {
    this.isPlayerA = false;
    let self = this;
    

    // Display the score
    this.scoreText = this.add.text(10, 10, 'Score: 0 - 0', {
      fontSize: '32px',
      fontFamily: 'Trebuchet MS',
    });
    this.scoreText.setVisible(false);


    // point on where your server is on prod
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log('connected');
    });

    //Socket func for setting player A if player is connected to socket
    this.socket.on('isplayerA', () => {
      self.isPlayerA = true;
    });

    this.startButton = this.add.text(800/2, 600/2, 'Start Game!', {
      fontSize: '32px',
      fontFamily: 'Trebuchet MS',
      color: "#ff0000",
      stroke: "#ffffff",
      strokeThickness: 6,
    }).setInteractive().on('pointerdown', () => {
      this.startButton.destroy();
      this.scoreText.setVisible(true);
    });

  }

  update() {
  }
}
