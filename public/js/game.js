function Game() { }

Game.prototype.apply_move = function (move) {
    console_print('Player ' + this.status + ': ' + move.string);
    if (move.string === 'win') {
        return 1;
    } else if (move.string === 'lose') {
        return 2;
    } else {
        return 0;
    }
}

Game.prototype.is_valid_move = function (move) {
    return true;
}

function Move(player, string) {
    this.player = player;
    this.string = string;
}

$(window).on('waiting_for_opponent', function(event) {
    console_print('waiting for opponent');

});
    $(window).on('console-line', function (event, line) {
        if (game.status === player) {
            $(window).trigger('make_move', new Move(player, line));
        } else {
            console_print('not your turn');
        }
    });

$(window).on('invalid_move', function(event) {
    console_print('invalid move');
});

$(window).on('your_turn', function(event) {
    console_print('your turn');
});

$(window).on('opponent_turn', function(event) {
    console_print('opponent\'s turn');
});

$(window).on('win', function(event) {
    console_print('win');
});

$(window).on('lose', function(event) {
    console_print('lose');
});

