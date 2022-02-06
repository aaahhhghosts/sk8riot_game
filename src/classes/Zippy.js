import Sprite from '/src/Sprite.js';
import { getRandomInt } from '/src/common.js';
import { floor } from '/src/constants.js';

export default class Zippy extends Sprite {

  static src = '/sprites/zippy.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 9,
          height: 9,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 0,
          frames: 20,
          loop_animation: true,
          hasGravity: true
      });

      this.floor = floor;

      this.doneExploding = false;
      this.brokeCrate = false;

      this.isAirborn = true;

      this.velocity_y = 1;
  }

  animate_throw() {
      this.row = 0;
      this.frames = 20;
      this.frameIndex = 0;
  }

  animate_explode() {

      this.loop_animation = false;
      this.row = 1;
      this.frames = 5+1;
      this.frameIndex = 0;
      this.ticksPerFrame = 2;
  }

  animate_land() {
      this.y -= getRandomInt(0, 4);
      this.animate_explode();
  }

  update_zippy() {

      super.update();

      if (this.isAirborn) {
          this.x += 1.5;

      } else {
          this.doneExploding = (this.row === 1 && this.frameIndex >= this.frames-1);
      }
  }
}

// Spawn zippy.
export function throw_zippy(x, y, context, img, zippies) {

    zippies.push(new Zippy(x, y, context, img));
}

// Despawn exploded zippies.
export function despawn_zippies(zippies) {

    zippies.some((zippy, i) => {

        // If zippy has finished exploding, despawn.
        if (zippy.doneExploding) {
            let i = zippies.indexOf(zippy);
            zippies.splice(i, 1);
            return true;
        }
    });
}

export function explode_zippies(zippies, crates) {

    // Declare list to hold the position of every crate break, if any.
    let breakPosList = [];

    zippies.filter(zippy => zippy.isAirborn).forEach((zippy, i) => {

        // Check for crate collisions.
        crates.filter(crate => !crate.isBroken).forEach((crate, j) => {

            var hitCrate = zippy.x >= crate.x-5 && (zippy.x <= (crate.x+crate.width) &&
                           zippy.y >= (crate.y-2) && zippy.y < crate.y+crate.height);

            // If zippy collided with crate.
            if (hitCrate && !zippy.brokeCrate) {

                // Set zippy's floor to the top of the crate,
                // which will trigger a landing event next update.
                zippy.floor = crate.y+crate.height;

                // If crate is wooden and unbroken, break.
                if (crate.type == 0) {
                    crate.break();
                    zippy.brokeCrate = true;
                    breakPosList.push([Math.floor(crate.x), Math.floor(crate.y)]);
                }
            }
        });
    });
    return breakPosList;
}
