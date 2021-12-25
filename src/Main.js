import Sk8r from '/src/Sk8r.js';
import Road from '/src/Road.js';
import Downtown from '/src/Downtown.js';
import Cityscape from '/src/Cityscape.js';
import Crate from '/src/Crate.js';
import Textbox from '/src/Textbox.js';
import Zippy from '/src/Zippy.js';
import { getRandomInt } from '/src/common.js';
import { floor, sk8r_floor } from '/src/constants.js';
import { spawn_crates } from '/src/Crate.js';


export function get_canvas_height() {
        return game.canvas.height;
}

export function get_canvas_width() {
        return game.canvas.width;
}

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
        this.downtown = new Downtown(0, 0, this.context, loader.images.downtown);
        this.cityscape = new Cityscape(0, 0, this.context, loader.images.cityscape);

        // Create game floor.
        this.road = new Road(0, 0, this.context, loader.images.road);

        this.zippies = [];
        this.timeSinceLastZippy = 0;
        this.zippyCoolDown = 10;

        this.crates = [];
        this.timeSinceLastCrate = 0;
        this.crateCoolDown = 40;

        // Create player.
        this.sk8r = new Sk8r(10, sk8r_floor, this.context, loader.images.sk8r);

        // Start game
        this.drawingLoop();
    },

    // Add point to score counter.
    increment_scorebox() {
      this.score += 1;
      this.scorebox.setText(this.score);
    },



    despawn_crates(crates) {
      game.crates.forEach((crate, i) => {
          if (crate.x < 0 - crate.width) {

            // If crate leaves map, despawn.
            var i = this.crates.indexOf(crate);
            this.crates.splice(i, 1);
          }
      });
    },

    throw_zippy() {

        if (game.timeSinceLastZippy <= 0) {

            // Spawn zippy.
            var index = game.zippies.length - 1;
            game.zippies.push(new Zippy(game.sk8r.x+20, game.sk8r.y+24, game.zippies,
                              game.context, loader.images.zippy));

            // Begin zippy cooldown.
            game.timeSinceLastZippy = 1;
        }
    },

    explode_zippies() {
        game.zippies.forEach((zippy, i) => {

            // If zippy has finished exploding, despawn.
            if (zippy.hasExploded) {
                var i = this.zippies.indexOf(zippy);
                this.zippies.splice(i, 1);
            }

            // Check for crate collisions.
            game.crates.forEach((crate, j) => {

                var hitCrate = zippy.x >= crate.x-5 && (zippy.x <= (crate.x+crate.width) &&
                               zippy.y >= (crate.y-5) && zippy.y <= crate.y+crate.height);

                // If zippy collided with crate.
                if (hitCrate && zippy.isFlying) {
                    zippy.y = crate.y+crate.height-5;

                    // Explode on collided crate.
                    zippy.explode();

                    // If crate is wooden, break.
                    if (crate.type == 0) {
                        crate.break();
                    }
                }
            });
        });
    },

    update_player() {

        // Draw player.
        game.sk8r.set_floor(sk8r_floor);

        game.crates.forEach((crate, i) => {

            if (!crate.isBroken) {

                // If crate height is higher that
                if (game.sk8r.x >= crate.x-crate.width*2 && game.sk8r.x <= crate.x+crate.width/2) {

                    var top_of_crate = crate.y+(crate.height-1);

                    if (game.sk8r.get_floor() < top_of_crate) {
                        game.sk8r.set_floor(top_of_crate);
                    }

                    if (game.sk8r.y < top_of_crate-2 && game.sk8r.x-3 >= crate.x-crate.width*2) {
                        game.isRunning = false;
                    }
                }
            }
        });
        game.sk8r.render();
        game.sk8r.update();
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

        game.update_player();

        // Draw crates.
        game.crates.forEach((crate, i) => {
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
        var numCrates = 0;

        if (game.timeSinceLastCrate > 0) {
            game.timeSinceLastCrate += 1;

            if (game.timeSinceLastCrate == game.crateCoolDown) {
                game.timeSinceLastCrate = 0;
            }
        }

        // If cooldown has ended since last crate spawn, try to spawn another.
        if (game.timeSinceLastCrate == 0) {

            var randInt = getRandomInt(1, 500);

            if (randInt < 10) {numCrates = 1;}
            else if (randInt < 13) {numCrates = 2;}
            else if (randInt < 15) {numCrates = 3;}
            else if (randInt < 17) {numCrates = 4;}

            // Spawn crates if any.
            if (numCrates > 0) {
                spawn_crates(game.context, loader.images.crates, game.crates, numCrates);
                game.timeSinceLastCrate = 1;
            }
        }

        // Remove crates that leave screen.
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

      game.throw_zippy();
  }
});

// Image resource loader.
const loader = {
    count: 0,
    images: {},
    crates: {},

    add(title, src_list) {

        var img_list = [];

        src_list.forEach((src, i) => {
            const image = new Image();
            image.src = src;
            img_list.push(image);
            this.count++;
        });

        this.images[title] = img_list;
    },

    init() {
        loader.add('sk8r', [Sk8r.src]);
        loader.add('road', [Road.src]);
        loader.add('downtown', [Downtown.src]);
        loader.add('cityscape', [Cityscape.src]);
        loader.add('crates', [Crate.src_0, Crate.src_1]);
        loader.add('zippy', [Zippy.src]);
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
