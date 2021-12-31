import Scenery from '/src/Scenery.js';

export default class Road extends Scenery {

    static src = '/sprites/road.png';

    constructor(x, y, context, image) {
        super({
            context: context,
            image: image[0],
            x: x,
            y: y,
            width: 400,
            height: 14,
            frameIndex: 0,
            column: 0,
            tickCount: 0,
            ticksPerFrame: 1,
            frames: 1
        });

        this.set_scroll(true, 2, true, 200);
    }

    update_road() {
        super.update();
    }
}
