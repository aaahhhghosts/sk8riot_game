import Sk8r from '/src/classes/Sk8r.js';
import Road from '/src/classes/Road.js';
import Downtown from '/src/classes/Downtown.js';
import Cityscape from '/src/classes/Cityscape.js';
import Crate from '/src/classes/Crate.js';
import Zippy from '/src/classes/Zippy.js';
import Board from '/src/classes/Board.js';

// Image resource loader.
export const loader = {
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
        loader.add('board', [Board.src]);
    }
};
