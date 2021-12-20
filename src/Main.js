import Sk8r from '/src/Sk8r.js';
import Road from '/src/Road.js';
import Downtown from '/src/Downtown.js';
import Cityscape from '/src/Cityscape.js';
import WoodCrate from '/src/WoodCrate.js';
import SteelCrate from '/src/SteelCrate.js';
import Textbox from '/src/Textbox.js';
import Zippy from '/src/Zippy.js';
import { getRandomInt } from '/src/common.js';

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
        this.downtown = new Downtown(0, 1, this.context, loader.images.downtown);
        this.cityscape = new Cityscape(0, 0, this.context, loader.images.cityscape);

        // Create game floor.
        this.road = new Road(0, 111, this.context, loader.images.road);

        // Create player.
        this.sk8r = new Sk8r(10, 71, this.context, loader.images.sk8r);

        this.zippies = [];
        this.timeSinceLastZippy = 0;
        this.zippyCoolDown = 10;

        this.wood_crates = [];
        this.steel_crates = [];
        this.crate_height = 14;

        // Start game
        this.drawingLoop();
    },

    // Add point to score counter.
    increment_scorebox() {
      this.score += 1;
      this.scorebox.setText(this.score);
    },

    spawn_wood_crate() {
      game.wood_crates.push(new WoodCrate(this.canvas.width, 100, game.wood_crates, this.context, loader.images.wood_crate));
    },

    spawn_steel_crate() {
      game.steel_crates.push(new SteelCrate(this.canvas.width, 100, game.steel_crates, this.context, loader.images.steel_crate));
    },

    spawn_double_crate() {

      var bottomCrate = new WoodCrate(this.canvas.width, 100, game.wood_crates, this.context, loader.images.wood_crate);
      var topCrate = new WoodCrate(this.canvas.width, 100-game.crate_height, game.wood_crates, this.context, loader.images.wood_crate);

      topCrate.stackedOn.push(bottomCrate);

      game.wood_crates.push(bottomCrate);
      game.wood_crates.push(topCrate);
    },

    spawn_triple_crate() {

      var bottomCrate = new WoodCrate(this.canvas.width, 100, game.wood_crates, this.context, loader.images.wood_crate);
      var middleCrate = new WoodCrate(this.canvas.width, 100-game.crate_height, game.wood_crates, this.context, loader.images.wood_crate);
      var topCrate = new WoodCrate(this.canvas.width, 100-(2*game.crate_height), game.wood_crates, this.context, loader.images.wood_crate);
      middleCrate.stackedOn.push(bottomCrate);

      topCrate.stackedOn.push(bottomCrate);
      topCrate.stackedOn.push(middleCrate);

      game.wood_crates.push(bottomCrate);
      game.wood_crates.push(middleCrate);
      game.wood_crates.push(topCrate);
    },

    despawn_crates() {

      game.wood_crates.forEach((crate, i) => {
          if (crate.x < 0 - crate.width) {

            // If crate leaves map, despawn.
            var i = this.wood_crates.indexOf(crate);
            this.wood_crates.splice(i, 1);
          }
      });

      game.steel_crates.forEach((crate, i) => {
          if (crate.x < 0 - crate.width) {

            // If crate leaves map, despawn.
            var i = this.steel_crates.indexOf(crate);
            this.steel_crates.splice(i, 1);
          }
      });
    },

    explode_zippies() {
      game.zippies.forEach((zippy, i) => {

        // If zippy has finished exploding, despawn.
        if (zippy.hasExploded) {
            var i = this.zippies.indexOf(zippy);
            this.zippies.splice(i, 1);
        }

        // Check for crate collisions.
        game.wood_crates.forEach((crate, j) => {

            var hitCrate = (crate.x >= zippy.x && crate.x <= (zippy.x + crate.width+5) &&
                            zippy.y >= (crate.y - crate.height) && zippy.y <= crate.y-5);

            // Explode collided crate.
            if (hitCrate && zippy.isFlying) {
              zippy.y = crate.y-5;
              zippy.explode();
              crate.break();
            }
        });

        game.steel_crates.forEach((crate, j) => {

            var hitCrate = (crate.x >= zippy.x && crate.x <= (zippy.x + crate.width+5) &&
                            zippy.y >= (crate.y - crate.height) && zippy.y <= crate.y-5);

            // Explode on collided crate.
            if (hitCrate && zippy.isFlying) {
              zippy.y = crate.y-5;
              zippy.explode();
            }
        });
      });
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



        // Draw wood crates.
        game.wood_crates.forEach((crate, i) => {
            crate.render();
            crate.update();
        });

        // Draw steel crates.
        game.steel_crates.forEach((crate, i) => {
            crate.render();
            crate.update();
        });


        // Check if zippies has collided with any objects.
        if (game.zippies.length > 0) {
          game.explode_zippies();

          // Draw zippies
          game.zippies.forEach((zippy, i) => {
              zippy.render();
              zippy.update();
          });
        }

        // Calculate zippy cooldown clock.
        if (game.timeSinceLastZippy > 0) {
            game.timeSinceLastZippy += 1;

            if (game.timeSinceLastZippy == game.zippyCoolDown) {
                game.timeSinceLastZippy = 0;
            }
        }

        // Add point to score and draw.
        game.increment_scorebox();
        game.scorebox.update();

        // Draw game frame to true canvas.
        game.trueContext.drawImage(game.canvas, 0, 0, game.canvas.width, game.canvas.height, 0, 0, scale_width, scale_height);


        // Await new Promise(r => setTimeout(r, 180));
        var randInt = getRandomInt(1, 500);
        //console.log(randInt);
        if (randInt < 5) {

          game.spawn_wood_crate();
        } else if (randInt < 10) {

          game.spawn_steel_crate();
        } else if (randInt < 13) {

          game.spawn_double_crate();
        } else if (randInt < 15) {

          game.spawn_triple_crate();
        }

        game.despawn_crates();

        // As long as game is still running, create next game frame.
        if (game.isRunning) {
            requestAnimationFrame(game.drawingLoop);
        }
    },
};


document.addEventListener('keydown', event => {

  // Add space key listener for jumping.
  if (event.code === 'Space') {
    game.sk8r.jump();
  }

  // Add right arrow key listener for zippies.
  if (event.code === 'ArrowRight') {

      if (game.timeSinceLastZippy <= 0) {

          // Spawn zippy.
          var index = game.zippies.length - 1;
          game.zippies.push(new Zippy(game.sk8r.x+20, game.sk8r.y+7, game.zippies,
                            game.context, loader.images.zippy));

          // Begin zippy cooldown.
          game.timeSinceLastZippy = 1;
      }
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
        loader.add('wood_crate', WoodCrate.src);
        loader.add('steel_crate', SteelCrate.src);
        loader.add('zippy', Zippy.src);
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
