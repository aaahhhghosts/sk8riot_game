import { get_canvas_height } from '../Main.js';
import KALabel from './KALabel.js';

export default class Button {

  static src = ['/sprites/menu/button.png'];

  constructor (x, y, context, btn_image, font_image, text, action) {

    this.width = 82;
    this.height = 24;
    this.x = Math.floor(x - this.width/2);
    this.y = Math.floor(y - this.height/2);
    this.ctx = context;
    this.btn_image = btn_image;
    this.row = 0;

    this.kalabel = new KALabel(context, this.x, this.y, font_image, text, this.width);
    this.is_highlighted = false;
    this.keep_highlighted = false;
    this.fire = action;
  }

  hightlight() {this.is_highlighted = true; this.row = 1; this.text_y-=1;}
  unhighlight() {this.is_highlighted = false; this.row = 0; this.text_y+=1;}

  //Function to check whether a point is inside a rectangle
  isInside (pos) {
      let within_x_bounds = pos.x > this.x && pos.x < this.x+this.width;
      let within_y_bounds = pos.y > this.y+2 && pos.y < this.y+this.height;
      return (within_x_bounds && within_y_bounds);
  }

  render() {

    let canvas_height = Math.floor(get_canvas_height());
    this.ctx.drawImage(
        this.btn_image,
        0, // The x-axis coordinate of the top left corner
        this.row*this.height, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height // The height to draw the image
    );

    this.kalabel.draw_string(this.is_highlighted);
  }
}
