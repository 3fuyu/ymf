define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        var _this = this,
            layout = [];
        Component.baseConstructor.call(this, config);

        layout.title = '百分比';
        cl.createMoneyItemLayout(this, layout);

        this.plugin[this.id + "_focus"] = function (sender, params) {
            var now = sender.getValue(),
                processNum = '';

            if (now.indexOf('.') > -1) {
                processNum = (parseFloat(now.split('%')[0])).toFixed(2);
            } else {
                processNum = parseFloat(now.split('%')[0]);
            }

            if (now) {
                sender.setValue(processNum);
            }
        };

        this.plugin[this.id + "_blur"] = function (sender, params) {
            var now = sender.getValue(),
                percent = now + '';

            if (percent.indexOf('.') > -1) {
                percent = parseFloat(percent).toFixed(2);
            }

            percent += '%';

            if (now) {
                sender.setValue(percent);
            }
        };
    }

    utils.extends(Component, baseClass);

    return Component;

});
