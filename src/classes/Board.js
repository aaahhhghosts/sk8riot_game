import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

export default class Board extends Sprite {

  static src = '/sprites/board.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 27,
          height: 12,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 5,
      });

      this.loop_animation = false;
      this.hasGravity = true;
      this.floor = sk8r_floor;
      this.velocity_y = 1;
  }

  update_board() {
      super.update();
  }
}
