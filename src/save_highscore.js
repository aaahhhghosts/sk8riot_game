export async function save_highscore() {

    // Bail if inputbox doesn't exist.
    if (this.inputbox == null) {
        return;
    }

    // Get name from input box with leading/trailing white spaces removed.
    // Bail if the trimmed name fails regex match, or score is zero.
    let new_name = this.inputbox.text.trim().substring(0,8);
    let new_score = this.score;
    if (new_score <= 0 || !new_name.match(/^\d*[a-zA-Z][a-zA-Z0-9\-!?]*$/g)) {
        return;
    }

    // Freeze save button as highlighted while data is being processed.
    this.save_score_button.keep_highlighted = true;

    // Set variables for saving loop.
    const max_attempts = 3;
    let attempt = 0;
    let not_saved = true;

    while(not_saved && attempt < max_attempts) {

        // Increment attempt.
        attempt += 1;

        // Await the status of the ajax call which posts the highscore to the site.
        let status = await post_highscore(new_name, new_score);

        // If ajax call successful, inform player and update leaderboard.
        if (status == 'success') {

            // Wait a second just to give database extra time to update.
            // I think this is totally unnecessary, but just to be safe.
            await new Promise(r => setTimeout(r, 1000));

            // Get new and updated highscores.
            let saved_data_call = await get_highscores();
            if (saved_data_call != null && saved_data_call[0] == 'success') {
                let save_data = JSON.parse(saved_data_call[1]);

                // Check that the updated saved data really contains the new highscore.
                let leaderboard_has_newscore = save_data
                    .some(entry => entry.name == new_name && entry.score == entry.score);

                // If new score appears in retrieved database, remove buttons and exit loop.
                if (leaderboard_has_newscore) {

                    // Remove name input box and save button.
                    this.buttons = this.buttons.filter(b => b !== this.save_score_button);
                    this.inputbox = null;

                    // Update not_saved state to exit loop.
                    not_saved = false;

                    // Refresh leaderboard to display new scores.
                    this.highscore_data = save_data;
                    this.leaderboard.update_saved_data(save_data);
                    return;
                }
            }
        }

        // Check last attempt failed, and new score is still not saved.
        if (not_saved) {

            // If out of attempts, display error.
            if (attempt == max_attempts) {
                this.leaderboard.display_error();

                // Return save button to unhighlighted state.
                this.save_score_button.keep_highlighted = false;
                this.save_score_button.unhighlight();

            // Else, just wait 2 seconds before next attempt.
            } else {
                await new Promise(r => setTimeout(r, 2000));
            }
        }
    }
}
