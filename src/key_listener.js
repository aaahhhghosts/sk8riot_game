import { alphabet } from './constants.js';
import { attempt_to_jump, attempt_to_throw_zippy } from './Main.js';

export function create_key_listener(game) {
    document.addEventListener('keydown', event => {

      // Add space key listener for jumping.
      if (event.code === 'Space' || event.code === 'ArrowUp') {
          attempt_to_jump();
      }

      // Add right arrow key listener for zippies.
      if (event.code === 'ArrowRight' || event.code === 'KeyW') {
          attempt_to_throw_zippy();
      }

      // If user is prompted, enable typing out words (can't believe I have to
      // implement a whole ass input text box from scratch wtf).
      if (game.is_prompting_for_input && game.inputbox.is_highlighted) {

          // Get current input string.
          var input_str = game.inputbox.getText();

          // Perform backspace key press if more than zero characters.
          if (input_str.length > 0 && event.code == "Backspace") {
              input_str = input_str.slice(0, -1);
              game.inputbox.setText(input_str);
              return;
          }

          // Add typed letter to input string.
          if (input_str.length < game.inputbox.max_chars) {

              // Boolean to determine if nothing left to do.
              var key_found = false;

              // Check if letter was typed. If so, add it to string.
              alphabet.some((letter, i) => {
                  if (event.code == ("Key" + letter)) {
                      input_str += letter;
                      key_found = true;
                      return true;
                  }
              });

              // Stop if character was alreay matched and added.
              if (key_found) {game.inputbox.setText(input_str); return;}

              // Check if shift has been pressed. Set hold_shift true until
              // key is released.
              if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
                  game.inputbox.hold_shift = true;
                  return;
              }

              // If shift is being held, add shifted characters to string.
              if (game.inputbox.hold_shift) {
                  switch(event.code) {
                      case "Digit1": input_str += '!'; key_found = true; break;
                      case "Slash": input_str += '?'; key_found = true; break;
                  }
              }

              // Stop if character was alreay matched and added.
              if (key_found) {game.inputbox.setText(input_str); return;}

              // Check if digit was typed. If so, add it to string.
              for (let i = 0; i < 10; i++) {
                  if (event.code == ("Digit" + i.toString())) {
                      input_str += i.toString();
                      game.inputbox.setText(input_str)
                      return;
                  }
              }

              // If still no match, check for special characters.
              switch(event.code) {
                  case "Minus": input_str += '-'; key_found = true; break;
              }

              // Stop if character has been matched and added.
              if (key_found) {game.inputbox.setText(input_str); return;}
          }

       // Restart game when R key is pressed outside of input box and start menu.
       } else if (game.has_started && event.code === 'KeyR') {
            if (game.score > 10) {
                game.restart_game();
            }
       }
    });

    // Detect key up events.
    document.addEventListener('keyup', event => {

        // Check if shift has been lifted.
        if (event.code == "ShiftLeft" || event.code == "ShiftRight") {
            game.inputbox.hold_shift = false;
            return;
        }
    });
}
