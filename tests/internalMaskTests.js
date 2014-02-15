(function () {
    var template,
        container,
        defs;

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

    module('Mask Plugin Test', {
        setup: setUp,
        teardown: tearDown
    });

    test( "Initialization Test test", function () {
        var input = template.clone(),
            mask;

        ok($.prototype.maskPlugin, "maskPlugin is not exist");    

        container.append(input);


        input.maskPlugin('9999', {
            placeholder: '1',
            unmaskedPosition: 3
        });
        mask = input.data('maskPlugin');

        ok(mask, 'maskPlugin is created');
        equal(mask.unmaskedPosition, 2, 'unmaskedPosition was calculated wrong');

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
                equal(mask.firstPosition, test.position, test.mask); 
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
    
    test('setCarriagePosition function is working', function () {
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

        setSel.restore();
    });

      test('getCarriagePosition function is working', function () {
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

    test('carriageMoveDown function is working', function () {
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


    test('carriageMove function is working', function () {
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


test('_resetMask function is working', function () {
        var input = template.clone(),
            maskString = '!999 - 99!',
            mask;

        container.append(input);

        input.maskPlugin(maskString, {
            placeholder: '_',
            allwaysMask: true
        });
        mask = input.data('maskPlugin');

        mask.actualText = ['!', '1', '2', '3',' ', '-', ' ', '4', '5', '!'];
        mask.isEntered = true;
        mask._isComplete = true;
        mask.lastSign = 5;

        mask._resetMask();

        deepEqual(mask.actualText, mask.placeholders.slice(), 
            'wrong actual text paramert');
        equal(mask.isEntered, false, 'wrong isEntered paramert');
        equal(mask._isComplete, false, 
            'wrong _isComplete paramert');
        equal(mask.lastSign, mask.firstPosition, 
            'wrong lastSign paramert');
    });

    test('clearUp function is working', function () {
        var input = template.clone(),
            maskString = '!999 - 99!',
            buffer = ['!', '1', '2', '3', ' ',
             '-', ' ', '4', '5', '!'],
            _resetMask,
            val,
            mask;

        container.append(input);

        input.maskPlugin(maskString, {
            placeholder: '_'
        });
        mask = input.data('maskPlugin');
        mask.masked = true;

        this._isAlmostComplete = false;
        this.allwaysMask = false;

        _resetMask = sinon.spy(mask, '_resetMask');
        val = sinon.stub($.prototype, 'val');
        mask.clearUp();

        ok(_resetMask.calledOnce, 
            'reset mask function was not invoked');
        ok(val.calledOnce, 
            'val function was not invoked');
        ok(val.calledWith(''), 
            'val receive wrong paramert');
        equal(mask.masked, false, 'wrong masked parametr');

        val.reset();


        mask.lastSign = 9;
        mask.masked = true;
        mask.actualText = buffer;
        mask._isAlmostComplete = true;

        mask.clearUp();
        
        ok(val.calledOnce, 
            'val function was not invoked');
        ok(val.calledWith(buffer.join('')), 
            'val receive wrong paramert');
        equal(mask.masked, false, 'wrong masked parametr');

        val.restore();
        _resetMask.restore();

    });

    test('removeText is working', function () {
        var input = template.clone(),
            text = 'some text'.split(''),
            reset,
            addText,
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });
        mask = input.data('maskPlugin');
        
        reset = sinon.stub(mask, '_resetMask');
        addText = sinon.stub(mask, 'addText');

        mask.removeText(text);

        ok(reset.calledOnce, '_resetMask function was not invoked');
        ok(addText.calledOnce, 'addText function was not invoked');
        ok(addText.calledWith(0, text), 
            'addText function was invoked with wrong parametrs');

        reset.restore();
        addText.restore();
    });

    test('addOne is working', function () {
        var input = template.clone(),
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });
        mask = input.data('maskPlugin');

        mask.lastSign = 1;

        mask.addOne(2, '1');

        equal(mask.actualText[2], '1', 'wrong value in array');
        equal(mask.lastSign, 2, 'wrong last sing paramert');
        ok(mask.isEntered, 'is entered was not true');

    });

    test('addText is working', function () {
        var input = template.clone(),
            addOne,
            mask;

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });
        mask = input.data('maskPlugin');
        addOne = sinon.spy(mask, 'addOne');
        mask.addText(0, '12345'.split(''));

        equal(addOne.callCount, 5, 'wrong count of chars has been added');
        ok(addOne.getCall(0).calledWith(0, '1'), 'wrong char or index was added');
        ok(addOne.getCall(1).calledWith(1, '2'), 'wrong char or index was added');
        ok(addOne.getCall(2).calledWith(2, '3'), 'wrong char or index was added');
        ok(addOne.getCall(3).calledWith(6, '4'), 'wrong char or index was added');
        ok(addOne.getCall(4).calledWith(7, '5'), 'wrong char or index was added');
        ok(mask._isComplete, 'wrong parametr _isComplete');
        
        addOne.reset();
        mask.clearUp();

        mask.addText(0, 'abc1\|sa/*2 aop!@#%^&*()_3+?><|}4{[]|AABW5'.split(''));

        equal(addOne.callCount, 5, 'wrong count of chars has been added');
        ok(addOne.getCall(0).calledWith(0, '1'), 'wrong char or index was added');
        ok(addOne.getCall(1).calledWith(1, '2'), 'wrong char or index was added');
        ok(addOne.getCall(2).calledWith(2, '3'), 'wrong char or index was added');
        ok(addOne.getCall(3).calledWith(6, '4'), 'wrong char or index was added');
        ok(addOne.getCall(4).calledWith(7, '5'), 'wrong char or index was added');
        ok(mask._isComplete, 'wrong parametr _isComplete');

        addOne.reset();
        mask.clearUp();

        mask.addText(0, 'abc\|sa/* aop!@#%^&*()_+?><|}{[]|AABW'.split(''));

        ok(!addOne.called, 'wrong char or index was added');
        ok(!mask._isComplete, 'wrong parametr _isComplete');

        addOne.reset();
        mask.clearUp();

        mask.addText(0, '1234567890098765431'.split(''));

        equal(addOne.callCount, 5, 'wrong count of chars has been added');
        ok(addOne.getCall(0).calledWith(0, '1'), 'wrong char or index was added');
        ok(addOne.getCall(1).calledWith(1, '2'), 'wrong char or index was added');
        ok(addOne.getCall(2).calledWith(2, '3'), 'wrong char or index was added');
        ok(addOne.getCall(3).calledWith(6, '4'), 'wrong char or index was added');
        ok(addOne.getCall(4).calledWith(7, '5'), 'wrong char or index was added');
        ok(mask._isComplete, 'wrong parametr _isComplete');


        addOne.reset();
        mask.clearUp();
        mask.unmaskedPosition = 2;
        
        mask.addText(0, '123'.split(''));
        
        equal(addOne.callCount, 3, 'wrong count of chars has been added');
        ok(addOne.getCall(0).calledWith(0, '1'), 'wrong char or index was added');
        ok(addOne.getCall(1).calledWith(1, '2'), 'wrong char or index was added');
        ok(addOne.getCall(2).calledWith(2, '3'), 'wrong char or index was added');
        ok(!mask._isComplete, 'wrong parametr _isComplete');
        ok(mask._isAlmostComplete, 'wrong parametr _isAlmostComplete');

        addOne.reset();
        mask._isAlmostComplete = false;
        mask.clearUp();
        
        mask.addText(0, '12'.split(''));

        equal(addOne.callCount, 2, 'wrong count of chars has been added');
        ok(addOne.getCall(0).calledWith(0, '1'), 'wrong char or index was added');
        ok(addOne.getCall(1).calledWith(1, '2'), 'wrong char or index was added');
        ok(!mask._isComplete, 'wrong parametr _isComplete');
        equal(mask._isAlmostComplete, false, 'wrong parametr _isAlmostComplete');
        
        addOne.restore();
    });   

    // TODO: write some more variant
    test('middleChange is working', function () {
        var input = template.clone(),
            addText,
            carriageMove,
            result,
            mask;   

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });
        mask = input.data('maskPlugin');

        input.val('111').trigger('input');

        addText = sinon.stub(mask, 'addText');
        carriageMove = sinon.stub(mask, 'carriageMove').returns(5);

        result = mask.middleChange(['1', '1', '2', '2', '1', '-', ' ', '_', '_'], 2,
            ['2', '2']);

        ok(addText.calledOnce, 'addText function was not invoked');
        
        ok(addText.calledWith(2, ['2', '2', '1', '-', ' ', '_', '_']),
            'addText function was invoked with wrong parametrs');

        ok(carriageMove.calledOnce, 'addText function was not invoked');
        
        ok(carriageMove.calledWith(3), 
            'carriageMove was invoked with wrong parametrs');

        equal(result, 6);

        carriageMove.restore();
        addText.restore();
    });
    
    test('removingText function is working', function () {
        var input = template.clone(),
            _remove,
            _carriage,
            testValue = {},
            testValue1 = {},
            mask;   

        container.append(input);

        input.maskPlugin('999 - 99 - 99', {
            placeholder: '_'
        });
        mask = input.data('maskPlugin');

        _remove = sinon.stub(mask, 'removeText');
        _carriageDown = sinon.stub(mask, 'carriageMoveDown').returns(testValue1);
        _carriage = sinon.stub(mask, 'carriageMove').returns(1);

        mask.buttonCode = 46;

            //cause returned value must be the actually the same not the equal;
        equal(mask.removingText('some text', testValue), testValue,
         'function removing text was not return actual paramert');
        ok(_remove.calledOnce, 'removeText function was not invoked');
        ok(_remove.calledWith('some text'), 
            'removeText function was invoked with wrong params');

        mask.buttonCode = 8;

        equal(mask.removingText('some text', 1), testValue1,
         'function removing text was not return actual paramert');
        ok(_carriageDown.calledOnce, 'carriageMoveDown function was not invoked');
        ok(_carriageDown.calledWith(0 + mask.isTextSelected), 
            'carriageMoveDown function was invoked with wrong params');

        mask.buttonCode = 0;
        mask.lastSign = 5;
        mask.firstPosition = 2;

        equal(mask.removingText('some text', 1), 2,
         'function removingTextving text was not return actual paramert');
        ok(_carriage.calledOnce, 'carriageMoveDown function was not invoked');
        ok(_carriage.calledWith(1), 
            'carriageMoveDown function was invoked with wrong params');

        equal(mask.removingText('some text', 6), 5,
         'function removing text was not return actual paramert');

        _remove.restore();
        _carriage.restore();
        _carriageDown.restore();
    });

    test('adding text function is working', function () {
        var input = template.clone(),
            addText,
            carriageMove,
            result,
            mask;   

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });

        mask = input.data('maskPlugin');

        input.val('111').trigger('input');

        addText = sinon.stub(mask, 'addText');
        carriageMove = sinon.stub(mask, 'carriageMove').returns(5);
        mask.lastSign = 5;
        mask.isEntered = true;
        result = mask.addingText(['1', '1', '2', '2', '1', '-', ' ', '_', '_'],
         2, ['2', '2']);

        ok(addText.calledOnce, 'addText function was not invoked');
        
        ok(addText.calledWith(2, ['2', '2', '1', '-', ' ', '_', '_']),
            'addText function was invoked with wrong parametrs');

        ok(carriageMove.calledOnce, 'addText function was not invoked');
        
        ok(carriageMove.calledWith(mask.lastSign), 
            'carriageMove was invoked with wrong parametrs');
        equal(result, 6);

        carriageMove.restore();
        addText.restore();
    });

    test('focus navigate function is working', function () {
        var input = template.clone(),
            _getCarr,
            _setCarr,
            _carrMove,
            _writeDown,
            mask;   

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });

        mask = input.data('maskPlugin');

        _getCarr = sinon.stub(mask, 'getCarriagePosition');
        _setCarr = sinon.stub(mask, 'setCarriagePosition');
        _carrMove = sinon.stub(mask, 'carriageMove');
        _writeDown = sinon.stub(mask, 'writeDown');

        mask.masked = false;
        mask._isComplete = true;

        mask.focusNavigate();

        ok(_getCarr.callCount === 1, 'getCarriage function was not invoked');
        ok(_writeDown.calledOnce, 
            'writeDown function was not invoked when masked is false');
        ok(_setCarr.calledOnce, 
            'set Carriage function was not invoked in case ' + 
            'of _isComplete false value');
        ok(_setCarr.calledWith(0, mask.lastSymbol + 1), 
            'set Carriage function was invoked without actual data' + 
            'of _isComplete false value');

        mask.masked = true;
        mask._isComplete = false;
        mask.lastSign = 7;
        _getCarr.returns({
            begin: 1,
            end: 1
        });
        _carrMove.returns(100);
        mask.isEntered = true;

        _writeDown.reset();
        _setCarr.reset();

        mask.focusNavigate();

        ok(_getCarr.callCount === 2, 'getCarriage function was not invoked');
        ok(!_writeDown.calledOnce, 
            'writeDown function was invoked when masked is true');
        ok(_setCarr.calledOnce, 
            'set Carriage function was not invoked in case ' + 
            'of carriage is taked place before last entered symbols');
        ok(_setCarr.calledWith(101), 
            'set Carriage function was invoked without actual data' + 
            'of carriage is taked place before last entered symbols');
        ok(_carrMove.calledOnce, 
            'Carriage Move function was not invoked in case ' + 
            'of carriage is taked place before last entered symbols');
        ok(_carrMove.calledWith(0), 
            'Carriage Move function was invoked without actual data' + 
            'of carriage is taked place before last entered symbols');

        mask.lastSign = 2;
        _getCarr.returns({
            begin: 3,
            end: 3
        });
        mask.isEntered = true;

        _setCarr.reset();

        mask.focusNavigate();

        ok(_getCarr.callCount === 3, 'getCarriage function was not invoked');
        ok(_setCarr.calledOnce, 
            'set Carriage function was not invoked in case ' + 
            'when carriage was taked place after last symbol');
        ok(_setCarr.calledWith(mask.lastSign + mask.isEntered), 
            'set Carriage function was invoked without actual data' + 
            'when carriage was taked place after last symbol'); 

        _getCarr.restore();
        _setCarr.restore();
        _carrMove.restore();
        _writeDown.restore();     
    });

