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
            ok(mask.size === 4, 'parametr');
            input.newMask('destroy');
        });

        test("Mask Analyze function test", function() {
            var input = template.clone(),
                mask = input.data('maskPlugin');

            container.append(input);
            input.newMask('11119', {placeholder: '_'});
            mask = input.data('maskPlugin');

            deepEqual(mask.placeholders, ['1', '1', '1', '1', '_']);
            deepEqual(mask.charTest, [
                false,
                false,
                false,
                false,
                new RegExp($.mask.definitions['9'])
            ]);
            equal(mask.firstPosition, 3);

            input.remove();

            input = template.clone();
            container.append(input);
            input.newMask('(09-90', {placeholder: '+'});
            mask = input.data('maskPlugin');

            deepEqual(mask.placeholders, ['(', '0', '+', '-', '+', '0']);
            deepEqual(mask.charTest,  [
                false,
                false,
                new RegExp($.mask.definitions['9']),
                false,
                new RegExp($.mask.definitions['9']),
                false
            ]);
            equal(mask.firstPosition, 1);

            input.newMask('destroy');
        });

    });
} (jQuery));