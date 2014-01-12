(function () {

    var template,
        container,
        defs;

    module('Mask Plugin Test', {
        setup: setUp,
        teardown: tearDown
    });

    function setUp () {
        template = $('<input />', {
            type: 'text'
        });

        container = $('#qunit-fixture');
        defs = $.maskPlugin.definitions;

        Function.prototype.bind = Function.prototype.bind || function (obj) {
            var caller = this;
            return function () {
                caller.apply(obj, arguments);
            };    
        };
    }

    function tearDown () {

    }

    test( "Initialization Test test", function () {
        ok($.prototype.maskPlugin, "maskPlugin is not exist");
    });

    test( "Initialization Test test", function () {
        var input = template.clone(),
            mask;

        container.append(input);


        input.maskPlugin('1111', {placeholder: '1'});
        mask = input.data('maskPlugin')

        ok(mask, 'maskPlugin is created');

        input.maskPlugin('destroy');
    });

    test("Mask Analyze function test", function () {
        var numReg = new RegExp(defs['9']),
            testDefinitions = [{
                mask: '11119',
                placeholder: '_',
                testPlaceholders: ['1', '1', '1', '1', '_'],
                testMask: [ false, false, false, false, numReg],
                position: 4,
                last: 4
            }, {
                mask: '(09-90',
                placeholder: '+',
                testPlaceholders: ['(', '0', '+', '-', '+', '0'],
                testMask: [ false, false, numReg, false,  numReg, false],
                position: 2,
                last: 4
            }, {
                mask: '----',
                placeholder: '+',
                testPlaceholders: ['-', '-', '-', '-'],
                testMask: [false, false, false, false],
            }, {
                mask: '999',
                placeholder: 'A',
                testPlaceholders: ['A', 'A', 'A'],
                testMask: [numReg, numReg, numReg],
                position: 0,
                last: 2
            }],
            testInd,
            test,
            mask,
            input;

        for (testInd in testDefinitions) {
            input = template.clone();
            test = testDefinitions[testInd];
            container.append(input);

            input.maskPlugin(test.mask, {placeholder: test.placeholder});
            mask = input.data('maskPlugin');

            deepEqual(mask.placeholders, test.testPlaceholders);
            deepEqual(mask.charTest, test.testMask);
            
            if(test.position) {
                equal(mask.firstPosition, test.position, test.mask) 
            }


            input.maskPlugin('destroy');
        }
    });

    test("isMasked function test", function () {
        var input = template.clone(),
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {placeholder: '_'});
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

        input.maskPlugin('999 - 99', {placeholder: '_'});
        mask = input.data('maskPlugin');

        ok(mask.isEmptyField, 'function isEmptyField was not exist');

        ok(mask.isEmptyField(1), 'function isEmptyField works wrong');
        ok(mask.isEmptyField(2), 'function isEmptyField works wrong');
        mask.actualText[1] = '2';
        mask.actualText[2] = '4';

        ok(!mask.isEmptyField(1), 'function isEmptyField works wrong');
        ok(!mask.isEmptyField(2), 'function isEmptyField works wrong');
    });

    test('about replace forbidden symbols', function () {

    });

} ());