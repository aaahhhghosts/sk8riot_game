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
          width: 27,
          height: 41,
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
      this.moving = true;

      this.isAlive = true;
      this.floor = sk8r_floor+1;
      this.death_floor = floor;
      this.timeSinceFire = 70;
      this.readyToFire = false;
  }

  get_floor() {return this.floor;}
  set_floor(floor) {this.floor = floor;}

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
      this.width = 35;
      this.row = 2;
      this.frames = 4;
      this.frameIndex = 0;
      this.ticksPerFrame = 12;
      this.loop_animation = false;
  }

  kill() {
      this.isAlive = false;
      this.animate_death();
      this.throw_off_board();
  }

  throw_off_board() {

    // Send sk8r's body flying.
    this.death_floor = this.floor;
    this.set_floor(sk8r_floor-12);
    this.isGrounded = false;
    this.velocity_y = 4;
    this.y += 3;
    this.velocity_x = 1.5;
  }

  update_cop(context, image, bullets) {
      super.update();

      this.timeSinceFire += 1;
      if (this.isAlive && this.row == 0 && this.frameIndex == 3) {

          if (this.timeSinceFire > 80) {
              this.readyToFire = true;
          }
      }

      if (this.moving) {
          this.x -= 0.5;
      }
  }
}

export function despawn_cops(cops) {
  cops.forEach((cop, i) => {
      if (cop.x < 0 - cop.width) {

        // If crate leaves map, despawn.
        let i = cops.indexOf(cop);
        cops.splice(i, 1);
      }
  });
}
