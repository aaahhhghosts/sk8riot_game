import Sprite from '/src/Sprite.js';

export default class WoodCrate extends Sprite {

  static src = '/sprites/wood_crate.png';

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

      this.stackedOn = [];

      this.wood_crates = wood_crates;

      this.isBroken = false;


      this.floor_height = 100;
      this.stacked_height = this.y;
      this.gravity = 0.2;
      this.timeSinceFall = 0;
  }

  break () {
      this.isBroken = true;
      this.row = 1;
  }

  update() {

      // Move crate toward player.
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

      // If there are any crates beneath current crate.
      if (this.stackedOn.length > 0) {

        // Remove broken crates from stack.
        this.stackedOn.forEach((crate, i) => {

            // If crate is broken, remove from stack.
            if (crate.isBroken) {
              var i = this.stackedOn.indexOf(crate);
              this.stackedOn.splice(i, 1);

              // Set new current floor to height below crate.
              this.stacked_height += (crate.height-1);
            }
        });
      }

      // If higher than current floor height, apply gravity.
      if (this.y < this.stacked_height) {

        this.timeSinceFall += 1;
        var now = this.timeSinceFall;
        this.y += (this.gravity * (Math.pow(now, 2) / 2) / 10);

        // If gravity has dropped crate to the current
        // floor height, stop fall and reset fall clock.
        if (this.y >= this.stacked_height) {
          this.timeSinceFall = 0;
          this.y = this.stacked_height;
        }
      }
  }
}
