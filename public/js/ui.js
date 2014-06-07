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
    $('#connecting').css('display', 'none');
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
        game_start();
        console_print('Start! (your turn)');
    } else {
        console_print(board_string(game));
        mark_cell(move.row, move.col, move.player);
        console_print('Your turn.');
    }
});

$(window).on('opponent_turn', function(event, move) {
    if (move === 0) {
        game_start();
        console_print('Start! (opponent\'s turn)');
    } else {
        console_print(board_string(game));
        mark_cell(move.row, move.col, move.player);
        console_print('Opponent\'s turn.');
    }
});

$(window).on('win', function(event, move) {
    console_print(board_string(game));
    mark_cell(move.row, move.col, move.player);
    console_print('You win!');
});

$(window).on('lose', function(event, move) {
    console_print(board_string(game));
    mark_cell(move.row, move.col, move.player);
    console_print('You lose.');
});

function game_start () {
    $('#connecting').css('display', 'none');
    enable_console();
    $('.game-wrap').css('display', 'block');
    $('.board-cell').click(function (a) {
        var clicked = parse_cell_id(this.id);
        $(window).trigger('make_move', new Move(player, clicked.row, clicked.col));
    });
}

function parse_cell_id(id) {
    var parts = id.split('-');
    return {row: parseInt(parts[1]),
            col: parseInt(parts[2])};
}

function mark_cell(row, col, player) {
    var class_name = ['x', 'o'][player];
    $('#cell-'+row+'-'+col).addClass(class_name);
}
