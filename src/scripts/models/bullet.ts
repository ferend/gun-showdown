import Phaser from 'phaser'
import { PlayerData, Direction } from './types'

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  autodisable: Phaser.Time.TimerEvent | null = null

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'bullet')
    scene.add.existing(this)
    scene.physics.world.enable(this)
  }
  
  public fire(playerData: PlayerData): void {
    if (this.body === null) return;

    const dirObj = this.getDirFromAngle(playerData.angle)
    this.setScale(1.2, 1.2)
    this.setBounce(0, 0)

    this.body.checkCollision.none = false

    const offsetX = dirObj.tx * 50
    const offsetY = dirObj.ty * 50

    this.body.reset(playerData.x + offsetX, playerData.y + offsetY)

    this.setActive(true)
    this.setVisible(true)

    this.body.enable = true
    this.angle = playerData.angle

    this.setVelocity(dirObj.tx * 3000, dirObj.ty * 3000)

    this.autodisable = this.scene.time.addEvent({
      delay: 800,
      callback: this.disable,
      callbackScope: this,
      loop: false
    })
  }
  
  private getDirFromAngle(angle: number): Direction {
    const rads = (angle * Math.PI) / 180
    const tx = Math.cos(rads)
    const ty = Math.sin(rads)
    return { tx, ty }
  }

  public disable(): void {
    if (this.body === null) return; 
    if (this.autodisable) {
      this.scene.time.removeEvent(this.autodisable)
      this.autodisable = null
    }
    this.visible = false
    this.active = false
    this.body.enable = false
  }
}
