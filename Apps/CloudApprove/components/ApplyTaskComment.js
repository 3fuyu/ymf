define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};
        Component.baseConstructor.call(this, config);

        // layout.title = "文本";
        layout.type = 'text';
        this.itemData.tips = '系统自动填入审批意见';

        layout.multiLineSecSecStyle = {
            justifyContent: "flex-start",
            color: "#262626"
        };
        cl.switchLayout(this, layout);

        this.plugin[this.id + '_didmount'] = function (sender, params) {
            sender.setText(_this.itemData.tips);
        };
    }

    utils.extends(Component, baseClass);
    Component.prototype.getValue = function () {
        if (this.plugin.mode === 'MODIFY') {
            return this.itemData.values;
        } else {
            return '';
        }
    };

    Component.prototype.bindInitValue = function (sender) {
        var values = this.itemData.values;

        if(values && values.length > 0){
            sender.config.value = values[0];
        }else {
            sender.config.value = this.itemData.defaultValue || '';
        }
    };
    Component.prototype.bindInitValueInRepeat = function (sender) {
        if(sender.datasource[this.id]){
            sender.config.value = (sender.datasource[this.id]);
        }else {
            sender.config.value = this.itemData.defaultValue;
        }

    };
    return Component;

});
