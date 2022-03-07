import { get_canvas_width, get_canvas_height, get_fullscreen_offsets, get_true_canvas_size } from './Main.js';
import { attempt_to_jump, attempt_to_throw_zippy } from './Main.js';
import { loader } from './loader.js';

export function create_click_listener(game) {

    // Fire button if mouse clicks on top of it.
    document.addEventListener('click', function(evt) {

        let click_done = false;
        let mousePos = getMousePos(game.trueCanvas, evt, game.is_fullscreen);

        // If click occurs anywhere in the screen and the start menu music
        // has not been played, play the song on loop.
        if (!game.opening_song_started && in_screen(mousePos)) {

            game.opening_song_started = true;
            game.start_menu_song.play();
            return;
        }

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
            let mousePos = getMousePos(game.trueCanvas, evt, game.is_fullscreen);

            console.log("x " + Math.floor(mousePos.x) + ", y " + Math.floor(mousePos.y));

            // If movement occurs anywhere in the screen and the start menu music
            // has not been played, hightlight nothing.
            if (!game.opening_song_started && in_screen(mousePos)) {
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
function getMousePos(canvas, event, is_fullscreen) {
    let rect = canvas.getBoundingClientRect();

    let true_can_size = get_true_canvas_size();

    let x_pos = (event.clientX - rect.left) * (true_can_size.width / rect.width);
    let y_pos = true_can_size.height - (event.clientY - rect.top) * (true_can_size.height / rect.height);

    // Account for black bars of space if game is in fullscreen mode.
    let width_offset = 0;
    if (is_fullscreen) {
        let f_off = get_fullscreen_offsets();
        x_pos += f_off.x;
        y_pos += f_off.y;

        width_offset = 2*f_off.x; // idk why I have to do this. I'm sorry. It just works.
    }

    // Scaled x and y positions so that max y_pos is always 126 (number of in-game pixels),
    // and likewise for max x_pos (224 in-game pixels).
    let scaled_y_pos = (get_canvas_height()*y_pos)/true_can_size.height;
    let scaled_x_pos = ((get_canvas_width()-width_offset)*x_pos)/true_can_size.width;

    return {
        x: scaled_x_pos,
        y: scaled_y_pos
    };
}

function in_screen(pos) {
    return (pos.x > 0 && pos.x < get_canvas_width() && pos.y > 0 && pos.y < get_canvas_height());
}
