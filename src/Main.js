import Sk8r from '/src/classes/Sk8r.js';
import Road from '/src/classes/Road.js';
import Downtown from '/src/classes/Downtown.js';
import Smog from '/src/classes/Smog.js';
import Cityscape from '/src/classes/Cityscape.js';
import Crate from '/src/classes/Crate.js';
import Zippy from '/src/classes/Zippy.js';
import Board from '/src/classes/Board.js';

import KAFont from '/src/menus/KAFont.js';
import StartButton from '/src/menus/StartButton.js';
import Logo from '/src/menus/Logo.js';
import Leaderboard from '/src/menus/Leaderboard.js';
import Inputbox from '/src/menus/Inputbox.js';
import SaveButton from '/src/menus/SaveButton.js';
import ArrowButton from '/src/menus/ArrowButton.js';
import Sk8rNameLabel from '/src/menus/Sk8rNameLabel.js';
import DeathMsgLabel from '/src/menus/DeathMsgLabel.js';
import FullscreenButton from '/src/menus/FullscreenButton.js';
import Instruct from '/src/menus/Instruct.js'
import Explosion from '/src/classes/Explosion.js';
import Debris from '/src/classes/Debris.js';
import Car from '/src/classes/Car.js';
import Tire from '/src/classes/Tire.js';
import Cop from '/src/classes/Cop.js';
import Bullet from '/src/classes/Bullet.js';
import Scooter from '/src/classes/Scooter.js';

import { loader } from '/src/loader.js';
import { despawn_sprites } from '/src/Sprite.js';
import { spawn_crates } from '/src/classes/Crate.js';
import { explode_zippies } from '/src/classes/Zippy.js';
import { collide_debris } from '/src/classes/Debris.js';
import { collide_bullets } from '/src/classes/Bullet.js';

