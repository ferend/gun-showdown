import Player from '../models/player'
import * as Phaser from 'phaser'
import io from 'socket.io-client'
import { Bullet } from '../models/bullet'
import { UserData } from '../UserData'
import {gameConfig} from "../backend/gameConfig";

import { Socket } from 'socket.io-client'

export default class MainScene extends Phaser.Scene {
  private socket: Socket
  private player: Player | null = null
  private background: Phaser.GameObjects.Sprite

  playerLabel: Phaser.GameObjects.Text
  playersConnectedText: Phaser.GameObjects.Text
  firstHi = false
  opponents: Player[] = []
  bullets: Bullet[] = []
  
  constructor() {
    super({ key: 'MainScene' })
  }

  create() : void {
    this.createBackground()
    this.createGameTitle();
    this.playerLabel = this.createPlayerLabel();
    this.playersConnectedText = this.createConnectedText();
    this.socket = io()
    this.socketEvents();
    this.startGame()
  }
  
  update(): void {
    if (this.player != null) {
      this.player.handleMovement();
      this.player.handleRotation();
      this.playerLabel.x = this.player.x;
      this.playerLabel.y = this.player.y - 100;
    }
    // Clean up inactive bullets
    this.bullets = this.bullets.filter(bullet => {
      if (!bullet.active || !bullet.visible) {
        bullet.destroy();
        return false;
      }
      return true;
    });
  }
  private startGame(): void {
    this.background.setVisible(true)
    this.createCameraFunctions()
  }
  
  private createGameTitle(): void {
    const textStyle = {
      color: 'yellow',
      fontSize: '120px',
      fontFamily: 'Arial',
      fontStyle: 'bold',
      stroke: 'purple',
      strokeThickness: 20,
      align: 'center',
    };
    let text = this.add.text(gameConfig.width / 2, gameConfig.height - 1000, 'Gun Showdown', textStyle);
    text.setScale();
  }

  private createConnectedText(): Phaser.GameObjects.Text {
    const textStyle = {
      color: 'yellow',
      fontSize: '60px',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      align: 'center',
    };
    let text = this.add.text(gameConfig.width / 1.7, gameConfig.height - 850, 'Clients Connected : ', textStyle);
    text.setScale();
    return text;
  }

  private createPlayerLabel(): Phaser.GameObjects.Text {
    const labelStyle = {
      color: 'orange',
      fontStyle: 'bold',
      fontSize: '42px', 
      fontFamily: 'Arial', 
      align: 'center', 
    };
    let label = this.add.text(-50, 0, 'This Is You', labelStyle).setOrigin(0.5, 1);
    return label;
  }

  private createBackground(): void {
    this.background = this.physics.add.sprite(0, 0, 'bg')
    this.background.setOrigin(0, 0)
    this.background.setScale(3);
    this.physics.world.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight)
    this.background.setVisible(false)
    this.background.setInteractive()
  }

  private createCameraFunctions(): void {
    this.cameras.main.setBounds(0, 0, this.background.displayWidth, this.background.displayHeight)
    this.cameras.main.zoom = 0.75
  }

  private updateStateCallback = () => {
    if (!this.player) return;
    
    this.playersConnectedText.setText('Clients Connected: ' + (this.opponents.length + 1).toString())
    let data = {
      socketId: this.socket.id,
      x: this.player.x,
      y: this.player.y,
      vx: this.player.body?.velocity.x || 0,
      vy: this.player.body?.velocity.y || 0,
      angle: this.player.angle
    }
    this.socket.emit('player update', data)
  }

  private socketEvents() {
    this.socket.on('first hi', (data: UserData, opponentData: UserData[]) => {
      if (!this.firstHi) {
        this.firstHi = true
        this.player = new Player(500, 400, this, data)
        opponentData.forEach(o => {
          let opponent = new Player(200, 220, this, o)
          this.opponents.push(opponent)
        })
        this.time.addEvent({delay: 1000 / 60, loop: true, callback: this.updateStateCallback, callbackScope: this})
      }
    })

    this.socket.on('add opponent', (data: UserData) => {
      let opponent = new Player(400, 200, this, data)
      this.opponents.push(opponent)
    })

    this.socket.on('remove player', pSocket => {
      let o: Player[] = this.opponents.filter((player: Player) => {
        return player.socketId == pSocket
      })
      if (o && o[0]) {
        let p = o[0]
        const index = this.opponents.indexOf(p)
        if (index > -1) {
          this.opponents.splice(index, 1)
        }
        p.destroy()
      }
    })

    this.socket.on('update all', (data: any[]) => {
      if (!this.player) return;
      
      const currentPlayerId = this.player.socketId;
      data.forEach(p => {
        const opponent = this.opponents.find((player: Player) => {
          return player.socketId === p.socketId
        })
        if (opponent && opponent.socketId !== currentPlayerId) {
          opponent.x = p.x
          opponent.y = p.y
          opponent.setVelocityX(p.vx)
          opponent.setVelocityY(p.vy)
          opponent.angle = p.angle
        }
      })
    })

    this.socket.emit('ready')

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown() && this.player) {
        const bullet = new Bullet(this, this.player.x, this.player.y)
        bullet.fire(this.player)
        this.bullets.push(bullet);
        this.socket.emit('bullet_fired', {
          player: {x: this.player.x, y: this.player.y, angle: this.player.angle},
          bullet: {x: bullet.x, y: bullet.y, angle: bullet.angle}
        })
      }
    })

    this.socket.on('bullet_fired', (data: any) => {
      const bullet = new Bullet(this, data.bullet.x, data.bullet.y);
      bullet.angle = data.bullet.angle;
      bullet.fire(data.player);
      this.bullets.push(bullet);
    });

    this.socket.on('player_hit', (data: { playerSocketId: string }) => {
      // Works somehow?
      if (this.player && this.player.socketId === data.playerSocketId) {
        console.log(`You got hit!`);
        this.player.notifyHit();
      } else {
        // Find the opponent that got hit
        const hitPlayer = this.opponents.find((opponent: Player) => opponent.socketId === data.playerSocketId);
        if (hitPlayer) {
          console.log(`Player ${hitPlayer.socketId} got hit from enemy!`);
          hitPlayer.notifyHit();
        } else {
          console.log(`Player with socketId ${data.playerSocketId} not found.`);
        }
      }
    });

    this.physics.add.collider(this.bullets, this.opponents, (bullet: any, opponent: any) => {
      if (bullet.active && bullet.visible && opponent.active) {
        console.log(`Bullet hit opponent: ${opponent.socketId}`);
        bullet.disable();
        this.socket.emit('player_hit', {playerSocketId: opponent.socketId});
      }
    });
  }
}
