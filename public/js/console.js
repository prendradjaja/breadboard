/*jslint plusplus: true, devel: true, browser: true */
/*global $: false */
"use strict";

function console_print(message) {
    var output_box = $('#console-out');
    output_box.append(message + '<br>');
    output_box.scrollTop(output_box.prop('scrollHeight'));
}

$('#console-in').keydown(function (event) {
    if (event.keyCode === 13 && $('#console-in').val() !== '') {
        var message = $('#console-in').val();
        $('#console-in').val('');
        $(window).trigger('console-line', message);
    }
});
