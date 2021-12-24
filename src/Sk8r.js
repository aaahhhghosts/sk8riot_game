import Sprite from '/src/Sprite.js';

export default class Sk8r extends Sprite {

  static src = '/sprites/sk8r.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image[0],
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

      this.crate_floor = y;
      this.isGrounded = true;
      this.gravity = 0.3;
      this.velocity_y = 0.0;

      this.timeSinceJump = 0.0;
  }

  get_floor() {
      return this.crate_floor;
  }

  set_floor(floor) {
      this.crate_floor = floor;
  }

  animate_ride() {
    this.row = 0;
    this.frames = 6;
    this.frameIndex = 0;
  }

  animate_jump() {
    this.row = 1;
    this.frames = 2;
    this.frameIndex = 0;
  }

  jump() {
      if (this.isGrounded) {
        this.isGrounded = false;
        this.animate_jump();
        this.velocity_y = 4;
        this.y = this.crate_floor + 3;
        // console.log('Space pressed ' + this.isGrounded);
      }
  }

  update() {

      if (this.y > this.crate_floor) {

          this.timeSinceJump += 1;
          var now = this.timeSinceJump;

          this.y += (
              ((this.velocity_y * now)
              - (this.gravity * (Math.pow(now, 2) / 2))) / 10
          );

          if (this.y <= this.crate_floor+2) {
              this.isGrounded = true;
          }

          if (this.y <= this.crate_floor) {
              this.y = this.crate_floor;

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
}
