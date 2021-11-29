import Sprite from '/src/Sprite.js';

export default class Sk8r extends Sprite {

  static src = '/sprites/sk8r.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 27,
          height: 36,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 6,
          frames: 6
      });
  }

  resize(context) {
    super.context = context;
  }

  /*walk() {
      this.frames = 1;
      this.frameIndex = 0;
      this.row = 1;
      this.ticksPerFrame = 4;
  }

  run() {
      this.frames = 1;
      this.frameIndex = 0;
      this.row = 2;
      this.ticksPerFrame = 2;
  }

  idle() {
      this.frames = 1;
      this.frameIndex = 0;
      this.row = 0;
      this.ticksPerFrame = 12;
  }*/
}
