import { get_canvas_height, get_canvas_width } from './Main.js';
import { gravity, floor } from './constants.js';

export default class Sprite {

    constructor(options) {
        this.context = options.context;
        this.image = options.image; // Path to image sprite sheet
        this.x = options.x; // Coordinates on canvas
        this.y = options.y;
        this.width = options.width; // Size of sprite frame
        this.height = options.height;
        this.frames = options.frames; // Number of frames in a row
        this.frameIndex = options.frameIndex; // Current frame
        this.startingFrame = 0; // Frame to begin animation from. Used for cases where the first n frames only play once.
        this.row = options.row; // Row of sprites
        this.ticksPerFrame = options.ticksPerFrame; // Speed of animation
        this.tickCount = options.tickCount; // How much time has passed
        this.loop_animation = options.loop_animation;
        this.hasGravity = options.hasGravity;

        this.despawn_after_animation = true;
        this.is_animation_done = false;

        this.gravity = gravity;
        this.velocity_y = 0;
        this.floor = options.y;
        this.isAirborn = false;
        this.timeSinceAirborn = 0;

        this.does_scroll = true;
        this.scroll_speed = 2;

        this.init_options = options;
    }

    set_scroll(does_scroll, speed) {
        this.does_scroll = does_scroll;
        this.scroll_speed = speed;
    }
    stop_scroll() {this.set_scroll(false, 0);}
    scroll() {this.x -= this.scroll_speed;}

    resize(context) {context = context;}

    apply_gravity() {

        // If higher than floor height, apply gravity.
        if (this.y > this.floor) {

            this.timeSinceAirborn += 1;
            let now = this.timeSinceAirborn;

            // Calculate next y value
            let new_y = this.y + (((this.velocity_y * now)
                        - (this.gravity * (Math.pow(now, 2) / 2))) / 10);

            // Use next y value unless it is below the floor,
            // in which case just set the object on the floor.
            if (new_y >= this.floor) {
                this.y = new_y;
            } else {
                this.y = this.floor;
            }

        // If gravity has dropped object to the current
        // floor height, stop fall and reset fall clock.
        } else if (this.isAirborn) {
              this.isAirborn = false;
              this.timeSinceAirborn = 0;
              this.animate_land();
        }
    }

    animate_land() {return;}

    animate() {
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
            this.tickCount = 0;
            if (this.frameIndex < this.frames - 1) {
                this.frameIndex += 1;
            } else {

                if (this.loop_animation) {
                    this.frameIndex = this.startingFrame;
                } else {
                    this.is_animation_done = true;
                }
            }
        }
    }

    update() {

        if (this.does_scroll) {this.scroll();}
        if (this.hasGravity) {this.apply_gravity();}
        if (this.frames > 1) {this.animate();}
    }

    render() {

        let canvas_height = Math.floor(get_canvas_height());
        this.context.drawImage(
            this.image,
            this.frameIndex * this.width, // The x-axis coordinate of the top left corner
            this.row * this.height, // The y-axis coordinate of the top left corner
            this.width, // The width of the sub-rectangle
            this.height, // The height of the sub-rectangle
            this.x, // The x coordinate
            canvas_height - (this.y+this.height),// The y coordinate
            this.width, // The width to draw the image
            this.height // The width to draw the image
        );
    }

    reset() {

        this.x = this.init_options.x; // Coordinates on canvas
        this.y = this.init_options.y;
        this.width = this.init_options.width; // Size of sprite frame
        this.height = this.init_options.height;
        this.frames = this.init_options.frames; // Number of frames in a row
        this.frameIndex = this.init_options.frameIndex; // Current frame
        this.row = this.init_options.row; // Row of sprites
        this.ticksPerFrame = this.init_options.ticksPerFrame; // Speed of animation
        this.tickCount = this.init_options.tickCount; // How much time has passed
        this.loop_animation = this.init_options.loop_animation;
        this.hasGravity = this.init_options.hasGravity;

        this.velocity_y = 0;
        this.floor = this.init_options.y;
        this.isAirborn = false;
        this.timeSinceAirborn = 0;
    }
}

export function despawn_sprites(sprites) {
    sprites.forEach((s, i) => {
        let out_of_frame = (s.x < 0-s.width || s.x > 100+get_canvas_width());
        let done_rendering = (s.despawn_after_animation && s.is_animation_done);

        if (out_of_frame || done_rendering) {

          // If crate leaves map, despawn.
          let i = sprites.indexOf(s);
          sprites.splice(i, 1);
        }
    });
}
