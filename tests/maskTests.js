(function ($) {
    $.mask = {};

    $.mask.definitions = {
        '9': "[0-9]"
    };

    $(function () {
        var template = $('<input />', {
            type: 'text'
        }),
            container = $('#qunit-fixture');

        test( "Initialization Test test", function() {
            ok($.prototype.newMask, "newMask is not exist");
        });

        test( "Initialization Test test", function() {
            var input = template.clone(),
                mask = input.data('maskPlugin');

            container.append(input);


            input.newMask('1111', {placeholder: '1'});
            mask = input.data('maskPlugin')

            ok(mask, 'newMask is created');
            ok(mask.size === 4, 'parametr')
        });

    });
} (jQuery));