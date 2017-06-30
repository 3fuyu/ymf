define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        var _this = this;
        Component.baseConstructor.call(this, config);

        this.starNum = config.num || 5;
        this.halfSelect = this.itemData.half ? true : false;
        this.starColor = config.starColor || "#F39801";
        this.defaultstar = this.itemData.defaultstar;
        this.repeatArray = [];
        this.score = 0;

        cl.layoutForScore(this);
        this.plugin[this.id + "_didmount"] = function (sender, params) {
            // 默认选中
            if (_this.defaultstar) {
                setTimeout(function () {
                    var defaultNumber = Math.round(_this.defaultstar);

                    if (_this.halfSelect && (_this.defaultstar+'').indexOf('.') === -1) {
                        // 模拟半选时的全选
                        sender.components[defaultNumber - 1].$el.click();
                        sender.components[defaultNumber - 1].$el.click();
                    } else {
                        sender.components[defaultNumber - 1].$el.click();
                    }
                }, 500);
            }
        };

        if(!this.authInfo.readonly) {
            this.plugin[this.id + "_itemclick"] = function (sender, params) {
                var nowTarget = sender.components[_this.scoreKey];
                _this.score = 0;

                for (var j = 0; j < sender.datasource; j++) {
                    sender.parent.components[j].components[_this.scoreKey].setIcon('cap_e907', {color: _this.starColor});
                    sender.parent.components[j].$el.find('.star_icon i').css({color: _this.starColor});
                    if (j < sender.datasource - 1) {
                        sender.parent.components[j].components[_this.scoreKey].$el.addClass('all');
                    }

                    _this.score += 1;
                }

                for (var k = 4; k > sender.datasource - 1; k--) {
                    sender.parent.components[k].components[_this.scoreKey].$el.addClass('all');

                    sender.parent.components[k].components[_this.scoreKey].setIcon('cap_e908', {color: _this.starColor});
                }

                // 是否开启半选
                if (_this.halfSelect) {
                    if (nowTarget.$el.hasClass('all')) {
                        nowTarget.$el.removeClass('all').addClass('half');
                        nowTarget.setIcon('cap_e909', {color: _this.starColor});
                        _this.score -= 0.5;
                    } else {
                        nowTarget.$el.removeClass('half').addClass('all');
                        nowTarget.setIcon('cap_e907', {color: _this.starColor});
                    }
                }
            };
        }
    }

    utils.extends(Component, baseClass);

    Component.prototype.bindInitValue = function (sender) {
        for (var i = 1; i < this.starNum + 1; i++) {
            this.repeatArray.push(i);
        }

        sender.config.items = this.repeatArray;
    };
    Component.prototype.getValue = function () {
        console.log(this.score);
        return this.score;
    };
    return Component;

});
