function Move(player, string) {
    this.player = player;
    this.string = string;
}

$(window).on('waiting_for_opponent', function(event) {
    console_print('Waiting for an opponent...');

});

function enable_console() {
    $(window).on('console-line', function (event, line) {
        if (game.status === player) {
            $(window).trigger('make_move', new Move(player, line));
        } else if (game.status === 2 ) {
            console_print('The game is already over.');
        } else {
            console_print('Not your turn.');
        }
    });
}

$(window).on('invalid_move', function(event) {
    console_print('Invalid move.');
});

$(window).on('your_turn', function(event, move) {
    if (move === 0) {
        enable_console();
        console_print('Start! (your turn)');
    } else {
        console_print('Player ' + move.player + ': ' + move.string);
        console_print('Your turn.');
    }
});

$(window).on('opponent_turn', function(event, move) {
    if (move === 0) {
        enable_console();
        console_print('Start! (opponent\'s turn)');
    } else {
        console_print('Player ' + move.player + ': ' + move.string);
        console_print('Opponent\'s turn.');
    }
});

$(window).on('win', function(event, move) {
    console_print('Player ' + move.player + ': ' + move.string);
    console_print('You win!');
});

$(window).on('lose', function(event, move) {
    console_print('Player ' + move.player + ': ' + move.string);
    console_print('You lose.');
});
