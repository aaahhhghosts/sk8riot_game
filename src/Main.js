import Sk8r from '/src/Sk8r.js';
import Ground1 from '/src/Ground1.js';
import Background1 from '/src/background1.js';
import Cityscape from '/src/cityscape.js';

const game = {
    isRunning: true,

    init() {

        game.trueCanvas = document.getElementById("canvas");
        game.trueContext = game.trueCanvas.getContext("2d");

        game.trueCanvas.width = 400;
        game.trueCanvas.height = 250;

        game.canvas = document.getElementById("mini_canvas");
        game.canvas.width = game.trueCanvas.width / 2;
        game.canvas.height = game.trueCanvas.height / 2;

        game.context = game.canvas.getContext("2d");

        game.loader = loader;
        game.loader.init();

        this.sk8r = new Sk8r(10, 71, game.context, loader.images.sk8r);
        this.ground1 = new Ground1(0, 111, game.context, loader.images.ground1);
        this.background1 = new Background1(0, 1, game.context, loader.images.background1);
        this.cityscape = new Cityscape(0, 0, game.context, loader.images.cityscape);

        // Start game
        game.drawingLoop();
    },

    drawingLoop() {

        // Clear canvas
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.trueContext.clearRect(0, 0, game.trueCanvas.width, game.trueCanvas.height);

        var scale_width = game.trueCanvas.width;
        var scale_height = game.trueCanvas.height;

        // Draw and update frame index
        game.cityscape.render();
        game.cityscape.update();

        game.background1.render();
        game.background1.update();

        game.sk8r.render();
        game.sk8r.update();

        game.ground1.render();
        game.ground1.update();



        game.trueContext.drawImage(game.canvas, 0, 0, game.canvas.width, game.canvas.height, 0, 0, scale_width, scale_height);

        if (game.isRunning) {
            requestAnimationFrame(game.drawingLoop);
        }
    },
};

// event = keyup or keydown
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    game.sk8r.jump();
  }
});

const loader = {
    count: 0,
    images: {},

    add(title, src) {
        const image = new Image();
        image.src = src;
        this.images[title] = image;
        this.count++;
    },

    init() {
        loader.add('sk8r', Sk8r.src);
        loader.add('ground1', Ground1.src);
        loader.add('background1', Background1.src);
        loader.add('cityscape', Cityscape.src);
    }
};

function resizeGame() {
    var gameArea = document.getElementById('canvas');
    var widthToHeight = 4 / 2.5;
    var newWidth = window.innerWidth * 0.95;
    var newHeight = window.innerHeight * 0.95;
    var newWidthToHeight = newWidth / newHeight;

    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = newHeight + 'px';
        gameArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + 'px';
        gameArea.style.height = newHeight + 'px';
    }

    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

    //var gameCanvas = document.getElementById('canvas');
    game.canvas.style.width = newWidth / 4;
    game.canvas.style.height = newHeight / 4;

    //game.context.scale(2, 2);
    game.trueContext.webkitImageSmoothingEnabled = false;
    game.trueContext.mozImageSmoothingEnabled = false;
    game.trueContext.imageSmoothingEnabled = false;
}
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

window.addEventListener("load", () => {
    game.init();
    resizeGame();
});
