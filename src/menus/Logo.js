import { get_canvas_height } from '/src/Main.js';


export default class Button {

  static src = '/sprites/logo.png';

  constructor (x, y, context, image) {

    this.width = 175;
    this.height = 50;

    this.x = x - this.width/2;
    this.y = y - this.height/2;

    this.ctx = context;
    this.image = image[0];
    this.row = 0;

    this.off_screen = false;
  }

  nudge_off_screen() {
      if (this.y < get_canvas_height()) {
          this.y += 1;
      } else {
          this.off_screen = true;
      }
  }

  render() {
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    let canvas_height = get_canvas_height();

    this.ctx.drawImage(
        this.image,
        0, // The x-axis coordinate of the top left corner
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
