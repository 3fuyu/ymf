define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this,
            layout = [];
        Component.baseConstructor.call(this, config);

        layout.title = '选项';
        cl.createItemLayout(this, layout);

        this.checkListID = this.id + "_radiolist";
        this.plugin[this.checkListID + "_selected"] = function(sender, params) {
            var Re = [];
            for (var i = 0, j = params.selectedValue.length; i < j; i++) {
                Re.push(params.selectedValue[i].name);
            }
            if (_this.curFormRowInstance) {
                _this.curFormRowInstance.datasource[_this.id] = params.selectedValue;
                _this.curFormRowInstance.refs[_this.id].setText(Re.join(","));
            } else {
                //   _this.checkListSelectedData = params.selectedValue;
                this.pageview.refs[_this.id].setText(Re.join(","));
            }
        };

        config.plugin[this.checkListID + "_init"] = function(sender, params) {
            if (_this.isInDetail) {
                // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
                // _this.bindSelectListInitValueInRepeat(sender);
            } else {
                _this.bindSelectListInitValue(sender);
            }
        };
        this.createCheckOrRadioList("checklist");


    }

    utils.extends(Component, baseClass);


    Component.prototype.bindInitValue = function(sender) {

        var selectedArr = [],
            itemArr = this.itemData.values,
            optionsArr = this.itemData.options || [];

        //如果是编辑状态已经有值
        if (itemArr && itemArr.length > 0){
            itemArr.split(',').forEach(function(item, index){
                for (var i = 0, j = optionsArr.length; i < j; i++) {
                    if (optionsArr[i].selectionId === item) {
                        selectedArr.push(optionsArr[i].name);
                    }
                }
            });
            sender.config.text = selectedArr.join(',');
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
    Component.prototype.bindInitAuth = function (sender) {
        var _this = this;
        if(this.authInfo && this.authInfo.readonly) {
            setTimeout(function () {
                sender.setDisabled(true);
                sender.$el.css({
                    opacity: 1
                });
            }, 10);
        }
    };

    Component.prototype.bindInitValueInRepeat = function(sender) {

        // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
        var itemsData = sender.datasource[this.id],
            optionsArr = this.itemData.options || [],
            showArr = [],
            selectedArr = [];

        if(itemsData) {
            //显示控制
            //如果有默认的选中值
            itemsData.split(',').forEach(function(item, index){
                for (var i = 0, j = optionsArr.length; i < j; i++) {
                    if (optionsArr[i].selectionId === item) {
                        showArr.push(optionsArr[i].name);
                        selectedArr.push(item);
                    }
                }
            });
            sender.config.text = showArr.join(",");
        }else {
            //否则使用默认值
            for (var i = 0, j = optionsArr.length; i < j; i++) {
                if (optionsArr[i].defOption) {
                    showArr.push(optionsArr[i].name);
                    selectedArr.push(optionsArr[i]);
                }
            }
            if (showArr.length > 0) {
                sender.config.text = showArr.join(",");
            }
        }
        sender.config.selectedValue = selectedArr;
    };

    Component.prototype.bindSelectListInitValue = function(sender) {
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
    
    // Component.prototype.bindSelectListInitValueInRepeat = function (sender) {
    //     var itemsData = sender.datasource[this.id],
    //         optionsArr = this.itemData.options || [],
    //         selectedArr = [];
    //     if(itemsData) {
    //         itemsData.split(',').forEach(function(item, index){
    //             for (var i = 0, j = optionsArr.length; i < j; i++) {
    //                 if (optionsArr[i].selectionId === item) {
    //                     selectedArr.push(optionsArr[i]);
    //                 }
    //             }
    //         });
    //     }else {
    //         //否则使用默认值
    //         for (var i = 0, j = optionsArr.length; i < j; i++) {
    //             if (optionsArr[i].defOption) {
    //                 selectedArr.push(optionsArr[i]);
    //             }
    //         }
    //     }
    //
    //     sender.config.selectedValue = selectedArr;
    // }

    Component.prototype.getValue = function() {
        return this.plugin.pageview.refs[this.checkListID].selectedValue;
    };

    Component.prototype.getValueWhenItemInRepeat = function(rowInstance) {
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
            }
        }
        return initArr;
    };
    Component.prototype.getConfig = function(rowInstance) {
        var value,
            keyFeature = {},
            featureValue = '',
            _this = this;

        var Config = utils.copy(this.itemData);
        if (rowInstance) {
            value = this.getValueWhenItemInRepeat(rowInstance) || [];
        } else {
            value = this.getValue() || [];
        }
        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }
        var newRe = [];
        if (value instanceof Array){
            for (var i = 0, j = value.length; i < j; i++) {
                newRe.push(value[i].selectionId);
            }
            Config.value = newRe.join(',');
        }else {
            Config.value = value || '';
        }

        // 选项涉及到流程时需要传给后台选项的id和text
        this.itemData.options.forEach(function (value, key) {
            _this.plugin.optionsFlow[value.selectionId] = value.name;
        });

        if (!rowInstance) {
            //对主表单字段才做关键特性的控制显示
            if (this.itemData.crux){
                var selectedValue = this.plugin.pageview.refs[this.checkListID].selectedValue || [],
                    tempArr = [];
                for (var i = 0, j = selectedValue.length; i < j; i++) {
                    tempArr.push(selectedValue[i].name);
                }
                if (tempArr.length > 0) {
                    featureValue = tempArr.join(",");
                }
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
