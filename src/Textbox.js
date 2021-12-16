export default class Textbox {

  constructor (x, y, context, width, height, text) {

    this.x = x;
    this.y = y;
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.text = text;


  }

  setText(text) {
    this.text = text;
  }

  update() {
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.mozImageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.font = "10px Arcade_BG";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText(this.text, this.x, this.y);
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "10px Arcade";
    this.ctx.fillText(this.text, this.x, this.y);

  }
}
