define(["./ApplyBase", "utils", "../parts/common"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this,
            layout = [];
        Component.baseConstructor.call(this, config);

        layout.title = '选项';
        c.createItemLayout(this, layout);
        this.checkListID = this.id + "_radiolist";
        this.plugin[this.checkListID + "_selected"] = function (sender, params) {
            if (_this.curFormRowInstance) {
                _this.curFormRowInstance.datasource[_this.id] = params.selectedValue;
                _this.curFormRowInstance.refs[_this.id].setText(params.selectedValue[0].name);
            } else {
                //   _this.checkListSelectedData=  params.selectedValue;
                this.pageview.refs[_this.id].setText(params.selectedValue[0].name);

                if (_this.isEnabledConditionField()) {
                    this.updateApproveLines();
                }
            }
        }
        //1.
        config.plugin[this.checkListID + "_init"] = function (sender, params) {
            if (_this.isInDetail) {
                // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
                // _this.bindSelectListInitValueInRepeat(sender);
            } else {
                _this.bindSelectListInitValue(sender);
            }
        }
        //2
        this.createCheckOrRadioList("radiolist");


    }

    utils.extends(Component, baseClass);


    // 绑定主控件中的数据初始化
    Component.prototype.bindInitValue = function (sender) {
        if (this.itemData.options === "" || this.itemData.options === undefined || this.itemData.options === null) {
            return;
        }

        var selectedArr = [],
            item = this.itemData.values,
            optionsArr = this.itemData.options || [];

        //如果是编辑状态已经有值
        if (item){
            var text = '';
            for (var i = 0, j = optionsArr.length; i < j; i++) {
                if (optionsArr[i].selectionId === item) {
                    text = optionsArr[i].name;
                }
            }
            sender.config.text = text;
        }else {
            //否则使用默认值
            for (var i = 0, j = optionsArr.length; i < j; i++) {
                if (optionsArr[i].defOption) {
                    selectedArr.push(optionsArr[i].name);
                }
            }
            if (selectedArr.length > 0) {
                sender.config.text = selectedArr.join(",");
            }
        }
    };

    Component.prototype.bindSelectListInitValue = function (sender) {

        var selectedArr = [],
            itemArr = this.itemData.values,
            optionsArr = this.itemData.options || [];

        //如果是编辑状态已经有值
        if (itemArr && itemArr.length > 0){

            itemArr.split(',').forEach(function(item, index){
                for (var i = 0, j = optionsArr.length; i < j; i++) {
                    if (optionsArr[i].selectionId === item) {
                        selectedArr.push(optionsArr[i]);
                    }
                }
            });
        }else {
            //否则使用默认值
            for (var i = 0, j = optionsArr.length; i < j; i++) {
                if (optionsArr[i].defOption) {
                    selectedArr.push(optionsArr[i]);
                }
            }
        }

        sender.config.selectedValue = selectedArr;
    };


    Component.prototype.getValue = function () {
        // var _this = this;
        // window.setTimeout(function(){
        //     _this.plugin.pageview.refs[_this.checkListID].selectedValue[0].string
        // },200);

        return this.plugin.pageview.refs[this.checkListID].selectedValue[0].name;

    };
    Component.prototype.getRadioValue = function () {
        return this.plugin.pageview.refs[this.checkListID].selectedValue;

    };
    Component.prototype.bindInitValueInRepeat = function (sender) {

        var itemsData = utils.copy(sender.datasource[this.id]),
            optionsArr = this.itemData.options || [],
            showArr = [];

        if(itemsData) {
            //显示控制
            var text = '';
            for (var i = 0, j = optionsArr.length; i < j; i++) {
                if (optionsArr[i].selectionId === itemsData) {
                    text = optionsArr[i].name;
                }
            }
            sender.config.text = text;
        }else {
            //否则使用默认值
            for (var i = 0, j = optionsArr.length; i < j; i++) {
                if (optionsArr[i].defOption) {
                    showArr.push(optionsArr[i].name);
                }
            }
            if (showArr.length > 0) {
                sender.config.text = showArr.join(",");
            }
        }
    };

    Component.prototype.getValueWhenItemInRepeat = function (rowInstance) {
        if (rowInstance.datasource[this.id]){
            return rowInstance.datasource[this.id];
        }else {
            return this.getDefaultOptions();
        }
    };
    Component.prototype.getDefaultOptions = function () {
        var initArr = [],
            optionsArr = this.itemData.options || [];
        for (var i = 0, j = optionsArr.length; i < j; i++) {
            if (optionsArr[i].defOption) {
                initArr.push(optionsArr[i]);
                break;
            }
        }
        return initArr;
    };
    Component.prototype.getConfig = function (rowInstance) {
        var value = '',
            keyFeature = {},
            featureValue = '',
            _this = this;

        var Config = utils.copy(this.itemData);
        if (rowInstance) {
            value = this.getValueWhenItemInRepeat(rowInstance);
        } else {
            value = this.getRadioValue() || [];
        }

        if (value instanceof Array && value.length > 0) {
            Config.value = value[0].selectionId + '';
        } else if(value) {
            Config.value = value || '';
        } else {
            if (this.isRequired) {
                this.showRequiedTip();
                return false;
            }
        }

        // 选项涉及到流程时需要传给后台选项的id和text
        this.itemData.options.forEach(function (value, key) {
            _this.plugin.optionsFlow[value.selectionId] = value.name;
        });

        if (!rowInstance) {
            //对主表单字段才做关键特性的控制显示
            if (this.itemData.crux){
                var selectedValue = this.plugin.pageview.refs[this.checkListID].selectedValue || [];
                selectedValue.forEach(function (item, index) {
                    featureValue += item.name;
                });
                keyFeature.key = (this.itemData.title || '选项');
                keyFeature.value = featureValue;
                keyFeature.code = this.itemData.columncode;
            }
        }

        Config.keyFeature = keyFeature;

        return Config;
    };


    return Component;

});
