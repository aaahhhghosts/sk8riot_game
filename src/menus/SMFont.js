import { get_canvas_height } from '/src/Main.js';
import { small_font_alpha_dict, sm_char_width, sm_char_height } from '/src/constants.js';

export default class SMFont {

  static src = ['/fonts/small_font.png'];

  constructor(context, font_image) {

      this.ctx = context;
      this.font_image = font_image;

      this.char_width = sm_char_width;
      this.char_height = sm_char_height;
  }

  // Method for drawing individual characters.
  draw_char(char, x, y) {

      // Get index and row of letter on the sprite sheet.
      let char_num = small_font_alpha_dict.get(char);
      let index = char_num % 100;
      let row = Math.floor(char_num/100);

      let canvas_height = Math.floor(get_canvas_height());

      // Draw letter.
      this.ctx.drawImage(
          this.font_image,
          index*this.char_width, // The x-axis coordinate of the top left corner
          row*this.char_height, // The y-axis coordinate of the top left corner
          this.char_width, // The width of the sub-rectangle
          this.char_height, // The height of the sub-rectangle
          x, // The x coordinate
          canvas_height - (y+this.char_height), // The y coordinate
          this.char_width, // The width to draw the image
          this.char_height, // The height to draw the image
      );
  }

  // Method for drawing a whole string.
  draw_string(str, x, y) {

      // Clean up input for conversion to font.
      str = str.toUpperCase();

      // For each valid character in string, draw it.
      for (var i = 0; i < str.length; i++) {

          if (str[i] == " ") {
              continue;
          } else if (str[i].match(/[A-Z0-9!?|\-]/)) {

              let x_pos = x+(i*this.char_width);
              if (i >= 10) {x_pos += 1;}

              this.draw_char(str[i], x_pos, y);
          }
      }
  }
}
