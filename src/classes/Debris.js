import Sprite from '../Sprite.js';
import { getRandomInt } from '../common.js';
import { floor } from '../constants.js';
import { add_bonus_points } from '../Main.js';

export default class Debris extends Sprite {

    static src = ['/sprites/wood_debris.png', '/sprites/car_debris.png'];

    constructor(x, y, context, image, countdown, x_velocity_boost) {
        super({
            context: context,
            image: image,
            x: x,
            y: y,
            width: 12,
            height: 12,
            frameIndex: 0,
            row: 0,
            tickCount: 0,
            ticksPerFrame: 1,
            frames: 12,
            loop_animation: true,
            hasGravity: true
        });

        this.countdown = countdown;
        this.floor = floor;
        this.isAirborn = true;

        this.velocity_y = 1.0 + (getRandomInt(0, 5)/10.0);
        this.velocity_x = x_velocity_boost + 2.0 + (getRandomInt(0, 15)/10.0);

        switch(getRandomInt(0,4)) {
            case 1: this.frames = 12; this.row = 1; break;
            case 2: this.frames = 8; this.row = 2; break;
            case 3: this.frames = 8; this.row = 3; break;
        }
    }

    animate_land() {
         this.y -= getRandomInt(4, 8);
         this.frameIndex = (this.frames)*getRandomInt(0,1);
         this.frames = 1;
    }

    update_debris(debris_list) {

        // If countdown is up, begin throw.
        if (this.countdown > 0) {
            this.countdown -= 1;
            this.scroll();
        } else {
            super.update(debris_list);
        }

        if (this.isAirborn) {
            this.x += 3.5;
        }

        // If sk8r is dead, move body forwards.
        if (!this.isAirborn && this.velocity_x > 0) {

            this.x += this.velocity_x;
            this.velocity_x -= this.velocity_x / 30;

            if (this.velocity_x < 0.3) {
                this.velocity_x = 0;
            }
        }
    }
}

export function collide_debris(debris, cops, zombie_death_sfx, is_muted) {

    // Declare list to hold the position of every crate break, if any.
    let hitPosList = [];

    debris.forEach((deb, i) => {

        // Check for cop collisions.
        cops.filter(cop => cop.isAlive).forEach((cop, j) => {

            if (deb.x >= cop.x-23 && deb.x <= cop.x+cop.width-7) {

                let hitcop = deb.x >= (cop.x-5) && deb.x <= (cop.x+cop.width) &&
                             deb.y >= (cop.y-2) && deb.y < (cop.y+cop.height);

                // If deb collided with cop.
                if (hitcop) {

                   // If cop is alive on collision, blow up that cop ass.
                   if (cop.isAlive) {
                       cop.kill(1);
                       hitPosList.push([Math.floor(deb.x+9), Math.floor(cop.y)]);

                       // Play zombie death sfx
                       if (!is_muted) {
                            zombie_death_sfx.cloneNode(false).play();
                       }

                       // Give player extra 50 points for killing cop via debris.
                       add_bonus_points(50, cop.x+(cop.width/2), cop.y+20);
                   }
                }
            }
        });
    });
    return hitPosList;
}
