$(function () {
    var inp1 = $('#inp1'),
        inp2 = $('#inp2');

    $.newMask.definitions = {
        '9': "[0-9]"
    };

    inp1.newMask('(999) 9999-999', {placeholder: '_'});
    inp2.newMask('(999) 9999-999', {placeholder: '_'});
});