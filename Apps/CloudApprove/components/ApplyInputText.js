define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};
        Component.baseConstructor.call(this, config);

        layout.title = "文本";
        cl.switchLayout(this, layout);
        _this.isEditor = true;

        this.plugin[this.id + "_focus"] = function(sender, params) {
            _this.scrollIntoView();
        };

        this.plugin[this.id + "_blur"] = function(sender, params) {
            var curValue = sender.getValue();
            sender.setValue(_this.limitTextLength(curValue));
        };
        this.plugin[this.id + "_input"] = function(sender, params) {
            if(_this.isEditor){
                var curValue = sender.getValue();
                sender.setValue(_this.limitTextLength(curValue));
            }
        };
        this.plugin[this.id + "_compositionstart"] = function(sender, params) {
            _this.isEditor = false;
        };
        this.plugin[this.id + "_compositionend"] = function(sender, params) {
            _this.isEditor = true;
        };

    }

    utils.extends(Component, baseClass);

    // Component.prototype.bindInitValue = function (sender) {
    //     var values = this.itemData.values;
    //
    //     if(values && values.length > 0){
    //         sender.config.value = values;
    //     }else {
    //         sender.config.value = this.itemData.defaultValue || '';
    //     }
    // };
    Component.prototype.bindInitValueInRepeat = function (sender) {
        if(sender.datasource[this.id]){
            sender.config.value = (sender.datasource[this.id]);
        }else {
            sender.config.value = this.itemData.defaultValue;
        }

    };
    return Component;

});
