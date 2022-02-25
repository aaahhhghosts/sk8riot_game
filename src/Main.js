// Player.
import Sk8r from '/src/classes/Sk8r.js';
import Board from '/src/classes/Board.js';
import { floor, sk8r_floor } from '/src/constants.js';

// Enviroment.
import Road from '/src/classes/Road.js';
import Downtown from '/src/classes/Downtown.js';
import Smog from '/src/classes/Smog.js';
import Cityscape from '/src/classes/Cityscape.js';

// Start Menu.
import Logo from '/src/menus/Logo.js';
import Version from '/src/menus/Version.js';
import Instruct from '/src/menus/Instruct.js'
import Sk8rNameLabel from '/src/menus/Sk8rNameLabel.js';
import ArrowButton from '/src/menus/ArrowButton.js';
import StartButton from '/src/menus/StartButton.js';

// In-Game Menu Elements.
import KAFont from '/src/menus/KAFont.js';
import FullscreenButton from '/src/menus/FullscreenButton.js';
import ZippyCooldownBar from '/src/menus/ZippyCooldownBar.js';

// Gameover Menu.
import Leaderboard from '/src/menus/Leaderboard.js';
import Inputbox from '/src/menus/Inputbox.js';
import SaveButton from '/src/menus/SaveButton.js';
import DeathMsgLabel from '/src/menus/DeathMsgLabel.js';

// Projectiles and Effects.
import Zippy from '/src/classes/Zippy.js';
import Bullet from '/src/classes/Bullet.js';
import Debris from '/src/classes/Debris.js';
import Tire from '/src/classes/Tire.js';
import Explosion from '/src/classes/Explosion.js';
import { explode_zippies } from '/src/classes/Zippy.js';
import { collide_debris } from '/src/classes/Debris.js';
import { collide_bullets } from '/src/classes/Bullet.js';
import { throw_zippy } from '/src/classes/Zippy.js';

// Obstacles.
import Crate from '/src/classes/Crate.js';
import Car from '/src/classes/Car.js';
import { despawn_sprites } from '/src/Sprite.js';
import { spawn_crates } from '/src/classes/Crate.js';

// Enemies.
import Cop from '/src/classes/Cop.js';
import Scooter from '/src/classes/Scooter.js';

// Misc & Utility.
import { loader } from '/src/loader.js';
import { create_key_listener } from '/src/key_listener.js';
import { create_click_listener } from '/src/click_listener.js';
import { getRandomInt } from '/src/common.js';

// Function for getting current height of HTML5 canvas.
export function get_canvas_height() {
    return game.canvas.height;
}

// Function for getting current width of HTML5 canvas.
export function get_canvas_width() {
    return game.canvas.width;
}

