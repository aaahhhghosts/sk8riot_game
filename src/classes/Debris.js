import Sprite from '/src/Sprite.js';
import { getRandomInt } from '/src/common.js';
import { floor } from '/src/constants.js';

export default class Debris extends Sprite {

  static src = '/sprites/wood_debris.png';

  constructor(x, y, context, image, countdown) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 12,
          height: 12,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 12,
          loop_animation: true,
          hasGravity: true
      });

      this.countdown = countdown;
      this.floor = floor;
      this.isAirborn = true;
      this.moving = true;

      this.velocity_y = 1.0 + (getRandomInt(0, 5)/10.0);
      this.velocity_x = 2.0 + (getRandomInt(0, 15)/10.0);

      switch(getRandomInt(0,2)) {
          case 1: this.frames = 8; this.row = 1; break;
          case 2: this.frames = 8; this.row = 2; break;
      }
  }

  animate_throw() {
      this.row = 0;
      this.frames = 12;
      this.frameIndex = 0;
  }


  animate_land() {
       this.y -= getRandomInt(4, 8);
       if (this.row != 2) {
           this.frameIndex = (this.frames/2)*getRandomInt(0,1);
       } else {
           this.frameIndex = 0;
       }
       this.frames = 1;
  }

  update_debris() {

      // If countdown is up, begin throw.
      if (this.countdown > 0) {
          this.countdown -= 1;
      } else {
          super.update();
      }

      if (this.isAirborn) {
          this.x += 1.5;
      } else if (this.moving) {
          this.x -= 2;
      }

      // If sk8r is dead, move body forwards.
      if (!this.isAirborn && this.velocity_x > 0) {

          this.x += this.velocity_x;
          this.velocity_x -= this.velocity_x / 30;

          if (this.velocity_x < 0.3) {
              this.velocity_x = 0;
          }
      }
  }
}

// Despawn debris when it leaves frame.
export function despawn_debris(debris) {
  debris.forEach((deb, i) => {
      if (deb.x < 0 - deb.width) {

        // If crate leaves map, despawn.
        var i = debris.indexOf(deb);
        debris.splice(i, 1);
      }
  });
}
