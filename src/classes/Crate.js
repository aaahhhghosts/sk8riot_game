import Sprite from '/src/Sprite.js';
import { floor } from '/src/constants.js';
import { getRandomInt, add } from '/src/common.js';
import { get_canvas_width } from '/src/Main.js';

export default class Crate extends Sprite {

  static src_0 = '/sprites/wood_crate.png';
  static src_1 = '/sprites/steel_crate.png';

  constructor(x, y, context, image, type) {

      super({
          context: context,
          image: image[type],
          x: x,
          y: y,
          width: 15,
          height: 15,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 1
      });

      this.type = type;

      this.stackedOn = [];
      this.isBroken = false;

      this.hasGravity = true;

      this.moving = true;
  }

  // Stack list of crates below this crate.
  stackOn(crates) {
      crates.forEach((crate, i) => {
          this.stackedOn.push(crate);
          this.floor += (crate.height-1);
          this.y = this.floor;
      });
  }

  break() {
      this.isBroken = true;
      this.row = 1;
  }

  update_crate() {
      super.update();

      if (this.moving) {
          this.x -= 2;
      }

      this.update_floor();
  }

  update_floor() {

      // If there are any crates beneath current crate.
      if (this.stackedOn.length > 0) {

          // Remove broken crates from stack.
          this.stackedOn.forEach((crate, i) => {

              // If crate is broken, remove from stack.
              if (crate.isBroken) {
                  var i = this.stackedOn.indexOf(crate);
                  this.stackedOn.splice(i, 1);

                  // Set new current floor to height below crate.
                  this.floor -= (crate.height-1);
                  console.log("new floor " + this.floor + " curr y " + this.y);
              }
          });
      }
  }
}

export function despawn_crates(crates) {
  crates.forEach((crate, i) => {
      if (crate.x < 0 - crate.width) {

        // If crate leaves map, despawn.
        var i = crates.indexOf(crate);
        crates.splice(i, 1);
      }
  });
}

// Method for spawning in a given number of stacked crates.
export function spawn_crates(context, img_list, crates, count) {

    // Do nothing if illegal input.
    switch(count) {
      case 1: case 2: case 3: case 4:
          break;
      default:
          return;
    }

    // Generate crate stack types
    var crate_types = Array.from({length: count}, () => {return (getRandomInt(0, 4) == 4) ? 1 : 0;});

    // Prevent stack of four steel crates
    if (count == 4) {
        while (crate_types.reduce(add, 0) === 4) {
            crate_types = Array.from({length: count}, () => {return (getRandomInt(0, 4) == 0) ? 1 : 0;});
        }
    }

    var canvas_width = get_canvas_width();

    // Spawn one crate
    var crate_1 = new Crate(canvas_width, floor, context, img_list, crate_types[0]);
    crates.push(crate_1);

    if (count == 1) return;

    // Spawn 2nd crate on top of last one
    var crate_2 = new Crate(canvas_width, floor, context, img_list, crate_types[1]);
    crate_2.stackOn([crate_1]);
    crates.push(crate_2);

    if (count == 2) return;

    // Spawn 3rd crate on top of the last two
    var crate_3 = new Crate(canvas_width, floor, context, img_list, crate_types[2]);
    crate_3.stackOn([crate_1, crate_2]);
    crates.push(crate_3);

    if (count == 3) return;

    // Spawn 4th crate on top of the last three.
    var crate_4 = new Crate(canvas_width, floor, context, img_list, crate_types[3]);
    crate_4.stackOn([crate_1, crate_2, crate_3]);
    crates.push(crate_4);
}
