define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        this.countDownLock = false;
        var layout = {};
        Component.baseConstructor.call(this, config);

        cl.switchIdentifyCodeLayout(this, layout);

        this.itemData.required = true;

        this.plugin[this.id + "_button_click"] = function (sender, params) {
            _this.phone = _this.plugin.pageview.refs[_this.itemData.mobileId].getValue();

            if (!_this.phone) {
                _this.plugin.pageview.showTip({text: "请输入手机号码！", duration: 1000});
                return false;
            }

            if (_this.phone && !utils.isPhone(_this.phone)) {
                _this.plugin.pageview.showTip({text: "手机号格式不对！", duration: 1000});
                return false;
            }

            var time = 60;

            _this.plugin.pageview.ajax({
                url: "sms/sendVerCode",
                type: "GET",
                data: {
                    mobile: _this.phone
                },
                success: function (data) {
                    if (!_this.countDownLock) {
                        _this.countDownLock = true; // 倒计时锁

                        sender.$el.css({
                            borderColor: "#bbb",
                            color: "#aaa"
                        });

                        setTime();
                    }
                },
                error: function () {
                    if (!_this.countDownLock) {
                        _this.countDownLock = true; // 倒计时锁

                        sender.$el.css({
                            borderColor: "#bbb",
                            color: "#aaa"
                        });

                        setTime();
                    }
                }
            });

            function setTime() {
                if (time >= 0) {
                    sender.$el.html(time + ' s');
                    setTimeout(function () {
                        time--;
                        setTime();
                    }, 1000);
                } else {
                    sender.$el.css({
                        borderColor: "#29b6f6",
                        color: "#29b6f6"
                    });
                    sender.$el.html('重新获取');
                    _this.countDownLock = false; // 解锁
                }
            }
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        var smsVerCode = this.plugin.pageview.refs[this.itemData.fieldId].$el.find('input').val();

        return {
            mobile: this.phone || this.plugin.pageview.refs[this.itemData.mobileId].getValue(),
            smsVerCode: smsVerCode
        };
    };

    Component.prototype.getConfig = function (rowInstance) {
        var value;
        var Config = utils.copy(this.itemData);

        value = this.getValue();

        if (!value.smsVerCode) {
            this.plugin.pageview.showTip({text: "请输入验证码! ", duration: 1000});
            return false;
        }

        Config.value = value || '';

        return Config;
    };

    return Component;
});
