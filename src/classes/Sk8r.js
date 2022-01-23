import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

export default class Sk8r extends Sprite {

  static src = '/sprites/sk8r.png';
  static board_src = '/sprites/board.png';


  constructor(x, y, context, image, board_image) {
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
      this.velocity_x = 0;

      this.isAlive = true;
      this.board_image = board_image;
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

  animate_death() {
      this.width = 32;
      this.row = 2;
      this.frames = 4;
      this.frameIndex = 0;
      this.ticksPerFrame = 12;
      this.loop_animation = false;
  }

  jump() {
      if (this.isGrounded && this.isAlive) {
        this.isGrounded = false;
        this.animate_jump();
        this.velocity_y = 4;
        this.y += 3;
      }
  }

  kill() {
      this.isAlive = false;
      this.animate_death();
      this.throw_off_board();
  }

  throw_off_board() {

    // Send sk8r's body flying.
    this.set_floor(sk8r_floor-12);
    this.isGrounded = false;
    this.velocity_y = 4;
    this.y += 3;
    this.velocity_x = 1.5;
  }

  update_sk8r(crates) {
      super.update();

      // Update current floor as long as player is alive.
      if (this.isAlive) {
          this.update_floor(crates);
      }
  }

  apply_gravity() {

      if (this.y > this.floor-2 && (this.y > sk8r_floor || !this.isAlive)) {

          this.timeSinceJump += 1;
          var now = this.timeSinceJump;

          this.y += (
              ((this.velocity_y * now)
              - (this.gravity * (Math.pow(now, 2) / 2))) / 10
          );

          // If sk8r is alive, return to skating animation on landing.
          if (this.y <= this.floor+2) {

              this.isGrounded = true;

              if (this.isAlive) {
                  this.animate_ride();
              }
          }

          if (this.y <= this.floor) {
              this.y = this.floor;

              this.timeSinceJump = 0;
              this.velocity_y = 0;
          }
      }

      // If sk8r is dead, move body forwards.
      if (!this.isAlive && this.velocity_x > 0) {

          this.x += this.velocity_x;
          if (this.y <= sk8r_floor-12) {
              this.velocity_x -= this.velocity_x / 30;

              if (this.velocity_x < 0.1) {
                  this.velocity_x = 0;
              }
          }
      }
  }

  update_floor(crates) {

      // Reset floor.
      this.set_floor(sk8r_floor);

      // Loop through all creates.
      crates.filter(crate => !crate.isBroken).some((crate, j) => {

          // If crate is at the same place as sk8r
          if (this.x >= crate.x-crate.width*2 && this.x <= crate.x+crate.width/2) {

              // Get y coord of the top of this crate.
              var top_of_crate = crate.y+(crate.height-1);

              // If sk8r is below the top of crate, they have hit a wall.
              // Kill sk8r and break out of loop.
              if (this.y < top_of_crate-2 && this.x-3 >= crate.x-crate.width*2) {
                  this.kill();
                  return true;
              }

              // Else if sk8r clears the top of crate, update the current floor.
              if (this.get_floor() < top_of_crate) {
                  this.set_floor(top_of_crate);
              }
          }
      });
  }
}
