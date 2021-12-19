import Sprite from '/src/Sprite.js';

export default class Crate extends Sprite {

  static src = '/sprites/wooden_crate.png';

  constructor(x, y, wood_crates, context, image) {
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

      this.wood_crates = wood_crates;

      this.isBroken = false;
  }

  break () {
      this.isBroken = true;
      this.row = 1;
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
