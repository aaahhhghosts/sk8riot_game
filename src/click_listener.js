import { get_canvas_width, get_canvas_height, get_true_canvas_size, get_true_canvas_rect } from './Main.js';
import { attempt_to_jump, attempt_to_throw_zippy, attempt_to_duck, attempt_to_stand } from './Main.js';
import { loader } from './loader.js';

export function create_click_listener(game) {

    // Fire button if mouse clicks on top of it.
    game.trueCanvas.addEventListener('click', function(evt) {

        let click_done = false;
        let mousePos = getMousePos(evt);
        console.log("x: " + mousePos.x + ", y: " + mousePos.y);

        // If click occurs anywhere in the screen and the start menu music
        // has not been played, play the song on loop.
        if (!game.opening_song_started) {

            game.opening_song_started = true;
            game.start_menu_song.play();
            game.start_menu_song.muted = game.is_muted;

            // Highlight hovered-on buttons, if any.
            game.buttons.forEach(button => {
                if (button.isInside(mousePos)) {
                    if (!button.is_highlighted) {
                        button.hightlight();
                    }
                } else {
                    if (button.is_highlighted && !button.keep_highlighted) {
                        button.unhighlight();
                    }
                }
            });
            return;
        }

        // Fire any buttons, if clicked and is not in a frozen, "keep highlighted" state.
        game.buttons.some(button => {
            if (button.isInside(mousePos) && !button.keep_highlighted) {
                button.fire();
                click_done = true;

                // Play click sfx, if game isn't muted.
                if (!game.is_muted) {
                    let click_sfx = loader.audio.click_button[0].cloneNode(false);
                    click_sfx.play();
                }
                return;
            }
        });
        if (click_done) {return;}

        // Enter the inputbox, if clicked.
        if (game.inputbox != null) {
            if (game.inputbox.isInside(mousePos)) {

                // Animate highlighted input box.
                game.inputbox.hightlight();

                // Prompt user for input.
                let user_input = prompt("Enter Name!");
                if (user_input != null) {

                    // Set input box text equal to cleaned user input.
                    let cleaned_user_input = user_input.toUpperCase().replace(/[^A-Z0-9!?|\-]/g,'').substring(0, 8);
                    game.inputbox.text = cleaned_user_input;
                }
            } else {
                game.inputbox.unhighlight();
            }
        }
    }, false);

    // Listen for touch events.
    game.trueCanvas.addEventListener('touchstart', function(event) {

        // For each touch event.
        for (let i = 0; i < event.targetTouches.length; i++) {

            // Convert touch event location into pixel coordinates on canvas.
            let touch = event.targetTouches[i];
            let touchPos = getMousePos(touch);

            // If during gameplay, and if touchPos is below clickable buttons,
            // prevent default ensuing click events for quicker response time,
            // and trigger player controls.
            if (game.has_started && !game.showing_restart_menu && touchPos.y < 100) {

                event.preventDefault();

                // Control player depending on which side of screen is tapped.
                if (game.sk8r.isAlive) {
                    if (touchPos.x < get_canvas_width()/2) {

                        // If player has tapped upper left, jump.
                        if (touchPos.y > 40) {
                            attempt_to_jump();

                        // Else, player is ducking.
                        } else {
                            attempt_to_duck();
                        }

                    // If player taps right screen, throw zippy.
                    } else {
                        attempt_to_throw_zippy();
                    }
                }

            // Else, if clicking buttons, set timer for unhighlighting button after click.
            // This code exists because touch events fail to trigger a mouse move outside of
            // a highlighted button after click, thus leaving it highlighted forever until the
            // next touchevent away from button.
            } else {
                setTimeout(() => {game.buttons.forEach(button  => button.unhighlight());}, 250);
            }
        }
    }, false);

    // When touch lifts off screen, standing player if they are ducking.
    game.trueCanvas.addEventListener('touchend', function(event) {

        attempt_to_stand();
    }, false);

    // Highlight button if mouse hovers over it.
    game.trueCanvas.addEventListener('mousemove', function(evt) {

        if (game.buttons.length > 0) {
            let mousePos = getMousePos(evt);

            // If movement occurs anywhere in the screen and the start menu music
            // has not been played, hightlight nothing.
            if (!game.opening_song_started) {
                return;
            }

            // Highlight hovered-on buttons , if any.
            game.buttons.forEach(button => {
                if (button.isInside(mousePos)) {
                    if (!button.is_highlighted) {
                        button.hightlight();
                    }
                } else {
                    if (button.is_highlighted && !button.keep_highlighted) {
                        button.unhighlight();
                    }
                }
            });
        }
    }, false);
}

//Function to get the mouse position
function getMousePos(event) {
    let rect = get_true_canvas_rect();

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
