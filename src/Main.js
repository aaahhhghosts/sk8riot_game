import Sk8r from '/src/Sk8r.js';
import Road from '/src/Road.js';
import Downtown from '/src/Downtown.js';
import Cityscape from '/src/Cityscape.js';
import Crate from '/src/Crate.js';
import Textbox from '/src/Textbox.js';

const game = {

    // Game running.
    isRunning: true,

    // Initialize game.
    init() {

        // True canvas to display game at full size.
        this.trueCanvas = document.getElementById("canvas");
        this.trueContext = this.trueCanvas.getContext("2d");
        this.trueCanvas.width = 400;
        this.trueCanvas.height = 250;

        // Smaller canvas to draw game onto and resize later.
        this.canvas = document.getElementById("mini_canvas");
        this.canvas.width = this.trueCanvas.width / 2;
        this.canvas.height = this.trueCanvas.height / 2;
        this.context = this.canvas.getContext("2d");

        // Score textbox
        this.scorebox = new Textbox(155.5, 10.5, this.context, 100, 50, "Ayooo");
        this.score = 0;

        // Load all image resources.
        this.loader = loader;
        this.loader.init();

        // Create game background.
        this.downtown = new Downtown(0, 3, this.context, loader.images.downtown);
        this.cityscape = new Cityscape(0, 0, this.context, loader.images.cityscape);

        // Create game floor.
        this.road = new Road(0, 111, this.context, loader.images.road);

        // Create player.
        this.sk8r = new Sk8r(10, 71, this.context, loader.images.sk8r);

        // Test - create crate obstacle.
        this.crate = new Crate(100, 100, this.context, loader.images.wooden_crate);

        // Start game
        game.drawingLoop();
    },

    // Add point to score counter.
    increment_scorebox() {
      this.score += 1;
      this.scorebox.setText(this.score);
    },

    // Main animating loop.
    async drawingLoop() {

        // Clear canvas
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.trueContext.clearRect(0, 0, game.trueCanvas.width, game.trueCanvas.height);

        // Game true canvas size.
        var scale_width = game.trueCanvas.width;
        var scale_height = game.trueCanvas.height;

        // Draw background.
        game.cityscape.render();
        game.cityscape.update();
        game.downtown.render();
        game.downtown.update();

        // Draw floor.
        game.road.render();
        game.road.update();

        // Draw player.
        game.sk8r.render();
        game.sk8r.update();

        // Draw test obstacle.
        game.crate.render();
        game.crate.update();

        // Add point to score and draw.
        game.increment_scorebox();
        game.scorebox.update();

        // Draw game frame to true canvas.
        game.trueContext.drawImage(game.canvas, 0, 0, game.canvas.width, game.canvas.height, 0, 0, scale_width, scale_height);


        //await new Promise(r => setTimeout(r, 180));

        // As long as game is still running, create next game frame.
        if (game.isRunning) {
            requestAnimationFrame(game.drawingLoop);
        }
    },
};

// Add space key listener for jumping.
document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    game.sk8r.jump();
  }
});

// Image resource loader.
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
        loader.add('road', Road.src);
        loader.add('downtown', Downtown.src);
        loader.add('cityscape', Cityscape.src);
        loader.add('wooden_crate', Crate.src);
    }
};

// Framerate calculator for testing.
let i = 0;
const start = Date.now();
const stop = start + 5000;

function raf() {
  requestAnimationFrame(() => {
    const now = Date.now();
    if (now < stop){
      i++;
      raf();
    }else{
      const elapsedSeconds = (now - start) / 1000;
      console.log('Frame rate is: %f fps', i / elapsedSeconds);
    }
  });
}

console.log('Testing frame rate...')
raf();

// Resize mini drawing canvas to fit true canvas.
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

// Resize game as browser size changes.
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

// On page load, start game.
window.addEventListener("load", () => {
    game.init();
    resizeGame();
});
