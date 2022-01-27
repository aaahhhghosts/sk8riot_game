import { get_canvas_height } from '/src/Main.js';


export default class Button {

  static src = '/sprites/button.png';

  constructor (x, y, context, image, text, action, remove_on_fire) {

    this.width = 82;
    this.height = 24;

    this.x = x - this.width/2;
    this.y = y - this.height/2;

    this.ctx = context;
    this.image = image[0];
    this.row = 0;

    this.text = text;

    let letter_width = 8.5;
    let x_buffer = (this.width-this.text.length*letter_width)/2;
    this.text_x = this.x + x_buffer;
    this.text_y = this.y+10;

    this.is_highlighted = false;

    this.fire = action;
    this.remove_on_fire = remove_on_fire;
  }

  hightlight() {this.is_highlighted = true; this.row = 1; this.text_y-=1;}
  unhighlight() {this.is_highlighted = false; this.row = 0; this.text_y+=1;}

  //Function to check whether a point is inside a rectangle
  isInside (pos) {
     //console.log("x: " + pos.x + " y: " + pos.y);
      //console.log(pos.y + " > " + (this.y+2) + " && " + pos.y + " < " + (this.y+this.height))
      let within_x_bounds = pos.x > this.x && pos.x < this.x+this.width;
      let within_y_bounds = pos.y > this.y+2 && pos.y < this.y+this.height;
      return (within_x_bounds && within_y_bounds);
  }

  render() {
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    var canvas_height = get_canvas_height();

    this.ctx.drawImage(
        this.image,
        0, // The x-axis coordinate of the top left corner
        this.row*this.height, // The y-axis coordinate of the top left corner
        this.width, // The width of the sub-rectangle
        this.height, // The height of the sub-rectangle
        this.x, // The x coordinate
        canvas_height - (this.y+this.height),// The y coordinate,// The y coordinate
        this.width, // The width to draw the image
        this.height // The height to draw the image
    );

    this.ctx.font = "10px Arcade_BG";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(this.text, this.text_x, canvas_height - (this.text_y));
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "10px Arcade";
    this.ctx.fillText(this.text, this.text_x, canvas_height - (this.text_y));
  }
}
