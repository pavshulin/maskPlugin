(function () {
    var template,
        container,
        defs;

    function setUp () {
        template = $('<input />', {
            type: 'text'
        });

        container = $('#qunit-fixture');
        defs = $.maskPlugin.definitions;

        Function.prototype.bind = Function.prototype.bind || function (obj) {
            var caller = this;
            return function () {
                caller.apply(obj, arguments);
            };    
        };
    }

    function tearDown () {

    }    

    module('Mask Plugin Test', {
        setup: setUp,
        teardown: tearDown
    });

    test( "Initialization Test test", function () {
        var input = template.clone(),
            mask;

        ok($.prototype.maskPlugin, "maskPlugin is not exist");    

        container.append(input);


        input.maskPlugin('9999', {
            placeholder: '1',
            unmaskedPosition: 3
        });
        mask = input.data('maskPlugin');

        ok(mask, 'maskPlugin is created');

        input.maskPlugin('destroy');
    });




} ());