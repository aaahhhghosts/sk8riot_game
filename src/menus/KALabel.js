import { get_canvas_height } from '/src/Main.js';
import { karmatic_arcade_alpha_dict, ka_char_width, ka_char_height } from '/src/constants.js';

export default class KALabel {

  constructor(context, x, y, font_image, str, width) {

      this.x = x;
      this.y = y+7;
      this.ctx = context;
      this.font_image = font_image[0];
      this.str = str.toUpperCase();

      this.char_width = ka_char_width;
      this.char_height = ka_char_height;
      this.str_length = 0;
      this.char_coords = [];

      // Build list of letter x position and font table coords.
      for (let i = 0; i < this.str.length; i++) {
          let char = this.str[i];

          if (char == " ") {
              this.str_length += this.char_width;
          } else if (char.match(/[A-Z0-9!?\-]/)) {
              this.char_coords.push(this.get_char_coords(char));
          }
      }

      // Center text within given width, if provided.
      if (width != undefined) {
          this.x += Math.floor((width-this.str_length)/2);
      }
  }

  get_char_coords(char) {

      // Get index and row of char on the sprite sheet.
      let char_data = karmatic_arcade_alpha_dict.get(char);
      let char_num = char_data[0];

      let index = char_num % 100;
      let row = Math.floor(char_num/100);

      let x_buffer = 0;
      if (char_data[1] != undefined) {
          x_buffer = char_data[1];
      }

      let coords = [this.str_length-x_buffer, row, index];
      this.str_length += (this.char_width-2-x_buffer);
      return coords;
  }

  // Method for drawing individual characters.
  draw_string(is_highlight) {

      let y_buffer = 0;
      if (is_highlight) {y_buffer = 1;}

      let canvas_height = Math.floor(get_canvas_height());
      this.char_coords.forEach((coord, i) => {

          let x_pos = coord[0];
          let row = coord[1];
          let index = coord[2];

          // Draw char.
          this.ctx.drawImage(
              this.font_image,
              index*this.char_width, // The x-axis coordinate of the top left corner
              row*this.char_height, // The y-axis coordinate of the top left corner
              this.char_width, // The width of the sub-rectangle
              this.char_height, // The height of the sub-rectangle
              this.x+x_pos, // The x coordinate
              canvas_height-(this.y+this.char_height)+y_buffer, // The y coordinate
              this.char_width, // The width to draw the image
              this.char_height, // The height to draw the image
          );
      });
    }
}
