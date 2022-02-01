import { get_canvas_height } from '/src/Main.js';
import SmallFont from '/src/menus/SmallFont.js';


export default class Leaderboard {

  static src = '/sprites/leaderboard.png';
  static saved_src = '/saved_data/highscores.json';

  constructor (x, y, context, background_image, font_image, saved_data) {

    this.width = 100;
    this.height = 70;

    this.x = Math.floor(x - this.width/2);
    this.y = Math.floor(y - this.height/2)+5;

    this.ctx = context;
    this.background_image = background_image[0];
    this.row = 0;

    this.small_font = new SmallFont(context, font_image);
    this.x_buffer = this.small_font.letter_width+2;
    this.y_buffer = 2*this.small_font.letter_width;
    this.text_y = this.y-33;

    this.line_char_max = 22;
    this.saved_data = saved_data["highscores"];
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

    let x_pos = this.x+this.x_buffer;
    this.saved_data.forEach((entry, i) => {

        let y_pos = canvas_height-(this.text_y + i*this.y_buffer);

        let name_str = (i+1).toString() + " " + entry.name;
        let score_str = entry.score.toString();

        // If score is 100 billion or more, nerf it lmao.
        if (score_str.length > 11) {
            score_str = score_str.substring(0, 11);
        }

        // Calculate how many spaces to place between name and score.
        let num_spaces = this.line_char_max - name_str.length - score_str.length;
        let line_string = name_str + " ".repeat(num_spaces) + score_str;

        // Print highscore entry to leaderboard display.
        this.small_font.draw_string(line_string, x_pos, y_pos);
    });
  }
}
