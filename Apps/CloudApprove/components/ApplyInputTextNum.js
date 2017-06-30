define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this,
            layout = {};
        Component.baseConstructor.call(this, config);

        layout.title = '数字';
        cl.createMoneyItemLayout(this, layout);

        this.plugin[this.id + "_keyup"] = function(sender, params) {
            var repeatItemInstance = sender.rowInstance;
            if (repeatItemInstance) {
                var itemData = _this.itemData;
                if (itemData.isTotal || itemData.average || itemData.maxInGird || itemData.minInGird) {
                    var fromKeyup = true;
                    _this.DetailInstance.updateSummary(fromKeyup);
                }
            }
            if (_this.isEnabledConditionField()) {
                this.updateApproveLines();
            }

            var curValue = parseInt(sender.getValue(), 10),
                strValue = sender.getValue(),
                minValue = parseInt(_this.itemData.min, 10),
                maxValue = parseInt(_this.itemData.max, 10),
                decimalPlace = _this.itemData.decimalPlace;

            if(strValue && strValue.length > 16){
                _this.verify = true;
                _this.showTip('目前只支持16位字符');
                sender.setValue(strValue.substring(0, 16));
            }

            if (!isNaN(minValue) && !isNaN(curValue) && minValue > curValue){
                // sender.$el[0].focus();
                _this.verify = true;
                _this.verifyMsg = (_this.itemData.title || '') + '请输入大于' + minValue + '的数字';
                _this.showTip(_this.verifyMsg);
                _this.scrollIntoView();
                return;
            }
            if (!isNaN(maxValue) && !isNaN(curValue) && maxValue < curValue){
                // sender.$el[0].focus();
                _this.verify = true;
                _this.verifyMsg = (_this.itemData.title || '') + '请输入小于' + maxValue + '的数字';
                _this.showTip(_this.verifyMsg);
                _this.scrollIntoView();
                return;
            }

            if (decimalPlace !== 0 && curValue && strValue.indexOf('.') > -1) {
                var point = strValue.split('.')[1],
                    value = strValue.split('.')[0];
                if (point.length > decimalPlace) {
                    sender.setValue(value + '.' + point.substring(0, decimalPlace));
                }
            }

            _this.verify = false;
        };

        this.plugin[this.id + "_focus"] = function(sender, params) {
            // _this.scrollIntoView();
        };

        this.plugin[this.id + "_blur"] = function (sender, params) {
            var curValue = sender.getValue(),
                decimalPlace = _this.itemData.decimalPlace;

            if (curValue && curValue.indexOf('.') > -1) {
                var point = curValue.split('.')[1],
                    value = curValue.split('.')[0];
                if(decimalPlace !== 0){
                    if (point.length > decimalPlace) {
                        sender.setValue(value + '.' + point.substring(0, decimalPlace));
                    }
                }else {
                    sender.setValue(value);
                }
            }
        };

        this.plugin[this.id + "_didmount"] = function(sender, params) {

            // 如果合计字段被绑定计算，需要在这里注册field，计算时才会触发change
            if (_this.itemData.mainTableField) {
                _this.plugin.calculateComponent += _this.itemData.mainTableField + ';';
            }

            //非明细里面的组件控制
            if (!_this.isInDetail) {
                _this.updateFormulaFieldState();
                setTimeout(function () {
                    _this.updateFormulaFieldValue();
                }, 100);
            }
        };
    }

    utils.extends(Component, baseClass);

    // Component.prototype.bindInitValue = function (sender) {
    //     var values = this.itemData.values;
    //     if(values && values.length > 0){
    //         sender.config.value = values;
    //     }else {
    //         sender.config.value = this.itemData.defaultValue;
    //     }
    // };
    Component.prototype.bindInitValueInRepeat = function (sender) {
        if(sender.datasource[this.id]){
            sender.config.value = (sender.datasource[this.id]);
        }else {
            sender.config.value = this.itemData.defaultValue;
        }

    };
    return Component;

});
