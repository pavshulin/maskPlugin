(function () {
    var template = $('<input />', {
            type: 'text'
        }),
        container,
        defs = $.maskPlugin.definitions;

    function setUp () {
        this.maskCreate = function(params, mask) {
            mask = mask || 'a9999 - a9999 - *9999';
            this.input = template.clone();

            $('#qunit-fixture').append(this.input);

            this.input.maskPlugin(mask, params)
            this.mask = this.input.data('maskPlugin');    
        }

        Function.prototype.bind = Function.prototype.bind || function (obj) {
            var caller = this;
            return function () {
                caller.apply(obj, arguments);
            };    
        };
    }

    function tearDown () {
        if (this.mask) {
            this.mask.destroy();
            delete this.mask;

            this.input.remove();
            delete this.input;

        }

        delete this.maskCreate;
    }    

    module('Mask Plugin Test', {
        setup: setUp,
        teardown: tearDown
    });

    test( "Initialization Test test", function () {
        ok($.prototype.maskPlugin, "maskPlugin is not exist");    

        this.maskCreate();

        ok(this.mask, 'maskPlugin is created');
        ok(this.mask.destroy, 'destroy method was not exist');
        ok(this.mask.reset, 'destroy method was not exist');
    });

    test( "clear incomplete parametr test", function () {
        this.maskCreate({
            clearIncomplete: true
        });

        this.input.val('a2345a78901234').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 1234_', 
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), '', 'clear incomplete works wrong');

        this.input.trigger('focus').val('a').trigger('input');
        equal(this.input.val(), 'a____ - _____ - _____', 
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), '', 'clear incomplete works wrong');   
        
        this.input.val('a2345a789012345').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 12345', 
            'clear incomplete works wrong'); 

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890 - 12345', 
            'clear incomplete works wrong');     
    });

    test( "clear incomplete with unmasked position parametr test", function () {
        this.maskCreate({
            clearIncomplete: true,
            unmaskedPosition: 13
        });

        this.input.val('a2345a78901234').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 1234_',
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890 - 1234', 
            'clear incomplete works wrong');

        this.input.val('a2345a7890123').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 123__', 
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890 - 123',
            'clear incomplete works wrong');

        this.input.val('a2345a789012').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 12___',
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890 - 12', 
            'clear incomplete works wrong');

        this.input.val('a2345a78901').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 1____', 
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890 - 1', 
            'clear incomplete works wrong');

        this.input.val('a2345a7890').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - _____', 
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890', 
            'clear incomplete works wrong');

        this.input.trigger('focus').val('a').trigger('input');
        equal(this.input.val(), 'a____ - _____ - _____',
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), '', 
            'clear incomplete works wrong');   

        this.input.trigger('focus').val('a2345a789').trigger('input');
        equal(this.input.val(), 'a2345 - a789_ - _____', 
            'clear incomplete works wrong');

        this.input.trigger('blur');
        equal(this.input.val(), '', 'clear incomplete works wrong'); 
        
        this.input.val('a2345a789012345').trigger('focus').trigger('input');
        equal(this.input.val(), 'a2345 - a7890 - 12345', 
            'clear incomplete works wrong'); 

        this.input.trigger('blur');
        equal(this.input.val(), 'a2345 - a7890 - 12345', 
            'clear incomplete works wrong');     


        this.input.trigger('blur');
    });

    test( "allways mask parametr test", function () {
        this.maskCreate({
            allwaysMask: true,
            unmaskedPosition: 13
        });

        equal(this.input.val(), '_____ - _____ - _____', 
            'allways mask parametr works wrong');

        this.input.val('a').trigger('input').trigger('blur');

        equal(this.input.val(), 'a____ - _____ - _____', 
            'allways mask parametr works wrong');

        this.input.val('a2345a7890').trigger('input').trigger('blur');

        equal(this.input.val(), 'a2345 - a7890 - _____', 
            'allways mask parametr works wrong');

        this.input.val('a2345a7890123').trigger('input').trigger('blur');

        equal(this.input.val(), 'a2345 - a7890 - 123__', 
            'allways mask parametr works wrong');

    });

    test( "max length test", function () {

        this.maskCreate();

        this.input.val('123231a\\d/<>13_+21dad!s@d$1%4^41343232...')
            .trigger('input');

        equal(this.input.val(), 'a1321 - d1441 - 34323');
    });

    test( "reset function test", function () {

        this.maskCreate();

        this.input.val('a2345a789012345').trigger('input');

        equal(this.input.val(), 'a2345 - a7890 - 12345', 
            'reset function work wrong');

        this.mask.reset('9999 - a - 9999');
        equal(this.input.val(), '2345 - a - 7890', 
            'reset function work wrong');

        delete this.mask
    });
    
    test( "reset function test", function () {
        this.maskCreate();

        this.input.val('a2345a789012345').trigger('input');
        ok(true);


    });


} ());