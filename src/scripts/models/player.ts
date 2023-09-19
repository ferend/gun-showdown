import { Bullet } from './bullet'
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  speed: number
  hp: number
  socket: any

  constructor(x: number, y: number, scene: Phaser.Scene, socket: any) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.world.enable(this)

    this.setCollideWorldBounds(true)
    this.setScale(0.8, 0.8)

    //    this.setDrag(400);
    //    this.setFriction(500, 500);
    this.setBounce(0.2)

    // Create cursor keys
    this.cursors = scene.input.keyboard.createCursorKeys()

    //scene.input.setDefaultCursor("url(assets/images/blank.png), pointer");

    this.speed = 400

    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        const bullet = new Bullet(this.scene, this.x, this.y)
        bullet.fire(this)
      }
    })
  }

  update() {
    this.handleMovement()
    this.handleRotation()
  }

  private handleMovement(): void {
    if (this.cursors.left.isDown) {
      this.body.velocity.x = -this.speed
    } else if (this.cursors.right.isDown) {
      this.body.velocity.x = this.speed
    } else {
      this.body.velocity.x = 0
    }

    if (this.cursors.up.isDown) {
      this.body.velocity.y = -this.speed
    } else if (this.cursors.down.isDown) {
      this.body.velocity.y = this.speed
    } else {
      this.body.velocity.y = 0
    }
  }

  private handleRotation(): void {
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
}