test('_onFocus function is working', function () {
        var input = template.clone(),
            setTimeout = sinon.stub(window, 'setTimeout'),
            mask;   

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });

        mask = input.data('maskPlugin');  
        mask.isFocused = false;

        mask._onFocus();

        ok(mask.isFocused, 'isFocused paramert was not changed');
        ok(setTimeout.calledOnce, 'setTimeout was not invoked');
        ok(setTimeout.calledWith(mask.focusNavigate, 0),
            'setTimeout was invoked with wrong parametrs');

        setTimeout.restore();
    });

    test('_onBlur function is working', function () {
        var input = template.clone(),
            _clearUp,
            _trigger,
            mask;   

        container.append(input);

        input.maskPlugin('999 - 99', {
            placeholder: '_'
        });

        mask = input.data('maskPlugin'); 
        _trigger = sinon.stub(mask.$el, 'trigger');
        _clearUp = sinon.stub(mask, 'clearUp');
        mask.clearIncomplete = false;
        mask.isEntered = false;

        mask._onBlur();

        ok(!mask.isFocused, 'wrong isFocused attribute');
        ok(_trigger.calledOnce, 'trigger function was not invoked');
        ok(_trigger.calledWith('change'), 
            'trigger function was invoked with wrong attr');
        ok(_clearUp.calledOnce, 
            'function clearUp was not invoked when isEntered is false');

        mask.clearIncomplete = true;
        mask._isComplete = false;
        mask.isEntered = true;
        mask.isFocused = true;
        _trigger.reset();

        mask._onBlur();

        ok(!mask.isFocused, 'wrong isFocused attribute');
        ok(_trigger.calledOnce, 'trigger function was not invoked');
        ok(_trigger.calledWith('change'), 
            'trigger function was invoked with wrong attr');
        ok(_clearUp.calledTwice, 
            'function clearUp was not invoked when clearIncomplete was true' + 
                'and _isComplete was false');

        _clearUp.restore();
        _trigger.restore();
    });

} ());