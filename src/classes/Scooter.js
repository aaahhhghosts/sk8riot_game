import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

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

  update_scooter() {
      super.update();

      if (this.is_animation_done) {
          this.animate_ride();
      }

      if (!this.isBroken) {
          this.x += 1;

          if (this.row == 1) {
              this.y -= 0.02;
          }
      }
  }
}
