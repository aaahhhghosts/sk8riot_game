import { get_canvas_width, get_canvas_height } from '/src/Main.js';
import { karmatic_arcade_alpha_dict, ka_char_width, ka_char_height } from '/src/constants.js';

export default class KAFont {

  static src = ['/sprites/menu/karmatic_arcade_font.png'];

  constructor(context, x, y, image) {

      this.x = x;
      this.y = y;
      this.ctx = context;
      this.image = image;

      this.char_width = ka_char_width;
      this.char_height = ka_char_height;
      this.text = "";
  }

  setText(text) {
      this.text = text;
  }

  // Method for drawing score.
  render() {

      let string_length = (this.text.length*(this.char_width-2));
      let canvas_width = Math.floor(get_canvas_width());
      let cursor_x = 0;

      for (let i = 0; i < this.text.length; i++) {
          let char = this.text[i];

          if (char == " ") {
              cursor_x += this.char_width;
          } else if (char.match(/[A-Z0-9!?\-]/)) {

              // Get index of character from font sheet.
              let char_data = karmatic_arcade_alpha_dict.get(char);
              let char_num = char_data[0];
              let index = char_num % 100;
              let row = Math.floor(char_num/100);

              // Set character's x position and update string length.
              let x_pos = cursor_x;
              cursor_x += (this.char_width-2);

              // Draw char.
              this.ctx.drawImage(
                  this.image,
                  index*this.char_width, // The x-axis coordinate of the top left corner
                  row*this.char_height, // The y-axis coordinate of the top left corner
                  this.char_width, // The width of the sub-rectangle
                  this.char_height, // The height of the sub-rectangle
                  canvas_width+(x_pos-string_length)-this.x, // The x coordinate
                  this.y, // The y coordinate
                  this.char_width, // The width to draw the image
                  this.char_height, // The height to draw the image
              );
           }
        }
    }
}
