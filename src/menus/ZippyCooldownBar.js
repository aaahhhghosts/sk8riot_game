import { get_canvas_height } from '../Main.js';

export default class ZippyCooldownBar {

  static src = ['/sprites/menu/zippy_cooldown_bar.png'];

  constructor (context, x, y, image) {

      this.height = 43;
      this.width = 7;
      this.x = x;
      this.y = y;
      this.ctx = context;
      this.image = image;
      this.row = 0;
      this.level = 0;
      this.levels_per_increase = 3;
      this.max_level = 44;

      this.row = 0;
      this.fill_row = 2;
      this.decrease_delay = 0;
      this.is_frozen = false;
      this.x_buffer = 0;
  }

  reset() {
    this.level = 0;
    this.row = 0;
    this.is_frozen = false;
    this.x_buffer = 0;
  }

  increase_level(overheat_sfx) {

      if (!this.is_frozen) {
          let next_level = this.level + this.levels_per_increase;
          if (next_level <= this.height) {
              this.level = next_level;
          } else {

              this.freeze_bar();
              overheat_sfx.play();
          }
      }
  }

  freeze_bar() {
      this.is_frozen = true;
      this.row = 1;
      this.level = this.height;
      this.decrease_delay = 10;
  }

  decrease_level() {
      if (this.decrease_delay == 0) {
          if (this.level > 0) {
              this.level -= 1;
          }
      } else {
          this.decrease_delay -= 1;
      }
  }

  update_zippy_cooldown_bar() {

      if (this.is_frozen && this.level == 0) {
          this.is_frozen = false;
          this.row = 0;
      }

      if (this.is_frozen && this.decrease_delay > 0) {
          this.x_buffer = 1 - this.x_buffer;
      } else {
          this.x_buffer = 0;
      }
  }

  render() {


    let canvas_height = Math.floor(get_canvas_height());
    this.ctx.drawImage(
        this.image,
        this.row*this.width, // The x-axis coordinate of the top left corner
        0, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x+this.x_buffer, // The x coordinate
        canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height // The height to draw the image
    );

    this.ctx.drawImage(
        this.image,
        this.fill_row*this.width, // The x-axis coordinate of the top left corner
        1, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height-this.level, // The height of the sub-rectangle
        this.x+this.x_buffer, // The x coordinate
        canvas_height - (this.y+this.height-1),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height-this.level // The height to draw the image
    );
  }
}
