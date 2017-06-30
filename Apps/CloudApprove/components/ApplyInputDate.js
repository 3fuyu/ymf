define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this,
            layout = {};
        Component.baseConstructor.call(this, config);

        layout.title = '日期';
        c.createItemLayout(this, layout);
        var dateType = this.itemData.format.toLowerCase();

        switch (dateType) {
            case "yyyy-mm-dd":
                this.dateType = '1';
                break;
            case "yyyy-mm-dd hh:mm":
                this.dateType = '2';
                break;
            case "hh:mm:ss":
                this.dateType = '3';
                break;
            case "yyyy-mm":
                this.dateType = '4';
                break;
            default:
                console.error('时间控件未指定准确类型');
                break;
        }
        if (!this.authInfo.readonly && !this.itemData.isReadonly) {
            this.plugin[this.id + "_warp_click"] = function (sender, params) {
                _this.scrollIntoView();
                if (_this.dateType.toString() === "2") {
                    this.yyyyMMddhhssTimePicker.sender = sender;
                    this.yyyyMMddhhssTimePicker.curDateBetweenInstance = null;
                    this.yyyyMMddhhssTimePicker.curDateInstance = _this;
                    this.yyyyMMddhhssTimePicker.show(_this.getText(sender));
                } else if (_this.dateType.toString() === '4') {
                    this.yyyyMMTimePicker.sender = sender;
                    this.yyyyMMTimePicker.curDateBetweenInstance = null;
                    this.yyyyMMTimePicker.curDateInstance = _this;
                    this.yyyyMMTimePicker.show(_this.getText(sender));
                } else {
                    this.yyyyMMddTimePicker.sender = sender;
                    this.yyyyMMddTimePicker.curDateBetweenInstance = null;
                    this.yyyyMMddTimePicker.curDateInstance = _this;
                    this.yyyyMMddTimePicker.show(_this.getText(sender));
                }
            };
        }

        if (this.itemData.isSystemDate) {
            this.plugin[this.id + "_init"] = function (sender, params) {
                var format = '';

                if (_this.itemData.format.toLowerCase() === 'yyyy-mm-dd hh:mm') {
                    format = 'yyyy-MM-dd hh:mm';
                } else if (_this.itemData.format.toLowerCase() === 'yyyy-mm-dd') {
                    format = 'yyyy-MM-dd';
                } else if (_this.itemData.format.toLowerCase() === 'yyyy-mm') {
                    format = 'yyyy-MM';
                }

                sender.config.text = utils.ConvertDateToStr(new Date(), format);
            };
        }
    }

    utils.extends(Component, baseClass);

    Component.prototype.setValue = function (str, sender) {
        var repeatRowInstance = sender.rowInstance;
        if (repeatRowInstance) {
            repeatRowInstance.refs[this.id].setText(str);
        } else {
            this.plugin.pageview.refs[this.id].setText(str);
        }

        if (this.plugin[this.id + "_change"]) {
            this.plugin[this.id + "_change"].call(this.plugin, str, sender);
        }
    };
    Component.prototype.bindInitValueInRepeat = function (sender) {
        var val = sender.datasource[this.id] || "";
        if (val.length > 0) {
            sender.config.text = val;
        }
    };
    Component.prototype.bindInitValue = function (sender) {
        // 编辑时设默认值
        if (this.plugin.mode === 'MODIFY') {
            sender.config.text = this.itemData.values;
        }
    };

    Component.prototype.getValue = function () {
        var text = this.plugin.pageview.refs[this.id].getText();
        if (text.indexOf("请选择") >= 0) {
            text = null;
        }
        return text;
    };
    Component.prototype.getValueWhenItemInRepeat = function (rowInstance) {
        var text = rowInstance.refs[this.id].getText();
        if (text.indexOf("请选择") >= 0) {
            text = null;
        }
        return text;
    };
    Component.prototype.getText = function (sender) {
        var text = null;

        var repeatRowInstance = sender.rowInstance;
        if (repeatRowInstance) {
            text = repeatRowInstance.refs[this.id].getText();
        } else {
            text = this.plugin.pageview.refs[this.id].getText();
        }
        if (!text || text.indexOf("请选择") >= 0) {
            text = null;
        }
        return text;
    };
    
    return Component;

});
