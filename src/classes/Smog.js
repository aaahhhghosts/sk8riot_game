import Scenery from '../Scenery.js';
import { get_canvas_width } from '../Main.js';

export default class Smog extends Scenery {

  static src = ['/sprites/smog.png'];

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 824,
          height: 126,
          frameIndex: 0,
          column: 0,
          tickCount: 0,
          ticksPerFrame: 10,
          frames: 2
      });

      this.set_scroll(true, 0.75, true, 2*get_canvas_width());
  }

  update_smog() {
      super.update();
  }

  reset_smog() {
      super.reset();
      this.set_scroll(true, 0.75, true, 2*get_canvas_width());
  }
}
