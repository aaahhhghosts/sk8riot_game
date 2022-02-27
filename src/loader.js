// Player
import Sk8r from './classes/Sk8r.js';
import Board from './classes/Board.js';

// Enviroment.
import Road from './classes/Road.js';
import Downtown from './classes/Downtown.js';
import Smog from './classes/Smog.js';
import Cityscape from './classes/Cityscape.js';

// Start Menu.
import Logo from './menus/Logo.js';
import Version from './menus/Version.js';
import Instruct from './menus/Instruct.js'
import Sk8rNameLabel from './menus/Sk8rNameLabel.js';
import ArrowButton from './menus/ArrowButton.js';
import StartButton from './menus/StartButton.js';

// In-Game Menu Elements.
import KAFont from './menus/KAFont.js';
import FullscreenButton from './menus/FullscreenButton.js';
import ZippyCooldownBar from './menus/ZippyCooldownBar.js';

// Gameover Menu.
import Leaderboard from './menus/Leaderboard.js';
import Inputbox from './menus/Inputbox.js';
import SaveButton from './menus/SaveButton.js';
import DeathMsgLabel from './menus/DeathMsgLabel.js';
import SMFont from './menus/SMFont.js';

// Projectiles and Effects.
import Zippy from './classes/Zippy.js';
import Bullet from './classes/Bullet.js';
import Debris from './classes/Debris.js';
import Tire from './classes/Tire.js';
import Explosion from './classes/Explosion.js';

// Obstacles.
import Crate from './classes/Crate.js';
import Car from './classes/Car.js';

// Enemies.
import Cop from './classes/Cop.js';
import Scooter from './classes/Scooter.js';

// Image resource loader.
export const loader = {
    images: {},
    audio: {},
    saved_data: null,

    // Load image into object from file path.
    add_img(title, src_list) {

        let img_list = [];
        src_list.forEach((src, i) => {
            const image = new Image();
            image.src = `../${src}`;
            img_list.push(image);
        });
        this.images[title] = img_list;
    },

    // Load image into object from file path.
    add_wav(title, src_list) {

        let wav_list = [];
        src_list.forEach((src, i) => {
            const audio = new Audio();
            audio.src = `../audio/${src}.wav`;
            wav_list.push(audio);
        });
        this.audio[title] = wav_list;
    },

    // Load highscores from json file.
    async load_scores(scores_path) {
        await fetch(scores_path)
              .then(response => response.json())
              .then(parsed => {loader.saved_data = parsed;})
              .catch(e => console.log(e));
    },

    init() {

        /* ===== Loading Images ===== */
        // Player
        loader.load_scores(Leaderboard.saved_src);
        loader.add_img('sk8r', Sk8r.src);

        // Enviroment.
        loader.add_img('road', Road.src);
        loader.add_img('downtown', Downtown.src);
        loader.add_img('smog', Smog.src);
        loader.add_img('cityscape', Cityscape.src);

        // Start Menu.
        loader.add_img('logo', Logo.src);
        loader.add_img('version', Version.src);
        loader.add_img('instruct', Instruct.src);
        loader.add_img('name_label', Sk8rNameLabel.src);
        loader.add_img('arrowbuttons', ArrowButton.src);
        loader.add_img('startbutton', StartButton.src);

        // In-Game Menu Elements.
        loader.add_img('karmatic_arcade_font', KAFont.src);
        loader.add_img('fullscreen_button', FullscreenButton.src)
        loader.add_img('zippy_cooldown_bar', ZippyCooldownBar.src);

        // Gameover Menu.
        loader.add_img('leaderboard', Leaderboard.src);
        loader.add_img('inputbox', Inputbox.src);
        loader.add_img('savebutton', SaveButton.src);
        loader.add_img('smfont', SMFont.src);
        loader.add_img('death_label', DeathMsgLabel.src);

        // Projectiles and Effects.
        loader.add_img('zippy', Zippy.src);
        loader.add_img('bullet', Bullet.src);
        loader.add_img('debris', Debris.src);
        loader.add_img('tire', Tire.src);
        loader.add_img('explosion', Explosion.src);

        // Obstacles.
        loader.add_img('crates', Crate.src);
        loader.add_img('car', Car.src);

        // Enemies.
        loader.add_img('cop', Cop.src);
        loader.add_img('scooter', Scooter.src);

        /* ===== Loading Audio ===== */

        // Player.
        loader.add_wav('jump', ['jump_1',
                                'jump_2']);
        loader.add_wav('player_hit', ['player_hit']);
        loader.add_wav('gameover', ['gameover']);

        // Zippy.
        loader.add_wav('throw_zippy', ['throw_zippy_1',
                                       'throw_zippy_2',
                                       'throw_zippy_3']);
        loader.add_wav('ex_zippy_sounds', ['explode_z_1',
                                           'explode_z_2',
                                           'explode_z_3_dud',
                                           'explode_z_4_car_damage',
                                           'explode_z_5_car_destroy',]);
        loader.add_wav('cant_throw_z', ['cant_throw_zippy']);
        loader.add_wav('zippy_overheat', ['zippy_overheat']);

        // Enemies.
        loader.add_wav('zombie_death', ['zombie_death']);
        loader.add_wav('gunfire', ['gunfire_1', 'gunfire_2']);

        // Menu.
        loader.add_wav('click_button', ['click_button']);
    }
};
