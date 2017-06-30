define(["utils"], function (utils) {
    function BaseClass(config) {
        var _this = this;
        this.components = config.components;
        this.itemData = config.itemData;
        this.plugin = config.plugin;

        this.id = (this.itemData.fieldId || this.itemData.subFormId).toString();

        this.root = config.root;
        this.DetailInstance = config.DetailInstance; // 如果这个变量不为空的话 那么说明组件是在明细中
        this.isInDetail = true;
        if (!this.DetailInstance) {
            this.isInDetail = false;
        }
        this.isSummaryField = this.itemData.isSummaryField === "1";
        this.pageRoot = this.plugin.pageview.config.root;
        this.isRequired = this.itemData.required;
        this.repeatKey = config.repeatKey;
        this.checkListSelectedData = [];
        this.verify = config.verify;
        this.verifyMsg = config.verifyMsg;
        this.authInfo = config.authInfo;
        this.plugin.keyFeatureIndex = 0;
        _this.plugin.calculateComponent = '';

        config.plugin[this.id + "_init"] = function (sender, params) {
            if (_this.isInDetail) {
                _this.rowInstance = sender.rowInstance;
                _this.bindInitValueInRepeat(sender);
            } else {

                _this.bindInitValue(sender);
                _this.bindInitAuth(sender);
            }
        };
    }

    var labelValueNameArr = ["ApplyInputDate", ""];
    BaseClass.prototype = {
        setAttribute: function (key, value) {
            this[key] = value;
        },
        parseInt: function (str) {
            var strMid = str.toString();
            var len = strMid.length;
            if (len >= 3) {
                var lastStr = strMid.substring(len - 2, len);
                if (lastStr === ".0") {
                    str = parseInt(strMid);
                }
            }
            return str;
        },
        scrollIntoView: function (noNeedCheckDevice) {
            var _this = this;
            if (noNeedCheckDevice !== true) {
                if (!utils.deviceInfo().isAndroid) {
                    return;
                }
            }

            try {
                window.setTimeout(function () {
                    if (_this.isInDetail) {
                        if (_this.rowInstance) {
                            _this.rowInstance.refs[_this.id].$el[0].scrollIntoView();
                        }
                    } else {
                        _this.plugin.pageview.refs[_this.id].$el[0].scrollIntoView();
                        // _this.plugin.pageview.refs[_this.id].$el[0].scrollIntoViewIfNeeded();
                    }
                }, 40);
            } catch (e) {

            }
        },
        bindInitValueInRepeat: function (sender) {
            sender.config.value = sender.datasource[this.id];
        },
        bindInitValue: function (sender) {
            sender.config.value = this.itemData.values;
        },

        /**
         *  主要处理字段权限的控制,各组件如果需要修改控制样式,请在各组件内部重写此方法
         * */
        bindInitAuth: function (sender) {
            var _this = this;
            if (this.authInfo && this.authInfo.readonly) {
                setTimeout(function () {
                    sender.setDisabled(true);
                    sender.$el.css({
                        opacity: '1'
                    });
                }, 10);
            }
        },
        isEnabledConditionField: function () {
            if (!this.plugin.rule) {
                return false;
            }
            var ruleType = this.plugin.rule.activation || 1;
            if (ruleType !== 2) {
                return false;
            }
            var conditions = this.plugin.rule.type_2;
            if (!conditions) {
                return false;
            }
            if (!(conditions instanceof Array)) {
                return false;
            }
            if (conditions.length === 0) {
                return false;
            }
            var Re = false;
            for (i = 0, j = conditions.length; i < j; i++) {
                var conditionItem = conditions[i];
                var itemid = conditionItem.id.toString();
                var idArr = itemid.split(",");
                if (idArr.length === 2) {
                    itemid = idArr[1];
                }
                if (itemid === this.id && conditionItem.enabled.toString() === "1") {
                    Re = true;
                    break;
                }
            }
            return Re;
        },

        convertText: function (text) {
            if (text.indexOf("请选择") >= 0) {
                text = null;
            }
            return text;
        },
        getValue: function () {
            return this.plugin.pageview.refs[this.id].getValue();
        },
        getValueWhenItemInRepeat: function (rowInstance) {
            return rowInstance.refs[this.id].getValue();
        },
        getConfigWhenItemInRepeat: function (rowInstance) {
            return this.getConfig(rowInstance);
        },
        setValue: function (value) {
            return this.plugin.pageview.refs[this.id].setValue(value);
        },
        setValueWhenItemInRepeat: function (rowInstance, value) {
            return rowInstance.refs[this.id].setValue(value);
        },
        getConfigWhenItemInRepeatForSummary: function (rowInstance) {
            var Config = utils.copy(this.itemData);
            var value = this.getValueWhenItemInRepeat(rowInstance) || "";
            Config.value = value;
            return Config;
        },
        getConfig: function (rowInstance) {
            var value,
                keyFeature = {};
            var Config = utils.copy(this.itemData),
                componentKey = this.itemData.componentKey;

            if (rowInstance) {
                value = this.getValueWhenItemInRepeat(rowInstance) || "";

            } else {
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

            //如果是文本或者多行文本
            if (componentKey === 'Text' || componentKey === 'Paragraph') {
                value = this.limitTextLength(value);
            }

            //对主表单字段才做关键特性的控制显示
            if (!rowInstance && this.itemData.crux) {
                keyFeature.key = this.itemData.title || '未命名';
                keyFeature.value = value;
                keyFeature.code = this.itemData.columncode;
                keyFeature.index = this.plugin.keyFeatureIndex;

                this.plugin.keyFeatureIndex++;
            }

            Config.value = value;
            Config.keyFeature = keyFeature;
            return Config;
        },
        showRequiedTip: function (text) {
            this.scrollIntoView(true);
            if (this.itemData.tips) {
                text = this.itemData.tips;
            } else {
                text = (text || this.itemData.title) + "为必填项！";
            }
            this.plugin.pageview.showTip({
                text: text,
                duration: 1100
            });
        },
        showVerifyTip: function (text) {
            this.scrollIntoView(true);
            this.plugin.pageview.showTip({
                text: (text || this.itemData.title),
                duration: 1100
            });
        },
        showTip: function (text) {
            if (!text) {
                return "请输入有效text";
            }
            this.plugin.pageview.showTip({text: text, duration: 1100});
        },
        createCheckOrRadioList: function (type) {
            var _this = this;
            //type radiolist or checklist

            this.components[this.checkListID] = {
                ref: true,
                type: type,
                primaryKey: "id",
                labelKey: "name"
            };
            if (!this.authInfo.readonly) {
                this.plugin[this.wrapKey + "_click"] = function (sender, params) {
                    _this.curFormRowInstance = sender.rowInstance;
                    //   _this.scrollIntoView();
                    this.pageview.refs[_this.checkListID].show();

                    if (_this.curFormRowInstance) {
                        var selectedData = [],
                            selectItem = sender.rowInstance.datasource[_this.id],
                            options = _this.itemData.options || [];

                        //if (type === "radiolist")
                        if (selectItem instanceof Array) {
                            selectedData = utils.copy(selectItem);
                        } else if (selectItem) {
                            selectItem.split(',').forEach(function (item) {
                                for (var i = 0, j = options.length; i < j; i++) {
                                    if (item === options[i].selectionId) {
                                        selectedData.push(options[i]);
                                    }
                                }
                            });

                        } else {
                            for (var i = 0, j = options.length; i < j; i++) {
                                if (options[i].defOption) {
                                    selectedData.push(options[i]);
                                }
                            }
                        }

                        this.pageview.refs[_this.checkListID].setSelectedValue(selectedData);
                    } else {
                        //   selectedData = _this.checkListSelectedData;
                    }

                    // this.checkBoxCtlClick(sender,params);
                };
            }
            var options = this.itemData.options || [];
            for (var i = 0, j = options.length; i < j; i++) {
                options[i].id = i;
                options[i].name = options[i].name;
            }
            this.plugin[this.checkListID + "_loaddata"] = function (sender, params) {
                params.success(options);
            };


            // this.pageRoot.push(this.checkListID);
            var CheckListConfig = this.components[this.checkListID];
            // CheckListConfig.$$pageview = this.plugin.pageview;
            utils.getComponentClass(CheckListConfig, function () {
                var checkListInstance = _this.plugin.pageview._prepareComponent(_this.checkListID, null, null);
                _this.plugin.pageview.$el.append(checkListInstance.$el);

            });
        },
        limitTextLength: function (curValue) {

            // 普通文本200, 多行文本\段落 2000
            var limitNum = 4000,
                chNum = 0,
                text = '请控制在2000个字符以内';

            if (this.itemData.componentKey === 'Text' && !this.itemData.isTextArea) {
                limitNum = 400;
                text = '请控制在200个字符以内'
            }

            var count = curValue.replace(/[^\x00-\xff]/g, "**").length;
            if (count >= limitNum) {
                for (var i = 0; i < count; i++) {
                    if (curValue.charCodeAt(i) > 255)
                        chNum++;
                }

                if (chNum > 200 && limitNum == 400) {
                    chNum = 200;
                }
                if (chNum > 2000 && limitNum == 4000) {
                    chNum = 2000;
                }
                this.plugin.pageview.showTip({text: text, duration: 1100});
                return curValue.substr(0, limitNum - chNum);
            }
            return curValue;
        },

        /**
         *  绑定公式的控件不可操作
         * */
        updateFormulaFieldState: function (resultValues) {
            var _this = this;
            //判断是否有绑定计算的主表单字段
            if (this.itemData.formula) {
                _this.plugin.pageview.delegate(_this.itemData.fieldId, function (outTarget) {
                    outTarget.setDisabled(true);
                    outTarget.$el.css({
                        opacity: 1
                    });
                });
            }
        },
        /**
         *  同步更新统计的运算结果到指定的控件
         * */
        updateFormulaFieldValue: function () {
            var eachInput = [],
                _this = this,
                field = this.itemData.moneyFields || this.itemData.numberFields,
                formulaJSON = '';


            //遍历公式模型,找出模型中依赖的控件
            if (!field) {
                return;
            } else {
                formulaJSON = JSON.parse(field);
            }

            formulaJSON.forEach(function (value) {
                if (value.type === 'field') {
                    eachInput.push(value.value);
                }
            });

            var checkNeedChange = false;

            this.plugin.calculateComponent += this.itemData.fieldId + ';';

            // 对change事件做过滤，之后计算中所有变量都是由其他计算公式计算得来的时候才触发change
            formulaJSON.forEach(function (value) {
                if (value.type === 'field') {
                    if (_this.plugin.calculateComponent.indexOf(value.value) > -1) {
                        checkNeedChange = true;
                    } else {
                        checkNeedChange = false;
                    }
                }
            });

            formulaJSON.forEach(function (value) {
                if (value.type === 'field' && checkNeedChange) {
                    var Formitem = formulaJSON[1];
                    var calculateInput = _this.plugin.pageview.refs[formulaJSON[1].value].$el.find('input');

                    calculateInput.change(function (data) {
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
                                    para.formula[Formitem.value] = _this.itemData.formula;
                                    para[Formitem.value] = this.value || 0;
                                    eachInput.forEach(function (item) {
                                        var decimalDigit = '';
                                        _this.plugin.layoutData.forEach(function (grandItem) {
                                            if (grandItem.fieldId === item) {
                                                decimalDigit = grandItem.decimalPlace;
                                            }
                                        });
                                        para[item] = {};
                                        para[item].decimalDigit = decimalDigit;
                                        para[item].value = _this.plugin.pageview.refs[item].getValue() || 0;
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
                                                _this.setValue(value);
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
                    var input = _this.plugin.pageview.refs[Formitem.value].$el.find('input');
                    // input.unbind();
                    // input.change((function (Formitem) {
                    //     alert(1);console.log('222');
                    // })(Formitem));
                    input.keyup((function (Formitem, _this) {
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
                                        para.formula[Formitem.value] = _this.itemData.formula;
                                        para[Formitem.value] = this.value || 0;
                                        eachInput.forEach(function (item) {
                                            var decimalDigit = '';
                                            _this.plugin.layoutData.forEach(function (grandItem) {
                                                if (grandItem.fieldId === item) {
                                                    decimalDigit = grandItem.decimalPlace;
                                                }
                                            });
                                            para[item] = {};
                                            para[item].decimalDigit = decimalDigit;
                                            para[item].value = _this.plugin.pageview.refs[item].getValue() || 0;
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
                                                    _this.setValue(value);
                                                    _this.plugin.pageview.refs[_this.id].$el.find('input')
                                                    .trigger('change');

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

                    })(Formitem, _this));
                }
            });
        },
    };

    return BaseClass;

});
