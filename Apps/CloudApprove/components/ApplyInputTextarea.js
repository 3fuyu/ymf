define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};
        Component.baseConstructor.call(this, config);

        layout.height = 80;
        layout.type = 'textarea';
        layout.title = "多行文本";

        layout.singleLineStyle = {
            paddingTop: 10,
            paddingBottom: 10,
            paddingRight: 13,
            height: 80
        };
        layout.multiLineFirStyle = {
            height: 80
        };
        layout.multiLineSecSecStyle = {
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 0,
            paddingRight: 13
        };
        layout.multiLineSecFirStyle = {
            paddingTop: 10,
            alignItems: "flex-tart"
        };

        cl.switchLayout(this, layout);

        this.plugin[this.id + "_focus"] = function (sender, params) {
            _this.scrollIntoView();
        };

        this.plugin[this.id + "_blur"] = function(sender, params) {
            var curValue = sender.getValue();
            sender.setValue(_this.limitTextLength(curValue));
        };
        this.plugin[this.id + "_input"] = function(sender, params) {
            var curValue = sender.getValue();
            sender.setValue(_this.limitTextLength(curValue));
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.bindInitValueInRepeat = function (sender) {
        if(sender.datasource[this.id]){
            sender.config.value = (sender.datasource[this.id]);
        }else {
            sender.config.value = this.itemData.defaultValue;
        }

    };

    // Component.prototype.bindInitValue = function (sender) {
    //     var values = this.itemData.values;
    //     if(values && values.length > 0){
    //         sender.config.value = values;
    //     }else {
    //         sender.config.value = this.itemData.defaultValue;
    //     }
    // };
    
    return Component;

});
