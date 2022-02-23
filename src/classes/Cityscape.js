import Scenery from '/src/Scenery.js';

export default class Cityscape extends Scenery {

  static src = '/sprites/city_scape.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 624,
          height: 126,
          frameIndex: 0,
          column: 0,
          tickCount: 0,
          ticksPerFrame: 0,
          frames: 1
      });
      this.ticksPerRow = 5;

      this.set_scroll(true, 0.5, true, 400);
  }

  update_cityscape() {
      super.update();
  }

  reset_cityscape() {
      super.reset();
      this.set_scroll(true, 0.5, true, 400);
  }
}
