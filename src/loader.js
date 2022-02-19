import Sk8r from '/src/classes/Sk8r.js';
import Road from '/src/classes/Road.js';
import Downtown from '/src/classes/Downtown.js';
import Smog from '/src/classes/Smog.js';
import Cityscape from '/src/classes/Cityscape.js';
import Crate from '/src/classes/Crate.js';
import Zippy from '/src/classes/Zippy.js';
import Board from '/src/classes/Board.js';
import StartButton from '/src/menus/StartButton.js';
import Logo from '/src/menus/Logo.js';
import Leaderboard from '/src/menus/Leaderboard.js';
import Inputbox from '/src/menus/Inputbox.js';
import SMFont from '/src/menus/SMFont.js';
import KAFont from '/src/menus/KAFont.js';
import SaveButton from '/src/menus/SaveButton.js';
import ArrowButton from '/src/menus/ArrowButton.js';
import Sk8rNameLabel from '/src/menus/Sk8rNameLabel.js';
import DeathMsgLabel from '/src/menus/DeathMsgLabel.js';
import Instruct from '/src/menus/Instruct.js';
import Explosion from '/src/classes/Explosion.js';
import Debris from '/src/classes/Debris.js';
import Car from '/src/classes/Car.js';
import Tire from '/src/classes/Tire.js';
import Cop from '/src/classes/Cop.js';
import Bullet from '/src/classes/Bullet.js';
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
        loader.load_scores(Leaderboard.saved_src);
        loader.add('sk8r', Sk8r.src);
        loader.add('road', [Road.src]);
        loader.add('downtown', [Downtown.src]);
        loader.add('smog', [Smog.src]);
        loader.add('cityscape', [Cityscape.src]);
        loader.add('crates', [Crate.src_0, Crate.src_1]);
        loader.add('zippy', [Zippy.src]);
        loader.add('board', [Board.src]);
        loader.add('startbutton', [StartButton.src]);
        loader.add('logo', [Logo.src]);
        loader.add('leaderboard', [Leaderboard.src]);
        loader.add('inputbox', [Inputbox.src]);
        loader.add('smfont', SMFont.src);
        loader.add('karmatic_arcade_font', [KAFont.src]);
        loader.add('savebutton', [SaveButton.src]);
        loader.add('arrowbuttons', [ArrowButton.src_0, ArrowButton.src_1]);
        loader.add('name_label', Sk8rNameLabel.src);
        loader.add('death_label', DeathMsgLabel.src);
        loader.add('explosion', Explosion.src);
        loader.add('debris', Debris.src);
        loader.add('car', [Car.src]);
        loader.add('tire', Tire.src);
        loader.add('cop', Cop.src);
        loader.add('bullet', Bullet.src);
        loader.add('scooter', Scooter.src);
        loader.add('instruct', Instruct.src)
    }
};
