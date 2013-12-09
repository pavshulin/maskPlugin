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
            var testDefinitions = [{
                    mask: '11119',
                    placeholder: '_',
                    testPlaceholders: ['1', '1', '1', '1', '_'],
                    testMask: [
                        false, false, false, false,
                        new RegExp($.mask.definitions['9'])
                    ]
                }, {
                    mask: '(09-90',
                    placeholder: '+',
                    testPlaceholders: ['(', '0', '+', '-', '+', '0'],
                    testMask: [
                        false, false, new RegExp($.mask.definitions['9']),
                        false,  new RegExp($.mask.definitions['9']), false
                    ]
                }],
                testInd,
                test,
                mask,
                input;

            for (testInd in testDefinitions) {
                input = template.clone();
                test = testDefinitions[testInd];
                container.append(input);

                input.newMask(test.mask, {placeholder: test.placeholder});
                mask = input.data('maskPlugin');

                deepEqual(mask.placeholders, test.testPlaceholders);
                deepEqual(mask.charTest, test.testMask);

                input.newMask('destroy');
            }
        });

    });
} (jQuery));