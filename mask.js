    (function($) {
    var customOptioms = {
            placeholder: "_"
        },

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
                removeText: removeText,
                addText: addText,

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
            begin: this.$el.selectionStart,
            end: this.$el.selectionEnd
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

    function writeDown (text) {
        text = text || this.actualText;
        this.actualText = text;
        this.$el.val(text.join(''));
    };

    function clearUp () {
        this.actualText = this.placeholders.slice();

        this.$el.val('');
    };

    function removeText (start, text) {
        this.actualText = this.placeholders.slice();

        this.addText(0, text);

        this.writeDown();
        this.setCaretPosition(start - 1 + this.deleteHandler)
        this.deleteHandler = 0;
    };

    function addText (start, text) {
        var end = start + text.length,
            n = 0,
            pos = 0,
            i = start;


            while(n < end) {
                if(i >= this.size || !this.isEmptyField(i)) break;

                if (!this.isMasked(i)) {

                    if(!this.checkOne(text[n], i)) {
                        this.actualText[i] = text[n];
                        this.lastSign = i;
                        pos = i;
                    } else {
                        i--;
                    }
                    //if not masked position move to next
                    n++;
                } else {
                    this.actualText[i] = this.placeholders[i];
                }

                i++;
            }

        this.writeDown(this.actualText);

        this.setCaretPosition(this.caretMove(this.lastSign, 1) + 1);
    };

    /**
    * Event Handlers functions
    */

    function _onDownButtonHandler (event) {
        var caret = this.getCaretPosition(),
            button = event.which;

        this.firstCaret = caret;
        this.deleteHandler += !!(button === 46);
    };

    function _onButtonHandler (e) {
        var caret = this.getCaretPosition().end || this.firstPosition,
            button = e.which;

        if(button === 8) {
        }

        if (!e.shiftKey && (button === 39 || button === 40) ) {
            this.setCaretPosition(this.positionChange());
        }
    };

    function _onChange () {
        var start = this.firstCaret.begin || this.lastSign + 1,
            newText = this.$el.val().split(''),
            difference = newText.length - this.size;

        if (difference > 0) {
            this.addText(start, newText.slice(start, start + difference));
        } else {
            this.removeText(start, newText);
        }

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
                this.firstPosition = i - 1;
            }

            this.charTest.push(new RegExp($.newMask.definitions[char]));
            this.placeholders.push(placeholder);
        }

        this.actualText = this.placeholders.slice();
    };

    function maskPlugin (element, mask, options) {
        $.extend(this, _customMask());
        this.$el = element;
        this.size = mask.length;
        this._maxlengthCash =  this.$el.attr('maxlength');
        this.$el.removeAttr('maxlength');
        this.$el.data({maskPlugin: this});

        this.actualText = [];
        this.charTest = [];
        this.placeholders = [];
        this.lastSign = 0;
        this.firstPosition = undefined;
        this.firstCaret = {
            begin: 0,
            end: 0
        };
        this.deleteHandler = 0;
        this.masked = false;
        this.caretMovement = false;

        this.maskAnalyse(mask, options.placeholder);

        $(this.$el).on('input', this._onChange.bind(this))
            .on('keyup', this._onButtonHandler.bind(this))
            .on('keydown', this._onDownButtonHandler.bind(this));

        return this;
    };

    function newMask (mask, options) {
        return this.each(function () {
            if ($(this).data('maskPlugin')) {
                $(this).data('maskPlugin')[mask] && $(this).data('maskPlugin')[mask]();
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

