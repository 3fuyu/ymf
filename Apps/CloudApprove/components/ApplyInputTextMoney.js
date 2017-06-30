define(["./ApplyBase", "utils", "../parts/common", "../parts/commonLayout"], function (baseClass, utils, c, cl) {
    function Component(config) {
        var _this = this,
            upperCaseLabelKey = '',
            layout = [];
        Component.baseConstructor.call(this, config);

        layout.title = '金额';
        var moneyType = this.itemData.moneyType !== '人民币' ? ('（' + this.itemData.moneyType + '）') : '';
        this.itemData.tips = this.itemData.tips + moneyType;
        cl.createMoneyItemLayout(this, layout);

        if (this.itemData.readonly) {
            this.components[this.id].disabled = true;
        }

        if (this.itemData.numberToChinese && this.isInDetail === false) {
            this.components[this.id].style.marginBottom = 0;

            this.upperCaseKey = this.id + "_upperCase";
            upperCaseLabelKey = this.id + "_upperCaseLabel";
            this.upperCaseLabelValue = this.id + "_upperCasevalue";
            this.components[this.upperCaseKey] = {
                type: "view",
                className: "form-row form-upper-warp bottom-half-line",
                style: utils.processStyle({
                    height: 40,
                    flexDirection: "row",
                    // marginBottom: 1,
                    // borderBottom: "1px solid #ededed",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    // borderTop: "1px solid #ededed"
                }),
                root: [upperCaseLabelKey, this.upperCaseLabelValue]
            };
            this.components[upperCaseLabelKey] = {
                type: "text",
                style: utils.processStyle({
                    width: 60,
                    fontSize: 14,
                    paddingLeft: 15,
                    color: "#262626",
                }),
                text: "大写"
            };
            this.components[this.upperCaseLabelValue] = {
                type: "text",
                ref: true,
                numberofline: 2,
                style: utils.processStyle({
                    flex: 1,
                    justifyContent: "flex-start",
                    paddingRight: 15,
                    fontSize: 13,
                    color: "#999"
                }),
                text: ""
            };
            this.root.push(this.upperCaseKey);

            this.plugin[this.upperCaseLabelValue + "_init"] = function (sender, params) {
                sender.config.text = c.MoneyDX(_this.itemData.value || 0);
            };
        }
        if (this.itemData.numberToChinese && this.isInDetail === true) {
            this.components[this.id].style.marginBottom = 0;

            this.upperCaseKey = this.id + "_upperCase";
            upperCaseLabelKey = this.id + "_upperCaseLabel";
            this.upperCaseLabelValue = this.id + "_upperCasevalue";
            this.components[this.upperCaseKey] = {
                type: "view",
                className: "form-row form-upper-warp bottom-half-line",
                style: utils.processStyle({
                    height: 40,
                    flexDirection: "row",
                    // marginBottom: 1,
                    // borderBottom: "1px solid #ededed",
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    paddingLeft: 13,
                    // borderTop: "1px solid #ededed"
                }),
                root: [upperCaseLabelKey, this.upperCaseLabelValue]
            };
            this.components[upperCaseLabelKey] = {
                type: "text",
                ref: true,
                style: utils.processStyle({
                    width: 94,
                    fontSize: 14,
                    color: "#262626",
                }),
                text: "大写"
            };
            this.components[this.upperCaseLabelValue] = {
                type: "text",
                ref: true,
                numberofline: 2,
                style: utils.processStyle({
                    flex: 1,
                    justifyContent: "flex-start",
                    paddingRight: 15,
                    fontSize: 13,
                    color: "#999"
                }),
                text: ""
            };
            this.root.push(this.upperCaseKey);

            this.plugin[this.upperCaseLabelValue + "_init"] = function (sender, params) {
                sender.config.text = c.MoneyDX(_this.itemData.value || 0);
            };
        }

        this.plugin[this.id + "_keyup"] = function (sender, params) {
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
            _this.setDX();
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

            if (!isNaN(minValue) && !isNaN(curValue) && minValue > curValue) {
                // sender.$el[0].focus();
                _this.verify = true;
                _this.verifyMsg = (_this.itemData.title || '') + '请输入大于' + minValue + '的数字';
                _this.showTip(_this.verifyMsg);
                _this.scrollIntoView();
                return;
            }
            if (!isNaN(maxValue) && !isNaN(curValue) && maxValue < curValue) {
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
            _this.moneySender = sender;

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
        this.plugin[this.id + "_money_setvalue"] = function () {
            _this.setDX();
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.setValue = function (value) {
        this.moneySender.setValue(value);
        this.setDX();
    };
    Component.prototype.setDX = function () {
        var _this = this;
        if (_this.itemData.numberToChinese) {
            if (_this.isInDetail === false) {
                _this.plugin.pageview.delegate(_this.upperCaseLabelValue, function (target) {
                    target.setText(c.MoneyDX(_this.getValue()));
                });
            } else {
                _this.rowInstance.delegate(_this.upperCaseLabelValue, function (target) {
                    target.setText(c.MoneyDX(_this.getValueWhenItemInRepeat(_this.rowInstance)));
                });
            }
        }
    };
    Component.prototype.getConfig = function (rowInstance) {
        var value,
            keyFeatureValue,
            keyFeature = {};
        var Config = utils.copy(this.itemData);

        if (rowInstance) {
            if (this.itemData.numberToChinese){
                keyFeatureValue = rowInstance.refs[this.upperCaseLabelValue].getText() || '';
            } else {
                keyFeatureValue = this.getValueWhenItemInRepeat(rowInstance) || "";
            }

            value = this.getValueWhenItemInRepeat(rowInstance) || "";


        } else {
            if (this.itemData.numberToChinese){
                keyFeatureValue = this.plugin.pageview.refs[this.upperCaseLabelValue].getText() || '';
            } else {
                keyFeatureValue = this.getValue() || "";
            }

            value = this.getValue() || "";

        }
        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }
        if (this.verify) {
            this.showVerifyTip(this.verifyMsg);
            return false;
        }

        //对主表单字段才做关键特性的控制显示
        if (!rowInstance && this.itemData.crux) {
            keyFeature.key = this.itemData.title || '未命名';
            keyFeature.value = keyFeatureValue;
            keyFeature.code = this.itemData.columncode;
            keyFeature.index = this.plugin.keyFeatureIndex;

            this.plugin.keyFeatureIndex++;
        }

        Config.value = value;
        Config.keyFeature = keyFeature;
        return Config;
    };
    return Component;

});
