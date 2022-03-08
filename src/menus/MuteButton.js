import { get_canvas_height } from '../Main.js';

export default class MuteButton {

  static src = ['/sprites/menu/mute_button.png'];

  constructor (x, y, context, btn_image, action) {

    this.width = 11;
    this.height = 12;

    this.x =  Math.floor(x - this.width/2);
    this.y = Math.floor(y - this.height/2)+2;

    this.ctx = context;
    this.btn_image = btn_image;
    this.column = 0;
    this.row = 0;

    this.is_highlighted = true;
    this.fire = action;
  }

  hightlight() {
      this.is_highlighted = true;
      this.row = 1;
  }

  unhighlight() {
      this.is_highlighted = false;
      this.row = 0;
  }

  update_icon(is_fullscreen) {
      if (is_fullscreen) {this.column = 1;}
      else {this.column = 0;}
  }

  //Function to check whether a point is inside a rectangle
  isInside (pos) {
      let within_x_bounds = pos.x > this.x && pos.x < this.x+this.width;
      let within_y_bounds = pos.y > this.y+2 && pos.y < this.y+this.height;
      return (within_x_bounds && within_y_bounds);
  }

  render() {

      // Get current height of the canvas.
      let canvas_height = Math.floor(get_canvas_height());

      // Draw image background
      this.ctx.drawImage(
          this.btn_image,
          this.column*this.width, // The x-axis coordinate of the top left corner
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
