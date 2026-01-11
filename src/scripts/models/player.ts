import { Bullet } from './bullet'
import { UserData } from '../UserData'
 
class Player extends Phaser.Physics.Arcade.Sprite {

  public socketId: string

  constructor(x: number, y: number, scene: Phaser.Scene, data: UserData, socketId?: string) {
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
    const keyboard = this.scene.input.keyboard;
    if (!keyboard) return;
    
    const keyD = keyboard.addKey('D');
    const keyA = keyboard.addKey('A');
    const keyS = keyboard.addKey('S');
    const keyW = keyboard.addKey('W');
    
    const deltaX = Number(keyD.isDown) - Number(keyA.isDown);
    const deltaY = Number(keyS.isDown) - Number(keyW.isDown);
    this.x += deltaX * 5;
    this.y += deltaY * 5;
  }

  public handleRotation(): void {
    const mousePointer = this.scene.input.mousePointer;
    if (!mousePointer) return;
    
    const worldX = mousePointer.worldX + 33;
    const worldY = mousePointer.worldY + 45;
    
    let angle = Phaser.Math.Angle.BetweenPoints(
      { x: this.x, y: this.y },
      { x: worldX, y: worldY }
    );
    angle = Math.round((180 * angle) / Math.PI);
    
    try {
      this.setAngle(angle);
    } catch (e) {
      console.error('Error setting angle:', e);
    }
  }
  
  public notifyHit() : void {
    console.log("you got hit ")
    alert("you got hit");
  }
}
export default Player;