(function () {
    var data = [{
            label: 'One Phone mask: ',
            mask: '(999) 9999-999',
            maskOptions: {
                clearIncomlete: true,
                unmaskedPosition: 5
            },
            template: '(999) 9999-999',
            placeholder: '(xxx) xxxx-xxx',
            id: 'phoneOne'

        }, {
            label: 'Two Phone mask: ',
            mask: '(999) 9999-999',
            maskOptions: {
                clearIncomlete: true,
                unmaskedPosition: 5
            },
            template: '(999) 9999-999',
            placeholder: '(xxx) xxxx-xxx',
            id: 'phoneTwo'
        }],
        watcherModel = Backbone.Model.extend({

            initialize: function () {
                this.on('change:value', this.validate, this);
            },

            defaults: {
                value: ''
            },

            validate: function (value) {
                debugger;
            }
        }),
        maskModel = Backbone.Model.extend({

            defaults: {
                mask: '',
                maskOptions: {},
                label: '',
                template: '',
                placeholder: ''
            }
        }),

        maskCollection = Backbone.Collection.extend({
            initialize: function () {
                this.reset(data);
            }
        }),

        maskView = Backbone.View.extend({
            initialize: function () {
                this.template = _.template($('#mask-template').html()); 
                this._watch = new watcherModel();
                
                // Backbone.ModelBinder.SetOptions({
                //     modelSetOptions: {
                //         validate: true
                //     }
                // });

                this._modelBinder = new Backbone.ModelBinder();
            },

            render: function () {
                var _model = this.model.toJSON(),
                    selector = '#' + _model.id;

                this.$el.html(this.template(_model));
                this._modelBinder.bind(this._watch, this.$el, maskView.Bindings);
                this.$(selector).maskPlugin(_model.mask, _model.maskOptions)
                return this;
            }
        }, {
            Bindings: {
                value: {
                    selector: '[name=value]',
                    converter: function (dir, value) {
                        return value;
                    }
                }
            }    
        }),

        appView = Backbone.View.extend({
            initialize: function () {
                this.Masks = new maskCollection ();

                this._renderMasks();
            },

            render: function () {
                return this;
            },

            _renderMasks: function () {
                this.Masks.each(function (mask) {
                    this._renderMask(mask);
                }, this);
            },

            _renderMask: function (mask) {
                var view = new maskView({model: mask});

                this.$el.append(view.render().$el);   
            }


        });

        $(function () {
            new appView().render().$el.appendTo('#app');
        })
} ());