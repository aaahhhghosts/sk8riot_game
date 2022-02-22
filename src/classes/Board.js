import Sprite from '/src/Sprite.js';
import { sk8r_floor } from '/src/constants.js';
import { get_canvas_height } from '/src/Main.js';

export default class Board extends Sprite {

  constructor(x, y, context, image, crates, cars) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 27,
          height: 12,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 5,
          loop_animation: false,
          hasGravity: true
      });

      this.floor = sk8r_floor;
      this.velocity_y = 1;
      this.set_scroll(0, false);

      this.car_beneath = null;

      // Loop through all creates.
      crates.filter(crate => !crate.isBroken).some((crate, j) => {

          // If crate is at the same place as board
          if (this.x >= crate.x-crate.width && this.x <= crate.x+crate.width/2) {

              // Get y coord of the top of this crate.
              let top_of_crate = crate.y+(crate.height-1);

              // Else if board clears the top of crate, update the current floor.
              if (this.floor < top_of_crate) {
                  this.floor = top_of_crate;
              }
          }
      });

      // Loop through all cars.
      cars.filter(car => !car.isBroken).some((car, j) => {

          // If car is at the same place as sk8r
          if (this.x >= car.x-19 && this.x <= car.x+car.width-7) {

              // Get y coord of the top of this car.
              let top_of_car = car.y+car.height/2-1;

              if (this.x >= car.x+7 && this.x <= car.x+56) {
                  top_of_car = car.y+(car.height-4);
              }

              // Else if sk8r clears the top of car, update the current floor.
              if (this.floor < top_of_car) {

                  this.floor = top_of_car;
                  this.car_beneath = car;
              }
          }
      });
  }

  update_board() {

      if (this.car_beneath != null && this.frameIndex >= this.frames-1) {

          if (this.car_beneath.isBroken) {
              this.car_beneath = null;
              this.floor = sk8r_floor;

          } else {
              if (this.car_beneath.frameIndex == 1) {
                  this.y = this.floor-1;
              } else {
                  this.y = this.floor;
              }
          }
      }
      super.update();
  }

  render() {

      let canvas_height = Math.floor(get_canvas_height());
      this.context.drawImage(
          this.image,
          this.frameIndex * this.width, // The x-axis coordinate of the top left corner
          this.image.height-this.height, // The y-axis coordinate of the top left corner
          this.width, // The width of the sub-rectangle
          this.height, // The height of the sub-rectangle
          this.x, // The x coordinate
          canvas_height - (this.y+this.height),// The y coordinate
          this.width, // The width to draw the image
          this.height // The width to draw the image
      );
  }
}
