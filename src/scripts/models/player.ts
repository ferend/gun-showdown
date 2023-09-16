import { Bullet } from "./bullet";
export default class Player extends Phaser.Physics.Arcade.Sprite {
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  speed: number
  hp: number
  socket: any

  constructor(x: number, y: number, scene: Phaser.Scene, socket: any) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.world.enable(this);

    // Set player properties
    this.setCollideWorldBounds(true);
    this.setScale(0.8, 0.8);

//    this.setDrag(400);
//    this.setFriction(500, 500);
    this.setBounce(0.2);

    // Create cursor keys
    this.cursors = scene.input.keyboard.createCursorKeys();

    
    scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        if (pointer.leftButtonDown()) {
            const bullet = new Bullet(this.scene, this.x, this.y);
            bullet.fire(this);
        }
    });

  }

      update() {
        // Handle player movement
        this.handleMovement();
    }

    private handleMovement() {
        const speed = 200;

        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.scene.input.mousePointer.x, this.scene.input.mousePointer.y);
        this.rotation = angle;

        if (this.cursors.left.isDown) {
            this.body.velocity.x = -speed;
        } else if (this.cursors.right.isDown) {
            this.body.velocity.x = speed;
        } else {
            this.body.velocity.x = 0;
        }

        if (this.cursors.up.isDown) {
            this.body.velocity.y = -speed;
        } else if (this.cursors.down.isDown) {
            this.body.velocity.y = speed;
        } else {
            this.body.velocity.y = 0;
        }
    }

  }

