$(function () {
    var inp1 = $('#inp1'),
        inp2 = $('#inp2'),
        inp3 = $('#inp3'),
        inp4 = $('#inp4');

    $.newMask.definitions = {
        '9': "[0-9]"
    };

    inp1.newMask('(999) 9999-999', {placeholder: '_'});
    inp2.newMask('(999) 9999-999', {placeholder: '_'});
    inp3.newMask('999999', {placeholder: '_'});
    inp4.newMask('999999-99', {placeholder: '_'});


    window.masks = {
        1: inp1.data('maskPlugin'),
        2: inp2.data('maskPlugin'),
        3: inp3.data('maskPlugin'),
        4: inp4.data('maskPlugin')
    }
});