import { getRandomInt } from '/src/common.js';
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
        this.trueCanvas.width = 448;
        this.trueCanvas.height = 252;

        // Smaller canvas to draw game onto and resize later.
        this.canvas = document.getElementById("mini_canvas");
        this.canvas.width = this.trueCanvas.width / 2;
        this.canvas.height = this.trueCanvas.height / 2;
        this.context = this.canvas.getContext("2d");

        // Load all image resources.
        loader.init();

        let sk8r_x = 17;

        // Create player.
        this.sk8r = new Sk8r(sk8r_x, sk8r_floor, this.context, loader.images.sk8r, 0);

        // Score textbox
        this.scorebox = new KAFont(this.context, 10, 5, loader.images.karmatic_arcade_font);
        this.score = 0;

        // Opening title art
        this.showing_logo = true;
        this.logo = new Logo(this.canvas.width/2, this.canvas.height*3/4, game.context, loader.images.logo);
        this.sk8r_label = new Sk8rNameLabel(game.context, sk8r_x+15, sk8r_floor+47, loader.images.name_label[0], loader.images.smfont[0], this.sk8r.getName());
        this.instructs = new Instruct(this.canvas.width-47, 10, game.context, loader.images.instruct[0]);
        this.is_fullscreen = false;
        this.has_started = false;

        // List of buttons on the screen at any given time.
        this.buttons = [];

        // Add start game button.
        let start_game = function() {this.has_started = true;}
        this.buttons.push(new StartButton(this.canvas.width/2, this.canvas.height*1/3, game.context,
                                     loader.images.startbutton, loader.images.karmatic_arcade_font,
                                     "Start", start_game.bind(this), true));

        let prev_sk8r = function() {this.sk8r.prev_sprite(); this.sk8r_label.setName(this.sk8r.getName());}
        this.buttons.push(new ArrowButton(sk8r_x-4, sk8r_floor+45, game.context,
                                          loader.images.arrowbuttons[0], prev_sk8r.bind(this), false));

        let next_sk8r = function() {this.sk8r.next_sprite(); this.sk8r_label.setName(this.sk8r.getName());}
        this.buttons.push(new ArrowButton(sk8r_x+33, sk8r_floor+45, game.context,
                                          loader.images.arrowbuttons[1], next_sk8r.bind(this), false));

        this.fsbutton = new FullscreenButton(8, this.canvas.height-10, game.context, loader.images.fullscreen_button[0],
                                               toggleFullscreen.bind(this));
        this.buttons.push(this.fsbutton);
        // Boolean for when to show the end of game menu.
        this.showing_restart_menu = false;
        this.leaderboard = null;
        this.inputbox = null;
        this.death_label = null;
        this.is_prompting_for_input = false;

        // Create game background.
        this.downtown = new Downtown(0, 0, this.context, loader.images.downtown);
        this.smog = new Smog(0, 0, this.context, loader.images.smog);
        this.cityscape = new Cityscape(0, 0, this.context, loader.images.cityscape);

        // Create game floor.
        this.road = new Road(0, 0, this.context, loader.images.road);

        // List of zippies on the screen at any given time.
        this.zippies = [];
        this.timeSinceLastZippy = 0;
        this.zippyCoolDown = 10;

        // List of zombie cops on the screen at any given time.
        this.cops = [];
        this.bullets = [];
        this.scooters = [];

        // List of crates on the screen at any given time.
        this.crates = [];
        this.timeSinceLastCrate = 0;
        this.crateCoolDown = 40;
        this.last_spawned_obstacle = "";

        this.cars = [];

        // List of sprites for destruction effects.
        this.explosions = [];
        this.debris = [];
        this.tires = [];

        // Start game
        this.drawingLoop();
    },

    // Add point to score counter.
    increment_scorebox() {
        this.score += 1;
        this.scorebox.setText(this.score.toString());
    },

    update_background() {

        // Draw background.
        this.smog.render();
        this.smog.update_smog();
        this.cityscape.render();
        this.cityscape.update_cityscape();
        this.downtown.render();
        this.downtown.update_downtown();
    },

    end_game() {
        this.downtown.stop_scroll();
        this.smog.stop_scroll();
        this.cityscape.stop_scroll();
        this.road.stop_scroll();

        this.crates.forEach((crate, i) => crate.stop_scroll());
        this.cars.forEach((car, i) => car.stop_scroll());
        this.explosions.forEach((ex, i) => ex.stop_scroll());
        this.debris.forEach((deb, i) => deb.stop_scroll());
        this.tires.forEach((tire, i) => tire.stop_scroll());
        this.cops.forEach((cop, i) => cop.stop_scroll());
        this.scooters.forEach((scooter, i) => scooter.stop_scroll());
    },

    restart_game() {

        this.score = 0;

        this.logo = null;
        this.instructs = null;
        game.buttons = game.buttons.filter(btn => btn === game.fsbutton);
        this.buttons.push(this.fsbutton);
        this.showing_logo = false;
        this.showing_restart_menu = false;
        this.leaderboard = null;
        this.death_label = null;
        this.inputbox = null;
        this.is_prompting_for_input = false;

        // Create game background.
        this.downtown.reset_downtown();
        this.smog.reset_smog();
        this.cityscape.reset_cityscape();

        // Create game floor.
        this.road.reset_road();

        this.zippies = [];
        this.timeSinceLastZippy = 0;
        this.zippyCoolDown = 10;

        this.cops = [];
        this.scooters = [];
        this.bullets = [];

        this.explosions = [];
        this.debris = [];
        this.tires = [];

        this.cars = [];
        this.crates = [];
        this.timeSinceLastCrate = 0;
        this.crateCoolDown = 40;

        // Create player.
        this.sk8r.reset_sk8r();
        this.board = null;
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
        let scale_width = game.trueCanvas.width;
        let scale_height = game.trueCanvas.height;

        game.update_background();

        // Draw floor.
        game.road.update_road();
        game.road.render();

        // Draw crates.
        if (game.crates.length > 0) {
            game.crates.forEach((crate, i) => {
                crate.update_crate();
                crate.render();
            });
            despawn_sprites(game.crates);
        }

        // Draw cars.
        if (game.cars.length > 0) {
            game.cars.forEach((car, i) => {
                car.update_car();
                car.render();
            });
            despawn_sprites(game.cars);
        }

        game.sk8r.update_sk8r(game.crates, game.cars);

        // Check if zippies has collided with any objects.
        if (game.zippies.length > 0) {

          // Explode zippies and get crate break locations, if any.
          let breakPosList = explode_zippies(game.zippies, game.crates, game.cars, game.cops);

          // Spawn explosions at each crate break location.
          let spawned_tire = false;
          breakPosList.forEach((pos, i) => {
              let x_pos = pos[0];
              let y_pos = pos[1]-2;
              let type = pos[2];

              if (type == 2) {
                  game.scooters.push(new Scooter(x_pos, y_pos, game.context, loader.images.scooter[0]));
                  return;
              }

              for (let j = 0; j < 3; j++) {
                  x_pos += getRandomInt(-1, 4);
                  y_pos += getRandomInt(-1, 4);
                  game.explosions.push(new Explosion(x_pos, y_pos, game.context, loader.images.explosion, 0, 3*j));

                  if (type != undefined && getRandomInt(0,5) > 0) {
                      game.debris.push(new Debris(x_pos, y_pos+3, game.context, loader.images.debris[type], 2*j, type));
                  }
              }

              if (type == 1 && !spawned_tire && getRandomInt(0, 4) == 4) {
                  game.tires.push(new Tire(x_pos, y_pos+2, game.context, loader.images.tire[0], 0))
                  spawned_tire = true;
              }
          });

          // Draw zippies
          game.zippies.forEach((zippy, i) => {
              zippy.update_zippy();
              zippy.render();
          });
          despawn_sprites(game.zippies);
        }

        if (game.debris.length > 0) {
            game.debris.forEach((deb, i) => {
                deb.update_debris();
                deb.render();
            });
            despawn_sprites(game.debris);

            let hitPosList = collide_debris(game.debris, game.cops, game.scooters);
            hitPosList.forEach((pos, i) => {
                let x_pos = pos[0];
                let y_pos = pos[1]-2;
                game.scooters.push(new Scooter(x_pos, y_pos, game.context, loader.images.scooter[0]));
            });
        }

        if (game.tires.length > 0) {
            game.tires.forEach((tire, i) => {
                tire.update_tire();
                tire.render();
            });
            despawn_sprites(game.tires);
        }

        // Await new Promise(r => setTimeout(r, 180));
        game.scorebox.render();
        game.sk8r.render();
        if (!game.sk8r.isAlive) {

            if (game.board == null) {
                game.board = new Board(18, game.sk8r.y, game.context, game.sk8r.image, game.crates, game.cars);
            } else {
                game.board.render();
                game.board.update_board();
            }

            if (game.sk8r.velocity_x == 0 && !game.showing_restart_menu) {
                game.show_restart_menu();
            }
        }

        if (game.cops.length > 0) {
            game.cops.forEach((cop, i) => {

                if (cop.readyToFire) {
                    game.bullets.push(new Bullet(cop.x, cop.y+24, game.context, loader.images.bullet[0]));
                    game.explosions.push(new Explosion(cop.x-5, cop.y+20, game.context, loader.images.explosion, 1, 0));
                    cop.timeSinceFire = 0;
                    cop.readyToFire = false;
                }

                if (cop.is_looking_backwards() && cop.x < game.sk8r.x) {
                    cop.look_forwards();
                }

                cop.update_cop()
                cop.render();
            });
            despawn_sprites(game.cops);
        }

        if (game.scooters.length > 0) {
            game.scooters.forEach((scooter, i) => {
                scooter.update_scooter();
                scooter.render();
            });
            despawn_sprites(game.scooters);
        }

        if (game.bullets.length > 0) {
            game.bullets.forEach((bullet, i) => {
                bullet.update_bullet();
                bullet.render();
            });
            despawn_sprites(game.bullets);
        }

        if (game.explosions.length > 0) {
            game.explosions.forEach((ex, i) => {
                ex.update_explosion();
                ex.render();
            });
            despawn_sprites(game.explosions);
        }

        let hitPos = collide_bullets(game.sk8r, game.bullets);
        if (hitPos != null) {
            game.explosions.push(new Explosion(hitPos[0], hitPos[1], game.context, loader.images.explosion, 0, 0));
        }


        // Calculate zippy cooldown clock.
        if (game.timeSinceLastZippy > 0) {
            game.timeSinceLastZippy += 1;

            if (game.timeSinceLastZippy == game.zippyCoolDown) {
                game.timeSinceLastZippy = 0;
            }
        }

        // If player is still alive, continue spawning new crates.
        if (game.sk8r.isAlive && game.has_started) {

            // Add point to score and draw.
            game.increment_scorebox();

            if (game.timeSinceLastCrate > 0) {
                game.timeSinceLastCrate += 1;

                if (game.timeSinceLastCrate == game.crateCoolDown) {
                    game.timeSinceLastCrate = 0;
                }
            }

            // If cooldown has ended since last crate spawn, try to spawn another.
            if (game.timeSinceLastCrate == 0) {

                let stack_width = 0;
                let randInt = getRandomInt(1, 700);

                // If random int is below 3, spawn car.
                if (randInt > 697) {
                    game.cars.push(new Car(get_canvas_width(), floor+1, game.context, loader.images.car));
                    game.timeSinceLastCrate = 1;
                    game.last_spawned_obstacle = "car";

                } else if (randInt > 695 && game.last_spawned_obstacle != "cop") {
                    game.cops.push(new Cop(get_canvas_width(), sk8r_floor-6, game.context, loader.images.cop[0]));
                    game.timeSinceLastCrate = 1;
                    game.last_spawned_obstacle = "cop";

                // Else, move on to possibly spawn crate.
                } else {

                    if (randInt < 17) {stack_width = 1;}
                    else if (randInt < 19) {stack_width = 2;}
                    else if (randInt < 21) {stack_width = 3;}
                    else if (randInt < 22) {stack_width = 4;}

                    // Spawn crates if any.
                    if (stack_width > 0) {
                        spawn_crates(game.context, loader.images.crates, game.crates, stack_width);
                        game.timeSinceLastCrate = 1;
                        game.last_spawned_obstacle = "crate";
                    }
                }
            }
        }

        let restart_menu_exists = (game.showing_restart_menu && game.leaderboard != null && game.inputbox != null);
        if (restart_menu_exists) {
            game.leaderboard.render();
            game.inputbox.update_inputbox();
            game.inputbox.render();
            game.death_label.render();

            // Check if user is being prompted for input.
            if (game.inputbox.is_highlighted) {
                game.is_prompting_for_input = true;
            } else {
                game.is_prompting_for_input = false;
            }
        }

        // Render buttons, if any.
        game.buttons.forEach((button, i) => {
            button.render();
        });

        // Render logo as long as it exists and is on screen.
        if (game.logo != null) {
            game.logo.render();

            if (game.score > 25) {
              game.logo.nudge_off_screen();
            }

            if (game.logo.off_screen) {
                game.logo = null;
            }
        }

        if (game.instructs != null) {
            game.instructs.update_instructs();
            game.instructs.render();

            if (game.score > 0) {
              game.instructs.nudge_off_screen();
            }

            if (game.instructs.off_screen) {
                game.instructs = null;
            }
        }

        if (game.has_started && game.sk8r_label != null) {
            game.sk8r_label = null;
            game.buttons = game.buttons.filter(btn => btn === game.fsbutton);
        } else if (game.sk8r_label != null) {
            game.sk8r_label.render();
        }

        // Draw this frame to true canvas.
        game.trueContext.drawImage(game.canvas, 0, 0, game.canvas.width, game.canvas.height, 0, 0, scale_width, scale_height);

        // As long as game is still running, create next game frame.
        if (game.isRunning) {
            requestAnimationFrame(game.drawingLoop);
        }
    },

    show_restart_menu() {

        // Set boolean for showing restart menu.
        game.showing_restart_menu = true;

        // Set restart menu's position on screen.
        let menu_xpos = get_canvas_width()/2;
        let menu_ypos = get_canvas_height()*2/3;

        // Create and add restart button.
        let restart_game = function() {this.restart_game();}
        game.buttons.push(new StartButton(menu_xpos, get_canvas_height()*1/3, game.context,
                          loader.images.startbutton, loader.images.karmatic_arcade_font,
                          "Restart", restart_game.bind(this), true));

        // Create and add leaderboard and usernae input box.
        game.leaderboard = new Leaderboard(menu_xpos, menu_ypos, game.context, loader.images.leaderboard[0],
                                           loader.images.smfont[0], loader.saved_data);
        game.inputbox = new Inputbox(menu_xpos, menu_ypos-21, game.context, loader.images.inputbox[0], loader.images.smfont[0]);
        game.death_label = new DeathMsgLabel(game.context, get_canvas_width()/2, 5, loader.images.death_label[0], loader.images.smfont[0], game.sk8r.get_autopsy());

        // Create and add save high score button.
        let save_highscore = function() {this.restart_game();}
        game.buttons.push(new SaveButton(menu_xpos+34, menu_ypos-20, game.context,
                          loader.images.savebutton, save_highscore.bind(this)));
    }
};

