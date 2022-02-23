import { get_canvas_height } from '/src/Main.js';

export default class Version {

  static src = ['/sprites/menu/version.png'];

  constructor (context, x, y, image) {

    this.width = 23;
    this.height = 10;
    this.x = x;
    this.y = y;
    this.ctx = context;
    this.image = image;
  }

  render() {

    let canvas_height = get_canvas_height();
    this.ctx.drawImage(
        this.image,
        0, // The x-axis coordinate of the top left corner
        0, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height // The height to draw the image
    );
  }
}
