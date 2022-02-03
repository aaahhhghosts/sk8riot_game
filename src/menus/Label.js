import { get_canvas_height } from '/src/Main.js';
import SmallFont from '/src/menus/SmallFont.js';

export default class Label {

  static src = '/sprites/label.png';

  constructor (x, y, context, background_image, font_image, text) {

    this.width = 33;
    this.height = 11;

    this.x =  Math.floor(x - this.width/2);
    this.y = Math.floor(y - this.height/2)+2;

    this.ctx = context;
    this.background_image = background_image;
    this.row = 0;

    // Set up font variables.
    this.small_font = new SmallFont(context, font_image);
    this.text = text;
    this.max_chars = 7;
    this.text_x = this.x+3;
    this.text_y = this.y+2;
  }

  getText() {return this.text;}
  setText(str) {this.text = str;}

  render() {

      // Get current height of the canvas.
      let canvas_height = Math.floor(get_canvas_height());

      // Draw image background
      this.ctx.drawImage(
          this.background_image,
          0, // The x-axis coordinate of the top left corner
          this.row*this.height, // The y-axis coordinate of the top left corner
          this.width, // The width of the sub-rectangle
          this.height, // The height of the sub-rectangle
          this.x, // The x coordinate
          canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
          this.width, // The width to draw the image
          this.height // The height to draw the image
      );

      this.small_font.draw_string(this.text, this.text_x, this.text_y);
  }
}
