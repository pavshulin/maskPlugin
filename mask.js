(function($) {
    var customOptioms = {
            placeholder: "_",
            allwaysMask: false,
            clearIncomplete: false,
            unmaskedPosition: false
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
                _onComplete: _onComplete.bind(_this),
                focusNavigate: focusNavigate.bind(_this)
            };
        },

        _customMask = function () {
            return {
                isMasked: isMasked,
                isEmptyField: isEmptyField,
                maskAnalyse: maskAnalyse,
                middleChange: middleChange,
                addingText: addingText,
                removingText: removingText,
                _resetMask: _resetMask,

                setCarriagePosition: setCarriagePosition,
                getCarriagePosition: getCarriagePosition,
                carriageMoveDown: carriageMoveDown,
                carriageMove: carriageMoveUp,

                writeDown: writeDown,
                clearUp: clearUp,
                _clearUpCheck: _clearUpCheck,
                removeText: removeText,
                addText: addText,
                addOne: addOne,

                _reset: _reset,
                _destroy: _destroy
            };
        },
        moveButtons = [35, 39, 40],
        isMoveButton = function (button) {
            return ~ moveButtons.indexOf(button);
        };

    /**
     * Utils
     **/

    function isMasked (index) {
        return !this.charTest[index];
    }

    function isEmptyField (index) {
        return this.actualText[index] === this.placeholders[index];
    }

    function maskAnalyse (mask) {
        var maskLength = mask.length,
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
                    this.firstPosition = i;
                }
            }
            this.charTest.push(char);
            this.placeholders.push(placeholder);
            this.lastSymbol = i;
        }

        this.firstPosition = this.firstPosition || 0;

        this._resetMask();
    }

    /**
     * Carriage functions
     */

    function setCarriagePosition (begin, end) {
        if (!this.isFocused) {
            return;
        }
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
    }

    function carriageMoveDown (index) {
        if (index <= this.firstPosition) {
            return this.firstPosition;
        }

        while (this.isMasked(index - 1) && index > this.firstPosition) {
            index--;
        }

        return index;
    }

    function carriageMoveUp (index, isMoved) {
        var moved = 1 - (!!isMoved + 0);

        if (index >= this.size) {
            return this.size;
        }

        while (this.isMasked(index + moved) && index !== (this.size + 1)) {
            index++;
        }

        return index;
    }

    /**
     *  Text creationals function
     */

    function writeDown () {
        this.$el.val(this.actualText.join(''));
        this.masked = true;
    }

    function _resetMask () {
        this.actualText = this.placeholders.slice();
        this.isEntered = false;
        this._isComplete = false;
        this.lastSign = this.firstPosition;
    }

    function _clearUpCheck () {
        if (!this.isEntered || (this.clearIncomplete &&
            !this._isComplete)){
            this.clearUp();
        }
    }

    function clearUp () {
        if (!this.allwaysMask) {
            if (this._isAlmostComplete) {
                this.$el.val(this.actualText.slice(0, this.lastSign + 1).join(''));
                this.masked = false;
                return false;
            }

            this._resetMask();
            this.$el.val('');
            this.masked = false;
        }
    }

    function removeText (text) {
        this._resetMask();
        this.addText(0, text);
    }

    function addOne (index, char) {
        this.actualText[index] = char;
        if (this.lastSign < index) {
            this.lastSign = index;
        }
        this.isEntered = true;
    }


    function addText (start, text) {
        var end = text.length,
            n = 0,
            i = start;

        while(n < end && i < this.size) {
            if (!this.isMasked(i)) {
                if (this.charTest[i].test(text[n])) {
                    this.addOne(i, text[n]);
                } else {
                    i--;
                }
                n++;
            }
            i++;
        }

        this._isAlmostComplete = (this.unmaskedPosition &&
            this.unmaskedPosition <= this.lastSign);
        this._isComplete = this.lastSign === this.lastSymbol;
    }


    function middleChange (newText, start, buffer) {
        this.addText(start, newText.slice(start, newText.length));

        return this.carriageMove(start - 1 + buffer.length) + 1;
    }

    function removingText (newText, start) {

        this.removeText(newText);

        if (this.buttonCode === 46) {
            return start;
        }

        if (this.buttonCode === 8) {
            return this.carriageMoveDown(start - 1 + this.isTextSelected);
        }

        if(start < this.lastSign + 1) {
            return this.carriageMove(start || this.firstPosition) + 1;
        }

        return this.lastSign + this.isEntered;
    }

    function addingText (newText, start) {
        this.addText(start, newText.slice(start, newText.length));

        return this.carriageMove(this.lastSign) + this.isEntered;
    }

    /**
     * Event Handlers functions
     **/


    function focusNavigate () {
        var carr = this.getCarriagePosition();

        if (!this.masked) {
            this.writeDown();
        }

        if (this._isComplete) {
            this.setCarriagePosition(0, this.lastSymbol + 1);
            return;
        }

        if (carr.begin && carr.end === carr.begin &&
            carr.begin < this.lastSign) {

            this.setCarriagePosition(
                this.carriageMove(carr.begin - 1) + this.isEntered
            );
            return;
        }

        this.setCarriagePosition(this.lastSign + this.isEntered);
    }


    function _onFocus () {
        this.isFocused = true;
        this._firstState = this.$el.val();
        setTimeout(this.focusNavigate, 0);
    }

    function _onBlur () {
        this._clearUpCheck();

        this.isFocused = false;
        this._onComplete();

        if (this._firstState !== this.$el.val()) {
            this.$el.trigger('change');   
        }
    }

    function _onMouseUp () {
        var carr = this.getCarriagePosition();

        if(carr.begin > this.lastSign ||
            (carr.end !== carr.begin && carr.end > this.lastSign + 1)) {

            this.setCarriagePosition(
                this.carriageMove(this.lastSign) + this.isEntered
            );
            return;
        }

        if(carr.begin < this.lastSign && carr.end === carr.begin) {
            this.setCarriagePosition(
                this.carriageMove(carr.begin - 1) + this.isEntered
            );
            this.isTextSelected = false;
        }
    }

    function _onMouseDown () {
        this.firstCarriage = this.getCarriagePosition();
    }

    function _onSelect () {
        var carr = this.getCarriagePosition();

        if(carr.end > this.carriageMove(this.lastSign) + 1) {
            this.setCarriagePosition(
                this.carriageMove(this.lastSign) + this.isEntered
            );
        }
        this.isTextSelected = true;
    }

    function _onDownButtonHandler (event) {
        var carr = this.getCarriagePosition(),
            button = event.which;

        this.firstCarriage = carr;
        this.buttonCode = button;
    }

    function _onButtonHandler (event) {
        var button = event.which,
            shiftKey = event.shiftKey,
            carr = this.getCarriagePosition();

        if(!shiftKey && button === 37) {
            this.setCarriagePosition(
                this.carriageMoveDown(carr.begin)
            );
            this.isTextSelected = false;
            return;
        }

        if (!shiftKey && button === 39 && carr.begin <= this.lastSign) {
            this.setCarriagePosition(this.carriageMove(carr.begin, true));
            this.isTextSelected = false;
            return;
        }

        if (!shiftKey && isMoveButton(button)) {
            this.setCarriagePosition(this.lastSign + this.isEntered);
            this.isTextSelected = false;
        }
    }

    function _onComplete () {
        var newText = this.$el.val();

        if (newText !== this.actualText.join('')) {
            this.removeText(newText);
            this.writeDown();    
        }

        this._clearUpCheck();

    }

    function _onChange () {
        var carr = this.getCarriagePosition(),
            start = 0,
            newText = this.$el.val().split(''),
            difference = newText.length - this.size,
            method = 'addingText',
            enteredSymbols,
            position;

        if(this.firstCarriage && this.firstCarriage.begin) {
            start = this.firstCarriage.begin;
        }

        enteredSymbols = newText.slice(start, start + difference);

        if (!this.isFocused) {
            this._onComplete();
            return;
        }

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

        if (this._isComplete && typeof this.onComplete === 'function') {
            this.onComplete();
        }

    }

    /**
     * Initialize and destroy functions
     */

    function _reset (mask, options) {
        var $el = this.$el;

        this._destroy();

        return $el.maskPlugin(mask, options);
    }

    function _destroy () {
        this.$el.attr('maxlength', this.cash.maxlength);

        this.$el.off('.maskPlugin');
        this.$el.removeClass('maskPlugin');
        this.$el.data('maskPlugin', null);
        $.each(this, function (property) {
            if (this.hasOwnProperty(property)) {
                delete this[property];
            }

        }.bind(this));
    }

    function MaskPlugin (element, mask, options) {
        var text;

        $.extend(this, _customMask(), defaults(), events(this), options);

        this.$el = element;
        this.size = mask.length;
        this.cash.maxlength =  this.$el.attr('maxlength');
        this.$el.removeAttr('maxlength');
        this.$el.data('maskPlugin', {
            reset: this._reset.bind(this),
            destroy: this._destroy.bind(this)
        });

        this.maskAnalyse(mask.split(''));
        this.unmaskedPosition = (this.unmaskedPosition - 1) >=
            this.firstPosition && this.unmaskedPosition - 1;

        $(this.$el)
            .on('input.maskPlugin', this._onChange)
            .on('focus.maskPlugin', this._onFocus)
            .on('change.maskPlugin', this._onComplete)
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
    }

    function maskPlugin (mask, options) {
        var maskObj = $(this).data('maskPlugin');
        
        return this.each(function () {
            if (maskObj) {
                this.data('maskPlugin').reset(mask, options);
            }
            options = $.extend({}, customOptioms, options);

            if (mask && mask.length !== undefined && mask.length > 0 &&
                options.placeholder && options.placeholder.length === 1) {

                new MaskPlugin($(this), mask, options);
                $(this).addClass('maskPlugin');
            }
        });
    }

    $.fn.extend({
        maskPlugin: maskPlugin
    });

    $.maskPlugin = {
        definitions: {
            9: '[0-9]',
            'a': "[A-Za-z]",
            '*': "[A-Za-z0-9]"
        }
    };

})(jQuery);