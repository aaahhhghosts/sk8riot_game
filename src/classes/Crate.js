import Sprite from '../Sprite.js';
import { floor } from '../constants.js';
import { getRandomInt, add } from '../common.js';
import { get_canvas_width } from '../Main.js';

export default class Crate extends Sprite {

    static src =['/sprites/wood_crate.png', '/sprites/steel_crate.png'];

    constructor(x, y, context, image, type) {

        super({
            context: context,
            image: image,
            x: x,
            y: y,
            width: 15,
            height: 15,
            frameIndex: 0,
            row: 0,
            tickCount: 0,
            ticksPerFrame: 1,
            frames: 1,
            loop_animation: true,
            hasGravity: true,
        });

        this.type = type;

        this.stackedOn = [];
        this.isBroken = false;
    }

    getTypeName() {
        let name = "unknown";
        switch(this.type) {
            case 0: name = "wood crate"; break;
            case 1: name = "steel crate"; break;
        }
        return name;
    }

    // Stack list of crates below this crate.
    stackOn(crates) {
        crates.forEach((crate, i) => {
            this.stackedOn.push(crate);
            this.floor += (crate.height-1);
            this.y = this.floor;
        });
    }

    break() {
        this.isBroken = true;
        this.row = 1;
    }

    update_crate() {
        super.update();
        this.update_floor();
    }

    update_floor() {

        // If there are any crates beneath current crate.
        if (this.stackedOn.length > 0) {

            // Remove broken crates from stack.
            this.stackedOn.forEach((crate, i) => {

                // If crate is broken, remove from stack.
                if (crate.isBroken) {
                    var i = this.stackedOn.indexOf(crate);
                    this.stackedOn.splice(i, 1);

                    // Set new current floor to height below crate.
                    this.floor -= (crate.height-1);
                }
            });
        }
    }
}

// Method for spawning in a given number of stacked crates.
export function spawn_crates(context, img_list, crates, stack_width) {

    let next_xpos = get_canvas_width();

    for (let i = 0; i < stack_width; i++) {

        let xpos = next_xpos;

        let stack_height = 1;
        let randInt = getRandomInt(1, 20);

        if (randInt < 7) {stack_height = 2;}
        else if (randInt < 10) {stack_height = 3;}
        else if (randInt < 11) {stack_height = 4;}

        // Generate crate stack types
        let crate_types = Array.from({length: stack_height}, () => {return (getRandomInt(0, 4) == 4) ? 1 : 0;});

        // Prevent stack of four steel crates
        if (stack_height == 4) {
            while (crate_types.reduce(add, 0) === 4) {
                crate_types = Array.from({length: stack_height}, () => {return (getRandomInt(0, 4) == 0) ? 1 : 0;});
            }
        }

        // Spawn one crate
        let crate_1_type = crate_types[0];
        let crate_1 = new Crate(xpos, floor, context, img_list[crate_1_type], crate_1_type);
        crates.push(crate_1);

        next_xpos += crate_1.width-1;

        if (stack_height == 1) continue;

        // Spawn 2nd crate on top of last one
        let crate_2_type = crate_types[1];
        let crate_2 = new Crate(xpos, floor, context, img_list[crate_2_type], crate_2_type);
        crate_2.stackOn([crate_1]);
        crates.push(crate_2);

        if (stack_height == 2) continue;

        // Spawn 3rd crate on top of the last two
        let crate_3_type = crate_types[2];
        let crate_3 = new Crate(xpos, floor, context, img_list[crate_3_type], crate_3_type);
        crate_3.stackOn([crate_1, crate_2]);
        crates.push(crate_3);

        if (stack_height == 3) continue;

        // Spawn 4th crate on top of the last three.
        let crate_4_type = crate_types[3];
        let crate_4 = new Crate(xpos, floor, context, img_list[crate_4_type], crate_4_type);
        crate_4.stackOn([crate_1, crate_2, crate_3]);
        crates.push(crate_4);
    }
}
