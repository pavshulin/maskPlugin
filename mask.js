    (function($) {
    var customOptioms = {
            placeholder: "_"
        },

        _customMask = function () {
            return {
                actualText: [],
                charTest: [],
                lastEnteredPosition: 0,
                firstNonMaskedPosition: 0,
                firstCaret: {
                    begin: 0,
                    end: 0
                },
                deleteHandler: 0,
                masked: false,
                caretMovement: false,
                setCaretPosition: setCaretPosition,
                getCaretPosition: getCaretPosition,
                maskAnalyse: maskAnalyse,
                isMasked: isMasked,
                checkOne: checkOne,
                writeDown: writeDown,
                clearUp: clearUp,
                _onButtonHandler: _onButtonHandler,
                _onChange: _onChange,
                addText: addText,
                removeText: removeText,
                _onDownButtonHandler: _onDownButtonHandler,
                _onFocus: _onFocus,
                _onBlur: _onBlur,
                destroy: destroy
            };
        };

    function maskAnalyse (mask, placeholder) {
        var holder,
            firstFlag = false;

        this.placeholders = $.map(mask.split(''), function (char, num) {

            if (this.defs[char]) {
                firstFlag = true;
                this.charTest.push(new RegExp(this.defs[char]));
                holder = placeholder;
            } else {
                this.charTest.push(false);
                holder = char;

                if (!firstFlag) {
                    this.firstNonMaskedPosition = num;
                }
            }

            return holder;
        }.bind(this));
        this.actualText = this.placeholders.slice();
        this.firstNonMaskedPosition++;
    };

    function isMasked (index) {
        return !this.charTest[index];
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

    function _onFocus () {
        var caret = this.getCaretPosition().end || this.firstNonMaskedPosition;

        if (!this.masked) {
            this.masked = true;
        }

        this.writeDown(this.actualText);
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

        if(button === 46) {
            this.deleteHandler = 1;
        }

        if (button === 8) {

        }
    }

    function _onButtonHandler (e) {
        var caret = this.getCaretPosition().end || this.firstNonMaskedPosition,
            button = e.which;

        if(button === 8) {
        }

        if (button === 39 || button === 40) {
        }
    };

    function removeText (start, end, diff, text) {
        var z, i, pos, check;

        if (start === end) {
            i = start - 1;
            z = start;
        } else {
            i = start;
            z = end;
            check = z - i + diff;
        }

        pos = i;

        for (i; i < z; i++) {
            if (check && text[i] && !this.checkOne(text[i], i)) {
                this.actualText[i] = text[i];
                check--;
            } else {
                this.actualText[i] = this.placeholders[i]
            }
        }

        this.writeDown();
        this.setCaretPosition(pos);
    };

    function addText (start, text) {
        var end = start + text.length,
            n = 0,
            pos = 0,
            i = start;

        while(n < end) {
            if (!this.isMasked(i)) {

                if(!this.checkOne(text[n], i)) {
                    this.actualText[i] = text[n];
                    pos = i;
                }

                //if not masked position move to next
                n++;
            }

            i++;
            if(i > this.size) break;
        }

        this.writeDown(this.actualText);
        this.setCaretPosition(++pos);
    };

    function _onChange () {
        var start = this.firstCaret.begin || this.firstNonMaskedPosition,
            newText = this.$el.val().split(''),
            difference = newText.length - this.size;

        if (difference > 0) {
            this.addText(start, newText.slice(start, start + difference));
        } else {
            this.removeText(start, this.firstCaret.end, difference, newText);

        }

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
           // .on('mouseup', this._onMouseUpHandler.bind(this))
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
        newMask: newMask
    });

})(jQuery);

