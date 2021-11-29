import Sprite from '/src/Sprite.js';

export default class Ground1 extends Sprite {

  static src = '/sprites/ground1.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 400,
          height: 25,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 1
      });
  }

  resize(context) {
    super.context = context;
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
          if (this.x < -this.width/2) {
            this.x = 0;
          }
      }
  }

}
