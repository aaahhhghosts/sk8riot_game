import { get_canvas_width, get_canvas_height } from '../Main.js';

export default class Instruct {

  static src = ['/sprites/menu/instruct.png'];

  constructor (x, y, context, image) {

    this.width = 45;
    this.height = 71;
    this.x = x;
    this.y = y;
    this.ctx = context;
    this.image = image;

    this.frames = 7; // Number of frames in a row
    this.frameIndex = 0; // Current frame
    this.row = 0; // Row of sprites
    this.ticksPerFrame = 15; // Speed of animation
    this.tickCount = 0; // How much time has passed

    this.off_screen = false;
  }

  nudge_off_screen() {
      if (this.x < get_canvas_width()) {
          this.x += 1;
      } else {
          this.off_screen = true;
      }
  }

  animate() {
      this.tickCount += 1;
      if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < this.frames - 1) {
              this.frameIndex += 1;
          } else {
              this.row = this.get_next_row(this.row);
              this.frameIndex = 0;
          }
      }
  }

  // Get next row in animation.
  get_next_row(current) {
      if (current < 2) {
          return current+1;
      } else {
          return 0;
      }
  }

  update_instructs() {
      this.animate();
  }

  render() {
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    let canvas_height = get_canvas_height();

    this.ctx.drawImage(
        this.image,
        this.frameIndex*this.width, // The x-axis coordinate of the top left corner
        this.row*this.height, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height // The height to draw the image
    );
  }
}
