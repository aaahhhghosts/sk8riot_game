import { get_canvas_width, get_canvas_height } from '/src/Main.js';
import { attempt_to_jump, attempt_to_throw_zippy } from '/src/Main.js';
import { loader } from '/src/loader.js';

export function create_click_listener(game) {

    // Fire button if mouse clicks on top of it.
    document.addEventListener('click', function(evt) {

        let click_done = false;
        let mousePos = getMousePos(game.trueCanvas, evt);

        // Fire any buttons, if clicked.
        game.buttons.some((button, i) => {
            if (button.isInside(mousePos)) {
                button.fire();
                click_done = true;
                let click_sfx = loader.audio.click_button[0].cloneNode(false);
                click_sfx.play();

                if (button.remove_on_fire) {
                    let i = game.buttons.indexOf(button);
                    game.buttons.splice(i, 1);
                    return true;
                }
            }
        });
        if (click_done) {return;}

        // Enter the inputbox, if clicked.
        if (game.inputbox != null) {
            if (game.inputbox.isInside(mousePos)) {
                game.inputbox.hightlight()
                click_done = true;
            } else {
                game.inputbox.unhighlight();
            }
        }
        if (click_done) {return;}

        // Control player depending on which side of screen is clicked
        if (game.sk8r.isAlive && in_screen(mousePos)) {

            if (mousePos.x < get_canvas_width()/2) {
                attempt_to_jump();
            } else if (mousePos.x < get_canvas_width()) {
                attempt_to_throw_zippy();
            }
        }
    }, false);

    // Highlight button if mouse hovers over it.
    document.addEventListener('mousemove', function(evt) {
        if (game.buttons.length > 0) {
            let mousePos = getMousePos(game.trueCanvas, evt);

            // Highlight hovered-on buttons , if any.
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
        y: get_canvas_height() - (event.clientY - rect.top) * (get_canvas_height() / rect.height)
    };
}

function in_screen(pos) {
    return (pos.x > 0 && pos.x < get_canvas_width() && pos.y > 0 && pos.y < get_canvas_height());
}
