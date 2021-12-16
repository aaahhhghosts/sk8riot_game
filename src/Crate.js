import Sprite from '/src/Sprite.js';

export default class Crate extends Sprite {

  static src = '/sprites/wooden_crate.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
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
  }

  update() {

      if (this.x > 0 - this.width) {
          this.x -= 2;
      } else {
        this.x = 200;
      }

      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < this.frames - 1) {
              this.frameIndex += 1;
          } else {
              this.frameIndex = 0;
          }
      }
  }
}
