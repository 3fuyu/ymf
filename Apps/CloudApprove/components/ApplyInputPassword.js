/**
 * desc: 密码输入框组件
 * date: 2017-02-20 16:00
 * author: zero_zheng
 * config: {

     }
 */
define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        var _this = this,
            layout = {};
        Component.baseConstructor.call(this, config);

        layout.mode = "password";
        layout.title = "密码";
        cl.switchLayout(this, layout);

        this.plugin[this.id + "_focus"] = function (sender, params) {
            // _this.scrollIntoView();
        };
    }

    utils.extends(Component, baseClass);
    return Component;

});
