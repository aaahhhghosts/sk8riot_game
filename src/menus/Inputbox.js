import { get_canvas_height } from '../Main.js';
import SMFont from '../menus/SMFont.js';

export default class Inputbox {

  static src = ['/sprites/menu/input_box.png'];

  constructor (x, y, context, background_image, font_image, player_savename) {

    this.width = 40;
    this.height = 10;

    this.x =  Math.floor(x - this.width/2);
    this.y = Math.floor(y - this.height/2)+2;

    this.ctx = context;
    this.background_image = background_image;

    // Set up font variables.
    this.small_font = new SMFont(context, font_image);

    // Set default name entered into inputbox.
    this.text = player_savename;
    if (player_savename == '') {this.text = "yo-name";}

    // Input box letter vars.
    this.max_chars = 8;
    this.hold_shift = false;
    this.text_x = this.x+4;
    this.text_y = this.y+1;

    // Start input box off as active and highlighted.
    this.row = 0;
    this.is_highlighted = true;
    this.show_cursor = true;
    this.disable_cursor = false;

    this.ticksPerBlink = 20; // Speed of cursor animation
    this.tickCount = 0; // How much time has passed
  }

  getText() {return this.text;}
  setText(str) {this.text = str;}

  hightlight() {
      this.is_highlighted = true;
      this.row = 0;
      this.show_cursor = false;
      this.tickCount = 0;
      this.disable_cursor = false;
  }

  unhighlight() {
      this.is_highlighted = false;
      this.row = 1;
      this.disable_cursor = true;
  }

  toggle_show_cursor() {
      if (this.show_cursor) {this.show_cursor = false;}
      else {this.show_cursor = true;}
  }

  //Function to check whether a point is inside a rectangle
  isInside (pos) {
      let within_x_bounds = pos.x > this.x && pos.x < this.x+this.width;
      let within_y_bounds = pos.y > this.y+2 && pos.y < this.y+this.height;
      return (within_x_bounds && within_y_bounds);
  }

  // Update state of input box.
  update_inputbox() {

      if (!this.disable_cursor) {

          this.tickCount += 1;
          if (this.tickCount > this.ticksPerBlink) {
              this.toggle_show_cursor();
              this.tickCount = 0;
          }
      }
  }

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

      let line_string = this.text;

      // If displaying cursor is not disabled, show it every blick.
      if (!this.disable_cursor) {
          if (this.show_cursor && this.text.length < 8) {
              line_string += "|";
          }
      }

      this.small_font.draw_string(line_string, this.text_x, this.text_y);
  }
}
