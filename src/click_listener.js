import { get_canvas_width, get_canvas_height, restart_game } from '/src/Main.js';

export function create_click_listener(game) {

    // Fire button if mouse clicks on top of it.
    document.addEventListener('click', function(evt) {
        if (game.buttons.length > 0) {
            let mousePos = getMousePos(game.trueCanvas, evt);

            game.buttons.forEach((button, i) => {
                if (button.isInside(mousePos)) {
                    restart_game();
                }
            });
        }
    }, false);

    // Highlight button if mouse hovers over it.
    document.addEventListener('mousemove', function(evt) {
        if (game.buttons.length > 0) {
            let mousePos = getMousePos(game.trueCanvas, evt);

            game.buttons.forEach((button, i) => {
                if (button.isInside(mousePos)) {
                    if (!button.is_highlighted) {
                        button.hightlight();
                    }
                } else {
                    if (button.is_highlighted) {
                        button.unhighlight();
                    }
                }
            });
        }
    }, false);
}

//Function to get the mouse position
function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (event.clientX - rect.left) * (get_canvas_width() / rect.width),
        y: (event.clientY - rect.top) * (get_canvas_height() / rect.height)
    };
}
