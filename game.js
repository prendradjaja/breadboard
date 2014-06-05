function Game() { }

Game.prototype.apply_move = function (move) {
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

exports.Game = Game;
