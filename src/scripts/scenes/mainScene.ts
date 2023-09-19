//import PhaserLogo from '../objects/phaserLogo'
//import FpsText from '../objects/fpsText'
import Player from '../models/player'
import * as Phaser from 'phaser'
import io from 'socket.io-client'

export default class MainScene extends Phaser.Scene {
  private scoreText: Phaser.GameObjects.Text
  private socket: any
  public isPlayerA: boolean
  private startButton: Phaser.GameObjects.Text
  private player: Player
  private background: Phaser.GameObjects.Sprite

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    this.isPlayerA = false
    let self = this
    this.createBackground()
    this.createScoreText()

    // point on where your server is on prod
    this.socket = io('http://localhost:3000')
    this.socket.on('connect', () => {
      console.log('connected')
    })

    //Socket func for setting player A if player is connected to socket
    this.socket.on('isplayerA', () => {
      self.isPlayerA = true
    })

    this.createStartButton()
  }

  private createStartButton(): void {
    this.startButton = this.add
      .text(1600 / 2, 1080 / 2, 'Start Game!' ,{
        fontSize: '32px',
        fontFamily: 'Trebuchet MS',
        color: '#ff0000',
        stroke: '#ffffff',
        strokeThickness: 6,
      })
      .setInteractive()
      .on('pointerdown', () => {
        this.startButton.destroy()
        this.scoreText.setVisible(true)
        this.scoreText.setScrollFactor(0)

        this.startGame();
      })
  }


  private startGame() : void {
    this.player = new Player(900, 400, this, this.socket)
    this.background.setVisible(true)
    this.createCameraFunctions()
  }

  private createScoreText() : void {
    this.scoreText = this.add.text(10, 10, 'Score: 0 - 0', {
      fontSize: '32px',
      fontFamily: 'Trebuchet MS'
    })
    this.scoreText.setVisible(false)
  }

  private createBackground() : void {
    this.background = this.physics.add.sprite(0, 0, 'bg')
    this.background.setOrigin(0, 0)
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight)
    this.background.setVisible(false)
    this.background.setInteractive();

  }

  private createCameraFunctions() : void {
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight)
    this.cameras.main.zoom = 0.75
    try {
      this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    } catch (e) {
      console.log(e)
      this.createCameraFunctions()
    }
  }

  update() {
    if (this.player != null) {
      this.player.update()
    }
  }
}
