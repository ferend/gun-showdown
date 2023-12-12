import Player from '../models/player'
import * as Phaser from 'phaser'
import io from 'socket.io-client'
import { Bullet } from '../models/bullet'

interface UserData {
  socketId: string
  loginTime: string
  x: number
  y: number
  vx: number
  vy: number
  angle: number
  color: string
}

export default class MainScene extends Phaser.Scene {
  private socket: any
  public isPlayerA: boolean
  private player: Player
  private background: Phaser.GameObjects.Sprite

  playerLabel: Phaser.GameObjects.Text
  playersConnectedText: Phaser.GameObjects.Text
  firstHi = false
  opponents: Player[] = []

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {

    this.createBackground()

    this.createPlayerLabel()
    
    this.createConnectedText()

    this.socket = io()

    this.socket.on('first hi', (data: UserData, opponentData: UserData[]) => {
      if (this.firstHi != true) {
        this.firstHi = true
        this.player = new Player(0, 0, this, data)
        opponentData.forEach(o => {
          let opponent = new Player(100, 0, this, o)
          this.opponents.push(opponent)
        })
        this.time.addEvent({ delay: 1000 / 60, loop: true, callback: this.updateState(), callbackScope: this })
      }
    })

    this.socket.on('add opponent', (data: UserData) => {
      let opponent = new Player(100, 0, this, data)
      this.opponents.push(opponent)
    })

    this.socket.on('remove player', pSocket => {
      let o: Player[] = this.opponents.filter((player: Player) => {
        return player.socketId == pSocket
      })
      if (o && o[0]) {
        let p = o[0]
        this.opponents.splice(this.opponents.indexOf(p, 1))
        p.destroy()
      }
    })

    this.socket.on('update all', (data: any[]) => {
      data.forEach(p => {
        let o: Player[] = this.opponents.filter((player: Player) => {
          return player.socketId == p.socketId
        })
        if (o && o[0] && o[0].socketId != this.player.socketId) {
          let opponent = o[0]
          opponent.x = p.x
          opponent.y = p.y
          opponent.setVelocityX(p.vx)
          opponent.setVelocityY(p.vY)
          opponent.angle = p.angle
        }
      })
    })

    this.socket.emit('ready')

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        const bullet = new Bullet(this, this.player.x, this.player.y)
        bullet.fire(this.player)
      }
    })

    this.startGame()
  }



  update() {
    if (this.player != null) {
      this.player.handleMovement()
      this.player.handleRotation()

      this.playerLabel.x = this.player.x
      this.playerLabel.y = this.player.y - 40
    }
  }

  private startGame(): void {
    this.background.setVisible(true)
    this.createCameraFunctions()
  }

  private createConnectedText() {
    this.playersConnectedText = this.add.text(620, 20, '', {
      color: "red"
    })
    this.playersConnectedText.setScale(5)
  }

  private createPlayerLabel() {
    this.playerLabel = this.add.text(-50, -50, ' this is you', {
      color: "blue",
      fontStyle: "bold",
      fontSize: 10
    }).setOrigin(0.5, 1)
    this.playerLabel.setScale(3)
  }

  private createBackground(): void {
    this.background = this.physics.add.sprite(0, 0, 'bg')
    this.background.setOrigin(0, 0)
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight)
    this.background.setVisible(false)
    this.background.setInteractive()
  }

  private createCameraFunctions(): void {
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight)
    this.cameras.main.zoom = 0.75
    //try {
    //this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    //} catch (e) {
    //console.log(e)
    //this.createCameraFunctions()
    //}
  }

  updateState() {
    let oldX = 0
    let oldY = 0
    let oldAngle = 0

    //send a position update only if position is changed
    return () => {
      this.playersConnectedText.setText('clients connected: ' + (this.opponents.length + 1).toString())
        let data = {
          socketId: this.socket.id,
          x: this.player.x,
          y: this.player.y,
          //@ts-ignore
          vx: this.player.body.velocity.x,
          //@ts-ignore
          vy: this.player.body.velocity.x,
          angle: this.player.angle
        }
        this.socket.emit('player update', data)
        oldX = this.player.x
        oldY = this.player.y
        oldAngle = this.player.angle
      
    }
  }
}
