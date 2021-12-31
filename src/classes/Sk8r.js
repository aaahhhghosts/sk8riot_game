import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

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

      this.hasGravity = true;

      this.isGrounded = true;
      this.gravity = 0.3;
      this.velocity_y = 0;

      this.isAlive = true;
      this.timeSinceJump = 0;
  }

  get_floor() {
      return this.floor;
  }

  set_floor(floor) {
      this.floor = floor;
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
      if (this.isGrounded && this.isAlive) {
        this.isGrounded = false;
        this.animate_jump();
        this.velocity_y = 4;
        this.y += 3;
      }
  }

  animate_land() {
      this.isGrounded = true;
      this.animate_ride();
  }

  kill() {
      this.isAlive = false;
  }

  update_sk8r(crates) {
      super.update();
      this.update_floor(crates);
  }

  apply_gravity() {

      if (this.y > this.floor-2 && this.y > sk8r_floor) {

          this.timeSinceJump += 1;
          var now = this.timeSinceJump;

          this.y += (
              ((this.velocity_y * now)
              - (this.gravity * (Math.pow(now, 2) / 2))) / 10
          );

          if (this.y <= this.floor+2) {
              this.animate_land();
          }

          if (this.y <= this.floor) {
              this.y = this.floor;

              this.timeSinceJump = 0;
              this.velocity_y = 0;
          }
      }
  }

  update_floor(crates) {

      // Draw player.
      this.set_floor(sk8r_floor);

      crates.filter(crate => !crate.isBroken).forEach((crate, j) => {

          // If crate is at the same place as sk8r
          if (this.x >= crate.x-crate.width*2 && this.x <= crate.x+crate.width/2) {

              var top_of_crate = crate.y+(crate.height-1);

              if (this.get_floor() < top_of_crate) {
                  this.set_floor(top_of_crate);
              }

              if (this.y < top_of_crate-2 && this.x-3 >= crate.x-crate.width*2) {
                  this.kill();
              }
          }
      });
  }
}