function start_game() {

    game.init();
    create_key_listener(game);
    create_click_listener(game);
    resizeGame();
}

// Resize mini drawing canvas to fit true canvas.
function resizeGame() {
    let gameArea = document.getElementById('canvas');
    let widthToHeight = 16/9;
    //var widthToHeight = 4 / 2.5;
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

    game.canvas.style.width = newWidth / 4;
    game.canvas.style.height = newHeight / 4;

    game.trueContext.webkitImageSmoothingEnabled = false;
    game.trueContext.mozImageSmoothingEnabled = false;
    game.trueContext.imageSmoothingEnabled = false;
}

function toggleFullscreen() {

    console.log("toggle " + game.is_fullscreen);

    let canvas = game.canvas;
    if (game.is_fullscreen) {
        game.is_fullscreen = false;
        game.fsbutton.update_icon(false);

        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    } else {
        game.is_fullscreen = true;
        game.fsbutton.update_icon(true);

        if (canvas.requestFullScreen) {
            canvas.requestFullScreen();
        } else if (canvas.webkitRequestFullScreen) {
            canvas.webkitRequestFullScreen();
        } else if (canvas.mozRequestFullScreen) {
            canvas.mozRequestFullScreen();
        }
    }
}

// Resize game as browser size changes.
window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

// On page load, start game.
window.addEventListener("load", () => {
    start_game();
});
