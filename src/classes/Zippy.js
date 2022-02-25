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
        this.doneExploding = false;
        this.brokeCrate = false;
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

    animate_land() {
        this.y -= getRandomInt(0, 4);
        this.animate_explode();
    }

    update_zippy() {

        super.update();
        if (this.isAirborn) {this.x += this.velocity_x;}
    }
}

// Spawn zippy.
export function throw_zippy(x, y, x_velocity_boost, context, img, zippies) {
    zippies.push(new Zippy(x, y, x_velocity_boost, context, img));
}

export function explode_zippies(zippies, crates, cars, cops) {

    // Declare list to hold the position of every crate break, if any.
    let breakPosList = [];

    zippies.filter(zippy => zippy.isAirborn).forEach((zippy, i) => {

        // Check for crate collisions.
        crates.filter(crate => !crate.isBroken).forEach((crate, j) => {

            let hitCrate = zippy.x >= crate.x-5 && (zippy.x <= (crate.x+crate.width) &&
                           zippy.y >= (crate.y-2) && zippy.y < crate.y+crate.height);

            // If zippy collided with crate.
            if (hitCrate && !zippy.brokeCrate) {

                // Set zippy's floor to the top of the crate,
                // which will trigger a landing event next update.
                zippy.floor = crate.y+crate.height;

                // If crate is wooden and unbroken, break.
                if (crate.type == 0) {
                    crate.break();
                    zippy.brokeCrate = true;
                    breakPosList.push([Math.floor(crate.x), Math.floor(crate.y), 0]);
                }
            }
        });

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
                if (hitCar && !zippy.brokeCrate) {

                   // Set zippy's floor to the top of the car,
                   // which will trigger a landing event next update.
                   zippy.floor = car.y+car.height;

                   // If car is wooden and unbroken, break.
                   if (!car.isBroken) {
                       car.damage();
                       zippy.brokeCrate = true;
                       breakPosList.push([Math.floor(zippy.x), Math.floor(car.y)]);

                       if (car.isBroken) {
                           breakPosList.push([Math.floor(car.x+5), Math.floor(car.y+5), 1]);
                           breakPosList.push([Math.floor(car.x+20), Math.floor(car.y+10), 1]);
                           breakPosList.push([Math.floor(car.x+40), Math.floor(car.y+7), 1]);
                           breakPosList.push([Math.floor(car.x+60), Math.floor(car.y+3), 1]);
                       }
                   }
                }
            }
        });

        // Check for cop collisions.
        cops.filter(cop => cop.isAlive).forEach((cop, j) => {

            if (zippy.x >= cop.x-23 && zippy.x <= cop.x+cop.width-7) {

                let hitcop = zippy.x >= (cop.x-5) && zippy.x <= (cop.x+cop.width) &&
                               zippy.y >= (cop.y-2) && zippy.y < (cop.y+cop.height);

                // If zippy collided with cop.
                if (hitcop && !zippy.brokeCrate) {

                   // Set zippy's floor to the top of the cop,
                   // which will trigger a landing event next update.
                   zippy.floor = cop.y+cop.height;

                   // If cop is alive on collision, blow up that cop ass.
                   if (cop.isAlive) {
                       cop.kill(0);
                       breakPosList.push([Math.floor(zippy.x+9), Math.floor(cop.y), 2]);
                       zippy.brokeCrate = true;
                   }
                }
            }
        });
    });

    return breakPosList;
}
