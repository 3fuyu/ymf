/**
   * desc: 链接组件
   * date: 2017-02-20 16:00
   * author: zero_zheng
   * config: {

     }
*/

define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        var layout = {};
        Component.baseConstructor.call(this, config);

        layout.title = "超链接";
        cl.switchLayout(this, layout);

        this.plugin[this.id + "_focus"] = function(sender, params) {
            // _this.scrollIntoView();
        };

        this.plugin[this.id + "_blur"] = function(sender, params) {
            var value = sender.getValue();

            if (value && !utils.isRealURL(value)) {
                _this.verify = true;
                _this.verifyMsg = (_this.itemData.title || '') + '请输入正确的网址格式';
                _this.scrollIntoView();
                _this.plugin.pageview.showTip({
                    text: "请输入正确的网址格式",
                    duration: 1100
                });
            }else {
                _this.verify = false;
            }
        };
    }

    utils.extends(Component, baseClass);


    return Component;

});
