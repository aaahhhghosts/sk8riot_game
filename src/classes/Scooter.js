import Sprite from '../Sprite.js';
import { sk8r_floor } from '../constants.js';
import { getRandomInt } from '../common.js';

export default class Scooter extends Sprite {

  static src = ['/sprites/scooter.png'];

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 28,
          height: 20,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 3,
          loop_animation: false,
          hasGravity: true
      });

      this.despawn_after_animation = false;
      this.floor = sk8r_floor-6;
      this.velocity_y = 1;

      this.isBroken = false;
  }

  animate_ride() {
      this.row = 1;
      this.width = 29;
      this.frames = 6;
      this.frameIndex = 1;
      this.loop_animation = true;
      this.is_animation_done = false;
  }

  animate_break() {
      this.row = 2;
      this.width = 29;
      this.frames = 6;
      this.frameIndex = 0;
      this.loop_animation = false;
      this.is_animation_done = false;
  }

  break () {
      this.isBroken = true;
      this.velocity_x = 1.2;
      this.animate_break();
  }

  update_scooter() {
      super.update();

      if (this.row == 0 && this.is_animation_done) {

          let animation_type = getRandomInt(0, 1);
          if (animation_type > 0) {
              this.animate_ride();
          } else {
              this.break();
          }
      }

      if (!this.isBroken) {
          this.x += 1;

          if (this.row == 1) {
              this.y -= 0.02;
          }
      }

      // If scooter is broken, move shards forwards.
      if (this.isBroken && this.velocity_x > 0) {

          this.x += this.velocity_x;
          this.velocity_x -= this.velocity_x / 30;

          if (this.velocity_x < 0.3) {
              this.velocity_x = 0;
          }
      }
  }
}
