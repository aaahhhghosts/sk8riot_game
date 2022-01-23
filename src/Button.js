export default class Button {

  constructor (x, y, context, width, height, text) {

    this.x = x;
    this.y = y;
    this.ctx = context;
    this.width = width;
    this.height = 10;
    this.text = text;
  }

  setText(text) {
    this.text = text;
  }

  //Function to check whether a point is inside a rectangle
  isInside (pos) {
      return (pos.x > this.x && pos.x < this.x+62 && pos.y > this.y-7 && pos.y < this.y);
  }

  update() {
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(this.x-2, this.y-7, 64, this.height);
    this.ctx.font = "10px Arcade_BG";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "10px Arcade";
    this.ctx.fillText(this.text, this.x, this.y);
  }
}
