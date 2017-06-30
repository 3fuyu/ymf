define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};

        Component.baseConstructor.call(this, config);

        console.log(this.itemData);
        this.itemData.tips = '系统自动编号';
        layout.multiLineFirStyle = {
            opacity: 1,
            color: "#262626"
        };
        layout.singleLineStyle = {
            opacity: 1,
            color: "#262626"
        };
        layout.type = 'text';
        layout.multiLineSecSecStyle = {
            justifyContent: "flex-start",
            color: "#262626"
        };
        cl.switchLayout(this, layout);
        this.plugin[this.id + '_didmount'] = function (sender, params) {
            sender.setText(_this.itemData.tips);
        };
        this.components[this.id].disabled = true;

        var content = {
            columncode: this.itemData.columncode,
            codeRuleTypeValue: this.itemData.codeRuleTypeValue,
        };

        if (this.itemData.fieldValue) {
            $.extend(content, {
                fieldId: this.itemData.fieldValue,
                fieldValue: ''
            });
        }

        this.plugin.autoFields.push(content);
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        if (this.plugin.mode === 'MODIFY') {
            return this.itemData.values;
        } else {
            return '';
        }
    };

    return Component;

});
