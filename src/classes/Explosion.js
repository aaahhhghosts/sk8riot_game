import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

export default class Explosion extends Sprite {

  static src = ['/sprites/explosion.png', '/sprites/small_explosion.png'];

  constructor(x, y, context, image, type, countdown) {

    let width, height, frames;
    switch(type) {
        case 0: width = 20; height = 20; frames = 8; break;
        case 1: width = 9; height = 9; frames = 5; break;
    }

    super({
        context: context,
        image: image[type],
        x: x,
        y: y,
        width: width,
        height: height,
        frameIndex: 0,
        row: 0,
        tickCount: 0,
        ticksPerFrame: 2,
        frames: frames,
        loop_animation: false,
        hasGravity: false
    });

      this.x_movement = 0;
      if (type == 1) {
          this.x_movement = 1.5;
      }
      this.countdown = countdown;
      this.doneExploding = false;
  }

  update_explosion() {

      this.x += this.x_movement;

      // If countdown is up, begin explosion.
      if (this.countdown > 0) {
          this.countdown -= 1;
          this.scroll();
      } else {
          super.update();
      }

      this.doneExploding = (this.frameIndex >= this.frames-1);
  }
}
