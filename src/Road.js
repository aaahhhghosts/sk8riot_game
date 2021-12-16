import Sprite from '/src/Sprite.js';

export default class Road extends Sprite {

  static src = '/sprites/road.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 400,
          height: 14,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 1
      });
  }

  update() {
      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;

          if (this.frameIndex < this.frames - 1) {
              this.frameIndex += 1;
          } else {
              this.frameIndex = 0;
          }

          this.x -= 4;
          if (this.x < -200) {
            this.x = 0;
          }
      }
  }

}
