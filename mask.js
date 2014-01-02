
(function($) {
    var customOptioms = {
            placeholder: "_",
            allwaysMask: false,
            clearIncomplete: false
        },

        defaults = function () {
            return {
                actualText: [],
                charTest: [],
                placeholders: [],
                cash: {},
                buttonCode: false,
                isEntered: false,
                isTextSelected: false,
                masked:false,
                lastSign: 0,
                lastSymbol: 0,
                firstPosition: undefined,
                firstCarriage: {
                    begin: 0,
                    end: 0
                }
            };
        },

        events = function (_this) {
            return {
                _onFocus: _onFocus.bind(_this),
                _onMouseUp: _onMouseUp.bind(_this),
                _onMouseDown: _onMouseDown.bind(_this),
                _onSelect: _onSelect.bind(_this),
                _onBlur: _onBlur.bind(_this),
                _onDownButtonHandler: _onDownButtonHandler.bind(_this),
                _onButtonHandler: _onButtonHandler.bind(_this),
                _onChange: _onChange.bind(_this),
                focusNavigate: focusNavigate.bind(_this)
            };
        },

        _customMask = function () {
            return {
                isMasked: isMasked,
                isEmptyField: isEmptyField,
                addToArrays: addToArrays,
                maskAnalyse: maskAnalyse,
                middleChange: middleChange,
                addingText: addingText,
                removingText: removingText,

                setCarriagePosition: setCarriagePosition,
                getCarriagePosition: getCarriagePosition,
                carriageMoveDown: carriageMoveDown,
                carriageMove: carriageMoveUp,

                writeDown: writeDown,
                clearUp: clearUp,
                fillField: fillField,
                removeText: removeText,
                addText: addText,
                addOne: addOne,

                destroy: destroy
            };
        },
        moveButtons = [35, 39, 40],
        isMoveButton = function (button) {
            return ~ moveButtons.indexOf(button)
        };

    /**
     * Utils
     **/

    function isMasked (index) {
        return !this.charTest[index];
    };

    function isEmptyField (index) {
        return this.actualText[index] === this.placeholders[index];
    };

    function addToArrays (char, placeholder) {
        this.charTest.push(char);
        this.placeholders.push(placeholder);
    };

    function maskAnalyse (mask) {
        var mask = mask.split(''),
            maskLength = mask.length,
            i = 0,
            char,
            placeholder;

        for (; i < maskLength; i++) {
            char = false;
            placeholder = mask[i];

            if($.maskPlugin.definitions[placeholder]) {
                char = new RegExp($.maskPlugin.definitions[placeholder]);
                placeholder = this.placeholder;

                if (this.firstPosition === undefined) {
                    this.lastSign =  this.firstPosition = i  ;
                }
            }

            this.addToArrays(char, placeholder);

            this.lastSymbol = i;
        }

        this.actualText = this.placeholders.slice();
    };

    /**
     * Carriage functions
     */

    function setCarriagePosition (begin, end) {
        if (!this.isFocused) return;
        end = end || begin;

        this.$el.each(function () {
            this.setSelectionRange(begin, end);
        });
    }

    function getCarriagePosition () {
        return {
            begin: this.$el[0].selectionStart,
            end: this.$el[0].selectionEnd
        };
    };

    function carriageMoveDown (index) {
        if (index <= this.firstPosition) {
            index = this.firstPosition;
        }

        while (this.isMasked(index - 1) && index > this.firstPosition) {
            index--;
        }

        return index;
    };

    function carriageMoveUp (index) {
        if (index >= this.size) {
            index = this.size;
        }

        while (this.isMasked(index + 1) && index !== (this.size + 1)) {
            index++;
        }

        return index;
    };

    /**
     *  Text creationals function
     */

    function writeDown () {
        this.$el.val(this.actualText.join(''));
        this.masked = true;
    };

    function clearUp () {
        if (!this.allwaysMask) {
            this.actualText = this.placeholders.slice();

            this.$el.val('');
            this.lastSign = this.firstPosition;
            this.isEntered = false;
            this.masked = false;
        }
    };

    function removeText (text) {
        this.actualText = this.placeholders.slice();

        this.isEntered = false;
        this._isComplete = false;
        this.lastSign = this.firstPosition;
        this.addText(0, text);
    };

    function addOne (index, char) {
        this.actualText[index] = char;
        if (this.lastSign < index) {
            this.lastSign = index;
        }
        this.isEntered = true;
        this._isComplete = this.lastSign === this.lastSymbol;
    };

    function addText (start, text) {
        var end = text.length,
            n = 0,
            i = start;

        while(n < end && !(i >= this.size)) {
            if (!this.isMasked(i)) {
                if (this.charTest[i].test(text[n])) {
                    this.addOne(i, text[n])
                } else {
                    i--;
                }
                n++;
            }
            i++;
        }
    };

    function fillField () {
        if (!this.masked) {
            this.writeDown();
        }
    };


    function middleChange (newText, start, buffer) {
        this.addText(start, newText.slice(start, newText.length));

        return this.carriageMove(start - 1 + buffer.length) + 1;
    };

    function removingText (newText, start) {

        this.removeText(newText);

        if (this.buttonCode === 46) {
            return start;
        }

        if (this.buttonCode === 8) {
            return this.carriageMoveDown(start - 1 + this.isTextSelected);
        }

        if(start < this.lastSign + 1) {
            return this.carriageMove(start + 1);
        }

        return this.lastSign + this.isEntered;
    };

    function addingText (newText, start) {
        this.addText(start, newText.slice(start, newText.length));

        return this.carriageMove(this.lastSign) + this.isEntered;
    };

    /**
     * Event Handlers functions
     **/


    function focusNavigate () {
        var carr = this.getCarriagePosition();
        this.fillField();

        if (this._isComplete) {
            this.setCarriagePosition(0, this.lastSymbol + 1);
            return;
        }

        if (carr.begin
            && carr.end === carr.begin && carr.begin < this.lastSign) {
            
            this.setCarriagePosition(
                this.carriageMove(carr.begin - 1) + this.isEntered
                );
            return;
        }

        this.setCarriagePosition(this.lastSign + this.isEntered);   
    };


    function _onFocus (event) {
        this.isFocused = true;

        setTimeout(this.focusNavigate, 0);
    };

    function _onBlur () {
        if (!this.isEntered || (this.clearIncomplete 
            && this.lastSign < this.lastSymbol)) {
            this.clearUp();
        }

        this.isFocused = false;
        this.$el.trigger('change');
    };

    function _onMouseUp () {
        var carr = this.getCarriagePosition();

        if(carr.begin > this.lastSign || 
            (carr.end !== carr.begin && carr.end > this.lastSign + 1)) {
            
            this.setCarriagePosition(this.carriageMove(this.lastSign) + this.isEntered);
            return;
        }

        if(carr.begin < this.lastSign && carr.end === carr.begin) {
            this.setCarriagePosition(this.carriageMove(carr.begin - 1) + this.isEntered);
        }
    };

    function _onMouseDown () {
        this.firstCarriage = this.getCarriagePosition();
    };

    function _onSelect () {
        var carr = this.getCarriagePosition();

        if(carr.end > this.lastSign + 1) {
            this.setCarriagePosition(this.carriageMove(this.lastSign) + this.isEntered);
        }
        this.isTextSelected = true;
    };

    function _onDownButtonHandler (event) {
        var carr = this.getCarriagePosition(),
            button = event.which;

        this.firstCarriage = carr;
        this.buttonCode = button;
    };

    function _onButtonHandler (event) {
        var button = event.which,
            shiftKey = event.shiftKey,
            carr = this.getCarriagePosition();

        if(!shiftKey && button === 37) {
            this.setCarriagePosition(
                this.carriageMoveDown(carr.begin)
            );
            return;
        }

        if (!shiftKey && button === 39 && carr.begin <= this.lastSign) {
            this.setCarriagePosition(this.carriageMove(carr.begin));
            return;
        }

        if (!shiftKey && isMoveButton(button)) {
            this.setCarriagePosition(this.lastSign + this.isEntered);
        }
    };

    function _onChange () {
        var carr = this.getCarriagePosition(), 
            start = this.firstCarriage.begin,
            newText = this.$el.val().split(''),
            difference = newText.length - this.size,
            enteredSymbols = newText.slice(start, start + difference),
            method = 'addingText',
            position;

        if (this._isComplete && carr.begin === carr.end && difference > 0){
            this.writeDown();
            this.setCarriagePosition(start);
            return;
        }
        
        if (difference <= 0) {
            method = 'removingText';
        }

        if (this.isEntered && difference > 0 && start < this.lastSign + 1) {
            method = 'middleChange';
        }

        position = this[method](newText, start, enteredSymbols);

        this.writeDown();
        this.setCarriagePosition(position);

        this.isTextSelected = false;
        delete this.buttonCode;
        delete this.firstCarriage;

        if (this._isComplete) {
            typeof this.onComplete === 'function' && this.onComplete();
        }

    };

    /**
     * Initialize and destroy functions
     */

    function destroy () {
        this.$el.attr('maxlength', this.cash.maxlength);

        this.$el
            .off('input', this._onChange)
            .off('focus', this._onFocus)
            .off('blur', this._onBlur)
            .off('mouseup', this._onMouseUp)
            .off('keyup', this._onButtonHandler)
            .off('keydown', this._onDownButtonHandler);
    };

    function maskPlugin (element, mask, options) {
        var text;

        $.extend(this, _customMask(), defaults(), events(this), options);

        this.$el = element;
        this.size = mask.length;
        this.cash.maxlength =  this.$el.attr('maxlength');
        this.$el.removeAttr('maxlength');
        this.$el.data({maskPlugin: this});

        this.maskAnalyse(mask);

        $(this.$el)
            .on('input.maskPlugin', this._onChange)
            .on('focus.maskPlugin', this._onFocus)
            .on('blur.maskPlugin', this._onBlur)
            .on('select.maskPlugin', this._onSelect)
            .on('mouseup.maskPlugin', this._onMouseUp)
            .on('mousedown.maskPlugin', this._onMouseDown)
            .on('keyup.maskPlugin', this._onButtonHandler)
            .on('keydown.maskPlugin', this._onDownButtonHandler);

        text = this.$el.val();

        if (text || this.allwaysMask) {
            this.addText(0, text);

            this.writeDown();
            this.setCarriagePosition(
                this.carriageMove(this.lastSign, 1) + this.isEntered
                );
        }

        return this;
    };

    function newMask (mask, options) {
        var maskObj = $(this).data('maskPlugin');
        return this.each(function () {
            if (maskObj) {
                maskObj[mask] && maskObj[mask]();
                return false;
            }
            options = $.extend({}, customOptioms, options);

            if (mask && mask.length !== undefined && mask.length > 0 
                && options.placeholder && options.placeholder.length === 1) {
                
                new maskPlugin($(this), mask, options);
                $(this).addClass('maskPlugin');
            }
        });

        return this;
    };

    $.fn.extend({
        maskPlugin: newMask
    });

    $.maskPlugin = {
        definitions: {
            9: '[0-9]'
        }
    };

})(jQuery);