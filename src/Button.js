const letter_width = 9;
const letter_height = 10;
const x_padding = 3;
const y_padding = 3;

export default class Button {

  constructor (x, y, context, text) {

    this.ctx = context;

    this.width = (text.length*letter_width-3) + (2*x_padding);
    this.height = letter_height + (2*y_padding);

    this.x = x - this.width/2;
    this.y = y - this.height/2;

    this.text = text;

    this.text_x = this.x + x_padding;
    this.text_y = (this.y+letter_height-2) + y_padding;

    this.draw_background_rect = true;
  }

  setText(text) {
    this.text = text;
  }

  //Function to check whether a point is inside a rectangle
  isInside (pos) {
      //console.log("x: " + pos.x + " y: " + pos.y);
      //console.log(pos.x + " > " + this.x + " && " + pos.x + " < " + (this.x+this.width) + " && " + pos.y + " > " + (this.y-this.height+16) + " && " + pos.y + " < " + (this.y+14))
      var within_x_bounds = pos.x > this.x && pos.x < this.x+this.width;
      var within_y_bounds = pos.y > this.y-this.height+16 && pos.y < this.y+14;
      return (within_x_bounds && within_y_bounds);
  }

  update() {
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    if (this.draw_background_rect) {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.ctx.font = "10px Arcade_BG";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(this.text, this.text_x, this.text_y);
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "10px Arcade";
    this.ctx.fillText(this.text, this.text_x, this.text_y);
  }
}
