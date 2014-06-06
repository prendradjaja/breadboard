function Move(player, row, col) {
    this.player = player;
    this.row = row;
    this.col = col;
}

function board_string(game) {
    var symbols = {'-1': '.', 0: 'X', 1: 'O'};
    var result = "";
    for(var row = 0; row < 3; row++) {
        for(var col = 0; col < 3; col++) {
            result += symbols[game.board[row][col]];
        }
        result += '\n';
    }
    return result;
}

$(window).on('waiting_for_opponent', function(event) {
    console_print('Waiting for opponent...');
    console_print('Send your friend this url:');
    console_print(window.location.href);

});

function enable_console() {
    $(window).on('console-line', function (event, line) {
        if (game.status === player) {
            $(window).trigger('make_move', new Move(player, parseInt(line[0]), parseInt(line[1])));
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
        console_print(board_string(game));
        console_print('Your turn.');
    }
});

$(window).on('opponent_turn', function(event, move) {
    if (move === 0) {
        enable_console();
        console_print('Start! (opponent\'s turn)');
    } else {
        console_print(board_string(game));
        console_print('Opponent\'s turn.');
    }
});

$(window).on('win', function(event, move) {
    console_print(board_string(game));
    console_print('You win!');
});

$(window).on('lose', function(event, move) {
    console_print(board_string(game));
    console_print('You lose.');
});
