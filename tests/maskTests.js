(function ($) {

    $(function () {
        var template = $('<input />', {
            type: 'text'
        }),
            container = $('#qunit-fixture'),
                defs;

        $.newMask.definitions['9'] = "[0-9]";
        defs = $.newMask.definitions;

        test( "Initialization Test test", function () {
            ok($.prototype.newMask, "newMask is not exist");
        });

        test( "Initialization Test test", function () {
            var input = template.clone(),
                mask;

            container.append(input);


            input.newMask('1111', {placeholder: '1'});
            mask = input.data('maskPlugin')

            ok(mask, 'newMask is created');

            input.newMask('destroy');
        });

        test("Mask Analyze function test", function () {
            var numReg = new RegExp(defs['9']),
                testDefinitions = [{
                    mask: '11119',
                    placeholder: '_',
                    testPlaceholders: ['1', '1', '1', '1', '_'],
                    testMask: [ false, false, false, false, numReg],
                    position: 0
                }, {
                    mask: '(09-90',
                    placeholder: '+',
                    testPlaceholders: ['(', '0', '+', '-', '+', '0'],
                    testMask: [ false, false, numReg, false,  numReg, false],
                    position: 1
                }, {
                    mask: '----',
                    placeholder: '+',
                    testPlaceholders: ['-', '-', '-', '-'],
                    testMask: [false, false, false, false],
                    position: 0
                }, {
                    mask: '999',
                    placeholder: 'A',
                    testPlaceholders: ['A', 'A', 'A'],
                    testMask: [numReg, numReg, numReg],
                    position: 2
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

        test("isMasked function test", function () {
            var input = template.clone(),
                mask;

            container.append(input);

            input.newMask('999 - 99', {placeholder: '_'});
            mask = input.data('maskPlugin');

            ok(mask.isMasked, 'function isMasked was not exist');

            ok(mask.isMasked(3), 'function isMasked works wrong');
            ok(mask.isMasked(5), 'function isMasked works wrong');
            ok(!mask.isMasked(1), 'function isMasked works wrong');
            ok(!mask.isMasked(6), 'function isMasked works wrong');
        });

        test("isEmptyField function test", function () {
            var input = template.clone(),
                mask;

            container.append(input);

            input.newMask('999 - 99', {placeholder: '_'});
            mask = input.data('maskPlugin');

            ok(mask.isEmptyField, 'function isEmptyField was not exist');

            ok(mask.isEmptyField(1), 'function isEmptyField works wrong');
            ok(mask.isEmptyField(2), 'function isEmptyField works wrong');
            mask.actualText[1] = '2';
            mask.actualText[2] = '4';

            ok(!mask.isEmptyField(1), 'function isEmptyField works wrong');
            ok(!mask.isEmptyField(2), 'function isEmptyField works wrong');
        });

        test("checkOne function test", function () {
            var input = template.clone(),
                mask;

            container.append(input);

            input.newMask('999 - 99', {placeholder: '_'});
            mask = input.data('maskPlugin');

            ok(mask.checkOne, 'function checkOne was not exist');

            ok(mask.checkOne('a', 1), 'function checkOne works wrong');
            ok(!mask.checkOne('1', 1), 'function checkOne works wrong');
            ok(mask.checkOne('_', 1), 'function checkOne works wrong');
        });

    });
} (jQuery));