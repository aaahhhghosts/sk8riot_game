// Player
import Sk8r from '/src/classes/Sk8r.js';
import Board from '/src/classes/Board.js';

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
import SMFont from '/src/menus/SMFont.js';

// Projectiles and Effects.
import Zippy from '/src/classes/Zippy.js';
import Bullet from '/src/classes/Bullet.js';
import Debris from '/src/classes/Debris.js';
import Tire from '/src/classes/Tire.js';
import Explosion from '/src/classes/Explosion.js';

// Obstacles.
import Crate from '/src/classes/Crate.js';
import Car from '/src/classes/Car.js';

// Enemies.
import Cop from '/src/classes/Cop.js';
import Scooter from '/src/classes/Scooter.js';

// Image resource loader.
export const loader = {
    count: 0,
    images: {},
    saved_data: null,

    // Load image into object from file path.
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

    // Load highscores from json file.
    async load_scores(scores_path) {
        await fetch(scores_path)
              .then(response => response.json())
              .then(parsed => {loader.saved_data = parsed;})
              .catch(e => console.log(e));
    },

    init() {
      
        // Player
        loader.load_scores(Leaderboard.saved_src);
        loader.add('sk8r', Sk8r.src);

        // Enviroment.
        loader.add('road', Road.src);
        loader.add('downtown', Downtown.src);
        loader.add('smog', Smog.src);
        loader.add('cityscape', Cityscape.src);

        // Start Menu.
        loader.add('logo', Logo.src);
        loader.add('version', Version.src);
        loader.add('instruct', Instruct.src);
        loader.add('name_label', Sk8rNameLabel.src);
        loader.add('arrowbuttons', ArrowButton.src);
        loader.add('startbutton', StartButton.src);

        // In-Game Menu Elements.
        loader.add('karmatic_arcade_font', KAFont.src);
        loader.add('fullscreen_button', FullscreenButton.src)
        loader.add('zippy_cooldown_bar', ZippyCooldownBar.src);

        // Gameover Menu.
        loader.add('leaderboard', Leaderboard.src);
        loader.add('inputbox', Inputbox.src);
        loader.add('savebutton', SaveButton.src);
        loader.add('smfont', SMFont.src);
        loader.add('death_label', DeathMsgLabel.src);

        // Projectiles and Effects.
        loader.add('zippy', Zippy.src);
        loader.add('bullet', Bullet.src);
        loader.add('debris', Debris.src);
        loader.add('tire', Tire.src);
        loader.add('explosion', Explosion.src);

        // Obstacles.
        loader.add('crates', Crate.src);
        loader.add('car', Car.src);

        // Enemies.
        loader.add('cop', Cop.src);
        loader.add('scooter', Scooter.src);
    }
};
