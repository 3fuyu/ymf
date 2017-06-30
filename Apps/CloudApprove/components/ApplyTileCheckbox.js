/**
   * desc: 复选平铺组件
   * date: 2017-02-20 16:00
   * author: zero_zheng
   * config: {

     }
*/
define(["./ApplyBase", "utils", "../parts/common"], function(baseClass, utils, c) {
    function Component(config) {
        var _this = this;
        Component.baseConstructor.call(this, config);
        this.textKey = this.id + "_text";
        this.titleKey = this.id + "_title";
        this.otherKey = this.id + "_other";

        this.root.push(this.titleKey);
        this.root.push(this.id);

        this.components[this.titleKey] = this.getTileCtlTitle(this.itemData.title || '选项');

        // 其他
        if (this.itemData.hasOther) {
            this.root.push(this.otherKey);
        }

        this.components[this.otherKey] = {
            type: "input",
            ref: true,
            placeholder: "请输入其他内容",
            style: utils.processStyle({
                display: "none",
                backgroundColor: "#fff",
                height: 50,
                fontSize: 15,
                // marginBottom: 1,
                borderBottom: "1px solid #ededed",
                paddingLeft: 13,
            })
        };

        this.components[this.id] = {
            type: "repeat",
            selectedMode: 'm',
            ref: true,
            items: [],
            root: ['checkbox_select_icon', this.textKey],
            style: utils.processStyle({
                flexDirection: "row",
                flexWrap: "wrap",
                backgroundColor: "white",
                // marginBottom: 1,
                borderBottom: "1px solid #ededed",
                paddingLeft: 5
            }),
            itemStyle: utils.processStyle({
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                paddingTop: 8,
                paddingBottom: 8,
                paddingLeft: 10,
                paddingRight: 10
            })
        };
        this.components['checkbox_select_icon'] = {
            type: "checkbox",
            selectedClassName: "checkbox-group-selected",
            radioStyle: {
                fontSize: 14,
            },
            selectedStyle: {
                width: 16,
                height: 16,
                fontSize: 14,
                backgroundColor: c.mainColor,
                borderColor: c.mainColor
            },
            style: {
                width: 16,
                height: 16,
                fontSize: 14,
            }
        },
        this.components[this.textKey] = {
            type: "text",
            text_bind: "name",
            style: utils.processStyle({
                fontSize: 14,
                paddingLeft: 5,
                paddingRight: 5,
                color: '#262626'
            })
        };

        //选中
        this.plugin[this.id + "_itemclick"] = function(sender, params) {
            sender.select();
            if (_this.curFormRowInstance) {
                _this.curFormRowInstance.datasource[_this.id] = params.selectedValue[0];
                _this.curFormRowInstance.refs[_this.id].setText(params.selectedValue[0].name);
            } else {
                //   _this.checkListSelectedData=  params.selectedValue;
                // this.pageview.refs[_this.id].setText(params.selectedValue[0].string);
                //TODO: 逻辑待处理
                if (_this.isEnabledConditionField()) {
                    this.updateApproveLines();
                }
            }

            if (sender.datasource.name === '其他' && sender.datasource.type === 'other') {
                if (sender.isSelected) {
                    this.pageview.refs[_this.otherKey].$el.show();
                } else if(this.itemData.hasOther){
                    this.pageview.refs[_this.otherKey].$el.hide();
                }
            }
        };

        this.plugin[this.id + "_iteminit"] = function (sender, params) {
            _this.bindInitItemValue(sender);
        };
    }

    utils.extends(Component, baseClass);

    //数据解析,绑定数据源
    Component.prototype.bindInitValue = function(sender) {

        var optionsRepeatArr = this.itemData.options;

        for (var i = 0, j = optionsRepeatArr.length; i < j; i++) {
            optionsRepeatArr[i].id = i;
            optionsRepeatArr[i].value = optionsRepeatArr[i].name;
        }
        if (this.itemData.hasOther) {
            optionsRepeatArr.push({
                name: "其他",
                defOption: false,
                type: "other"
            });
        }
        sender.config.items = optionsRepeatArr;
    };

    // 绑定repeat中每一个项的选中值
    Component.prototype.bindInitItemValue = function (sender) {
        var datasource = sender.datasource,
            valueArr = '';

        //如果已经选择了值
        if (this.itemData.values){
            valueArr = this.itemData.values.split(',');
            //如果当前的item的selectionId在已经选择的字符串数组中,说明是选中状态
            if ($.inArray(datasource.selectionId, valueArr) !== -1){
                setTimeout(function () {
                    sender.select();
                }, 1000);
            }
        } else {
            //否则按照默认值
            if (datasource.defOption) {
                setTimeout(function () {
                    sender.select();
                }, 1000);
            }
        }
    };

    Component.prototype.getValue = function() {
        return this.plugin.pageview.refs[this.id].selectedItems[0].name;
    };
    Component.prototype.getCheckboxValue = function() {
        var _this = this;

        // 其他选项
        this.plugin.pageview.refs[this.id].selectedItems.forEach(function (value, key) {
            if (value.datasource.name === '其他' && value.datasource.type === 'other') {
                var val = _this.plugin.pageview.refs[_this.otherKey].getValue() || '其他';
                value.datasource.selectionId = "$$hasOther$$" + val;
            }
        });
        return this.plugin.pageview.refs[this.id].selectedItems;
    };

    Component.prototype.getValueWhenItemInRepeat = function(rowInstance) {
        return rowInstance.datasource[this.id];
    };
    Component.prototype.getConfig = function(rowInstance) {
        var value,
            keyFeature = {},
            featureValue = '';

        var Config = utils.copy(this.itemData);
        if (rowInstance) {
            value = [this.getValueWhenItemInRepeat(rowInstance)]  || [];
        } else {
            value = this.getCheckboxValue() || [];

        }
        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }
        var newRe = [];
        for (var i = 0, j = value.length; i < j; i++) {
            if (value[i].selectionId){
                newRe.push(value[i].selectionId);
            }else {
                newRe.push(value[i].datasource.selectionId);
            }

        }

        Config.value = newRe.join(',');

        //对主表单字段才做关键特性的控制显示
        if (this.itemData.crux){
            var selectedValue = this.plugin.pageview.refs[this.id].selectedItems || [],
                tempArr = [];
            for (var i = 0, j = selectedValue.length; i < j; i++) {
                tempArr.push(selectedValue[i].name || selectedValue[i].datasource.name);
            }
            if (tempArr.length > 0) {
                featureValue = tempArr.join(",");
            }
            keyFeature.key = (this.itemData.title || '选项');
            keyFeature.value = featureValue;
            keyFeature.code = this.itemData.columncode;
        }

        Config.keyFeature = keyFeature;
        return Config;
    };

    Component.prototype.getTileCtlTitle = function (title) {
        return {
            type: "text",
            text: title,
            style: utils.processStyle({
                height: 30,
                width: "100%",
                paddingLeft: 13,
                fontSize: 14,
                color: "#262626",
                background: "white"
            })
        };
    };
    return Component;

});
