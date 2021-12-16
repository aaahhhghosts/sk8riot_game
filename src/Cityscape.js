import Sprite from '/src/Sprite.js';

export default class Cityscape extends Sprite {

  static src = '/sprites/cityscape.png';

  constructor(x, y, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 400,
          height: 110,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 2,
          frames: 1
      });
      this.ticksPerRow = 5;
  }

  update() {
      this.tickCount += 1;

      this.x -= 1;
      if (this.x < - (200)) {
        this.x = 0;
      }
  }

}
