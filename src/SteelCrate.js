import Sprite from '/src/Sprite.js';

export default class SteelCrate extends Sprite {

  static src = '/sprites/steel_crate.png';

  constructor(x, y, steel_crates, context, image) {
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

      this.steel_crates = steel_crates;
      this.isBroken = false;
  }

  update() {

      this.x -= 2;

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
