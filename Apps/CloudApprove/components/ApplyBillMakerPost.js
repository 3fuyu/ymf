/**
 * Created by Gin on 17/3/30.
 */
define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {},
            duty = config.form.duty;

        this.dutyName = duty ? duty : '暂无';

        Component.baseConstructor.call(this, config);
        layout.multiLineFirStyle = {
            opacity: 1,
            color: "#262626"
        };
        layout.singleLineStyle = {
            opacity: 1,
            color: "#262626"
        };
        layout.multiLineSecSecStyle = {
            justifyContent: "flex-start",
            color: "#262626"
        };
        layout.type = 'text';
        cl.switchLayout(this, layout);
        // this.components[this.id].disabled = true;

        this.plugin[this.id + '_didmount'] = function (sender, params) {
            sender.setText(_this.dutyName);
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        return this.dutyName;
    };

    return Component;

});

