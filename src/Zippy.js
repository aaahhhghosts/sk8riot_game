import Sprite from '/src/Sprite.js';

export default class Zippy extends Sprite {

  static src = '/sprites/zippy.png';

  constructor(x, y, zippies, context, image) {
      super({
          context: context,
          image: image,
          x: x,
          y: y,
          width: 9,
          height: 9,
          frameIndex: 0,
          row: 0,
          tickCount: 0,
          ticksPerFrame: 1,
          frames: 20,
      });

      this.isFlying = true;
      this.hasExploded = false;

      this.floor_height = 100;
      this.gravity = 0.2;
      this.velocity_y = 2.0;
      this.timeSinceThrow = 0.0;

      this.zippies = zippies;
  }

  animate_throw() {
    this.row = 0;
    this.frames = 20;
    this.frameIndex = 0;
  }

  explode() {

      if (this.isFlying) {
          this.isFlying = false;
          this.row = 1;
          this.frames = 5;
          this.frameIndex = 0;
          this.ticksPerFrame = 2;
      }
  }

  update() {

      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < this.frames - 1) {
              this.frameIndex += 1;
          } else {

              // If zippy is exploding, delete zippy after animation.
              if(!this.isFlying) {
                  this.hasExploded = true;
              }

              this.frameIndex = 0;
          }
      }

      if (this.isFlying) {

          this.timeSinceThrow += 1;
          var now = this.timeSinceThrow;
          var jump_y = -(this.y - this.floor_height);

          // Apply gravity.
          this.y -= (
              ((this.velocity_y * now)
              - (this.gravity * (Math.pow(now, 2) / 2)))
              / 10
          );
          this.x += 1.5;

          // If zippy hits ground, explode.
          if (this.y >= this.floor_height) {
            this.explode();
          }
     }
  }
}
