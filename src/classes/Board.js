import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';

export default class Board extends Sprite {

  static src = '/sprites/board.png';

  constructor(crates, x, y, context, image) {
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

      // Loop through all creates.
      crates.filter(crate => !crate.isBroken).some((crate, j) => {

          // If crate is at the same place as board
          if (this.x >= crate.x-crate.width && this.x <= crate.x+crate.width/2) {

              // Get y coord of the top of this crate.
              var top_of_crate = crate.y+(crate.height-1);

              // Else if board clears the top of crate, update the current floor.
              if (this.floor < top_of_crate) {
                  this.floor = top_of_crate;
              }
          }
      });
  }

  update_board() {
      super.update();
  }
}
