define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this,
            layout = [];
        Component.baseConstructor.call(this, config);

        layout.title = "邮箱";
        cl.switchLayout(this, layout);

        this.plugin[this.id + "_blur"] = function(sender, params) {

            if (_this.getValue() && !utils.isEmail(_this.getValue())) {
                _this.setAttribute('verify', true);
                _this.setAttribute('verifyMsg', _this.itemData.title + '格式错误！');

                _this.showTip("邮箱格式错误！");
            } else {
                _this.setAttribute('verify', false);
            }
        };
    }

    utils.extends(Component, baseClass);

    return Component;
});
