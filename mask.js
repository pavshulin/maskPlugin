(function($) {
    var customOptioms = {
            placeholder: "_"
        },

        _customMask = function () {
            return {
                previousText: [],
                newText: [],
                charTest: [],
                setCaretPosition: setCaretPosition,
                getCaretPosition: getCaretPosition,
                maskAnalyse: maskAnalyse,
                checkOne: checkOne,
                writeDown: writeDown,
                replaceOne: replaceOne,
                checkPosition: checkPosition,
                addPlaces: addPlaces,
                _onChange: _onChange,
                editing: true,
                cutOff: cutOff,
                destroy: destroy
            };
        };

    function maskAnalyse (mask, placeholder) {
        this.placeholders = $.map(mask.split(''), function (char) {
            var holder;

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

    function checkPosition (caret) {
        return (this.newText[caret] !== undefined && !this.charTest[caret])
            ? this.checkPosition (++caret) : caret;
    };

    function checkOne (char, index) {
        if (!(this.charTest[index]) || !(this.charTest[index]).test(char)) {
            this.replaceOne(index);
        }
    };

    function getCaretPosition () {
        var caret = this.$el.caret();

        return caret && caret.end;
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

    function _onChange () {
        var caret = this.getCaretPosition() || 0,
            i = caret - 1;
        this.newText = this.$el.val().split('');

        for (i; i <= this.size ; i++) {
            if (this.previousText[i] !== this.newText[i]) {
                this.checkOne(this.newText[i], i);
            }
        }

        this.cutOff();

        this.writeDown();
        caret = this.checkPosition(caret);
        this.setCaretPosition(caret);
    };

    function destroy () {
        this.$el.attr('maxlength', this._maxlengthCash);
        this.$el.off('input', this._onChange);
        //this.$el.off('focus', this._onChange);
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

        $(this.$el).on('input', this._onChange.bind(this));
        //$(this.$el).on('focus', this._onChange.bind(this));
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

