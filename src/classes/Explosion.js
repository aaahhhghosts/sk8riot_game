import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

export default class Explosion extends Sprite {

  static src = '/sprites/explosion.png';

  constructor(x, y, context, image, countdown) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 20,
          height: 20,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 2,
          frames: 8,
          loop_animation: false,
          hasGravity: false
      });

      this.countdown = countdown;
      this.doneExploding = false;
      this.moving = true;
  }

  update_explosion() {

      // If countdown is up, begin explosion.
      if (this.countdown > 0) {
          this.countdown -= 1;
      } else {
          super.update();
      }

      if (this.moving) {
          this.x -= 2;
      }

      this.doneExploding = (this.frameIndex >= this.frames-1);
  }
}

// Despawn finished explosions.
export function despawn_explosions(explosions) {

    explosions.some((ex, i) => {

        // If zippy has finished exploding, despawn.
        if (ex.doneExploding) {
            let i = explosions.indexOf(ex);
            explosions.splice(i, 1);
            return true;
        }
    });
}
