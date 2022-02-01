import { get_canvas_height } from '/src/Main.js';

export default class SmallFont {

  static src = '/fonts/small_font.png';

  constructor(context, image) {

      this.ctx = context;
      this.image = image[0];

      this.letter_width = 4;
      this.letter_height = 6;
      this.alpha_dict = new Map([
          ['A', 0],  ['N', 100], ['0', 101],
          ['B', 1],  ['O', 101], ['1', 200],
          ['C', 2],  ['P', 102], ['2', 201],
          ['D', 3],  ['Q', 103], ['3', 202],
          ['E', 4],  ['R', 104], ['4', 203],
          ['F', 5],  ['S', 105], ['5', 204],
          ['G', 6],  ['T', 106], ['6', 205],
          ['H', 7],  ['U', 107], ['7', 206],
          ['I', 8],  ['V', 108], ['8', 207],
          ['J', 9],  ['W', 109], ['9', 208],
          ['K', 10], ['X', 110], ['!', 209],
          ['L', 11], ['Y', 111], ['?', 210],
          ['M', 12], ['Z', 112], ['-', 211],
                                 ['|', 212],
      ]);
  }

  // Method for drawing individual characters.
  draw_char(char, x, y) {

      // Get index and row of letter on the sprite sheet.
      let char_num = this.alpha_dict.get(char);

      let index = char_num % 100;
      let row = Math.floor(char_num/100);

      let canvas_height = Math.floor(get_canvas_height());

      // Draw letter.
      this.ctx.drawImage(
          this.image,
          index*this.letter_width, // The x-axis coordinate of the top left corner
          row*this.letter_height, // The y-axis coordinate of the top left corner
          this.letter_width, // The width of the sub-rectangle
          this.letter_height, // The height of the sub-rectangle
          x, // The x coordinate
          canvas_height - (y+this.letter_height), // The y coordinate
          this.letter_width, // The width to draw the image
          this.letter_height, // The height to draw the image
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

              let x_pos = x+(i*this.letter_width);
              if (i >= 10) {x_pos += 1;}

              this.draw_char(str[i], x_pos, y);
          }
      }
  }
}
