import Sprite from '/src/Sprite.js';

export default class Sk8r extends Sprite {

  static src = '/sprites/sk8r.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 27,
          height: 41,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 6
      });

      this.floor_height = y;
      this.isGrounded = true;
      this.gravity = 0.2;
      this.velocity_y = 0.0;
      this.acceleration_y = 0.2;
      this.jump_y_max = 2.0;

      this.timeSinceJump = 0.0;
  }

  resize(context) {
    super.context = context;
  }

  animate_ride() {
    this.row = 0;
    this.frames = 6;
    this.frameIndex = 0;
  }

  animate_jump() {
    this.row = 1;
    this.frames = 1;
    this.frameIndex = 0;
  }

  jump() {
      if (this.isGrounded) {
        this.isGrounded = false;
        this.animate_jump();
        this.velocity_y = 3.0;
        console.log('Space pressed ' + this.isGrounded);
      }
  }

  update() {

      if (!this.isGrounded) {


          this.timeSinceJump += 1;
          var now = this.timeSinceJump;
          var jump_y = -(this.y - this.floor_height);

          console.log('jumping ' + jump_y);


          /*if (jump_y < this.jump_y_max) {
              console.log('up ' + this.velocity_y);
              this.velocity_y += (
                  this.acceleration_y *
                  (Math.pow(now, 2) / 2)
              );
          }*/

          this.y -= (
              ((this.velocity_y * now)
              - (this.gravity * (Math.pow(now, 2) / 2)))
              / 10
          );

          if (this.y >= this.floor_height) {
              this.y = this.floor_height;
              this.isGrounded = true;
              this.animate_ride();
              this.timeSinceJump = 0.0;
              this.velocity_y = 0.0;
          }
      }


      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < this.frames - 1) {
              this.frameIndex += 1;
          } else {
              this.frameIndex = 0;
          }
      }
  }

  /*walk() {
      this.frames = 1;
      this.frameIndex = 0;
      this.row = 1;
      this.ticksPerFrame = 4;
  }

  run() {
      this.frames = 1;
      this.frameIndex = 0;
      this.row = 2;
      this.ticksPerFrame = 2;
  }

  idle() {
      this.frames = 1;
      this.frameIndex = 0;
      this.row = 0;
      this.ticksPerFrame = 12;
  }*/
}
