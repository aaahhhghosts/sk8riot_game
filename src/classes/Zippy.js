import Sprite from '/src/Sprite.js';
import { getRandomInt } from '/src/common.js';
import { floor } from '/src/constants.js';

export default class Zippy extends Sprite {

    static src = ['/sprites/zippy.png'];

    constructor(x, y, x_velocity_boost, context, image) {
        super({
            context: context,
            image: image,
            x: x,
            y: y,
            width: 9,
            height: 9,
            frameIndex: 0,
            row: 0,
            tickCount: 0,
            ticksPerFrame: 0,
            frames: 20,
            loop_animation: true,
            hasGravity: true
        });

        this.floor = floor;
        this.velocity_y = 1;
        this.velocity_x = 1.5+x_velocity_boost;
        if (this.velocity_x > 3.2) {this.velocity_x = 3.2;}

        this.set_scroll(false, 0);

        this.isAirborn = true;
        this.exploded = false;
    }

    animate_throw() {
        this.row = 0;
        this.frames = 20;
        this.frameIndex = 0;
    }

    animate_explode() {

        this.loop_animation = false;
        this.row = 1;
        this.frames = 5+1;
        this.frameIndex = 0;
        this.ticksPerFrame = 2;
    }

    explode() {
        this.exploded = true;
        this.animate_explode();
    }

    animate_land() {
        this.y -= getRandomInt(0, 4);
    }

    update_zippy() {

        super.update();
        if (this.isAirborn) {this.x += this.velocity_x;}
    }
}

// Spawn zippy.
export function throw_zippy(x, y, x_velocity_boost, context, img, zippies, throw_sfx) {
    zippies.push(new Zippy(x, y, x_velocity_boost, context, img));
    throw_sfx.play();
}

export function explode_zippies(zippies, crates, cars, cops, ex_zippy_sounds, zombie_death_sfx) {

    // Declare list to hold the position of every crate break, if any.
    let breakPosList = [];

    zippies.filter(zippy => !zippy.exploded).forEach((zippy, i) => {

        // If zippy has landed on ground, explode.
        if (!zippy.isAirborn) {
            zippy.explode();

            // Play dud sfx.
            let dud_sfx = ex_zippy_sounds[2].cloneNode(false);
            dud_sfx.play();
            return;
        }

        // Check for crate collisions.
        crates.filter(crate => !crate.isBroken).forEach((crate, j) => {

            let hitCrate = zippy.x >= crate.x-5 && (zippy.x <= (crate.x+crate.width) &&
                           zippy.y >= (crate.y-2) && zippy.y < crate.y+crate.height);

            // If zippy collided with crate.
            if (hitCrate && !zippy.exploded) {

                // Set zippy's floor to the top of the crate,
                // which will trigger a landing event next update.
                zippy.floor = crate.y+crate.height;

                // If crate is wooden and unbroken, break.
                if (crate.type == 0) {
                    crate.break();
                    zippy.explode();
                    breakPosList.push([Math.floor(crate.x), Math.floor(crate.y), 0]);

                    // Play one of two crate explosion sfx.
                    let rand_int = getRandomInt(0,1);
                    let explode_sfx = ex_zippy_sounds[rand_int].cloneNode(false);
                    explode_sfx.play();

                // Else if crate is steel, play dud sfx.
                } else if (crate.type == 1) {

                    // Play dud sfx.
                    let dud_sfx = ex_zippy_sounds[2].cloneNode(false);
                    dud_sfx.play();
                }
            }
        });
        if (zippy.exploded) {return breakPosList;}

        // Check for car collisions.
        cars.filter(car => !car.isBroken).forEach((car, j) => {


            if (zippy.x >= car.x-23 && zippy.x <= car.x+car.width-7) {

                // Get y coord of the top of this car.
                let top_of_car = car.y+car.height/2-1;

                if (zippy.x >= car.x+5 && zippy.x <= car.x+56) {
                    top_of_car = car.y+(car.height-4);
                }

                let hitCar = zippy.x >= (car.x-5) && zippy.x <= (car.x+car.width) &&
                             zippy.y >= (car.y-2) && zippy.y < top_of_car;

                // If zippy collided with car.
                if (hitCar && !zippy.exploded) {

                   // Set zippy's floor to the top of the car,
                   // which will trigger a landing event next update.
                   zippy.floor = car.y+car.height;

                   // If car is wooden and unbroken, break.
                   if (!car.isBroken) {
                       car.damage();

                       // Play car damage sfx.
                       let car_damage_sfx = ex_zippy_sounds[3].cloneNode(false);
                       car_damage_sfx.play();

                       zippy.explode();
                       breakPosList.push([Math.floor(zippy.x), Math.floor(car.y)]);

                       if (car.isBroken) {
                           breakPosList.push([Math.floor(car.x+5), Math.floor(car.y+5), 1]);
                           breakPosList.push([Math.floor(car.x+20), Math.floor(car.y+10), 1]);
                           breakPosList.push([Math.floor(car.x+40), Math.floor(car.y+7), 1]);
                           breakPosList.push([Math.floor(car.x+60), Math.floor(car.y+3), 1]);

                           // Play car destroy sfx.
                           let car_destroy_sfx = ex_zippy_sounds[4].cloneNode(false);
                           car_destroy_sfx.play();
                       }
                   }
                }
            }
        });
        if (zippy.exploded) {return breakPosList;}

        // Check for cop collisions.
        cops.filter(cop => cop.isAlive).forEach((cop, j) => {

            if (zippy.x >= cop.x-23 && zippy.x <= cop.x+cop.width-7) {

                let hitcop = zippy.x >= (cop.x-5) && zippy.x <= (cop.x+cop.width) &&
                               zippy.y >= (cop.y-2) && zippy.y < (cop.y+cop.height);

                // If zippy collided with cop.
                if (hitcop && !zippy.exploded) {

                   // Set zippy's floor to the top of the cop,
                   // which will trigger a landing event next update.
                   zippy.floor = cop.y+cop.height;

                   // If cop is alive on collision, blow up that police ass.
                   if (cop.isAlive) {
                       cop.kill(0);
                       breakPosList.push([Math.floor(zippy.x+9), Math.floor(cop.y), 2]);
                       zippy.explode();

                       // Play dud sfx.
                       let dud_sfx = ex_zippy_sounds[2].cloneNode(false);
                       dud_sfx.play();

                       // Play zombie death sfx
                       zombie_death_sfx.cloneNode(false).play();
                   }
                }
            }
        });
    });

    return breakPosList;
}
