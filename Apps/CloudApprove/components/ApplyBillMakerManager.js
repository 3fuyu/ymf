define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {},
            deptMgr = config.form.deptMgr;

        this.deptMgrName = deptMgr ? deptMgr.name : '暂无';

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
            sender.setText(_this.deptMgrName);
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        return this.deptMgrName;
    };

    return Component;

});
