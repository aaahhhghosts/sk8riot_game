import Sprite from '/src/Sprite.js';
import { getRandomInt } from '/src/common.js';
import { floor } from '/src/constants.js';

export default class Tire extends Sprite {

  static src = ['/sprites/tire.png'];

  constructor(x, y, context, image, countdown) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 12,
          height: 12,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 8,
          loop_animation: true,
          hasGravity: true
      });

      this.countdown = countdown;
      this.floor = floor;
      this.isAirborn = true;
      this.moving = true;

      this.velocity_y = 1.0 + (getRandomInt(0, 5)/10.0);
      this.velocity_x = 3.0 + (getRandomInt(0, 10)/10.0);
  }

  animate_land() {
       this.y -= getRandomInt(4, 6);
  }

  animate_topple() {
      this.row = 1;
      this.frames = 3;
      this.frameIndex = 0;
      this.loop_animation = false;
  }

  update_tire() {

      // If countdown is up, begin throw.
      if (this.countdown > 0) {
          this.countdown -= 1;
      } else {
          super.update();
      }

      if (this.isAirborn) {
          this.x += this.velocity_x;
      } else if (this.moving) {
          this.x -= 2;
      }

      // If sk8r is dead, move body forwards.
      if (!this.isAirborn && this.velocity_x > 0) {

          this.x += this.velocity_x;
          this.velocity_x -= this.velocity_x / 50;

          this.ticksPerFrame = Math.floor(7 - (2*this.velocity_x));

          if (this.velocity_x < 1.0 && this.row == 0) {
              this.animate_topple();
          }

          if (this.velocity_x < 0.3) {
              this.velocity_x = 0;
          }
      }
  }
}

// Despawn debris when it leaves frame.
export function despawn_tires(tires) {
  tires.forEach((tire, i) => {
      if (tire.x < 0 - tire.width) {

        // If crate leaves map, despawn.
        let i = tires.indexOf(tire);
        tires.splice(i, 1);
      }
  });
}
