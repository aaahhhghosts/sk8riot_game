import { get_canvas_height } from '/src/Main.js';
import { sm_char_width, sm_char_height } from '/src/constants.js';
import SMLabel from '/src/menus/SMLabel.js';

export default class Leaderboard {

    static src = ['/sprites/menu/leaderboard.png'];
    static saved_src = '/saved_data/highscores.json';

    constructor (x, y, context, background_image, font_image, saved_data) {

      this.width = 100;
      this.height = 70;
      this.x = Math.floor(x - this.width/2);
      this.y = Math.floor(y - this.height/2)+5;

      this.ctx = context;
      this.background_image = background_image;
      this.row = 0;

      this.x_buffer = sm_char_width+2;
      this.y_buffer = sm_char_height+2;

      this.line_char_max = 22;
      this.saved_data = saved_data["highscores"];

      let x_pos = this.x+this.x_buffer;
      this.entry_labels = [];
      this.saved_data.forEach((entry, i) => {

          // Calculate y position for small font label.
          let y_pos = (this.y-i*this.y_buffer)+44;

          // Begin building entry string.
          let name_str = (i+1).toString() + " " + entry.name;

          // If score is 100 billion or more, nerf it lmao.
          let score_str;
          if (entry.score <= Math.pow(10, 11)) {
              score_str = entry.score.toString();
          } else {
              score_str = "9".repeat(11);
          }

          // Calculate how many spaces to place between name and score.
          let num_spaces = this.line_char_max - name_str.length - score_str.length;
          let line_string = name_str + " ".repeat(num_spaces) + score_str;

          // Add finished string to leaderboard as small font label.
          this.entry_labels.push(new SMLabel(context, x_pos, y_pos, font_image, line_string));
        });
    }

    render() {
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        let canvas_height = get_canvas_height();
        this.ctx.drawImage(
            this.background_image,
            0, // The x-axis coordinate of the top left corner
            this.row*this.height, // The y-axis coordinate of the top left corner
            this.width, // The width of the sub-rectangle
            this.height, // The height of the sub-rectangle
            this.x, // The x coordinate
            canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
            this.width, // The width to draw the image
            this.height, // The height to draw the image
        );

        // Print highscore entries to leaderboard display.
        this.entry_labels.forEach((label, i) => {
            label.draw_string();
        });
    }
}
