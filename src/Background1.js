import Sprite from '/src/Sprite.js';

export default class Ground1 extends Sprite {

  static src = '/sprites/background1.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 800,
          height: 110,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 1
      });
      this.ticksPerRow = 20;
  }

  resize(context) {
    super.context = context;
  }

  update() {
      this.tickCount += 1;

      this.x -= 1;
      if (this.x < - (600)) {
        this.x = 0;
      }

      if (this.tickCount > this.ticksPerRow) {
        this.row ^= 1;
        this.tickCount = 0;
      }
  }
}
