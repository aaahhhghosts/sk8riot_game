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
          loop_animation: true,
          hasGravity: false,
      });

      this.doneBreaking = false;
      this.set_scroll(true, 2.5);
  }

  break() {
      this.isBroken = true;
      this.row = 1;
  }

  update_bullet() {
      super.update();
      if (this.row != 1 && this.frameIndex == this.frames-1) {
          if (this.row == 0) {this.row = 1;}
          if (this.row == 2) {this.doneBreaking = true;}
      }
  }
}
