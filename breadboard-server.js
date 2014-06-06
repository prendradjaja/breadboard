'use strict';

var util = require('util'),
    io = require('socket.io'),
    Game = require('./game').Game;

var socket, tables;

function Table(first_player_socket, game) {
    this.players = [first_player_socket];
    this.game = game;
}
Table.prototype.start = function (second_player_socket) {
    this.players.push(second_player_socket);
    this.game.status = 0;
}
Table.prototype.current_player = function () {
    return this.players[this.game.status];
}
Table.prototype.other_player = function (player_socket) {
    if (this.players[0].id === player_socket.id) {
        return this.players[1];
    } else {
        return this.players[0];
    }
}

function init() {
    tables = {};
    socket = io.listen(8000);
    socket.configure(function() {
        socket.set('transports', ['websocket']);
        socket.set('log level', 2);
    });
    socket.sockets.on('connection', on_connection);
}

function on_connection(client) {
    util.log('New client has connected: ' + client.id);
    client.on('disconnect', on_disconnect);
    client.on('create_table', on_create_table);
    client.on('join_table', on_join_table);
    client.on('make_move', on_make_move);
}

function on_disconnect() {
    util.log('Client has disconnected: ' + this.id);
}

function on_create_table() {
    var table_id = make_table_id();
    var this_player = this;
    var game = new Game();
    game.status = -1;
    var new_table = new Table(this_player, game);
    tables[table_id] = new_table;
    tables[this_player.id] = new_table;
    this_player.emit('table_created', table_id);
    util.log("New table " + table_id + " with client " + this_player.id)
}

function on_join_table(table_id) {
    if (tables.hasOwnProperty(table_id) && tables[table_id].game.status == -1) {
        tables[table_id].start(this);
        tables[this.id] = tables[table_id];

        var other_player = tables[this.id].players[0];
        var this_player = this;
        other_player.emit('ready');
        this_player.emit('ready');
        util.log("Game starting at table " + table_id + " with clients "
                + other_player.id + " and " + this_player.id)
    } else {
        // TODO: deal with nonexistent tables and already-started games
    }
}

function on_make_move(move) {
    var table = tables[this.id];
    if (table.game.status !== -1
            && this.id === table.current_player().id
            && table.game.is_valid_move(move)) {
        util.log("Client " + table.current_player().id + " made a move.");
        var status = table.game.apply_move(move);
        if (status === 0) {
            table.game.status = 1 - table.game.status;
        } else if (status === 1 || status === 2) {
            table.game.status = 2;
        } else {
            // TODO? the user-written Game code is malfunctioning. handle this?
        }
        table.other_player(this).emit('opponent_move', move);
    }
    // TODO? deal with invalid moves
}

var num_tables = 0;

function make_table_id() {
    var table_id  = 'table' + num_tables;
    num_tables += 1;
    return table_id;
}

init();
