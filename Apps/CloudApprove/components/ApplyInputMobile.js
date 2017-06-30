define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};
        Component.baseConstructor.call(this, config);

        // layout.mode = "number";
        layout.title = "手机号码";

        cl.switchLayout(this, layout);

        this.plugin[this.id + "_blur"] = function(sender, params) {
            if (_this.itemData.componentKey === "Mobile") {
                if (_this.getValue() && !utils.isPhone(_this.getValue())) {
                    _this.verify = true;
                    _this.verifyMsg = "手机号格式不对！";
                    _this.showTip(_this.verifyMsg);
                    _this.scrollIntoView();
                    return;
                } else {
                    _this.verify = false;
                }
            } else if (_this.itemData.componentKey === "Phone") {
                if (_this.getValue() && !utils.isMobile(_this.getValue())) {
                    _this.verify = true;
                    _this.verifyMsg = "座机号格式不对！";
                    _this.showTip(_this.verifyMsg);
                    _this.scrollIntoView();
                    return;
                } else {
                    _this.verify = false;
                }
            } else {
                _this.showTip("未找到对应表单类型！");
            }
        };
    }

    utils.extends(Component, baseClass);

    return Component;
});
