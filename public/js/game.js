function Game() {
    this.board = [[-1, -1, -1],
                  [-1, -1, -1],
                  [-1, -1, -1]];
}

Game.prototype.has_win = function(player) {
    // check rows
    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            if (this.board[row][col] !== player) {
                break;
            } else if (col === 2) {
                return true;
            }
        }
    }

    // check cols
    for (var col = 0; col < 3; col++) {
        for (var row = 0; row < 3; row++) {
            if (this.board[row][col] !== player) {
                break;
            } else if (row === 2) {
                return true;
            }
        }
    }

    // check 00 11 22 diagonal
    for (var i = 0; i < 3; i++) {
        if (this.board[i][i] !== player) {
            break;
        } else if (i === 2) {
            return true;
        }
    }

    // check the other diagonal
    for (var i = 0; i < 3; i++) {
        if (this.board[i][i] !== player) {
            break;
        } else if (i === 2) {
            return true;
        }
    }

    return false;
}

Game.prototype.apply_move = function (move) {
    this.board[move.row][move.col] = move.player;
    if (this.has_win(move.player)) {
        return 1;
    } else {
        return 0;
    }
}

Game.prototype.is_valid_move = function (move) {
    // check for other invalidities
    if (this.board[move.row][move.col] !== -1) {
        return false;
    }
    return true;
}
