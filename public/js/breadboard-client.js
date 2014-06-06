'use strict';

var socket, game, player;

$(function () {
    socket = io.connect('http://localhost', {port: 8000, transports:['websocket']});
    socket.on('connect', on_connect);
    socket.on('table_created', on_table_created);
    socket.on('ready', on_ready);
    socket.on('opponent_move', on_opponent_move);
    $(window).on('make_move', on_make_move);
});

function on_connect() {
    game = new Game();
    game.status = -1;
    var hash_index = window.location.href.indexOf('#');
    if (hash_index === -1) {
        player = 0;
        socket.emit('create_table');
    } else {
        player = 1;
        var table_id = window.location.href.substring(hash_index + 1);
        socket.emit('join_table', table_id);
    }
}

function on_table_created(table_id) {
    window.location.hash = '#' + table_id;
    $(window).trigger('waiting_for_opponent');
}

function on_ready() {
    game.status = 0;
    if (player === 0) {
        $(window).trigger('your_turn', 0);
    } else {
        $(window).trigger('opponent_turn', 0);
    }
}

function on_opponent_move(move) {
    var status = game.apply_move(move);
    if (status === 0) {
        game.status = player;
        $(window).trigger('your_turn', move);
    } else if (status === 1) {
        game.status = 2;
        $(window).trigger('lose', move);
    } else if (status === 2) {
        game.status = 2;
        $(window).trigger('win', move);
    } else {
        // TODO? the user-written Game code is malfunctioning. handle this?
    }
}

function on_make_move(event, move) {
    if (game.status === player && game.is_valid_move(move)) {
        var status = game.apply_move(move);
        socket.emit('make_move', move);
        if (status === 0) {
            game.status = 1 - player;
            $(window).trigger('opponent_turn', move);
        } else if (status === 1) {
            game.status = 2;
            $(window).trigger('win', move);
        } else if (status === 2) {
            game.status = 2;
            $(window).trigger('lose', move);
        } else {
            // TODO? the user-written Game code is malfunctioning. handle this?
        }
    } else {
        $(window).trigger('invalid_move');
    }
}
