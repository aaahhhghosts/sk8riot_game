import { get_canvas_width, get_canvas_height, restart_game } from '/src/Main.js';

export function create_click_listener(game) {

    document.addEventListener('click', function(evt) {
        var mousePos = getMousePos(game.trueCanvas, evt);

        game.buttons.forEach((button, i) => {

            if (button.isInside(mousePos)) {
                //console.log('clicked inside button: ' + button.text);
                restart_game();
            }
        });
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
