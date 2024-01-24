import { Bullet } from './bullet'
 
class Player extends Phaser.Physics.Arcade.Sprite {

  public socketId: string

  constructor(x: number, y: number, scene: Phaser.Scene, data: any, socketId?: string) {
    super(scene, data.x, data.y, 'player')

    scene.add.existing(this)
    scene.physics.world.enable(this)

    this.socketId = data.socketId
    this.angle = data.angle

    this.setCollideWorldBounds(true)
    this.setScale(0.8, 0.8)
    this.setBounce(0.2)
  }

  public handleMovement(): void {
    //@ts-ignore
    const deltaX = Number(this.scene.input.keyboard.addKey('D').isDown) - Number(this.scene.input.keyboard.addKey('A').isDown);
    //@ts-ignore
    const deltaY = Number(this.scene.input.keyboard.addKey('S').isDown) - Number(this.scene.input.keyboard.addKey('W').isDown);
    this.x += deltaX * 5;
    this.y += deltaY * 5;
  }

  public handleRotation(): void {
    this.scene.input.mousePointer.x = this.scene.input.mousePointer.worldX + 33
    this.scene.input.mousePointer.y = this.scene.input.mousePointer.worldY + 45

    let angle = Phaser.Math.Angle.BetweenPoints(this, this.scene.input.mousePointer)
    angle = Math.round((180 * angle) / Math.PI)
    try {
      this.setAngle(angle)
    } catch (e) {
      console.log(e)
    }
  }
  
  public notifyHit() : void {
    console.log("you got hit ")
    alert("you got hit");
  }
}
export default Player;