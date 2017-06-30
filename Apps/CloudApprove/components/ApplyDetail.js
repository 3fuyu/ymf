define(["./ApplyBase", "utils", "../parts/common"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this;
        Component.baseConstructor.call(this, config);
        this.isDetail = true;
        this.rootTitleWrap = this.id + "_rootitle";
        this.titleWrap = this.id + "_titlewrap";
        this.itemInstanceArr = [];
        this.repeatKey = this.id;
        this.addBtn = this.id + "_addbtn";
        _this.plugin.calculateDetailComponent = '';

        this.components[this.rootTitleWrap] = {
            type: "text",
            text: "明细表",
            style: utils.processStyle({
                color: "#9E9E9E",
                fontSize: 12,
                marginLeft: 15,
                marginTop: 6,
                marginBottom: 6
            })
        };

        var repeatConfig = {
            type: "repeat",
            ref: true,
            className: "form-repeat",
            style: utils.processStyle({
                flexDirection: "column",
                marginLeft: 15,
                marginRight: 15
            }),
            itemStyle: utils.processStyle({
                width: "100%",
                marginBottom: 10,
                borderRadius: "5px 5px 0 0",
                border: "1px solid #ededed",
                borderBottom: "none"
            }),
            subComponent: this.addBtn,
            items: [{}],
            root: [this.titleWrap]
        };
        var inputs = this.itemData.layoutDetail;

        for (var i = 0, j = inputs.length; i < j; i++) {
            var itemInstance = this.plugin.addSubComponent(inputs[i], this.components, repeatConfig.root, this.repeatKey, this);
            if (itemInstance) {
                this.itemInstanceArr.push(itemInstance);
            }
        }

        this.components[this.titleWrap] = c.getDetailCtlTitle(this.itemData, this.components, this.plugin, this);
        this.components[this.repeatKey] = repeatConfig;
        this.components[this.addBtn] = {
            type: "icon",
            ref: true,
            src: "./imgs/add.png",
            textPos: "right",
            iconStyle: utils.processStyle({
                w: 10,
                lineHeight: "2px"
            }),
            style: utils.processStyle({
                height: 40,
                width: "100%",
                backgroundColor: "#fff",
                margin: "0px auto 10px auto",
                borderRadius: 5
            }),
            textStyle: {
                color: "rgb(2,199,255)",
                lineHeight: "15px",
                fontSize: 14,
                marginLeft: 5
            },
            text: this.itemData.actionname || "增加明细"
        };
        this.summaryRepeatKey = this.id + "_summaryrepeat";

        this.summaryRepeatLabelKey = this.id + "_summaryrepeatlabel";
        this.summaryRepeatLabelValue = this.id + "_summaryrepeatvalue";
        var topview = this.id + "_itemtopview";
        var bottomview = this.id + "_itembottomview";
        this.components[this.summaryRepeatKey] = {
            type: "repeat",
            className: "displaynone",
            items: [],
            style: utils.processStyle({
                flexDirection: "column",
                fontSize: 14,
                paddingBottom: 10
            }),
            itemStyle: utils.processStyle({
                flexDirection: "column",
                padding: "2px 0px 2px 13px"
            }),
            root: [topview, bottomview],
            ref: true
        };
        this.components[topview] = {
            type: "view",
            style: utils.processStyle({
                flexDirection: "row"
            }),
            root: [this.summaryRepeatLabelKey, this.summaryRepeatLabelValue]
        };
        var upperLabel = this.id + "_upperlabel";
        var uppperValue = this.id + "_uppervalue";
        this.components[bottomview] = {
            type: "view",
            className: "displaynone",
            style: utils.processStyle({
                marginTop: 3,
                flexDirection: "row"
            }),
            root: [upperLabel, uppperValue]
        };


        this.components[upperLabel] = {
            type: "text",
            text: "大写",
            style: utils.processStyle({
                color: "#333"
            })
        };
        this.components[uppperValue] = {
            type: "text",
            numberofline: 2,
            style: utils.processStyle({
                color: "#999",
                flex: 1,
                paddingRight: 10,
                marginLeft: 30
            })
        };

        this.components[this.summaryRepeatLabelKey] = {
            type: "text",
            text_bind: "label",
            style: utils.processStyle({
                color: "#333"
            })
        };
        this.components[this.summaryRepeatLabelValue] = {
            type: "text",
            text_bind: "value",
            style: utils.processStyle({
                color: "#999",
                marginLeft: 30
            })
        };

        this.plugin[bottomview + "_init"] = function (sender, params) {
            if (sender.datasource.uppercase === "1") {
                sender.$el.removeClass("displaynone");
            }
        };

        this.plugin[uppperValue + "_init"] = function (sender, params) {
            if (sender.datasource.uppercase === "1") {
                sender.config.text = c.MoneyDX(sender.datasource.value);
            }
        };

        this.root.push(this.rootTitleWrap);
        this.root.push(this.repeatKey);

        this.root.push(this.summaryRepeatKey);

        this.plugin[this.addBtn + "_click"] = function (sender, params) {
            this.repeatAddMoreClick(sender, params);
            _this.repeatEachDetailInstance();
        };

    }

    utils.extends(Component, baseClass);


    Component.prototype.bindInitValue = function (sender) {

        //默认明细行数
        this.defaultRows = this.itemData.defaultRows;
        var inputs = this.itemData.layoutDetail || [];

        var Re = [{}];
        // if (inputs.length === 0 || this.plugin.mode === "NEW" || window.isPreview === true) {} else {
        //     for (var i = 0, j = inputs.length; i < j; i++) {
        //         var item = {};
        //         var ctlData = inputs[i];
        //         var ctlID = ctlData.id.toString();
        //         var values = ctlData.value || [];
        //         for (var ii = 0, jj = values.length; ii < jj; ii++) {
        //             if (!Re[ii]) {
        //                 Re.push({});
        //             }
        //             Re[ii][ctlID] = values[ii];
        //         }
        //
        //     }
        // }
        for (var i = 0, j = inputs.length; i < j; i++) {
            var item = {};
            var ctlData = inputs[i];
            var ctlID = (ctlData.fieldId || ctlData.subFormId).toString();
            var values = ctlData.values || [];

            //如果是新建的时候
            if (this.plugin.mode === "NEW") {
                var defaultRows = this.itemData.defaultRows;

                for (var def = 0; def < defaultRows; def++) {
                    if (!Re[def]) {
                        Re.push({});
                    }
                    Re[def][ctlID] = '';
                }
            } else {
                // if(values instanceof Array){
                //     for (var ii = 0, jj = values.length; ii < jj; ii++) {
                //         if (!Re[ii]) {
                //             Re.push({});
                //         }
                //         Re[ii][ctlID] = values[ii];
                //     }
                // }else {
                //     if (!Re[ii]) {
                //         Re.push({});
                //     }
                //     Re[i][ctlID] = values;
                // }
                for (var ii = 0, jj = values.length; ii < jj; ii++) {
                    if (!Re[ii]) {
                        Re.push({});
                    }
                    Re[ii][ctlID] = values[ii];
                }
            }
        }
        sender.config.items = Re;
    };

    Component.prototype.getSummaryData = function (fromKeyup) {
        var Re = {};
        var Retitle = {};
        var ReCtl = {};
        //以 id为Key value为数值的数组
        var _this = this;
        var isError = false;
        this.plugin.pageview.refs[this.repeatKey].eachItem(function (rowInstance) {

            // rowInstance.delegate();
            var item = {}, itemData = {};
            for (var i = 0, j = _this.itemInstanceArr.length; i < j; i++) {
                item = _this.itemInstanceArr[i];
                itemData = item.itemData;
                // 判断是否有选择了某种运算方式
                if (itemData.isTotal || itemData.average || itemData.maxInGird || itemData.minInGird) {
                    if (!Re[item.id]) {
                        Re[item.id] = [];
                    }
                    var itemResult = item.getConfigWhenItemInRepeatForSummary(rowInstance, true);
                    var ctlType = itemResult.componentKey;
                    var val = 0;
                    ReCtl[item.id] = item;
                    if (ctlType === "DateInterval") {
                        val = _this.getDateDiff(itemResult.value, itemResult.dateType);
                        Retitle[item.id] = itemResult.autocalculatetitle + (itemResult.dateType.toString() === "2" ? "(时)" : "(天)");
                        Re[item.id].push({
                            value: val
                        });

                    } else if (ctlType === "Number") {
                        Retitle[item.id] = itemResult.title;
                        Re[item.id].push({
                            value: itemResult.value,
                            label: itemResult.title
                        });
                    } else if (ctlType === "Money") {
                        Retitle[item.id] = itemResult.title;

                        Re[item.id].push({
                            value: itemResult.value,
                            uppercase: itemResult.uppercase
                        });
                    }
                }

                //如果该子组件有公式
                if (!fromKeyup && itemData.formula) {
                    _this.analysisBindRowItem(rowInstance, item);
                }
            }
        });
        var result = [];
        for (var key in Re) {
            var values = Re[key];
            var resultValues;
            var labelTitle = '(求和)';
            var itemData = ReCtl[key].itemData;
            //itemData.isTotal = false,itemData.minInGird =true;
            if (itemData.isTotal) {
                labelTitle = '(求和)';
                resultValues = this.sumVal(values);
            } else if (itemData.average) {
                labelTitle = '(平均)';
                resultValues = this.avgVal(values);
            } else if (itemData.maxInGird) {
                labelTitle = '(最大)';
                resultValues = this.maxVal(values);
            } else if (itemData.minInGird) {
                labelTitle = '(最小)';
                resultValues = this.minVal(values);
            }
            // 更新的是主表字段
            _this.updateMainTableFieldValue(itemData, resultValues);

            ReCtl[key].itemData.summaryvalue = resultValues;

            // 主表字段更新就更新了,但是明细里面的合计,要根据是否勾选 "列运算"和 "子表中是否显示合计"

            if (itemData.isOperationRule && itemData.showOperValueInGird) {
                result.push({
                    label: (Retitle[key] || "") + labelTitle,
                    value: resultValues,
                    uppercase: values[0].uppercase || "0"
                });
            }
        }

        return result;
    };

    /**
     *  遍历明细组件中的子组件,如果该子组件有公式,则给该组件依赖的其他组件绑定光标离开的事件
     *
     * */
    Component.prototype.repeatEachDetailInstance = function () {
        var _this = this;
        var length = this.plugin.pageview.refs[this.repeatKey].components.length;
        this.plugin.pageview.refs[this.repeatKey].eachItem(function (rowInstance, index) {
            var item = {}, itemData = {};
            if (index === length - 1) {
                for (var i = 0, j = _this.itemInstanceArr.length; i < j; i++) {
                    item = _this.itemInstanceArr[i];
                    itemData = item.itemData;
                    //如果该子组件有公式
                    if (itemData.formula) {
                        _this.analysisBindRowItem(rowInstance, item);
                    }
                }
            }
        });
    };

    /**
     *  同步更新统计的运算结果到指定的--[主表字段]
     * */
    Component.prototype.updateMainTableFieldValue = function (itemData, resultValues) {
        var _this = this;
        //判断是否有绑定合计的主表单字段
        if (itemData.mainTableField) {

            _this.plugin.pageview.delegate(itemData.mainTableField, function (outTarget) {

                // 如果合计字段被绑定计算，需要在这里触发change
                outTarget.$el.find('input').trigger('change');
                outTarget.setDisabled(true);
                outTarget.$el.css({
                    opacity: 1
                });
                outTarget.setValue(resultValues || 0);
                // $(outTarget).change();
                // $(outTarget).trigger('blur');

                // for 合计中 money 大写
                if (_this.plugin[itemData.mainTableField + '_money_setvalue']) {
                    _this.plugin[itemData.mainTableField + '_money_setvalue']();
                }
            });
        }
    };

    /**
     *   解析:(被设置计算的控件)中需要绑定数值改变的其他控件
     * */
    Component.prototype.analysisBindRowItem = function (rowInstance, rowItem) {
        var _this = this;

        var field = rowItem.itemData.moneyFields || rowItem.itemData.numberFields,
            formulaJSON = JSON.parse(field),
            eachInput = [];

        //被绑定计算的控件,不可编辑状态设置
        rowInstance.delegate(rowItem.itemData.fieldId, function (outTarget) {
            outTarget.setDisabled(true);
            outTarget.$el.css({
                opacity: 1
            });

            //遍历公式模型,找出模型中依赖的控件
            if (!formulaJSON) {
                return;
            }

            formulaJSON.forEach(function (value) {
                if (value.type === 'field') {
                    eachInput.push(value.value);
                }
            });

            var checkNeedChange = false;

            _this.plugin.calculateDetailComponent += rowItem.itemData.fieldId + ';';

            // 对change事件做过滤，之后计算中所有变量都是由其他计算公式计算得来的时候才触发change
            formulaJSON.forEach(function (value) {
                if (value.type === 'field') {
                    if (_this.plugin.calculateDetailComponent.indexOf(value.value) > -1) {
                        checkNeedChange = true;
                    } else {
                        checkNeedChange = false;
                    }
                }
            });

            formulaJSON.forEach(function (Formitem, index) {
                if (Formitem.type === 'field' && checkNeedChange) {
                    var input = rowInstance.refs[Formitem.value].$el.find('input');

                    // 对已经是计算的字段再次计算所做的逻辑（不能触发keyup就用change）
                    input.change(function (data) {
                        var timeout = '',
                            interval = '';

                        // 500ms 内多次触发只发起一次请求
                        if (timeout) {
                            clearTimeout(timeout);
                        }

                        timeout = setTimeout(function () {
                            // 避免计算嵌套，等一次计算返回结果后再进行下次计算
                            interval = setInterval(function () {
                                if (!window.calculateLock) { // 计算锁
                                    clearInterval(interval);
                                    window.calculateLock = true;

                                    var para = {};
                                    para.formula = {};
                                    para.formula[Formitem.value] = rowItem.itemData.formula;
                                    para[Formitem.value] = this.value || 0;
                                    eachInput.forEach(function (item) {
                                        var decimalDigit = '';
                                        _this.itemData.layoutDetail.forEach(function (grandItem) {
                                            if (grandItem.fieldId === item) {
                                                decimalDigit = grandItem.decimalPlace;
                                            }
                                        });
                                        para[item] = {};
                                        para[item].decimalDigit = decimalDigit;
                                        para[item].value = rowInstance.refs[item].getValue() || 0;
                                    });
                                    para = JSON.stringify(para);

                                    //被作为计算条件的控件,改变的时候,开始做网络请求并更新数据
                                    _this.plugin.pageview.ajax({
                                        url: "formula/calculation",
                                        type: "POST",
                                        contentType: "application/json; charset=UTF-8",
                                        data: para,
                                        success: function (data) {
                                            window.calculateLock = false;

                                            _this.plugin.pageview.hideLoading(true);
                                            if (data.success) {
                                                var value = data.data[Formitem.value];
                                                rowItem.setValueWhenItemInRepeat(rowInstance, value);
                                            } else {
                                                _this.plugin.pageview.showTip({text: data.msg, duration: 1000});
                                            }
                                        },
                                        error: function (err) {
                                            window.calculateLock = false;

                                            console.error('network error');
                                        }
                                    });
                                }
                            }, 50);
                        }, 500);
                    });
                }
            });

            //遍历公式模型,为每一个被依赖的控件,增加blur方法
            formulaJSON.forEach(function (Formitem, index) {
                // 为每一个被依赖的控件, blur被触发的时候,需要发起网络请求,计算被绑定的控件的新值
                if (Formitem.type === 'field') {
                    var input = rowInstance.refs[Formitem.value].$el.find('input');
                    // input.unbind();
                    input.keyup((function (rowInstance, rowItem, _this) {
                        var timeout = '',
                            interval = '';
                        return function () {
                            // 500ms 内多次触发只发起一次请求
                            if (timeout) {
                                clearTimeout(timeout);
                            }

                            timeout = setTimeout(function () {
                                // 避免计算嵌套，等一次计算返回结果后再进行下次计算
                                interval = setInterval(function () {
                                    if (!window.calculateLock) { // 计算锁
                                        clearInterval(interval);
                                        window.calculateLock = true;

                                        var para = {};
                                        para.formula = {};
                                        para.formula[Formitem.value] = rowItem.itemData.formula;
                                        para[Formitem.value] = this.value || 0;
                                        eachInput.forEach(function (item) {
                                            var decimalDigit = '';
                                            _this.itemData.layoutDetail.forEach(function (grandItem) {
                                                if (grandItem.fieldId === item) {
                                                    decimalDigit = grandItem.decimalPlace;
                                                }
                                            });
                                            para[item] = {};
                                            para[item].decimalDigit = decimalDigit;
                                            para[item].value = rowInstance.refs[item].getValue() || 0;
                                        });
                                        para = JSON.stringify(para);

                                        _this.plugin.pageview.ajax({
                                            url: "formula/calculation",
                                            type: "POST",
                                            contentType: "application/json; charset=UTF-8",
                                            data: para,
                                            success: function (data) {
                                                window.calculateLock = false;
                                                _this.plugin.pageview.hideLoading(true);
                                                if (data.success) {
                                                    var value = data.data[Formitem.value];
                                                    rowItem.setValueWhenItemInRepeat(rowInstance, value);

                                                    _this.plugin.pageview.refs[_this.id].$el.find('input')
                                                    .trigger('change');

                                                    _this.updateSummary(true);
                                                } else {
                                                    _this.plugin.pageview.showTip({text: data.msg, duration: 1000});
                                                }
                                            },
                                            error: function (err) {
                                                window.calculateLock = false;
                                                console.error('network error');
                                            }
                                        });
                                    }
                                }, 50);
                            }, 500);
                        };
                    })(rowInstance, rowItem, _this));
                }
            });
        });

    };

    Component.prototype.bindValue = function (valueArr) {

    };

    Math.formatFloat = function (f, digit) {

    };

    /**
     *  计算表单明细中需要计算的总和
     * */
    Component.prototype.sumVal = function (valueArr) {
        var Re = [];
        var sum = 0;
        var digit = 0;
        var maxDigit = 0;
        for (var i = 0, j = valueArr.length; i < j; i++) {
            var val = valueArr[i].value.toString();
            var var_arr = val.split(".");
            if (var_arr.length === 2) {
                digit = var_arr[1].length;
                if (digit > maxDigit) {
                    maxDigit = digit;
                }
            }
            try {
                val = parseFloat(val);
                if (!isNaN(val)) {
                    Re.push(val);
                }
            } catch (e) {

            }
        }

        //精度丢失
        if (maxDigit > 0) {
            var m = Math.pow(10, maxDigit);
            for (var ii = 0, jj = Re.length; ii < jj; ii++) {
                sum += Math.round((Re[ii] * m) * 1000) / 1000;
            }
            sum = sum / m;
        } else {
            for (var iii = 0, jjj = Re.length; iii < jjj; iii++) {
                sum += Re[iii];
            }
        }
        //    if(maxDigit>0){
        //          var m = Math.pow(10, maxDigit);
        //          Re = parseInt(Re * m, 10) / m;
        //    }
        return this.parseInt(sum);
    };
    /**
     *  计算表单明细中需要计算的平均值
     * */
    Component.prototype.avgVal = function (valueArr) {
        var sum = this.sumVal(valueArr),
            avg = 0;
        if (valueArr.length) {
            avg = sum / valueArr.length;
        }
        return this.parseInt(avg);
    };
    /**
     *  计算表单明细中需要计算的最大值
     * */
    Component.prototype.maxVal = function (valueArr) {
        var newArr = [];
        valueArr.forEach(function (item) {
            newArr.push(item.value);
        });
        return Math.max.apply(Math, newArr);
    };
    /**
     *  计算表单明细中需要计算的最小值
     * */
    Component.prototype.minVal = function (valueArr) {
        var newArr = [];
        valueArr.forEach(function (item) {
            newArr.push(item.value);
        });
        return Math.min.apply(Math, newArr);
    };

    Component.prototype.getDateDiff = function (arr, dateType) {
        if (!(arr instanceof Array)) {
            return 0;
        }
        if (arr.length != 2) {
            return 0;
        }
        var startTime = arr[0];
        if (!startTime || startTime === "") {
            return 0;
        }
        var endTime = arr[1];
        if (!endTime || endTime === "") {
            return 0;
        }

        var startTimeObj = utils.convertToDate(startTime);
        var endTimeObj = utils.convertToDate(endTime);
        var diff = endTimeObj - startTimeObj;
        if (dateType.toString() === "2") {
            diff = (diff / (60 * 60 * 1000)).toFixed(1);
        } else {
            diff = diff / (24 * 60 * 60 * 1000) + 1;
        }
        diff = this.parseInt(diff);

        return diff;
    };
    Component.prototype.updateSummary = function (fromKeyup) {
        var _this = this;

        //同步更新统计的运算结果到表单明细底部
        this.plugin.pageview.delegate(this.summaryRepeatKey, function (target) {

            setTimeout(function () {
                target.bindData(_this.getSummaryData(fromKeyup));
            }, 900);
            target.$el.removeClass("displaynone");
        });

        this.plugin.pageview.delegate(this.addBtn, function (target) {
            target.$el.css({
                marginBottom: 4
            });
        });
    };

    Component.prototype.getConfig = function () {
        var _this = this;
        var Config = utils.copy(this.itemData);
        var Re = {};
        var isError = false,
            tableName = Config.tableName || '',
            pk_sub_bo = Config.pk_sub_bo || '',
            dataTableConfig = [],
            pkValue = '';

        if (this.plugin.subFormPk && this.plugin.subFormPk[this.itemData.tableName]) {
            pkValue = this.plugin.subFormPk[this.itemData.tableName];
        }

        //以控件ID为key，value为数组 存储控件的配置  然后在将 value合并成一个控件配置
        this.plugin.pageview.refs[this.repeatKey].eachItem(function (rowInstance) {
            var ReapetItemObj = {};

            // 编辑时新增字表pkValue传空
            if (!$.isEmptyObject(rowInstance.datasource)) {
                ReapetItemObj.pkValue = pkValue;
            } else {
                ReapetItemObj.pkValue = '';
            }
            ReapetItemObj.tableName = tableName;
            ReapetItemObj.formData = [];

            for (var i = 0, j = _this.itemInstanceArr.length; i < j; i++) {
                var item = _this.itemInstanceArr[i],
                    itemResult = item.getConfigWhenItemInRepeat(rowInstance),
                    itemObj = {};
                if (itemResult === false) {
                    isError = true;
                    break;
                }
                itemObj.name = itemResult.columncode;
                itemObj.type = itemResult.componentKey;
                itemObj.value = itemResult.value;

                ReapetItemObj.formData.push(itemObj);
            }
            dataTableConfig.push(ReapetItemObj);

        });
        if (isError === true) {
            return false;
        }

        // var inputs = Config.layoutDetail;
        // var inputLen = inputs.length;
        // for (var i = 0; i < inputLen; i++) {
        //     var childConfig = inputs[i];
        //
        //     var childId = childConfig.fieldId.toString();
        //     var childData = Re[childId];
        //
        //     childConfig.value = [];
        //     for (var ii = 0, jj = childData.length; ii < jj; ii++) {
        //         childConfig.value.push(childData[ii].value);
        //     }
        // }

        // 过滤掉整行为空 以下标字符串为键
        // var emptyDict = {};
        // for (var n = 0; n < inputLen; n++) {
        //     var itemConfig = inputs[n];
        //     var itemValueArr = itemConfig.value;
        //     for (var nn = 0, mm = itemValueArr.length; nn < mm; nn++) {
        //         if (emptyDict[nn.toString()] === undefined || emptyDict[nn.toString()] === null) {
        //             emptyDict[nn.toString()] = true;
        //         }
        //         var itemvalue = itemValueArr[nn];
        //         if (itemvalue !== undefined && itemvalue !== null && $.trim(itemvalue) !== "") {
        //             emptyDict[nn.toString()] = false;
        //         }
        //     }
        // }


        //删除为空的行
        // for (var k = 0; k < inputLen; k++) {
        //     var itemConfig = inputs[k];
        //     var itemValueArr = itemConfig.value;
        //     for (var kk = itemValueArr.length - 1; kk >= 0; kk--) {
        //         if (emptyDict[kk.toString()] === true) {
        //             itemValueArr.splice(kk, 1);
        //         }
        //     }
        // }

        return dataTableConfig;
    };

    return Component;

});