// Game Object.
const game = {

    // Game running boolean.
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

        // Create player.
        let sk8r_x = 17;
        this.sk8r = new Sk8r(sk8r_x, sk8r_floor, this.context, loader.images.sk8r, 0);

        // Set starting score.
        this.score = 0;

        // Game state booleans.
        this.showing_logo = true;
        this.is_fullscreen = false;
        this.has_started = false;
        this.showing_restart_menu = false;
        this.is_prompting_for_input = false;

        // Create Enviroment.
        this.road = new Road(0, 0, this.context, loader.images.road[0]);
        this.downtown = new Downtown(0, 0, this.context, loader.images.downtown[0]);
        this.smog = new Smog(0, 0, this.context, loader.images.smog[0]);
        this.cityscape = new Cityscape(0, 0, this.context, loader.images.cityscape[0]);

        // Create start menu.
        this.logo = new Logo(this.canvas.width/2, this.canvas.height*3/4, game.context, loader.images.logo[0]);
        this.version = new Version(game.context, this.canvas.width-24, this.canvas.height-11, loader.images.version[0]);
        this.instructs = new Instruct(this.canvas.width-47, 10, game.context, loader.images.instruct[0]);
        this.sk8r_label = new Sk8rNameLabel(game.context, sk8r_x+15, sk8r_floor+47, loader.images.name_label[0], loader.images.smfont[0], this.sk8r.getName());

        // Create list to hold all buttons available on screen at any given time.
        this.buttons = [];

        // Create and add start game button.
        let start_game = function() {this.has_started = true;}
        this.buttons.push(new StartButton(this.canvas.width/2, this.canvas.height*1/3, game.context,
                                     loader.images.startbutton[0], loader.images.karmatic_arcade_font[0],
                                     "Start", start_game.bind(this), true));

        // Create and add buttons for character selection.
        let prev_sk8r = function() {this.sk8r.prev_sprite(); this.sk8r_label.setName(this.sk8r.getName());}
        let next_sk8r = function() {this.sk8r.next_sprite(); this.sk8r_label.setName(this.sk8r.getName());}
        this.buttons.push(new ArrowButton(sk8r_x-4, sk8r_floor+45, game.context,
                                          loader.images.arrowbuttons[0], prev_sk8r.bind(this), false));
        this.buttons.push(new ArrowButton(sk8r_x+33, sk8r_floor+45, game.context,
                                          loader.images.arrowbuttons[1], next_sk8r.bind(this), false));

        // Create in-game menu elements.
        this.scorebox = new KAFont(this.context, 10, 5, loader.images.karmatic_arcade_font[0]);
        this.zcooldown_bar = new ZippyCooldownBar(this.context, 3, Math.floor(this.canvas.height/2), loader.images.zippy_cooldown_bar[0]);
        this.fsbutton = new FullscreenButton(7, this.canvas.height-9, game.context, loader.images.fullscreen_button[0], toggleFullscreen.bind(this));
        this.buttons.push(this.fsbutton);

        // Create variables to contain gameover menu elements.
        this.leaderboard = null;
        this.inputbox = null;
        this.death_label = null;

        // Create lists to hold all projectiles and effects in game at any given time.
        this.zippies = [];
        this.bullets = [];
        this.explosions = [];
        this.debris = [];
        this.tires = [];

        // Projectile timing values.
        this.time_since_last_zippy = 0;
        this.zippy_throw_delay = 10;

        // Create lists to hold all obstacles in game at any given time.
        this.crates = [];
        this.cars = [];

        // Obstacle timing values.
        this.time_since_last_obs_emy = 0;
        this.obj_emy_spawn_delay = 40;
        this.last_spawned_obstacle = "";

        // Create lists of enemies an enemy effects in game at any given time.
        this.cops = [];
        this.scooters = [];

        // Start game.
        this.drawingLoop();
    },

    // Function to halt scrolling game elements.
    game_over() {

        // Stop scrolling enviroment.
        this.downtown.stop_scroll();
        this.smog.stop_scroll();
        this.cityscape.stop_scroll();
        this.road.stop_scroll();

        // Stop scrolling sprites.
        this.crates.forEach((crate, i) => crate.stop_scroll());
        this.cars.forEach((car, i) => car.stop_scroll());
        this.explosions.forEach((ex, i) => ex.stop_scroll());
        this.debris.forEach((deb, i) => deb.stop_scroll());
        this.tires.forEach((tire, i) => tire.stop_scroll());
        this.cops.forEach((cop, i) => cop.stop_scroll());
        this.scooters.forEach((scooter, i) => scooter.stop_scroll());
    },

    // Function for reseting game.
    restart_game() {
        // Reset score.
        this.score = 0;

        // Null start and gameover menu elements, in case they are still on screen.
        this.logo = null;
        this.version = null;
        this.instructs = null;
        this.leaderboard = null;
        this.death_label = null;
        this.inputbox = null;

        // Remove all buttons except for full screen button.
        game.buttons = game.buttons.filter(btn => btn === game.fsbutton);

        // Reset game state booleans.
        this.showing_logo = false;
        this.showing_restart_menu = false;
        this.is_prompting_for_input = false;

        // Reset enviroment elements.
        this.downtown.reset_downtown();
        this.smog.reset_smog();
        this.cityscape.reset_cityscape();
        this.road.reset_road();

        // Reset projectiles and effects.
        this.zippies = [];
        this.bullets = [];
        this.explosions = [];
        this.debris = [];
        this.tires = [];
        this.time_since_last_zippy = 0;
        this.zippy_throw_delay = 10;

        this.zcooldown_bar.reset();

        // Reset obstacles.
        this.cars = [];
        this.crates = [];
        this.time_since_last_obs_emy = 0;
        this.obj_emy_spawn_delay = 40;

        // Reset enemies.
        this.cops = [];
        this.scooters = [];

        // Reset player and player effects.
        this.sk8r.reset_sk8r();
        this.board = null;
    },

    // Function to update and render enviroment elements.
    update_and_render_enviroment() {

        // Update enviroment.
        this.smog.update_smog();
        this.cityscape.update_cityscape();
        this.downtown.update_downtown();
        this.road.update_road();

        // Render enviroment.
        this.smog.render();
        this.cityscape.render();
        this.downtown.render();
        this.road.render();
    },

    // Function to update and render obstacles.
    update_and_render_obstacles() {

        // Update, render, and despawn crates.
        if (this.crates.length > 0) {
            this.crates.forEach((c, i) => {
                c.update_crate();
                c.render();
            });
            despawn_sprites(this.crates);
        }

        // Update, render, and despawn cars.
        if (this.cars.length > 0) {
            this.cars.forEach((c, i) => {
                c.update_car();
                c.render();
            });
            despawn_sprites(this.cars);
        }
    },

    // Function for updating and rendering zippy fireworks.
    update_render_and_explode_zippies() {

        if (this.zippies.length > 0) {

          // Explode zippies and get crate break locations, if any.
          let breakPosList = explode_zippies(this.zippies, this.crates, this.cars, this.cops,
                                             loader.audio.ex_zippy_sounds, loader.audio.zombie_death[0]);

            // Spawn explosions/effects at each crate break location.
            let spawned_tire = false;
            breakPosList.forEach((pos, i) => {
                /*
                 * Get explosion coordinates and type of destroyed object.
                 * type 0: destroyed crate (obstacle).
                 * type 1: destroyed car (obstacle).
                 * type 2: destroyed zombie cop (enemy).
                */
                let x_pos = pos[0];
                let y_pos = pos[1]-2;
                let type = pos[2];

                // Spawn scooter at break location, if destroyed zombie cop.
                if (type == 2) {
                    this.scooters.push(new Scooter(x_pos, y_pos, this.context, loader.images.scooter[0]));
                    return;
                }

                // Else, must be obstacle type. Run for-loop to layer multiple explosions/debris for effect.
                for (let j = 0; j < 3; j++) {

                    // Get new random point local to break position.
                    x_pos += getRandomInt(-1, 4);
                    y_pos += getRandomInt(-1, 4);

                    // Create explosion effect of type 0 (big explosion).
                    this.explosions.push(new Explosion(x_pos, y_pos, this.context, loader.images.explosion, 0, 3*j));

                    // Create debris object based on destroyed object.
                    if (type != undefined && getRandomInt(0,5) > 0) {
                        this.debris.push(new Debris(x_pos, y_pos+3, this.context, loader.images.debris[type], 2*j, type));
                    }
                }

                // If destroyed oject was a car, and a tire debris hasn't been spawned yet, try to spawn tire.
                if (type == 1 && !spawned_tire && getRandomInt(0, 4) == 4) {
                    this.tires.push(new Tire(x_pos, y_pos+2, this.context, loader.images.tire[0], 0))
                    spawned_tire = true;
                }
            });

            // Update and render zippies.
            this.zippies.forEach((zippy, i) => {
                zippy.update_zippy();
                zippy.render();
            });
            despawn_sprites(this.zippies);
        }

        // Calculate zippy throw delay clock.
        if (this.time_since_last_zippy > 0) {
            this.time_since_last_zippy += 1;

            if (this.time_since_last_zippy == this.zippy_throw_delay) {
                this.time_since_last_zippy = 0;
            }
        }
    },

    // Function for updating and rendering zippy cooldown bar.
    update_and_render_zippy_cooldown_bar() {

        if (this.has_started) {

            // Every 7 ticks (points), descrease zippy cooldown bar by 1 level.
            if (this.score % 7 == 0 || !this.sk8r.isAlive) {
                this.zcooldown_bar.decrease_level();
            }
            this.zcooldown_bar.update_zippy_cooldown_bar();
            this.zcooldown_bar.render();
        }
    },

    // Function to update, render, and collide debris objects.
    update_render_and_collide_debris() {

        if (this.debris.length > 0) {

            // Update and render each debris object.
            this.debris.forEach((deb, i) => {
                deb.update_debris();
                deb.render();
            });
            despawn_sprites(this.debris);

            // Check for and apply any collisions with enemies.
            let hitPosList = collide_debris(this.debris, this.cops, loader.audio.zombie_death[0]);
            hitPosList.forEach((pos, i) => {
                let x_pos = pos[0];
                let y_pos = pos[1]-2;
                this.scooters.push(new Scooter(x_pos, y_pos, this.context, loader.images.scooter[0]));
            });
        }

        // Update and render tire debris.
        if (this.tires.length > 0) {
            this.tires.forEach((tire, i) => {
                tire.update_tire();
                tire.render();
            });
            despawn_sprites(this.tires);
        }
    },

    // Function to add point to score counter and update score display.
    increment_scorebox() {
        this.score += 1;
        this.scorebox.setText(this.score.toString());
    },

    // Function for updating and rendering scorebox.
    update_and_render_scorebox() {
        if (this.sk8r.isAlive && this.has_started) {
            // Add point to score and draw.
            this.increment_scorebox();
        }
        this.scorebox.render();
    },

    // Function for rendering player and player effects.
    render_sk8r() {

        // If player dies, create/render player effects.
        if (!this.sk8r.isAlive) {

            if (this.board == null) {
                this.board = new Board(18, this.sk8r.y, this.context, this.sk8r.image, this.crates, this.cars);
            } else {
                this.board.render();
                this.board.update_board();
            }
        }
        this.sk8r.render();
    },

    // Function for updating, rendering, and firing the weapons of zombie cop enemies.
    update_render_and_fire_cops() {

        if (this.cops.length > 0) {
            this.cops.forEach((cop, i) => {

                // If cop is on screen and firing timer is up, shoot bullet.
                if (cop.readyToFire && cop.x < this.canvas.width+10) {
                    this.bullets.push(new Bullet(cop.x, cop.y+24, this.context, loader.images.bullet[0]));
                    this.explosions.push(new Explosion(cop.x-5, cop.y+20, this.context, loader.images.explosion, 1, 0));
                    cop.timeSinceFire = 0;
                    cop.readyToFire = false;

                    // Play gun fired sfx.
                    let gunfire_sounds = loader.audio.gunfire;
                    let rand_int = getRandomInt(0,gunfire_sounds.length-1);
                    let shoot_sfx = gunfire_sounds[rand_int].cloneNode(false);
                    shoot_sfx.play();
                }

                // Change direction cop is facing, if behind player.
                if (cop.is_looking_backwards() && cop.x < this.sk8r.x) {
                    cop.look_forwards();
                }

                // Update and render cop.
                cop.update_cop(loader.audio.ex_zippy_sounds[1]);
                cop.render();
            });
            despawn_sprites(this.cops);
        }

        // Update and render zombie cop effects.
        if (this.scooters.length > 0) {
            this.scooters.forEach((scooter, i) => {
                scooter.update_scooter();
                scooter.render();
            });
            despawn_sprites(this.scooters);
        }
    },

    // Function for updating and rendering explosion effects.
    update_and_render_explosions() {
        if (this.explosions.length > 0) {
            this.explosions.forEach((ex, i) => {
                ex.update_explosion();
                ex.render();
            });
            despawn_sprites(this.explosions);
        }
    },

    // Function for updating, rendering, and colliding bullet objects with player.
    update_render_and_collide_bullets() {

        if (this.bullets.length > 0) {

            // Update and render bullets.
            this.bullets.forEach((bullet, i) => {
                bullet.update_bullet();
                bullet.render();
            });
            despawn_sprites(this.bullets);

            // Check for and apply collisions with player, if any.
            let hitPos = collide_bullets(this.sk8r, this.bullets, loader.audio.player_hit[0]);
            if (hitPos != null) {
                this.explosions.push(new Explosion(hitPos[0], hitPos[1], this.context, loader.images.explosion, 0, 0));
            }
        }
    },

    // Function to try and spawn, based on timers and probability, the next obstacle or enemy.
    try_to_spawn_obj_emy() {

        // Compute clock for spawn delay.
        if (this.time_since_last_obs_emy > 0) {
            this.time_since_last_obs_emy += 1;

            if (this.time_since_last_obs_emy == this.obj_emy_spawn_delay) {
                this.time_since_last_obs_emy = 0;
            } else {
                return;
            }
        }

        // If cooldown has ended since last obstacle/enemy, try to spawn another.
        if (this.time_since_last_obs_emy == 0) {

            // Roll dice to determine what will spawn, if anything.
            let randInt = getRandomInt(1, 700);

            // Odds are 3/700 of spawning car.
            if (randInt > 697) {
                this.cars.push(new Car(get_canvas_width(), floor+1, this.context, loader.images.car[0]));
                this.time_since_last_obs_emy = 1;
                this.last_spawned_obstacle = "car";

            // Odds are 2/700 of spawning zombie cop enemy.
            } else if (randInt > 695 && this.last_spawned_obstacle != "cop") {
                this.cops.push(new Cop(get_canvas_width(), sk8r_floor-6, this.context, loader.images.cop[0]));
                this.time_since_last_obs_emy = 1;
                this.last_spawned_obstacle = "cop";

            // Finally, if nothing has spawned yet, attempt to spawn crate.
            } else {

                // Set initial stack width of 0. If this remains 0, then no crate will spawn.
                let stack_width = 0;

                // Odds for crate piles of various widths.
                if (randInt < 17) {stack_width = 1;}
                else if (randInt < 19) {stack_width = 2;}
                else if (randInt < 21) {stack_width = 3;}
                else if (randInt < 22) {stack_width = 4;}

                // Spawn crate pile of specified width, if any.
                if (stack_width > 0) {
                    spawn_crates(this.context, loader.images.crates, this.crates, stack_width);
                    this.time_since_last_obs_emy = 1;
                    this.last_spawned_obstacle = "crate";
                }
            }
        }
    },

    // Function to create the gameover menu.
    create_gameover_menu() {

        // Set boolean for showing restart menu.
        this.showing_restart_menu = true;

        // Set restart menu's position on screen.
        let menu_xpos = get_canvas_width()/2;
        let menu_ypos = get_canvas_height()*2/3;

        // Create and add restart button.
        let restart_game = function() {this.restart_game();}
        this.buttons.push(new StartButton(menu_xpos, get_canvas_height()*1/3, this.context,
                          loader.images.startbutton[0], loader.images.karmatic_arcade_font[0],
                          "Restart", restart_game.bind(this), true));

        // Create and add leaderboard and usernae input box.
        this.leaderboard = new Leaderboard(menu_xpos, menu_ypos, this.context, loader.images.leaderboard[0],
                                           loader.images.smfont[0], loader.saved_data);
        this.inputbox = new Inputbox(menu_xpos, menu_ypos-21, this.context, loader.images.inputbox[0], loader.images.smfont[0]);
        this.death_label = new DeathMsgLabel(this.context, get_canvas_width()/2, 5, loader.images.death_label[0], loader.images.smfont[0], this.sk8r.get_autopsy());

        // Create and add save high score button.
        let save_highscore = function() {this.restart_game();}
        this.buttons.push(new SaveButton(menu_xpos+34, menu_ypos-20, this.context,
                          loader.images.savebutton[0], save_highscore.bind(this)));
    },

    // Function for updating and rendering start menu, if it exists.
    try_to_update_and_render_start_menu() {

        // Update and render logo as long as it exists and is on screen.
        if (this.logo != null) {
            this.logo.render();

            if (this.score > 25) {
              this.logo.nudge_off_screen();
            }
            if (this.logo.off_screen) {this.logo = null;}
        }

        // Update and render this instructions as long as it exists and is on screen.
        if (this.instructs != null) {
            this.instructs.update_instructs();
            this.instructs.render();

            if (this.score > 0) {
              this.instructs.nudge_off_screen();
            }
            if (this.instructs.off_screen) {this.instructs = null;}
        }

        // Check if character selection name label an version icon exist.
        if (this.sk8r_label != null && this.version != null) {

            // If these start menu elements still exist and the this has just started, remove them.
            if (this.has_started) {
                this.sk8r_label = null;
                this.version = null;
                this.buttons = this.buttons.filter(btn => btn === this.fsbutton);

            // Else, if still idling on the start menu, update and render elements.
            } else {
                this.sk8r_label.render();
                this.version.render();
            }
        }
    },

    // Function to update and render gameover menu, if any of its elements exist.
    try_to_update_and_render_gameover_menu() {

        let gameover_menu_exists = (this.showing_restart_menu && this.leaderboard != null
                                    && this.inputbox != null && this.death_label != null);
        if (gameover_menu_exists) {
            this.leaderboard.render();
            this.inputbox.update_inputbox();
            this.inputbox.render();
            this.death_label.render();

            // Check if user is being prompted for input. If so, highlight input box.
            if (this.inputbox.is_highlighted) {
                this.is_prompting_for_input = true;
            } else {
                this.is_prompting_for_input = false;
            }
        }
    },

    // Main animating loop.
    async drawingLoop() {

        // Set game frame rate.
        await new Promise(r => setTimeout(r, 15));

        // If player dies, trigger game over.
        if (game.sk8r.isAlive === false) { game.game_over(); }

        // Wipe canvas for new frame.
        game.context.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.trueContext.clearRect(0, 0, game.trueCanvas.width, game.trueCanvas.height);

        // Get true HTML5 canvas dimensions.
        let scale_width = game.trueCanvas.width;
        let scale_height = game.trueCanvas.height;

        // Enviroment and Obstacles.
        game.update_and_render_enviroment(); // Update/render enviroment elements.
        game.update_and_render_obstacles(); // Update/render obstacles

        // Player and Friendly Projectiles.
        game.sk8r.update_sk8r(game.crates, game.cars, loader.audio.player_hit[0], loader.audio.gameover[0]); // Update player.
        game.update_render_and_explode_zippies(); // Update, render, and explode zippy fireworks on obstacles and enemies.
        game.update_and_render_zippy_cooldown_bar(); // Update and render zippy cooldown bar.
        game.update_render_and_collide_debris(); // Update, render, and collide debris with enemies.

        // Score and Player.
        game.render_sk8r(); // Render player.
        game.update_and_render_scorebox(); // Update and render scorebox.

        // Enemies, Destruction Effects, and Enemy Projectiles.
        game.update_render_and_fire_cops(); // Update, render, and fire the weapons of zombie cop enemies.
        game.update_and_render_explosions(); // Update and render explosion effects.
        game.update_render_and_collide_bullets(); // Update, render, and collide bullets with player.

        // If player is still alive and game has begun, continue spawning new obstacles/enemies.
        if (game.sk8r.isAlive && game.has_started) {
            game.try_to_spawn_obj_emy();
        }

        // Gameover menu.
        let just_became_gameover = (!game.sk8r.isAlive && game.sk8r.velocity_x == 0 && !game.showing_restart_menu);
        if (just_became_gameover) {game.create_gameover_menu();}
        game.try_to_update_and_render_gameover_menu(); // Update and render gameover menu, if any of its element exist.

        // Render buttons, if any.
        game.buttons.forEach((button, i) => {
            button.render();
        });

        // Start menu.
        game.try_to_update_and_render_start_menu(); // Update and render the start menu, if any of its element exist.

        // Draw this frame to true canvas.
        game.trueContext.drawImage(game.canvas, 0, 0, game.canvas.width, game.canvas.height, 0, 0, scale_width, scale_height);

        // As long as game is still running, create next game frame.
        if (game.isRunning) {
            requestAnimationFrame(game.drawingLoop);
        }
    }
};

