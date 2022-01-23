import Scenery from '/src/Scenery.js';

export default class Cityscape extends Scenery {

  static src = '/sprites/cityscape.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 400,
          height: 125,
          frameIndex: 0,
          column: 0,
          tickCount: 0,
          ticksPerFrame: 0,
          frames: 1
      });
      this.ticksPerRow = 5;

      this.set_scroll(true, 1, true, 200);
  }

  update_cityscape() {
      super.update();
  }

  reset_cityscape() {
      super.reset();
      this.set_scroll(true, 1, true, 200);
  }
}
