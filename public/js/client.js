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
    var hash_index = window.location.href.indexOf('#');
    if (hash_index === -1) {
        my_player_number = 0;
        socket.emit('create_table');
    } else {
        my_player_number = 1;
        var table_id = window.location.href.substring(hash_index + 1);
        socket.emit('join_table', table_id);
    }
    game = new Game();
}

function on_table_created(table_id) {
    window.location.hash = '#' + room;
    $(window).trigger('waiting_for_opponent')
}

function on_ready() {
    if (player === 0) {
        $(window).trigger('your_turn');
    } else {
        $(window).trigger('opponent_turn');
    }
    // TODO? do i need a which-turn variable? or do these events suffice?
}

function on_opponent_move(move) {
    var status = game.apply_move(move);
    if (status === 0) {
        $(window).trigger('your_turn');
    } else if (status === 1) {
        $(window).trigger('lose');
    } else if (status === 2) {
        $(window).trigger('win');
    } else {
        // TODO? the user-written Game code is malfunctioning. handle this?
    }
}

function on_make_move(event, move) {
    // TODO? need to check that it's the correct player
    if (game.is_valid_move(move)) {
        var status = game.apply_move(move);
        socket.emit('make_move', move);
        if (status === 0) {
            $(window).trigger('opponent_turn');
        } else if (status === 1) {
            $(window).trigger('win');
        } else if (status === 2) {
            $(window).trigger('lose');
        } else {
            // TODO? the user-written Game code is malfunctioning. handle this?
        }
    } else {
        $(window).trigger('invalid_move');
    }
}
