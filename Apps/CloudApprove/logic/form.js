define(["../parts/timepicker", "../parts/common", "utils",
    "../components/ApplyDetail",
    "../components/ApplyInputDateCalculate",
    "../components/ApplyInputDate",
    "../components/ApplyInputCheckbox",
    "../components/ApplyInputDateBetween",
    "../components/ApplyInputRadio",
    "../components/ApplyLayout",
    "../components/ApplyInputText",
    "../components/ApplyInputTextarea",
    "../components/ApplyInputTextNum",
    "../components/ApplyImage",
    "../components/ApplyInputTextMoney",
    "../components/ApplyInputString",
    "../components/ApplyInputEmail",
    "../components/ApplyInputMobile",
    "../components/ApplyScore",
    "../components/ApplyInputTextPercent",
    "../components/ApplyTileRadio",
    "../components/ApplyTileCheckbox",
    "../components/ApplyInputPassword",
    "../components/ApplyInputLink",
    "../components/ApplySwitch",
    "../components/ApplyViewImage",
    "../components/ApplyDividingLine",
    "../components/ApplyBillMaker",
    "../components/ApplyCodeRule",
    "../components/ApplyReference",
    "../components/ApplyEmployee",
    "../components/ApplyDepartment",
    "../components/ApplyBillMakerManager",
    "../components/ApplyBillMakerOrg",
    "../components/ApplyFile",
    "../components/ApplyTaskComment",
    "../components/ApplyBillMakerPost",
    "../components/ApplyIdentifyCode",

    "../../../components/dialog"
], function (timepicker, c, utils, ApplyDetail, ApplyInputDateCalculate, ApplyInputDate, ApplyInputCheckbox, ApplyInputDateBetween, ApplyInputRadio, ApplyLayout, ApplyInputText, ApplyInputTextarea, ApplyInputTextNum, ApplyImage, ApplyInputTextMoney, ApplyInputString, ApplyInputEmail, ApplyInputMobile, ApplyScore, ApplyInputTextPercent, ApplyTileRadio, ApplyTileCheckbox, ApplyInputPassword, ApplyInputLink, ApplySwitch, ApplyViewImage, ApplyDividingLine, ApplyBillMaker, ApplyCodeRule, ApplyReference, ApplyEmployee, ApplyDepartment, ApplyBillMakerManager, ApplyBillMakerOrg, ApplyFile, ApplyTaskComment, ApplyBillMakerPost, ApplyIdentifyCode, Dialog) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        var _this = this;
        this.itemDict = {};
        this.mode = this.pageview.params.formType;
        this.isFreeApprove = false;
        this.isQrRreview = this.pageview.params.qrcodepreview === "1";
        this.templateid = (this.pageview.params.templateid);//模版ID
        this.id = (this.pageview.params.id);//用户提交的单据ID
        this.isPreview = this.pageview.params.preview === "1";
        this.source = this.pageview.params.source || '';//是新表单还是旧表单的标志
        this.taskDefinitionKey = this.pageview.params.taskDefinitionKey;// 流程ID
        this.autoFields = []; // 自动编号需要的数组
        this.formName = this.pageview.showPageParams.formName || decodeURI(this.pageview.params.title) || '';

        this.share = this.pageview.params.share || '';//是否是分享过来的
        this.tenantId = this.pageview.params.tenantId || '';
        this.shareTenantId = ''; // enterform得到的参数(分享专用)
        this.shareUserId = '';

        this.pk_boins = '';//editform 会拿到的参数(编辑提交的时候使用)
        this.procInstName = this.pageview.params.procInstName || decodeURI(this.pageview.params.procInstName) || '';//详情过来的流程实例名称(编辑提交的时候使用)
        this.optionsFlow = {};

        if (!this.isPreview) {

            this.loadData();
        } else {
            $(document.body).addClass("pc-zoom");
            window.isPreview = true;
            window.previewPlugin = this;
        }
        if (this.isQrRreview) {
            window.isPreview = true;
        }

        this.year = (new Date()).getFullYear();
        this.itemInstanceArr = [];
        //全月控件,yyyy-MM
        this.yyyyMMTimePicker = new timepicker();
        this.yyyyMMTimePicker.mapping.yyyy.start = (1910);
        this.yyyyMMTimePicker.mapping.yyyy.end = (this.year + 20);
        this.yyyyMMTimePicker.setMode("yyyy-MM").setParent(this.pageview.$el[0]).done()
            .bind("clear", function () {
            })
            .bind("ok", function (valStr) {
                if (_this.yyyyMMTimePicker.curDateInstance) {
                    _this.yyyyMMTimePicker.curDateInstance.setValue(valStr, _this.yyyyMMTimePicker.sender);
                } else if (_this.yyyyMMTimePicker.curDateBetweenInstance) {

                    _this.yyyyMMTimePicker.curDateBetweenInstance.setSingleValue(valStr, _this.yyyyMMTimePicker.curDateBetweenInstanceIndex, _this.yyyyMMTimePicker.sender);
                }

            })
            .bind("cancel", function () {
            });
        //全天日程控件,yyyy-MM-dd
        this.yyyyMMddTimePicker = new timepicker();
        this.yyyyMMddTimePicker.mapping.yyyy.start = (1910);
        this.yyyyMMddTimePicker.mapping.yyyy.end = (this.year + 20);
        this.yyyyMMddTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
            .bind("clear", function () {
            })
            .bind("ok", function (valStr) {
                if (_this.yyyyMMddTimePicker.curDateInstance) {
                    _this.yyyyMMddTimePicker.curDateInstance.setValue(valStr, _this.yyyyMMddTimePicker.sender);
                } else if (_this.yyyyMMddTimePicker.curDateBetweenInstance) {

                    _this.yyyyMMddTimePicker.curDateBetweenInstance.setSingleValue(valStr, _this.yyyyMMddTimePicker.curDateBetweenInstanceIndex, _this.yyyyMMddTimePicker.sender);
                }
            })
            .bind("cancel", function () {
            });
        //非全天日程控件,yyyy-MM-dd hh:mm
        this.yyyyMMddhhssTimePicker = new timepicker();
        this.yyyyMMddhhssTimePicker.mapping.yyyy.start = (1910);
        this.yyyyMMddhhssTimePicker.mapping.yyyy.end = (this.year + 20);
        this.yyyyMMddhhssTimePicker.setMode("yyyy-MM-dd hh:mm").setParent(this.pageview.$el[0]).done()
            .bind("clear", function () {
            })
            .bind("ok", function (valStr) {
                if (_this.yyyyMMddhhssTimePicker.curDateInstance) {
                    _this.yyyyMMddhhssTimePicker.curDateInstance.setValue(valStr, _this.yyyyMMddhhssTimePicker.sender);
                } else if (_this.yyyyMMddhhssTimePicker.curDateBetweenInstance) {
                    _this.yyyyMMddhhssTimePicker.curDateBetweenInstance.setSingleValue(valStr, _this.yyyyMMddhhssTimePicker.curDateBetweenInstanceIndex, _this.yyyyMMddhhssTimePicker.sender);
                }
            })
            .bind("cancel", function () {
            });

        this.setHeader();
    }

    pageLogic.prototype = {
        onPageResume: function () {
            this.setHeader();

        },
        setHeader: function () {
            try {
                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: this.formName || "审批",
                    rightTitle: "",
                    rightValues: [],
                }, function (b) {

                });
            } catch (e) {
                this.setH5Header();
            }
        },
        setH5Header: function () {

        },
        approve_line_repeat_itemclick: function (sender, params) {
            if (this.isFreeApprove) {
                sender.remove();
            }
        },
        getItemTitle: function (item) {
            if (item.type === "ApplyInputDateBetween") {
                return (item.title || "") + "-" + (item.title1 || "");
            } else {
                return (item.title);
            }
        },
        pushTitle: function (item, titleArr) {
            if (item.type === "ApplyInputString") {
                return false;
            }
            titleArr.push(this.getItemTitle(item) + "$$xz" + item.id);
        },
        getExcelContent: function (config) {
            var titleArr = [];
            var detailInfoArr = [];
            for (var i = 0, j = config.length; i < j; i++) {
                var item = config[i];
                if (this.pushTitle(item, titleArr) === false) {
                    continue;
                }
                if (item.type === "ApplyLayout" && item.isChildForm === "1") {
                    var inputs = item.inputs || [];
                    var startIndex = -1;
                    var endIndex = -1;
                    for (var ii = 0, jj = inputs.length; ii < jj; ii++) {
                        var inputItem = inputs[ii];
                        if (this.pushTitle(inputItem, titleArr, true) === false) {
                            continue;
                        }
                        if (startIndex === -1) {
                            startIndex = titleArr.length - 1;
                        }
                        endIndex = titleArr.length - 1;
                    }

                    var detailRowCount = 0;
                    if (inputs.length > 0) {
                        detailRowCount = inputs[0].value.length;
                    }
                    detailInfoArr.push({
                        detailItem: item,
                        detailRowCount: detailRowCount
                    });
                }
            }
            var content = {
                title: titleArr
            };
            this.getExcelContentValue(content, detailInfoArr, config, titleArr);

            for (var iii = 0, jjj = content.title.length; iii < jjj; iii++) {
                content.title[iii] = content.title[iii].split("$$xz")[0];
            }
            return content;
        },
        getExcelContentValue: function (re, detailInfoArr, config, titleArr) {
            var content = [];
            if (detailInfoArr.length === 0) {
                //没有详情
                var itemData = [];
                for (var i = 0, j = config.length; i < j; i++) {
                    if (config[i].type === "ApplyInputString") {
                        continue;
                    }
                    itemData.push(this.formartValue(config[i].value, config[i]));
                }
                content.push(itemData);
            } else {
                //第一层循环 循环明细个数
                //第二层循环 循环明细的条数
                for (var len = 0; len < detailInfoArr.length; len++) {
                    var singleDetail = detailInfoArr[len];
                    var singleDetailConfig = singleDetail.detailItem;
                    var detailRowCount = singleDetail.detailRowCount;
                    for (var row = 0; row < detailRowCount; row++) {
                        var singleRe = [];
                        for (var flen = 0; flen < titleArr.length; flen++) {
                            singleRe.push(this.getExcelFieldValue(titleArr[flen], singleDetailConfig, row, config));
                        }
                        content.push(singleRe);
                    }
                }


            }
            re.content = content;


        },
        formartValue: function (value, itemConfig, rowIndex) {
            try {
                if (itemConfig.type === "ApplyLayout" && itemConfig.isChildForm === "1") {
                    return itemConfig.title + "" + (rowIndex + 1);
                }

                if (itemConfig.type === "ApplyInputRadio") {
                    var v = itemConfig.value || {};
                    return v.value || "";
                }

                if (itemConfig.type === "ApplyInputCheckbox") {
                    var arr = itemConfig.value || [];
                    arr = arr[rowIndex] || [];
                    var ReArr = [];
                    for (var i = 0, j = arr.length; i < j; i++) {
                        ReArr.push(arr[i].value);
                    }

                    return ReArr.join(",");
                }
                return value.toString();
            } catch (e) {
                return "";
            }
        },
        getExcelFieldValue: function (title, DetailConfig, rowIndex, allConfig) {
            //通过title中的id取数据 如果在明细外面能够找到字段的话 就不去明细中找
            //如果在明细外找不到的话 就从当前提供的明细配置以及行index中去找  如果找不到就是空字符串
            var id = title.split("$$xz")[1];
            var Re = "";
            var filedIsInOut = false;
            for (var i = 0, j = allConfig.length; i < j; i++) {
                var itemConfig = allConfig[i];
                if (itemConfig.id.toString() === id.toString()) {
                    Re = this.formartValue(itemConfig.value, itemConfig, rowIndex);
                    filedIsInOut = true;
                    break;
                }
            }
            if (filedIsInOut === false) {
                var inputs = DetailConfig.inputs;
                for (var ii = 0; ii < inputs.length; ii++) {
                    var inputItem = inputs[ii];
                    if (inputItem.id.toString() === id.toString()) {
                        var valueArr = inputItem.value;
                        var value = valueArr[rowIndex];
                        Re = this.formartValue(value, inputItem, rowIndex);
                        break;
                    }
                }
            }

            return Re;
        },
        submitbtn_click: function () {
            var _this = this,
                postData = {};

            if (this.isPreview || this.isQrRreview) {
                return;
            }

            var config = [],
                subFormMap = {},
                processKey = this.form.processKey;

            for (var i = 0, j = this.itemInstanceArr.length; i < j; i++) {

                var itemConfig = this.itemInstanceArr[i].getConfig();
                if (itemConfig === false) {
                    config = null;
                    break;
                }

                //如果是数组类型的返回,则是表单明细控件的方式解析,否则按照普通控件解析
                if (itemConfig instanceof Array) {
                    subFormMap[this.itemInstanceArr[i].id] = itemConfig;
                } else {
                    config.push(itemConfig);
                }

            }
            if (config === null) {
                return;
            }

            //如果是追加单据
            if (_this.mode === 'addFormMore') {
                //指派检查
                _this.goAgreeAndAssign(this.processFormData(config, subFormMap));

            } else {
                //如果是条件审批  需要重新请求一下获取审批人员  如果不存在 就需要提示

                //cc_line_repeat memberId
                var ccArray = [];
                for (var ii = 0, jj = this.pageview.refs.cc_line_repeat.datasource.length; ii < jj; ii++) {
                    ccArray.push(this.pageview.refs.cc_line_repeat.datasource[ii].memberId);
                }

                //keyFeature 关键特性检测
                var keyFeatureArr = [];
                config.forEach(function (item, index) {
                    if (item.crux && item.keyFeature) {
                        keyFeatureArr.push(item.keyFeature);
                    }
                });

                if (_this.mode === 'MODIFY') {
                    // 提交的数据格式
                    postData = {
                        pk_boins: this.pk_boins,
                        instanceId: this.id,
                        procInstName: this.procInstName,
                        tableName: this.form.tableName || '',
                        formData: this.processFormData(config, subFormMap),
                        keyFeature: JSON.stringify(keyFeatureArr) || [],
                        mapping: this.processMapping(config) || {},
                        keyValues: JSON.stringify(this.optionsFlow) || {}
                    };
                } else {
                    // 提交的数据格式
                    postData = {
                        formId: this.form.id,
                        tableName: this.form.tableName || '',
                        formName: this.form.name,
                        processKey: processKey,
                        assignInfoItems: ccArray.join(",") || [],
                        formData: this.processFormData(config, subFormMap),
                        copyToUsers: ccArray.join(",") || [],
                        source: this.source,
                        share: this.share || '',
                        shareTenantId: this.shareTenantId || '',
                        shareUserId: this.shareUserId || '',
                        keyFeature: JSON.stringify(keyFeatureArr) || [],
                        mapping: this.processMapping(config) || {},
                        keyValues: JSON.stringify(this.optionsFlow) || {}
                    };
                }

                // 任务ID, 如果不是自由流审批, 才需要将任务ID作为参数
                if (this.form.processKey === '' || this.form.processKey === 'freeflow') {
                    postData.processKey = 'freeflow';
                }

                if (this.isFreeApprove) {
                    //customize
                    var persons = this.pageview.refs.approve_line_repeat.datasource;
                    var personsArr = [];
                    for (var iii = 0, jjj = persons.length; iii < jjj; iii++) {
                        personsArr.push(persons[iii].memberId);
                    }

                    if (personsArr.length === 0) {
                        this.pageview.showTip({
                            text: "请选择审批人",
                            duration: 1200
                        });
                        return;
                    }
                    postData.nextAuditors = personsArr.join(",");
                    this.pageview.showLoading({
                        text: "正在提交..."
                    });
                    this.submitData(postData);
                } else {
                    this.pageview.showLoading({
                        text: "正在提交..."
                    });
                    if (this.isConditionApprove) {
                        // 做审批人检测
                        this.updateApproveLines(function (data) {
                            if (data.length > 0) {
                                _this.submitData(postData);
                            } else {
                                _this.pageview.hideLoading(true);
                                _this.pageview.showTip({text: "请选择审批人员", duration: 1400});
                            }
                        }, function () {
                            _this.pageview.hideLoading(true);
                        });
                    } else {
                        this.submitData(postData);
                    }
                }
            }
        },

        /*
         *  临时处理表单数据的mapping
         * */
        processMapping: function (data) {

            var processData = {};
            data.forEach(function (value) {
                processData[value.columncode] = value.fieldId;
            });

            return JSON.stringify(processData);
        },

        /*
         *  处理表单数据的formData格式(普通表单控件)
         * */
        processFormData: function (data, subFormMap) {

            var _this = this,
                processData = {
                    formData: []
                };

            data.forEach(function (value, key) {

                var type = value.type;

                //云表单(根据source来区分)
                if (_this.source) {
                    type = value.componentKey;
                }

                if (type !== "IdentifyCode") {
                    processData.formData.push({
                        "name": value.columncode,
                        "type": type,
                        "value": value.value,
                        "fieldId": value.fieldId
                    });
                } else {
                    processData.smsData = [{
                        mobile: value.value.mobile || '',
                        smsVerCode: value.value.smsVerCode || ''
                    }];
                }
            });

            processData.version = this.form.version || '';
            processData.pkValue = this.form.pkValue || '';
            processData.tableName = this.form.tableName || '';
            processData.pkTemp = this.form.pkTemp || '';
            // 自动编号获取绑定字段值
            this.autoFields.forEach(function (value, key) {
                if (value.fieldId) {
                    value.fieldValue = $('.' + value.fieldId).find('input').val();
                }
            });
            processData.autoFields = this.autoFields;
            processData.subFormMap = subFormMap;

            console.log(processData);
            return JSON.stringify(processData);
        },

        // updateApproveLines
        submitData: function (postData) {
            var _this = this,
                url = "/process/submitForm";

            if (_this.mode === 'MODIFY') {
                url = "/process/updateEditForm";
            }

            this.pageview.ajax({
                type: "POST",
                url: url,
                data: postData,
                success: function (data) {
                    _this.pageview.hideLoading(data.code === 0);
                    if (data.code === 0) {
                        window.needRefresMyApproveListData = true;
                        window.needRefresCopyApproveListData = true;

                        var messge = _this.form.thankPageMessage;
                        if (_this.form.showThankPage && messge) {
                            _this.pageview.showTip({text: messge, duration: 1000});
                        } else {
                            _this.pageview.showTip({text: "已提交成功", duration: 1000});
                        }
                        if (_this.share) {
                            _this.pageview.replaceGo('thanks');
                            return;
                        }
                        window.setTimeout(function () {
                            //特殊处理,详情需要,如果是新增的时候,让formID和instID相同
                            var formId = data.data[0];
                            if (_this.mode === 'NEW') {
                                formId = data.data[2];

                            }
                            if (_this.mode === 'MODIFY') {
                                _this.pageview.replaceGo("detail", {
                                    formId: _this.form.id,
                                    instId: _this.id,
                                    formDataName: encodeURI(_this.formName)
                                });
                            } else {
                                _this.pageview.replaceGo("detail", {
                                    formId: data.data[0],
                                    instId: data.data[2],
                                    formDataName: encodeURI(_this.formName)
                                });
                            }

                        }, 1000);
                    } else {
                        _this.pageview.showTip({text: data.msg || "操作失败!请稍后再试", duration: 1000});
                    }
                },
                error: function (error) {
                    _this.pageview.hideLoading(false);
                    _this.pageview.showTip({text: "操作失败!请稍后再试", duration: 1000});
                }
            });

        },
        loadData: function () {
            var _this = this;
            this.pageview.showLoading({
                text: "努力加载中...",
                timeout: 9000,
                reLoadCallBack: function () {
                    _this._loadData();
                }
            });
            _this._loadData();
        },
        _loadData: function () {
            var _this = this;
            var id;
            var ajaxConfig = {
                type: "GET",
                error: function (e) {
                    _this.pageview.hideLoading(false);
                }
            };
            if (this.mode === "NEW") {
                id = this.templateid;
                ajaxConfig.url = "/form/enterform";
                ajaxConfig.data = {
                    formId: id,
                    source: _this.source,
                    share: _this.share,
                    tenantId: _this.tenantId
                };
                ajaxConfig.success = function (data) {
                    if (data.code === 0) {
                        _this.form = data.data.form;
                        _this.shareTenantId = data.data.shareTenantId || '';
                        _this.shareUserId = data.data.shareUserId || '';
                        _this.layoutData = [];
                        //字段权限控制
                        _this.processAuthinfo = _this.form.processAuthinfo;

                        var layoutTemp = null;

                        try {
                            var layout = data.data.formLayout.layoutDetail;
                            if (_this.source && (typeof layout === 'string')) {
                                layoutTemp = JSON.parse(layout).layoutDetail;
                            } else {
                                layoutTemp = layout.layoutDetail;
                            }

                            console.log(layoutTemp);
                        } catch (e) {
                            _this.pageview.showTip({text: "模版结构错误！请联系管理员"});
                        }

                        layoutTemp.forEach(function (item, index) {

                            if (item.componentKey === 'TableLayout') {
                                item.layoutDetail.forEach(function (sonItem, sonIndex) {
                                    sonItem.layoutDetail.forEach(function (grandItem, grandIndex) {
                                        _this.layoutData.push(grandItem);
                                    });
                                });
                            } else if (item.componentKey === 'ColumnPanel') {
                                item.layoutDetail.forEach(function (sonItem, sonIndex) {
                                    sonItem.layoutDetail.forEach(function (grandItem, grandIndex) {
                                        _this.layoutData.push(grandItem);
                                    });
                                });
                            } else {
                                _this.layoutData.push(item);
                            }
                        });

                        _this.initSetApprovePersonData(_this.form.processKey);
                        _this.loadSuccess(_this.layoutData);
                    } else {
                        if (_this.isQrRreview) {
                            _this.pageview.showTip({text: "预览失败,在预览期间请勿关闭二维码,请重试!"});
                        }
                    }
                    _this.pageview.hideLoading(data.code === 0);
                };
            } else if (this.mode === "MODIFY" || this.mode === "reAdd") {
                id = this.id;
                ajaxConfig.url = "/form/editform";
                ajaxConfig.data = {
                    instanceId: id,
                    source: _this.source
                };
                ajaxConfig.success = function (data) {
                    if (data.code === 0) {
                        _this.layoutData = [];
                        var form = data.data.form,
                            layoutTemp = null;
                        _this.form = form;
                        _this.pk_boins = form.pk_boins;
                        _this.subFormPk = data.data.subFormPk;
                        layoutTemp = data.data.formLayout.layoutDetail;
                        //字段权限控制
                        _this.processAuthinfo = _this.form.processAuthinfo;

                        if (layoutTemp.layoutDetail) {
                            layoutTemp = layoutTemp.layoutDetail;
                        }
                        layoutTemp.forEach(function (item, index) {

                            if (item.componentKey === 'TableLayout') {
                                item.layoutDetail.forEach(function (sonItem, sonIndex) {
                                    sonItem.layoutDetail.forEach(function (grandItem, grandIndex) {
                                        _this.layoutData.push(grandItem);
                                    });
                                });
                            } else if (item.componentKey === 'ColumnPanel') {
                                item.layoutDetail.forEach(function (sonItem, sonIndex) {
                                    sonItem.layoutDetail.forEach(function (grandItem, grandIndex) {
                                        _this.layoutData.push(grandItem);
                                    });
                                });
                            } else {
                                _this.layoutData.push(item);
                            }
                        });
                        _this.initSetApprovePersonData(_this.form.processKey);
                        _this.loadSuccess(_this.layoutData);
                        if (_this.isConditionApprove) {
                            window.setTimeout(function () {
                                _this.updateApproveLines();
                            }, 100);

                        }
                        _this.pageview.hideLoading(data.code === 0);
                    } else {
                        _this.pageview.hideLoading();
                        _this.warningDialog = new Dialog({
                            mode: 3,
                            wrapper: _this.pageview.$el,
                            contentText: data.msg,
                            btnDirection: "row",
                            className: "dialog-custom-className",
                            buttons: [{
                                title: "确定",
                                style: {
                                    height: 45,
                                    fontSize: 16,
                                    color: c.titleColor,
                                    borderRight: '1px solid #eee'
                                },
                                onClick: function () {
                                    _this.warningDialog.hide();
                                    setTimeout(function () {
                                        _this.pageview.goBack(-1);
                                    }, 800);
                                }
                            }]
                        });
                        _this.warningDialog.show();
                    }

                };
            } else if (this.mode === "addFormMore") {
                id = this.id;

                ajaxConfig.url = "/form/activityForm";
                ajaxConfig.data = {
                    formId: window._applyHistory.nodeFormID,
                    processId: window._applyHistory.instData.processDefinitionId,
                    activityId: window._applyHistory.instData.currentActivityId,
                    taskId: window._applyHistory.taskId,
                    starter: window._applyHistory.instData.startUserId,
                    instanceId: window._applyHistory.instData.id,
                    businessKey: window._applyHistory.instData.businessKey
                };
                ajaxConfig.success = function (data) {
                    if (data.code === 0) {
                        _this.layoutData = [];
                        _this.form = data.data.form;
                        var layoutTemp = data.data.formLayout.layoutDetail.layoutDetail;
                        layoutTemp.forEach(function (item, index) {

                            if (item.componentKey === 'TableLayout') {
                                item.layoutDetail.forEach(function (sonItem, sonIndex) {
                                    sonItem.layoutDetail.forEach(function (grandItem, grandIndex) {
                                        _this.layoutData.push(grandItem);
                                    });
                                });
                            } else if (item.componentKey === 'ColumnPanel') {
                                item.layoutDetail.forEach(function (sonItem, sonIndex) {
                                    sonItem.layoutDetail.forEach(function (grandItem, grandIndex) {
                                        _this.layoutData.push(grandItem);
                                    });
                                });
                            } else {
                                _this.layoutData.push(item);
                            }
                        });
                        _this.initSetApprovePersonData(_this.form.processKey);
                        _this.loadSuccess(_this.layoutData);
                        if (_this.isConditionApprove) {
                            window.setTimeout(function () {
                                _this.updateApproveLines();
                            }, 100);

                        }
                    }
                    _this.pageview.hideLoading(data.code === 0);
                };
            }
            this.pageview.ajax(ajaxConfig);
        },
        loadSuccess: function (data) {
            this.pageview.hideLoading(true);
            this.createLayout(data);
        },

        createLayout: function (data) {
            var _this = this;
            window.setTimeout(function () {
                for (var key in _this.itemDict) {
                    // 判断当前组件是否是明细组件,如果是的话更新明细组件的运算
                    if (_this.itemDict[key] && _this.itemDict[key].isDetail === true) {
                        _this.itemDict[key].updateSummary(false);
                    }
                }
            }, 100);
            var components = this.pageview.config.components;
            for (var i = 0, j = data.length; i < j; i++) {
                var itemData = data[i];
                this.addItemLayout(itemData, components);
            }


            components.body.root.push("approve_line_wrap");
            components.body.root.push("cc_line_warp");
            components.body.root.push("submitbtn");

            this.pageview.delegate("statusview", function (target) {
                target.change("body");
            });
            this.pageview.delegate("headertitle", function (target) {
                target.setText(_this.form.name);
            });
        },


        dateCtlClick: function (sender, params) {
            console.log(sender);
        },

        detailItemDeleteInit: function (sender, params) {
            if (sender.parent.parent.config.index === 0) {
                sender.config.style.display = "none";
            }
        },

        detailItemDeleteClick: function (sender, params) {
            var _this = this;
            this.curDateInstance = params.DetailInstance;
            this.curDetailItem = sender;
            if (!this.chexiaoDialog) {
                this.chexiaoDialog = new Dialog({
                    mode: 3,
                    wrapper: this.pageview.$el,
                    contentText: "你确定要删除该明细吗？",
                    btnDirection: "row",
                    buttons: [{
                        title: "取消",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: c.titleColor
                        },
                        onClick: function () {
                            _this.chexiaoDialog.hide();
                        }
                    }, {
                        title: "确定",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: "#37b7fd",
                        },
                        onClick: function () {
                            _this.delDetailItem();
                            _this.chexiaoDialog.hide();
                        }
                    }]
                });
            }
            this.chexiaoDialog.show();

        },
        delDetailItem: function () {
            var sender = this.curDetailItem;
            sender.rowInstance.remove();
            var titleKeyStr = sender.config.titleLabel;
            var titleKey = sender.config.titleKey;
            this.curDateInstance.updateSummary(true);
            this.updateApproveLines();
            sender.rowInstance.parent.eachItem(function (item, index) {
                if (index >= 0) {
                    item.delegate(titleKey, function (label) {
                        var indexTemp = parseInt(index, 10) + 1;
                        label.setText(titleKeyStr + "(" + (indexTemp) + ")");
                    });
                }

            });
        },
        detailItemTitleInit: function (sender, params) {
            var index = sender.parent.parent.config.index;
            if (index >= 0) {
                index = parseInt(index, 10) + 1;
                sender.config.text = sender.config.text + "(" + (index) + ")";
            }
        },
        repeatAddMoreClick: function (sender, params) {
            if (this.isPreview || this.isQrRreview) {
                return;
            }
            sender.parent.addItem({});
        },
        approve_icon_init: function (sender) {
            sender.config.src = c.thumbImg(sender.config.src);
        },
        addSubComponent: function (itemData, components, root, repeatKey, DetailInstance) {

            //通过 processAuthinfo 拿到每个控件的权限信息
            // params: 各个字段权限控制模型\  控件数据模型\   模板类型\  流程ID(新建时是空)\
            var authInfo = c.parseAuthInfo(this.processAuthinfo, itemData, this.mode, this.taskDefinitionKey);
            //如果该控件设置了隐藏,则不添加到组件布局中
            if (!authInfo) {
                return false;
            }

            var type = itemData.componentKey,
                itemInstance,
                params = {
                    plugin: this,
                    components: components,
                    itemData: itemData,
                    root: root,
                    repeatKey: repeatKey,
                    DetailInstance: DetailInstance,
                    authInfo: authInfo,
                    form: this.form
                };
            switch (type) {
                case "Text":
                    if (itemData.textArea || itemData.isTextArea) {
                        itemInstance = new ApplyInputTextarea(params);
                    } else {
                        itemInstance = new ApplyInputText(params);
                    }
                    break;
                case "Paragraph":
                    itemInstance = new ApplyInputString(params);
                    break;
                case "Hyperlink":
                    itemInstance = new ApplyInputLink(params);
                    break;
                case "Mobile":
                    itemInstance = new ApplyInputMobile(params);
                    break;
                case "TextEditor":
                    itemInstance = new ApplyInputTextarea(params);
                    break;
                case "Phone":
                    itemInstance = new ApplyInputMobile(params);
                    break;
                case "Email":
                    itemInstance = new ApplyInputEmail(params);
                    break;
                case "Precent":
                    itemInstance = new ApplyInputTextPercent(params);
                    break;
                case "Raty":
                    itemInstance = new ApplyScore(params);
                    break;
                case "Money":
                    itemInstance = new ApplyInputTextMoney(params);
                    break;
                case "Number":
                    itemInstance = new ApplyInputTextNum(params);
                    break;
                case "Password":
                    itemInstance = new ApplyInputPassword(params);
                    break;
                case "Date":
                    itemInstance = new ApplyInputDate(params);
                    break;
                case "DateInterval":
                    itemInstance = new ApplyInputDateBetween(params);
                    break;
                case "Picture":
                    itemInstance = new ApplyViewImage(params);
                    break;
                case "DividingLine":
                    itemInstance = new ApplyDividingLine(params);
                    break;
                case "BillMaker":
                    itemInstance = new ApplyBillMaker(params);
                    break;
                case "CodeRule":
                    itemInstance = new ApplyCodeRule(params);
                    break;
                case "Select":
                    if (itemData.switcher) {
                        //开关
                        itemInstance = new ApplySwitch(params);
                    } else if (itemData.multiselect) {
                        if (itemData.optionsType === 'Inline') {
                            itemInstance = new ApplyTileCheckbox(params);
                        } else {
                            itemInstance = new ApplyInputCheckbox(params);
                        }
                    } else {
                        if (itemData.optionsType === 'Inline') {
                            //平铺
                            itemInstance = new ApplyTileRadio(params);
                        } else {
                            //下拉
                            itemInstance = new ApplyInputRadio(params);
                        }
                    }

                    break;
                case "ApplyImage":
                    itemInstance = new ApplyImage(params);
                    break;
                case "DataTable":
                    itemInstance = new ApplyDetail(params);
                    break;
                case "Reference":
                    itemInstance = new ApplyReference(params);
                    break;
                case "Employee":
                    itemInstance = new ApplyEmployee(params);
                    break;
                case "Department":
                    itemInstance = new ApplyDepartment(params);
                    break;
                case "DateCalculate":
                    itemInstance = new ApplyInputDateCalculate(params);
                    break;
                case "BillMakerManager":
                    itemInstance = new ApplyBillMakerManager(params);
                    break;
                case "BillMakerOrg":
                    itemInstance = new ApplyBillMakerOrg(params);
                    break;
                case "File":
                    itemInstance = new ApplyFile(params);
                    break;
                case "TaskComment":
                    itemInstance = new ApplyTaskComment(params);
                    break;
                case "BillMakerPost":
                    itemInstance = new ApplyBillMakerPost(params);
                    break;
                case "IdentifyCode":
                    itemInstance = new ApplyIdentifyCode(params);
                    break;
            }
            var itemId = itemData.fieldId || itemData.subFormId;
            this.itemDict[itemId.toString()] = itemInstance;

            return itemInstance;
        },
        addItemLayout: function (itemData, components) {
            var itemInstance = this.addSubComponent(itemData, components, components.body.root, null, null);
            if (itemInstance) {
                this.itemInstanceArr.push(itemInstance);
            }

        },
        setFreeApprove: function () {
            this.isFreeApprove = true;
            this.pageview.delegate("approve_line_repeat", function (repeat) {
                repeat.$el.removeClass("displaynone");
            });
            this.pageview.delegate("approve_line_wrap_title", function (approve_line_wrap_title) {
                approve_line_wrap_title.setNextText("(点击头像可删除)");
            });
        },
        initSetApprovePersonData: function (rule) {

            this.isConditionApprove = false;
            if (rule === 'freeflow' || rule === '') {
                //自由审批(没用设置审批人,需要显示提供用户选择审批人)
                this.setFreeApprove();
                return;
            } else if (rule === 'processKey') {
                // 数据收集
                this.pageview.delegate("approve_line_wrap", function (target) {
                    target.$el.hide();
                });
                this.pageview.delegate("cc_line_warp", function (target) {
                    target.$el.hide();
                });
            } else {
                this.pageview.delegate("approve_line_wrap", function (target) {
                    target.$el.hide();
                });
            }
        },

        cc_line_repeat_itemclick: function (sender, params) {
            //	memberId:itemData.member_id
            var itemMemberID = sender.datasource.memberId.toString();
            if (this.cc_select_list) {
                for (var i = this.cc_select_list.length - 1; i >= 0; i--) {
                    if (this.cc_select_list[i].member_id.toString() === itemMemberID) {
                        this.cc_select_list.splice(i, 1);
                    }
                }
            }
            sender.remove();
        },
        add_cc_btn_click: function (sender) {
            if (this.isPreview || this.isQrRreview) {
                return;
            }
            var _this = this;

            try {
                window.yyesn.enterprise.selectContacts(function (b) {
                    if (b.error_code === "0") {
                        var persons = b.data;
                        _this.pageview.refs.cc_line_repeat.empty();
                        _this.cc_select_list = [];
                        for (var i = 0, j = persons.length; i < j; i++) {
                            var itemData = persons[i];
                            _this.cc_select_list.push(itemData);
                            _this.pageview.refs.cc_line_repeat.addItem({
                                userName: itemData.name,
                                headImgUrl: itemData.avatar,
                                memberId: itemData.member_id
                            });
                        }

                    }
                }, {
                    mode: 1,
                    multi: 1,
                    select_list: _this.cc_select_list || []
                }, function (b) {
                });
            } catch (e) {
                alert(JSON.stringify(e));
            }
        },
        // isExistsCCPerson:function(itemData){
        // 	var datasource = this.pageview.refs.cc_line_repeat.datasource;
        // 	var Re = false;
        // 	for(var i=0,j=datasource.length;i<j;i++){
        // 		if(datasource[i].memberId.toString()===itemData.member_id.toString()){
        // 			Re = true;
        // 			break;
        // 		}
        // 	}
        // 	return Re;
        // },
        add_approve_btn_click: function (sender) {
            if (this.isPreview || this.isQrRreview) {
                return;
            }
            var _this = this;

            try {
                window.yyesn.enterprise.selectContacts(function (b) {
                    //   document.write(JSON.stringify(b))
                    if (b.error_code === "0") {
                        var itemData = b.data[0];
                        ////userName headImgUrl memberId
                        var checkResult = _this.checkSelectedPerson(itemData);
                        if (checkResult === false) {
                            return;
                        }
                        _this.pageview.refs.approve_line_repeat.addItem({
                            userName: itemData.name,
                            headImgUrl: itemData.avatar,
                            memberId: itemData.member_id
                        });
                    }
                }, {
                    mode: 1,
                    multi: 0
                }, function (b) {
                });
            } catch (e) {
                alert(JSON.stringify(e));
            }

        },
        checkSelectedPerson: function (itemData) {
            var Re = true;

            var datasource = this.pageview.refs.approve_line_repeat.datasource;
            for (var i = 0, j = datasource.length; i < j; i++) {
                var singleData = datasource[i];
                if (singleData.memberId.toString() === itemData.member_id.toString()) {
                    this.pageview.showTip({text: "不能添加重复的审批人!", duration: 1200});
                    Re = false;
                    break;
                }
            }
            return Re;
        },
        showDefaultApprveLineWhenHasCondition: function () {
            var _this = this;
            this.pageview.delegate("approve_line_wrap_title", function (approve_line_wrap_title) {
                approve_line_wrap_title.setNextText("(审批人已由管理员内置)");
                approve_line_wrap_title.$el.removeClass("displaynone");
            });
        },
        approve_line_loadingtext_click: function (sender, params) {
            var text = sender.getText();
            if (text.indexOf("加载") >= 0) {
                this.loadApprovePerson();
            }
        },
        getItemInstanceById: function (id) {
            return this.itemDict[id.toString()];
        },
        updateApproveLines: function (success, error) {
            if (this.isPreview || this.isQrRreview) {
                return;
            }
            var _this = this;

            if (!this.conditionItemInstance && this.isConditionApprove === true) {
                this.pageview.showTip({text: "本单据审批流程错误!请联系管理员配置修改"});
                return;
            }
            if (this.loadApprovePersonTimeID) {
                window.clearTimeout(this.loadApprovePersonTimeID);
            }
        },
        loadApprovePerson: function (val, success, error) {
            var _this = this;
            this.pageview.delegate("approve_line_loadingtext", function (target) {
                target.setText("");
                target.showLoading();
            });
            var ajaxConfig = {
                type: "GET",
                url: "/formdata/member",
                data: {
                    ftid: this.templateid
                },//userName headImgUrl memberId
                success: function (data) {
                    _this.pageview.delegate("approve_line_loadingtext", function (target) {
                        target.hideLoading();
                        if (data.code === 0) {
                            _this.pageview.delegate("approve_line_repeat", function (repeat) {
                                repeat.$el.removeClass("displaynone");
                                if (data.data.length === 0) {
                                    _this.isFreeApprove = true;
                                    repeat.bindData([]);
                                    repeat.showOrHideSubComponent(true);
                                    _this.pageview.delegate("approve_line_wrap_title", function (approve_line_wrap_title) {
                                        approve_line_wrap_title.$el.removeClass("displaynone");
                                        approve_line_wrap_title.setNextText("(点击头像可删除)");
                                    });
                                } else {
                                    _this.pageview.delegate("approve_line_wrap_title", function (approve_line_wrap_title) {
                                        approve_line_wrap_title.setNextText("(审批人已由管理员内置)");
                                        approve_line_wrap_title.$el.removeClass("displaynone");
                                    });
                                    window.setTimeout(function () {
                                        repeat.showOrHideSubComponent(false);
                                    }, 60);
                                    repeat.bindData(data.data);
                                }

                            });

                            if (success) {
                                success(data.data);
                            }
                        } else {
                            target.setText("审批人获取失败,点击重新加载");
                            _this.pageview.delegate("approve_line_wrap_title", function (approve_line_wrap_title) {
                                approve_line_wrap_title.$el.addClass("displaynone");
                            });

                            if (error) {
                                error();
                            }
                        }
                    });

                },
                error: function (e) {
                    if (error) {
                        error();
                    }
                    _this.pageview.delegate("approve_line_loadingtext", function (target) {
                        target.hideLoading();
                        target.setText("审批人获取失败,点击重新加载");
                        _this.pageview.delegate("approve_line_wrap_title", function (approve_line_wrap_title) {
                            approve_line_wrap_title.$el.addClass("displaynone");
                        });
                    });
                }
            };
            if (this.isConditionApprove === true) {
                ajaxConfig.data.condition = val;
            }
            this.pageview.ajax(ajaxConfig);
        },
        /**
         *  指派检查(追加单据的时候,提交会做检查,再去提交)
         *  para:
         * */
        goAgreeAndAssign: function (formData) {
            var _this = this,
                processId = window._applyHistory.instData.processDefinitionId,
                taskId = window._applyHistory.taskId,
                instanceId = window._applyHistory.instData.id,
                businessKey = window._applyHistory.instData.businessKey;

            //将追加的单据信息存到 localStorage,
            window.localStorage.setItem(c.ADDITIONAL_FORM_DATA, formData);

            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            // 指派检查
            this.pageview.ajax({
                url: "process/assignCheck",
                type: "GET",
                data: {
                    "taskId": taskId
                },
                success: function (data) {
                    _this.pageview.hideLoading(true);

                    if (data.success) {
                        if (!data.data.assignAble) {
                            _this.pageview.go('deal', {
                                type: 1, // 同意
                                instanceId: instanceId,
                                processId: processId,
                                taskId: taskId,
                                businessKey: businessKey,
                                isAdd: true,
                                formName: _this.form.name
                            });
                        } else {
                            window.localStorage.setItem('ASSIGN_CHECK_DATA', JSON.stringify(data));

                            _this.pageview.go('deal', {
                                type: 3, // 指派
                                instanceId: instanceId,
                                processId: processId,
                                taskId: taskId,
                                isAdd: true,
                                formName: _this.form.name
                            });
                        }
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (err) {
                    console.error('指派检查失败');
                }
            });
        },
        cc_line_warp_init: function (sender) {
            if (this.mode === 'addFormMore' || this.mode === 'MODIFY') {
                sender.$el.hide();
            }
        },
        headerview_init: function (sender) {
            if (this.share) {
                sender.config.style.display = "flex";
            } else {
                sender.config.style.display = "none";
            }
        },
        headertitle_init: function (sender) {
            // sender.config.text = this.form.name;
        },
        headerpadding_init: function (sender) {
            if (this.share) {
                sender.config.style.display = "flex";
            } else {
                sender.config.style.display = "none";
            }
        }
    };

    return pageLogic;
});
