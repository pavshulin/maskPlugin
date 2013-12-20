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
                deleteHandler: false,
                isEntered: false,
                isMouseUp: false,
                masked:false,
                lastSign: 0,
                lastSymbol: 0,
                firstPosition: undefined,
                firstCaret: {
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
                _onBlur: _onBlur.bind(_this),
                _onDownButtonHandler: _onDownButtonHandler.bind(_this),
                _onButtonHandler: _onButtonHandler.bind(_this),
                _onChange: _onChange.bind(_this)
            };
        },

        _customMask = function () {
            return {
                isMasked: isMasked,
                isEmptyField: isEmptyField,

                setCaretPosition: setCaretPosition,
                getCaretPosition: getCaretPosition,
                caretMove: caretMove,

                writeDown: writeDown,
                clearUp: clearUp,
                fillField: fillField,
                removeText: removeText,
                addText: addText,
                addOne: addOne,
                addToArrays: addToArrays,

                maskAnalyse: maskAnalyse,
                destroy: destroy
            };
        },
        moveButtons = [35, 39, 40],
        isMoveButton = function (button) {
            return ~ moveButtons.indexOf(button)
        };

    /**
     * Utils
     */

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

        for (i; i < maskLength; i++) {
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
     * Caret functions
     */

    function setCaretPosition (begin, end) {
        end = end || begin;

        this.$el.each(function () {
            this.setSelectionRange(begin, end);

        });
    }

    function getCaretPosition () {
        return {
            begin: this.$el[0].selectionStart,
            end: this.$el[0].selectionEnd
        };
    };

    function caretMove (index) {
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
        this.lastSign = this.firstPosition;
        this.addText(0, text);
    };

    function addOne (index, char) {
        this.actualText[index] = char;
        this.isEntered = true;
        this.lastSign = index;
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

    /**
     * Event Handlers functions
     */

    function _onFocus () {
        this.fillField();
        this.setCaretPosition(this.lastSign + this.isEntered);
    };

    function _onBlur () {
        if(!this.isMouseUp) return true;

        if (!this.isEntered || (this.clearIncomplete && this.lastSign < this.lastSymbol)) {
            this.clearUp();
        }
    };

    function _onMouseUp () {
        var caret = this.getCaretPosition();

        this.isMouseUp = true;
        
        if(caret.begin === caret.end && caret.begin > this.lastSign) {
            this.setCaretPosition(this.lastSign + this.isEntered);
        }
    };

    function _onMouseDown () {
        this.isMouseUp = false;    
    };

    function _onDownButtonHandler (event) {
        var caret = this.getCaretPosition(),
            button = event.which;

        this.firstCaret = caret;
        this.deleteHandler = button === 46;
    };

    function _onButtonHandler (event) {
        var button = event.which;

        if (!event.shiftKey && isMoveButton(button) ) {
            this.setCaretPosition(this.lastSign + this.isEntered);
        }
    };

    function _onChange () {
        var start = this.firstCaret.begin === undefined ?
                this.getCaretPosition().begin : this.firstCaret.begin,
            newText = this.$el.val().split(''),
            difference = newText.length - this.size,
            position;

        if (difference > 0) {
            this.addText(start, newText.slice(start, newText.length));
            position = this.caretMove(this.lastSign, 1) + this.isEntered;
        } else {
            this.removeText(newText);
            position = this.deleteHandler ? start : this.lastSign + this.isEntered;
        }

        this.writeDown();
        this.setCaretPosition(position);

        this.deleteHandler = false;
        delete this.firstCaret.begin;
        delete this.firstCaret.end;

        if (this.lastSign === this.lastSymbol && typeof this.onComplete === 'function') {
            this.onComplete();
        }

    };

    /**
     * Initialize and destroy functions
     */

    function destroy () {
        this.$el.attr('maxlength', this._maxlengthCash);

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
        this._maxlengthCash =  this.$el.attr('maxlength');
        this.$el.removeAttr('maxlength');
        this.$el.data({maskPlugin: this});

        this.maskAnalyse(mask);

        $(this.$el)
            .on('input', this._onChange)
            .on('focus', this._onFocus)
            .on('blur', this._onBlur)
            .on('mouseup', this._onMouseUp)
            .on('mousedown', this._onMouseDown)
            .on('keyup', this._onButtonHandler)
            .on('keydown', this._onDownButtonHandler);

        text = this.$el.val();

        if (text || this.allwaysMask) {
            this.addText(0, text);

            this.writeDown();
            this.setCaretPosition(this.caretMove(this.lastSign, 1) + this.isEntered);
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

            if (mask && mask.length !== undefined && mask.length > 0 && options.placeholder && options.placeholder.length === 1) {
                new maskPlugin($(this), mask, options);
                $(this).addClass('maskPlugin');
            }

            return this;
        })

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

