    (function($) {
    var customOptioms = {
            placeholder: "_"
        },

        _customMask = function () {
            return {
                previousText: [],
                newText: [],
                charTest: [],
                lastEnteredPosition: 0,
                firstNonMaskedPosition: 0,
                editing: true,
                setCaretPosition: setCaretPosition,
                getCaretPosition: getCaretPosition,
                maskAnalyse: maskAnalyse,
                checkOne: checkOne,
                writeDown: writeDown,
                _onMouseUpHandler: _onMouseUpHandler,
                _onButtonHandler: _onButtonHandler,
                replaceOne: replaceOne,
                checkFalsePosition: checkFalsePosition,
                unCheckFalsePosition: unCheckFalsePosition,
                unCheckPosition: unCheckPosition,
                checkPosition: checkPosition,
                addPlaces: addPlaces,
                _onChange: _onChange,
                _onDownButtonHandler: _onDownButtonHandler,
                _onFocus: _onFocus,
                cutOff: cutOff,
                destroy: destroy
            };
        };

    function maskAnalyse (mask, placeholder) {
        var holder;
        this.placeholders = $.map(mask.split(''), function (char) {

            if (this.defs[char]) {
                this.charTest.push(new RegExp(this.defs[char]));
                holder = placeholder;
            } else {
                this.charTest.push(false);
                holder = char;
            }

            return holder;
        }.bind(this));
    };

    function unCheckFalsePosition (caret) {
        while(!this.charTest[caret - 1] && caret > 0) {
            caret--;
        }

        return caret;
    };

    function checkFalsePosition (caret) {
        while(!this.charTest[caret] && caret < this.size) {
            caret++;
        }

        return caret;
    };

    function checkPosition (caret, isBackSpace) {
        var i = this.size - 1,
            result;

        for (i; i > 0; i--) {
            if (this.charTest[i] && this.newText[i] !== this.placeholders[i]) break;
        }

        result = this.checkFalsePosition(i + 1);

        return  result;

    };

    function unCheckPosition (caret, isBackSpace) {
        var i = this.size - 1,
            result;

        for (i; i > 0; i--) {
            if (this.charTest[i] && this.newText[i] !== this.placeholders[i]) break;
        }

        result = this.unCheckFalsePosition(i - 1);

        return  result;

    };

    function checkOne (char, index) {
        if (!(this.charTest[index]) || !(this.charTest[index]).test(char)) {
            this.replaceOne(index);
        }
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

    function replaceOne (index) {
        this.newText[index] = this.placeholders[index];
    };

    function cutOff () {
        var actualSize = this.newText.length,
            boundSize = this.size;

        if (actualSize > boundSize) {
            this.newText.splice(boundSize, actualSize - boundSize);
        }
    }

    function addPlaces (newText) {
        var diff = this.placeholders.length - newText.length,
            length = this.placeholders.length;

        if (diff > 0) {
            for (diff = length - diff; diff < length; diff++ ) {
                if(this.placeholders[diff] !== '') {
                    newText.push(this.placeholders[diff]);
                }
            }
        }

        return newText;
    };

    function writeDown () {
        this.newText = this.addPlaces(this.newText);
        this.previousText = this.newText;

        this.$el.val(this.newText.join(''));
    };

    function _onMouseUpHandler (e) {
        // var caret =  this.checkPosition(this.getCaretPosition());
        // if (caret) {
        //     this.setCaretPosition(caret);    
        // }
        
    };

    function _onFocus () {

    }

    function _onDownButtonHandler (e) {
        var caret = this.getCaretPosition(),
            button = e.which,
            text = $(e.target).val();
        this.previousText = text.split('');
        if(button === 46) {
            this.previousText.splice(caret.end, (caret.end - caret.begin) + 1, '_');
            $(e.target).val(this.previousText.join(''));
        }

        if (button === 8) {
        }
    }

    function _onButtonHandler (e) {
        var caret = this.getCaretPosition().end || 0,
            button = e.which,
            text = $(e.target).val();

        //console.log(button, text)

        if(button === 8) {
            caret = this.unCheckFalsePosition(caret);

            this.setCaretPosition(caret);
        }

        if (button === 39 || button === 40) {
            caret = this.checkFalsePosition(caret);
            this.setCaretPosition(caret);
        }

        return true;
    };

    function _onChange () {
        var caret = this.getCaretPosition().end || 0,
            i = caret - 1;
        this.newText = this.$el.val().split('');
        
        if (this.newText.length > this.size) {
            this.newText.splice(caret, this.newText.length - this.size);

        }

        for (i; i <= this.size ; i++) {
            this.checkOne(this.newText[i], i);    
        }

        this.cutOff();

        this.writeDown();

        caret = this.checkPosition(caret);
        this.setCaretPosition(caret);
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
            .on('keydown', this._onDownButtonHandler.bind(this));

        this._onChange();

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

