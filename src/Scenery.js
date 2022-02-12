import { get_canvas_height } from '/src/Main.js';

export default class Scenery {

constructor(options) {
    this.context = options.context;
    this.image = options.image; // Path to image sprite sheet
    this.x = options.x; // Coordinates on canvas
    this.y = options.y;
    this.width = options.width; // Size of sprite frame
    this.height = options.height;
    this.frames = options.frames; // Number of frames in a row
    this.frameIndex = options.frameIndex; // Current frame
    this.column = options.column; // column of scenery frames
    this.ticksPerFrame = options.ticksPerFrame; // Speed of animation
    this.tickCount = options.tickCount; // How much time has passed

    this.does_scroll = false;
    this.scroll_speed = 0;
    this.scroll_reset = false;
    this.scroll_reset_x = 0;

    this.loop_animation = true;

    this.init_options = options;
}

resize(context) {
    context = context;
}

set_scroll(does_scroll, speed, reset, reset_x) {
    this.does_scroll = does_scroll;
    this.scroll_speed = speed;
    this.scroll_reset = reset;
    this.scroll_reset_x = reset_x;
}

stop_scroll() {
    this.set_scroll(false, 0, false, 0);
}

scroll() {

    this.x -= this.scroll_speed;
    if (this.scroll_reset && this.x < -this.scroll_reset_x) {
        this.x = 0;
    }
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

    if (this.does_scroll) {
        this.scroll();
    }

    if (this.frames > 1) {
        this.animate();
    }
}

render() {
    //console.log("draw height " + get_canvas_height() - 10);
    var canvas_height = get_canvas_height();

    this.context.drawImage(
        this.image,
        this.column * this.width, // The x-axis coordinate of the top left corner
        this.frameIndex * this.height, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        get_canvas_height() - (this.y+this.height),// The y coordinate
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
  }
}
