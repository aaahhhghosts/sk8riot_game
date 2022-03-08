import { get_canvas_width, get_canvas_height, get_true_canvas_size } from './Main.js';
import { attempt_to_jump, attempt_to_throw_zippy } from './Main.js';
import { loader } from './loader.js';

export function create_click_listener(game) {

    // Fire button if mouse clicks on top of it.
    game.trueCanvas.addEventListener('click', function(evt) {

        let click_done = false;
        let mousePos = getMousePos(game.trueCanvas, evt);

        // If click occurs anywhere in the screen and the start menu music
        // has not been played, play the song on loop.
        if (!game.opening_song_started) {

            game.opening_song_started = true;
            game.start_menu_song.play();
            return;
        }

        // Fire any buttons, if clicked.
        game.buttons.some((button, i) => {
            if (button.isInside(mousePos)) {
                button.fire();
                click_done = true;

                // Play click sfx, if game isn't muted.
                if (!game.is_muted) {
                    let click_sfx = loader.audio.click_button[0].cloneNode(false);
                    click_sfx.play();
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
    }, false);

    // Listen for touch events.
    game.trueCanvas.addEventListener('touchmove', function(event) {

        // Prevent following click events for quicker response time.
        event.preventDefault();
        event.touches.length.forEach(touch => {

            // Control player depending on which side of screen is clicked
            if (game.sk8r.isAlive) {
                if (touch.pageX < get_canvas_width()/2) {
                    attempt_to_jump();
                } else if (touch.pageX < get_canvas_width()) {
                    attempt_to_throw_zippy();
                }
            }
        });
    }, false);

    // Highlight button if mouse hovers over it.
    game.trueCanvas.addEventListener('mousemove', function(evt) {
        if (game.buttons.length > 0) {
            let mousePos = getMousePos(game.trueCanvas, evt);

            // If movement occurs anywhere in the screen and the start menu music
            // has not been played, hightlight nothing.
            if (!game.opening_song_started) {
                return;
            }

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
    let rect = canvas.getBoundingClientRect();

    let true_can_size = get_true_canvas_size();
    let x_pos = (event.clientX - rect.left) * (true_can_size.width / rect.width);
    let y_pos = true_can_size.height - (event.clientY - rect.top) * (true_can_size.height / rect.height);

    // Scaled x and y positions so that max y_pos is always 126 (number of in-game pixels),
    // and likewise for max x_pos (224 in-game pixels).
    let scaled_y_pos = (get_canvas_height()*y_pos)/true_can_size.height;
    let scaled_x_pos = (get_canvas_width()*x_pos)/true_can_size.width;

    return {
        x: scaled_x_pos,
        y: scaled_y_pos
    };
}
