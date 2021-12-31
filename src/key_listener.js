import { throw_zippy } from '/src/classes/Zippy.js';
import { loader } from '/src/img_loader.js';

export function create_key_listener(game) {
    document.addEventListener('keydown', event => {

      // Add space key listener for jumping.
      if (event.code === 'Space') {
        game.sk8r.jump();
      }

      // Add right arrow key listener for zippies.
      if (event.code === 'ArrowRight') {

          if (game.timeSinceLastZippy <= 0) {

              // Spawn zippy.
              throw_zippy(game.sk8r.x+20, game.sk8r.y+26, game.context,
                          loader.images.zippy, game.zippies);

              game.timeSinceLastZippy = 1;
          }
      }
    });
}
