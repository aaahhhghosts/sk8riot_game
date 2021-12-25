import { get_canvas_height } from '/src/Main.js';

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
}

resize(context) {
    context = context;
}

update() {
    this.tickCount += 1;
    if (this.tickCount > this.ticksPerFrame) {
        this.tickCount = 0;
        if (this.frameIndex < this.frames - 1) {
            this.frameIndex += 1;
        } else {
            this.frameIndex = 0;
        }
    }
}

render() {
  //console.log("draw height " + get_canvas_height() - 10);
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
