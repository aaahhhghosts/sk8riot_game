import Scenery from '/src/Scenery.js';

export default class Smog extends Scenery {

  static src = '/sprites/smog.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image[0],
          x: x,
          y: y,
          width: 600,
          height: 125,
          frameIndex: 0,
          column: 0,
          tickCount: 0,
          ticksPerFrame: 10,
          frames: 2
      });

      this.set_scroll(true, 0.75, true, 400);
  }

  update_smog() {
      super.update();

  }

  reset_smog() {
      super.reset();
      this.set_scroll(true, 0.75, true, 400);
  }
}
