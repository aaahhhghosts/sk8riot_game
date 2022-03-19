import { get_canvas_height } from '../Main.js';
import { sm_char_width, sm_char_height } from '../constants.js';
import SMLabel from './SMLabel.js';

export default class Leaderboard {

    static src = ['/sprites/menu/leaderboard.png'];

    constructor (x, y, context, background_image, font_image, saved_data) {

        this.width = 100;
        this.height = 69;
        this.x = Math.floor(x - this.width/2);
        this.y = Math.floor(y - this.height/2)+6;

        this.ctx = context;
        this.background_image = background_image;
        this.font_image = font_image;
        this.row = 0;

        this.page = 0;
        this.min_page = 0;
        this.max_page = 3;
        this.saved_data = saved_data;

        // Set variables for text spacing and limits.
        this.x_buffer = sm_char_width+2;
        this.y_buffer = sm_char_height+2;
        this.line_char_max = 22;

        // List to hold all leaderboard entries.
        this.entry_labels = [];

        // If no saved data provided, display error msg leaderboard.
        if (saved_data == null) {
            this.display_error();

        // Else, populate leaderboard with saved data.
        } else {
            this.refresh_board();
        }
    }

    update_saved_data(saved_data) {this.saved_data = saved_data; this.refresh_board();}

    // Go to next page of leaderboard entries.
    next_page(saved_data) {
        if (this.page < this.max_page) {
            this.page += 1;
        } else {
            this.page = this.min_page;
        }
        this.refresh_board();
    }

    // Go to previous page of leaderboard entries.
    prev_page(saved_data) {
        if (this.page > this.min_page) {
            this.page -= 1;
        } else {
            this.page = this.max_page;
        }
        this.refresh_board();
    }

    // Function to populate the leaderboard with entries.
    refresh_board() {

        // Reset entry labels to empty.
        this.entry_labels = [];

        // Display error and bail if data is null.
        if (this.saved_data == null) {
            this.display_error();
            return;
        }

        // X position for all entries.
        let x_pos = this.x+this.x_buffer;

        // Else, for each entry in data, build a label.
        for (let i = 0; i < 5; i++) {

            let name, score;
            let entry_num = 5*this.page + i;

            // If entry num is valid, get data from saved data.
            if (entry_num < this.saved_data.length) {
                let entry = this.saved_data[entry_num];
                name = entry.name;
                score = entry.score;

            // Else, set empty values.
            } else {
               name = '';
               score = 0;
            }

            // Calculate y position for small font label.
            let y_pos = (this.y-i*this.y_buffer)+44;

            // Begin building entry string.
            let name_str = (entry_num+1).toString() + " " + name;

            // If score is 100 billion or more, nerf it lmao.
            let score_str;
            if (score == 0) {
                score_str = '';
            } else if (score <= Math.pow(10, 11)) {
                score_str = score.toString();
            } else {
                score_str = "9".repeat(11);
            }

            // Calculate how many spaces to place between name and score.
            let num_spaces = this.line_char_max - name_str.length - score_str.length;
            let line_string = name_str + " ".repeat(num_spaces) + score_str;

            // Add finished string to leaderboard as small font label.
            this.entry_labels.push(new SMLabel(this.ctx, x_pos, y_pos, this.font_image, line_string));
        };
    }

    // Functions to set leaderboard background.
    congrat_player() {this.row = 1;}
    display_error() {this.row = 2; this.entry_labels = [];}

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