// Function to make player jump, if alive and on ground.
export function attempt_to_jump() {

    // If player successfully jumped, play sfx.
    if (game.sk8r.isGrounded && game.sk8r.isAlive) {
        let jump_sounds = loader.audio.jump;
        let rand_int = getRandomInt(0,jump_sounds.length-1);
        let jump_sfx = jump_sounds[rand_int].cloneNode(false);
        game.sk8r.jump(jump_sfx);
    }
}

// Function to spawn zippy, if zippy cooldown/clock and player state allows it.
export function attempt_to_throw_zippy() {

    if (game.sk8r.isAlive && game.time_since_last_zippy <= 0) {

        if (game.zcooldown_bar.is_frozen) {

            let cant_throw_sfx = loader.audio.cant_throw_z[0];
            cant_throw_sfx.cloneNode(false).play();
        } else {

            let throw_sounds = loader.audio.throw_zippy;
            let rand_int = getRandomInt(0,throw_sounds.length-1);
            let throw_sfx = throw_sounds[rand_int].cloneNode(false);

            // Spawn zippy with greater x velocity the higher the player is.
            let x_velocity_boost = Math.floor((game.sk8r.y-sk8r_floor)/30);
            throw_zippy(game.sk8r.x+20, game.sk8r.y+27, x_velocity_boost, game.context,
                        loader.images.zippy[0], game.zippies, throw_sfx);

            // If throwing zippy during game, increase cooldown bar level.
            if (game.has_started) {
                game.zcooldown_bar.increase_level(loader.audio.zippy_overheat[0]);
            }

            // Reset zippy timing clock.
            game.time_since_last_zippy = 1;
        }
    }
}

