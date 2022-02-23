import Scenery from '/src/Scenery.js';
import { get_canvas_width } from '/src/Main.js';

export default class Road extends Scenery {

    static src = '/sprites/road.png';

    constructor(x, y, context, image) {
        super({
            context: context,
            image: image[0],
            x: x,
            y: y,
            width: 448,
            height: 14,
            frameIndex: 0,
            column: 0,
            tickCount: 0,
            ticksPerFrame: 1,
            frames: 1
        });

        this.set_scroll(true, 2, true, get_canvas_width());
    }

    update_road() {
        super.update();
    }

    reset_road() {
        super.reset();
        this.set_scroll(true, 2, true, get_canvas_width());
    }
}
