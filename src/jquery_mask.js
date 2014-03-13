(function($) {
    var customOptioms = {
            placeholder: "_",
            allwaysMask: false,
            clearIncomplete: false
        };


    function MaskPlugin (mask, options) {
        var maskObj = $(this).data('maskPlugin');
        return this.each(function () {
            if (maskObj) {
                maskObj[mask] && maskObj[mask]();
                return false;
            }
            options = $.extend({}, customOptioms, options);

            if (mask && mask.length !== undefined && mask.length > 0 
                && options.placeholder && options.placeholder.length === 1) {
                
                //new maskPlugin($(this), mask, options);
                $(this).addClass('maskPlugin');
            }
        });

        return this;
    };

    $.fn.extend({
        maskPlugin: MaskPlugin
    });

    $.maskPlugin = {
        definitions: {
            9: '[0-9]'
        }
    };

}(jQuery));