// Function to resize mini drawing canvas to fit true canvas.
function resizeGame() {

    // Get game's HTML5 canvas element and dimensions.
    let gameArea = document.getElementById('canvas');
    let widthToHeight = 16/9;
    let newWidth = window.innerWidth * 0.95;
    let newHeight = window.innerHeight * 0.95;
    let newWidthToHeight = newWidth / newHeight;

    // Maintain game canvas aspect ratio.
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        gameArea.style.height = Math.floor(newHeight) + 'px';
        gameArea.style.width = Math.floor(newWidth) + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = Math.floor(newWidth) + 'px';
        gameArea.style.height = Math.floor(newHeight) + 'px';
    }

    // Draw canvas margin line.
    gameArea.style.marginTop = (-newHeight / 2) + 'px';
    gameArea.style.marginLeft = (-newWidth / 2) + 'px';

    // Set game's screen dimensions.
    game.canvas.style.width = newWidth / 4;
    game.canvas.style.height = newHeight / 4;

    // Disable antialiasing. Otherwise pixel art looks like blurry vomit.
    game.trueContext.webkitImageSmoothingEnabled = false;
    game.trueContext.mozImageSmoothingEnabled = false;
    game.trueContext.imageSmoothingEnabled = false;
}

// Toggle whether HTML5 canvas is in fullscreen mode.
function toggleFullscreen() {

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

// Function to official start game.
function start_game() {

    game.init();
    create_key_listener(game);
    create_click_listener(game);
    resizeGame();
}

// On page load, start game.
window.addEventListener("load", () => {
    start_game();
});
