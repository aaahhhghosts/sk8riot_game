import Sprite from '/src/Sprite.js';
import { sk8r_floor, floor } from '/src/constants.js';

export default class Cop extends Sprite {

  static src = ['/sprites/cop.png'];

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 30,
          height: 36,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 6,
          loop_animation: true,
          hasGravity: true
      });

      this.isGrounded = true;
      this.gravity = 0.3;
      this.velocity_y = 0;
      this.velocity_x = 0;

      this.isAlive = true;
      this.set_floor(sk8r_floor-6);
      this.death_floor = floor;
      this.timeSinceFire = 70;
      this.readyToFire = false;

      this.played_landing_sfx = false;
  }

  get_floor() {return this.floor;}
  set_floor(floor) {this.floor = floor;}

  is_looking_backwards() {return this.row == 0;}
  look_forwards() {
      this.row = 1;
  }

  animate_death() {
      this.width = 35;
      this.row = 2;
      this.frames = 4;
      this.frameIndex = 0;
      this.ticksPerFrame = 10;
      this.loop_animation = false;
      this.despawn_after_animation = false;
  }

  kill(cause_of_death) {
      this.isAlive = false;
      this.set_floor(sk8r_floor-11)
      this.animate_death();

      // If killed by debris and not explosion,
      // make flying off board less dramatic.
      switch(cause_of_death) {
          case 0: this.throw_off_scooter(4.0, 2.8); break;
          case 1: this.throw_off_scooter(2.0, 1.2); break;
      }
  }

  throw_off_scooter(x_vel, y_vel) {

    // Send sk8r's body flying.
    this.death_floor = this.floor;
    this.set_floor(sk8r_floor-12);
    this.isGrounded = false;
    this.velocity_x = x_vel;
    this.velocity_y = y_vel;
    this.y += 3;
  }

  update_cop(landing_sfx) {
      super.update();

      if (this.isAlive) {
          this.x += 1.5;

          this.timeSinceFire += 1;
          if (this.row == 0 && this.frameIndex == 5) {

              if (this.timeSinceFire > 80) {
                  this.readyToFire = true;
              }
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

      // Play crash sfx upon landing death.
      if (!this.isAlive && this.isGrounded && !this.played_landing_sfx) {
          landing_sfx.cloneNode(false).play();
          this.played_landing_sfx = true;
      }
  }
}
