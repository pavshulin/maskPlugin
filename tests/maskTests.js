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

    test('allwaysMask is working', function () {
        var input = template.clone(),
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_',
            allwaysMask: true
        });

        equal(input.val(), '___ - __', 'allwaysMask is work');
        
        input.trigger('focus').trigger('blur');
        
        equal(input.val(), '___ - __', 'allwaysMask is work');

        input.trigger('focus').val();
        input.trigger('input').trigger('blur');

        equal(input.val(), '___ - __', 'allwaysMask is work');
    });
    
    test('setCarriagePosition is working', function () {
        var input = template.clone(),
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_',
            allwaysMask: true
        });
        mask = input.data('maskPlugin');

        setSel = sinon.stub(input[0], 'setSelectionRange');
        mask.isFocused = true;
        mask.setCarriagePosition(0);

        ok(setSel.calledOnce, 'setSel function was not Invoked');

        ok(setSel.calledWith(0, 0), 
            'setSel function was not received right params');

        mask.setCarriagePosition(1, 2);

        ok(setSel.calledTwice, 'setSel function was not Invoked');
        ok(setSel.calledWith(1, 2), 
            'setSel function was not received right params');

        mask.isFocused = false;
        mask.setCarriagePosition(0);
        setSel.reset();

        ok(!setSel.calledOnce, 
            'setSel function was invoked when input is not in isFocused');
    });

      test('getCarriagePosition is working', function () {
        var input = template.clone(),
            result,
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_',
            allwaysMask: true
        });
        mask = input.data('maskPlugin');

        result = {
            begin: mask.$el[0].selectionStart,
            end: mask.$el[0].selectionEnd
        }
        deepEqual(mask.getCarriagePosition(), result, 
            'getCarriagePosition was return wrong parametrs');

    });

    test('carriageMoveDown is working', function () {
        var input = template.clone(),
            mask;

        container.append(input);

        input.maskPlugin('_999 - 99', {
            placeholder: '_',
            allwaysMask: true
        });
        mask = input.data('maskPlugin');

        equal(mask.carriageMoveDown(10), 9,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(22), 9,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(1), 1,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(0), 1,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(7), 4,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(6), 4,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(5), 4,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(4), 4,
            'carriageMoveDown is working wrong');
        equal(mask.carriageMoveDown(8), 8,
            'carriageMoveDown is working wrong');
    });


    test('carriageMove is working', function () {
        var input = template.clone(),
            mask;

        container.append(input);

        input.maskPlugin('!999 - 99!', {
            placeholder: '_',
            allwaysMask: true
        });
        mask = input.data('maskPlugin');

        equal(mask.carriageMove(0, true), 1,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(1), 1,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(-20), 0,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(-20, true), 1,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(3), 6,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(3, true), 3,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(5, true), 7,
            'carriageMoveUp is working wrong');

        equal(mask.carriageMove(5), 6,
            'carriageMoveUp is working wrong');


        equal(mask.carriageMove(6, true), 7,
            'carriageMoveUp is working wrong');


        equal(mask.carriageMove(6), 6,
            'carriageMoveUp is working wrong');


        equal(mask.carriageMove(20), 10,
            'carriageMoveUp is working wrong');


        equal(mask.carriageMove(10), 10,
            'carriageMoveUp is working wrong');
    });
} ());