import { get_canvas_height } from '/src/Main.js';
import SMLabel from '/src/menus/SMLabel.js';

export default class DeathMsgLabel {

  static src = ['/sprites/death_label.png'];

  constructor (context, x, y, label_image, font_image, text) {

      this.width = 140;
      this.height = 11;
      this.x = Math.floor(x - this.width/2);
      this.y = Math.floor(y - this.height/2);
      this.ctx = context;
      this.label_image = label_image;
      this.font_image = font_image;
      this.row = 0;

      this.smlabel = new SMLabel(context, this.x+3, this.y-5, font_image, text);
  }

  render() {

    let canvas_height = Math.floor(get_canvas_height());
    this.ctx.drawImage(
        this.label_image,
        0, // The x-axis coordinate of the top left corner
        this.row*this.height, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height // The height to draw the image
    );
    this.smlabel.draw_string();
  }
}
