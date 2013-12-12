    (function($) {
    var customOptioms = {
            placeholder: "_",
            caretMove: true
        },

        defaults = function () {
            return {
                actualText: [],
                charTest: [],
                placeholders: [],
                deleteHandler: false,
                isEntered: false,
                masked:false,
                lastSign: 0,
                firstPosition: undefined,
                firstCaret: {
                    begin: 0,
                    end: 0
                }
            };
        };

        _customMask = function () {
            return {
                isMasked: isMasked,
                isEmptyField: isEmptyField,
                checkOne: checkOne,

                setCaretPosition: setCaretPosition,
                getCaretPosition: getCaretPosition,
                caretMove: caretMove,
                positionChange: positionChange,
                
                writeDown: writeDown,
                clearUp: clearUp,
                fillField: fillField,
                removeText: removeText,
                addText: addText,

                _onFocus: _onFocus,
                _onMouseUp: _onMouseUp,
                _onDownButtonHandler: _onDownButtonHandler,
                _onButtonHandler: _onButtonHandler,
                _onChange: _onChange,
                
                maskAnalyse: maskAnalyse,
                destroy: destroy
            };
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

    function checkOne (char, index) {
        return !(!this.isMasked(index)) || !(this.charTest[index]).test(char)
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

    function positionChange () {
        var start = this.getCaretPosition().begin || this.size;

        if(start < this.lastSign + 1) return start;
        while (!(start === this.firstPosition || !this.isEmptyField(start))) {
            start--;
        }

        return ++start;
    }

    function caretMove (index, direction) {
        var stop = direction > 0 ? this.size + 1 : this.firstPosition;

        while (this.isMasked(index + direction)) {
            index++;
            if (index === stop) break;
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
        this.actualText = this.placeholders.slice();

        this.isEntered = false;
        this.masked = false;

        this.$el.val('');
    };

    function removeText (start, text) {
        this.actualText = this.placeholders.slice();

        this.isEntered = false;
        this.lastSign = this.firstPosition;
        this.addText(0, text);
    };

    function addText (start, text) {
        var end = text.length,
            n = 0,
            pos = 0,
            i = start;

            while(n < end && !(i >= this.size || !this.isEmptyField(i))) {

                if (!this.isMasked(i)) {
                    if(!this.checkOne(text[n], i)) {
                        this.actualText[i] = text[n];
                        this.isEntered = true;
                        this.lastSign = i;
                        pos = i;
                    } else {
                        i--;
                    }
                    //if not masked position move to next
                    n++;
                }

                i++;
            }
        console.log(this.lastSign, this.isEntered);
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
        var caret = this.getCaretPosition();

        this.fillField();
        this.setCaretPosition(this.lastSign + 1 || 0);
    };

    function _onMouseUp () {
        var caret = this.getCaretPosition(),
            position;
        this.fillField();


        if(caret.begin === caret.end && caret.begin > this.lastSign) {
            position = !this.isEntered ? this.firstPosition : this.lastSign + 1 || 0;
            this.setCaretPosition(position);
        }

    };

    function _onDownButtonHandler (event) {
        var caret = this.getCaretPosition(),
            button = event.which;

        this.firstCaret = caret;
        this.deleteHandler = button === 46;
    };

    function _onButtonHandler (e) {
        var button = e.which;

        if(button === 8) {
        }

        if (!e.shiftKey && (button === 39 || button === 40) ) {
            this.setCaretPosition(this.lastSign + this.isEntered);
        }
    };

    function _onChange () {
        var start = this.firstCaret.begin === undefined ? this.getCaretPosition().begin : this.firstCaret.begin,
            newText = this.$el.val().split(''),
            difference = newText.length - this.size,
            pos;

        if (difference > 0) {
            this.addText(start, newText.slice(start, newText.length));
            this.writeDown();
            pos = this.caretMove(this.lastSign, 1) + !!this.isEntered;
        } else {
            this.removeText(start, newText);
            this.writeDown();
            pos = this.deleteHandler ? start : this.lastSign + !!this.isEntered;
        }

        this.setCaretPosition(pos);

        this.deleteHandler = false;
        this.firstCaret.begin = undefined;
        this.firstCaret.end = undefined;
    };

    /**
    * Initialize and destroy functions
    */

    function destroy () {
        this.$el.attr('maxlength', this._maxlengthCash);
        this.$el.off('input', this._onChange);
    };

    function maskAnalyse (mask, placeholder) {
        var mask = mask.split(''),
            maskLength = mask.length,
            i = 0,
            char;

        for (i; i < maskLength; i++) {
            char = mask[i];

            if (!$.newMask.definitions[char]) {
                this.charTest.push(false);
                this.placeholders.push(char);
                continue;
            }

            if (this.firstPosition === undefined) {
                this.firstPosition = i  ;
            }

            this.charTest.push(new RegExp($.newMask.definitions[char]));
            this.placeholders.push(placeholder);
        }

        this.actualText = this.placeholders.slice();
    };

    function maskPlugin (element, mask, options) {
        $.extend(this, _customMask());
        $.extend(this, defaults());

        this.$el = element;
        this.size = mask.length;
        this._maxlengthCash =  this.$el.attr('maxlength');
        this.$el.removeAttr('maxlength');
        this.$el.data({maskPlugin: this});

        this.maskAnalyse(mask, options.placeholder);

        $(this.$el)
            .on('input', this._onChange.bind(this))
            .on('focus', this._onFocus.bind(this))
            .on('mouseup', this._onMouseUp.bind(this))
            .on('keyup', this._onButtonHandler.bind(this))
            .on('keydown', this._onDownButtonHandler.bind(this));

        return this;
    };

    function newMask (mask, options) {
        var maskObj = $(this).data('maskPlugin');
        return this.each(function () {
            if (maskObj) {
                maskObj[mask] && maskObj[mask]();
                return false;
            }
            options = $.extend(customOptioms, options);

            if (!mask || !mask.length || mask.length <= 0|| $(this).length === 0) return this;


            new maskPlugin($(this), mask, options);

            return this;
        })

    };

    $.fn.extend({
        newMask: newMask
    });

    $.newMask = {
        definitions: {
        }
    };

})(jQuery);

