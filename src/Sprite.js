import { get_canvas_height } from '/src/Main.js';
import { gravity, floor } from '/src/constants.js';

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
    this.row = options.row; // Row of sprites
    this.ticksPerFrame = options.ticksPerFrame; // Speed of animation
    this.tickCount = options.tickCount; // How much time has passed

    this.hasGravity = false;
    this.gravity = gravity;
    this.velocity_y = 0;
    this.floor = options.y;
    this.isAirborn = false;
    this.timeSinceAirborn = 0;

    this.loop_animation = true;
}

resize(context) {
    context = context;
}

apply_gravity() {

    // If higher than floor height, apply gravity.
    if (this.y > this.floor) {

        this.timeSinceAirborn += 1;
        var now = this.timeSinceAirborn;

        // Calculate next y value
        var new_y = this.y + (((this.velocity_y * now)
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

animate_land() {
    return;
}

animate() {
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        if (this.frameIndex < this.frames - 1) {
            this.frameIndex += 1;
        } else {

            if (this.loop_animation) {
                this.frameIndex = 0;
            }
        }
    }
}

update() {

    if (this.hasGravity) {
        this.apply_gravity();
    }

    if (this.frames > 1) {
        this.animate();
    }
}

render() {

    var canvas_height = get_canvas_height();

    this.context.drawImage(
        this.image,
        this.frameIndex * this.width, // The x-axis coordinate of the top left corner
        this.row * this.height, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        get_canvas_height() - (this.y+this.height),// The y coordinate
        this.width, // The width to draw the image
        this.height // The width to draw the image
    );
  }
}
