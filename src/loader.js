import Sk8r from '/src/classes/Sk8r.js';
import Road from '/src/classes/Road.js';
import Downtown from '/src/classes/Downtown.js';
import Cityscape from '/src/classes/Cityscape.js';
import Crate from '/src/classes/Crate.js';
import Zippy from '/src/classes/Zippy.js';
import Board from '/src/classes/Board.js';
import Button from '/src/menus/Button.js';
import Logo from '/src/menus/Logo.js';
import Leaderboard from '/src/menus/Leaderboard.js';
import Inputbox from '/src/menus/Inputbox.js';
import SmallFont from '/src/menus/SmallFont.js';
import SaveButton from '/src//menus/SaveButton.js';

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
        loader.add('sk8r', [Sk8r.src]);
        loader.add('road', [Road.src]);
        loader.add('downtown', [Downtown.src]);
        loader.add('cityscape', [Cityscape.src]);
        loader.add('crates', [Crate.src_0, Crate.src_1]);
        loader.add('zippy', [Zippy.src]);
        loader.add('board', [Board.src]);
        loader.add('button', [Button.src]);
        loader.add('logo', [Logo.src]);
        loader.add('leaderboard', [Leaderboard.src]);
        loader.add('inputbox', [Inputbox.src]);
        loader.add('smallfont', [SmallFont.src]);
        loader.add('savebutton', [SaveButton.src]);
    }
};
