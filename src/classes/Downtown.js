import Scenery from '/src/Scenery.js';

export default class Downtown extends Scenery {

    static src = '/sprites/downtown.png';

    constructor(x, y, context, image) {
        super({
            context: context,
            image: image[0],
            x: x,
            y: y,
            width: 800,
            height: 125,
            frameIndex: 0,
            column: 0,
            tickCount: 0,
            ticksPerFrame: 20,
            frames: 2
        });

        this.set_scroll(true, 1, true, 600);
    }

    resize(context) {
        super.context = context;
    }

    update_downtown() {
        super.update();
    }
}
