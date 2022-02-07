import Sprite from '/src/Sprite.js';
import { floor } from '/src/constants.js';
import { getRandomInt, add } from '/src/common.js';
import { get_canvas_width } from '/src/Main.js';

export default class Car extends Sprite {

  static src = '/sprites/cop_car.png';

  constructor(x, y, context, image) {

      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 83,
          height: 33,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 15,
          frames: 2,
          loop_animation: true,
          hasGravity: false,
      });

      this.stackedOn = [];
      this.isBroken = false;
      this.health = 4;

      this.moving = true;
  }

  damage() {

      if (this.row != 1) {this.row = 1;}

      this.health -= 1;
      
      if (this.health < 2) {this.row = 2;}

      if (this.health <= 0) {
          this.break();
      }
  }

  break() {
      this.isBroken = true;
      this.row = 3;
  }

  update_car() {
      super.update();

      if (this.moving) {
          this.x -= 2;
      }
  }
}

export function despawn_cars(cars) {
  cars.forEach((car, i) => {
      if (car.x < 0 - car.width) {

        // If crate leaves map, despawn.
        let i = cars.indexOf(car);
        cars.splice(i, 1);
      }
  });
}
