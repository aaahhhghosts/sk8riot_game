export async function save_highscore() {

    // Bail if inputbox doesn't exist or the name is empty.
    if (this.inputbox == null || this.inputbox.text.length == 0) {
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
        let new_name = this.inputbox.text;
        let new_score = this.score;
        let status = await post_highscore(new_name, new_score);

        // If ajax call successful, inform player and update leaderboard.
        if (status == 'success') {

            // Wait 1/10 a sec just to give database extra time to update.
            // I think this is totally unnecessary, but just to be safe.
            await new Promise(r => setTimeout(r, 100));

            // Get new and updated highscores;
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
                    this.leaderboard.set_board(this.highscore_data);
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
