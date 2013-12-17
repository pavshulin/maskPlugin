$(function () {
    var inp1 = $('#inp1'),
        inp2 = $('#inp2'),
        inp3 = $('#inp3'),
        inp4 = $('#inp4');

    inp1.maskPlugin('(999) 9999-999', {
        placeholder: '_',
        completed: function () {alert('a')}
    });
    inp2.maskPlugin('(999) 9999-999', {placeholder: '+'});
    inp3.maskPlugin('999999', {placeholder: '_', allwaysMask: true});
    inp4.maskPlugin('999999-99', {placeholder: '_'});


    window.masks = {
        1: inp1.data('maskPlugin'),
        2: inp2.data('maskPlugin'),
        3: inp3.data('maskPlugin'),
        4: inp4.data('maskPlugin')
    }
});