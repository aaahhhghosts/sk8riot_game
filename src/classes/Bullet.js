import Sprite from '/src/Sprite.js';
import { floor } from '/src/constants.js';
import { getRandomInt, add } from '/src/common.js';
import { get_canvas_width } from '/src/Main.js';

export default class Bullet extends Sprite {

  static src = ['/sprites/bullet.png'];

  constructor(x, y, context, image, type) {

      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 6,
          height: 3,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 5,
          frames: 2,
          loop_animation: false,
          hasGravity: false,
      });

      this.despawn_after_animation = false;
      this.set_scroll(true, 2.5);
  }

  animate_glide() {
      this.row = 1;
      this.is_animation_done = false;
      this.loop_animation = true;
  }

  animate_break() {
      this.row = 2;
      this.loop_animation = false;
  }

  break() {
      this.despawn_after_animation = true;
      this.animate_break();
  }

  update_bullet() {
      super.update();

      if (this.row == 0 && this.is_animation_done) {
          this.animate_glide();
      }
  }
}

export function collide_bullets(sk8r, bullets, player_hit_sfx) {

    // Get y coord of the top of sk8r.
    let top_of_sk8r = sk8r.y+sk8r.height/2-1;
    let hitPos = null;

    // Check for sk8r collisions.
    bullets.filter(bullet => !bullet.isBroken).forEach((bullet, i) => {

        if (bullet.x >= sk8r.x-23 && bullet.x <= sk8r.x+sk8r.width-7) {

            let hitsk8r = bullet.x >= (sk8r.x+5) && bullet.x <= (sk8r.x+sk8r.width) &&
                          bullet.y >= (sk8r.y-2) && bullet.y < (sk8r.y+sk8r.height);

            // If bullet collided with sk8r.
            if (hitsk8r) {

               // If sk8r is alive on collision, blow up that sk8r ass.
               if (sk8r.isAlive) {
                   sk8r.kill("zombie cop");
                   bullet.break();
                   hitPos = [Math.floor(bullet.x), Math.floor(bullet.y)];
                   player_hit_sfx.cloneNode(false).play();
               }
            }
        }
    });
    return hitPos;
}
