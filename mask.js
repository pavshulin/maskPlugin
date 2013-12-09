    (function($) {
    var customOptioms = {
            placeholder: "_"
        },

        _customMask = function () {
            return {
                actualText: [],
                charTest: [],
                placeholders: [],
                lastEnteredPosition: 0,
                firstPosition: undefined,
                firstCaret: {
                    begin: 0,
                    end: 0
                },
                deleteHandler: 0,
                masked: false,
                caretMovement: false,
                setCaretPosition: setCaretPosition,
                getCaretPosition: getCaretPosition,
                caretMove: caretMove,
                _onMouseUpHandler: _onMouseUpHandler,
                _onDownButtonHandler: _onDownButtonHandler,
                _onFocus: _onFocus,
                _onButtonHandler: _onButtonHandler,
                _onBlur: _onBlur,
                _onChange: _onChange,
                maskAnalyse: maskAnalyse,
                writeDown: writeDown,
                clearUp: clearUp,
                removeText: removeText,
                isMasked: isMasked,
                isEmptyField: isEmptyField,
                checkOne: checkOne,
                addText: addText,
                positionChange: positionChange,
                destroy: destroy
            };
        };

    function maskAnalyse (mask, placeholder) {
        var mask = mask.split(''), 
            maskLength = mask.length,
            i = 0,
            char;

        for (i; i < maskLength; i++) {    
            char = mask[i];

            if (!this.defs[char]) {
                this.charTest.push(false);
                this.placeholders.push(char);
                continue;
            }

            this.firstPosition = this.firstPosition || i - 1;
            this.charTest.push(new RegExp(this.defs[char]));
            this.placeholders.push(placeholder);
        }     

        this.actualText = this.placeholders.slice();
    };

    function isMasked (index) {
        return !this.charTest[index];
    };

    function isEmptyField (index) {
        return this.actualText[index] === this.placeholders[index];
    };

    function checkOne (char, index) {
        return !(!this.isMasked(index)) || !(this.charTest[index]).test(char)
    };

    function getCaretPosition () {
        var caret = this.$el.caret();

        return caret && {
            end: caret.end,
            begin: caret.begin
        } || {};
    };

    function positionChange () {
        var start = this.size;
        
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

    function setCaretPosition (pos) {
        this.$el.caret(pos, pos);
    };

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

        if(this.isEmptyField(i)) {
            while(n < end) {
                if(i >= this.size) break;

                if (!this.isMasked(i)) {

                    if(!this.checkOne(text[n], i)) {
                        this.actualText[i] = text[n];
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
        }

        this.writeDown(this.actualText);
        console.log('move', this.$el.attr('id'))
        this.setCaretPosition(this.caretMove(pos, 1) + 1);
    };

    function _onFocus () {
        var caret = this.getCaretPosition().end || this.firstPosition;

        if (!this.masked) {
            this.masked = true;
        }

        this.writeDown(this.actualText);
        this.setCaretPosition(this.firstPosition);
    }

    function _onBlur () {
        var i = 0,
            masked = false;
        for (i; i < this.size; i++) {
            if (this.charTest[i] && this.placeholders[i] !== this.actualText[i]) {
                masked = true;
                break;
            }
        }

        if (!masked) {
            this.clearUp();
        }

        this.masked = masked;
    }

    function _onDownButtonHandler (e) {
        var caret = this.getCaretPosition(),
            button = e.which;

        this.firstCaret = caret;

        this.deleteHandler += !!(button === 46);

        if (button === 8) {

        }
    };

    function _onMouseUpHandler () {
        this.setCaretPosition(this.positionChange());
    }

    function _onButtonHandler (e) {
        var caret = this.getCaretPosition().end || this.firstPosition,
            button = e.which;

        if(button === 8) {
        }

        if (button === 39 || button === 40) {
            this.setCaretPosition(this.positionChange());
        }
    };

    function _onChange () {
        var start = this.firstCaret.begin || this.firstPosition,
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

    function destroy () {
        this.$el.attr('maxlength', this._maxlengthCash);
        this.$el.off('input', this._onChange);
    };

    function maskPlugin (element, mask, options) {
        $.extend(this, _customMask());
        this.$el = element;
        this.size = mask.length;
        this._maxlengthCash =  this.$el.attr('maxlength');
        this.$el.removeAttr('maxlength');
        this.defs = $.mask.definitions;
        this.$el.data({maskPlugin: this});
        this.maskAnalyse(mask, options.placeholder);

        $(this.$el).on('input', this._onChange.bind(this))
            .on('focus', this._onFocus.bind(this))
            .on('mouseup', this._onMouseUpHandler.bind(this))
            .on('keyup', this._onButtonHandler.bind(this))
            .on('blur', this._onBlur.bind(this))
            .on('keydown', this._onDownButtonHandler.bind(this));

        return this;
    };

    function _initSeveral (elements, mask, options) {
        $(elements).each(function () {
            _initOne(elements, mask, options);
        });
    };

    function _initOne (element, mask, options) {
        new maskPlugin (element, mask, options);
    };

    function newMask (mask, options) {
        var method = $(this).length > 1 ? _initSeveral : _initOne;
        if (this.data('maskPlugin')) {
            this.data('maskPlugin')[mask] && this.data('maskPlugin')[mask]();
            return false;
        }
        options = $.extend(customOptioms, options);

        if (!mask || !mask.length || mask.length <= 0|| $(this).length === 0) return this;


        method(this, mask, options);

        return this;
    };

    $.fn.extend({
        newMask: newMask,
        caret: function(begin, end) {
            if (this.length == 0) return;
            if (typeof begin == 'number') {
                end = (typeof end == 'number') ? end : begin;
                return this.each(function() {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        var range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    var range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return { begin: begin, end: end };
            }
        }
    });

})(jQuery);

