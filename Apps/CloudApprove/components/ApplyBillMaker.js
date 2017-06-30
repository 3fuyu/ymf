define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};

        Component.baseConstructor.call(this, config);
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
            sender.setText(window.currentUserInfo && window.currentUserInfo.userName || '暂无');
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        return window.currentUserInfo && window.currentUserInfo.userName || '暂无';
    };

    return Component;

});
