import Sk8r from '/src/classes/Sk8r.js';
import Road from '/src/classes/Road.js';
import Downtown from '/src/classes/Downtown.js';
import Cityscape from '/src/classes/Cityscape.js';
import Crate from '/src/classes/Crate.js';
import Zippy from '/src/classes/Zippy.js';
import Board from '/src/classes/Board.js';

import Textbox from '/src/Textbox.js';
import Button from '/src/Button.js';
import { loader } from '/src/img_loader.js';
import { spawn_crates, despawn_crates } from '/src/classes/Crate.js';
import { explode_zippies, despawn_zippies } from '/src/classes/Zippy.js';

import { getRandomInt, raf } from '/src/common.js';
import { floor, sk8r_floor } from '/src/constants.js';
import { create_key_listener } from '/src/key_listener.js';
import { create_click_listener } from '/src/click_listener.js';

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

        this.buttons = [];
        this.showing_restart_menu = false;

        // Load all image resources.
        loader.init();

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

    update_background() {

        // Draw background.
        game.cityscape.render();
        game.cityscape.update_cityscape();
        game.downtown.render();
        game.downtown.update_downtown();
    },

    end_game() {
        game.downtown.stop_scroll();
        game.cityscape.stop_scroll();
        game.road.stop_scroll();

        game.crates.forEach((crate, i) => {
            crate.moving = false;
        });
    },

    // Main animating loop.
    async drawingLoop() {

        if (game.sk8r.isAlive === false) {
            game.end_game();
        }

        // Clear canvas
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.trueContext.clearRect(0, 0, game.trueCanvas.width, game.trueCanvas.height);

        // Game true canvas size.
        var scale_width = game.trueCanvas.width;
        var scale_height = game.trueCanvas.height;


        game.update_background();

        // Draw floor.
        game.road.render();
        game.road.update_road();

        // Draw crates.
        game.crates.forEach((crate, i) => {
            crate.render();
            crate.update_crate();
        });

        game.sk8r.render();
        game.sk8r.update_sk8r(game.crates);

        // Check if zippies has collided with any objects.
        if (game.zippies.length > 0) {

          despawn_zippies(game.zippies);

          explode_zippies(game.zippies, game.crates);

          // Draw zippies
          game.zippies.forEach((zippy, i) => {
              zippy.render();
              zippy.update_zippy();
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
        game.scorebox.update();
        if (game.sk8r.isAlive) {
            game.increment_scorebox();
        }

        // Await new Promise(r => setTimeout(r, 180));

        // If player is still alive, continue spawning new crates.
        if (game.sk8r.isAlive) {

            if (game.timeSinceLastCrate > 0) {
                game.timeSinceLastCrate += 1;

                if (game.timeSinceLastCrate == game.crateCoolDown) {
                    game.timeSinceLastCrate = 0;
                }
            }

            // If cooldown has ended since last crate spawn, try to spawn another.
            if (game.timeSinceLastCrate == 0) {

                var stack_width = 0;

                var randInt = getRandomInt(1, 700);
                if (randInt < 17) {stack_width = 1;}
                else if (randInt < 19) {stack_width = 2;}
                else if (randInt < 21) {stack_width = 3;}
                else if (randInt < 22) {stack_width = 4;}

                // Spawn crates if any.
                if (stack_width > 0) {
                    spawn_crates(game.context, loader.images.crates, game.crates, stack_width);
                    game.timeSinceLastCrate = 1;
                }
            }

            // Remove crates that leave screen.
            despawn_crates(game.crates);
        }

        if (!game.sk8r.isAlive) {

            if (game.board == null) {
                game.board = new Board(game.crates, 10, game.sk8r.y, game.context, loader.images.board, 0);
            } else {
                game.board.render();
                game.board.update_board();
            }

            if (game.sk8r.velocity_x == 0 && !game.showing_restart_menu) {
                game.show_restart_menu();
            }
        }

        game.buttons.forEach((button, i) => {
            button.update();
        });

        // Draw game frame to true canvas.
        game.trueContext.drawImage(game.canvas, 0, 0, game.canvas.width, game.canvas.height, 0, 0, scale_width, scale_height);

        // As long as game is still running, create next game frame.
        if (game.isRunning) {
            requestAnimationFrame(game.drawingLoop);
        }
    },

    show_restart_menu() {

        game.showing_restart_menu = true;
        game.buttons.push(new Button(get_canvas_width()/2, get_canvas_height()/2, game.context, "Restart"));
    }
};

function start_game() {

    game.init();
    create_key_listener(game);
    create_click_listener(game);
    resizeGame();

    console.log('Testing frame rate...')
    raf();
}

export function restart_game() {

  game.score = 0;

  game.buttons = [];
  game.showing_restart_menu = false;

  // Create game background.
  game.downtown.reset_downtown();
  game.cityscape.reset_cityscape();

  // Create game floor.
  game.road.reset_road();

  game.zippies = [];
  game.timeSinceLastZippy = 0;
  game.zippyCoolDown = 10;

  game.crates = [];
  game.timeSinceLastCrate = 0;
  game.crateCoolDown = 40;

  // Create player.
  game.sk8r.reset_sk8r();
}

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
    start_game();
});
