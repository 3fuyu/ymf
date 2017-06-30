/**
 * Created by Gin on 17/2/24.
 */
define(["../parts/common", "utils", "../../../components/dialog", "../libs/plupload/form-file-uploader", "../parts/analysis"], function (c, utils, Dialog, FileUploader, analysis) {

    function PageLogic(config) {
        var _this = this;
        this.applyHistory = {};

        this.item = [];
        this.pageview = config.pageview;
        this.formName = this.pageview.params.formDataName || "";
        this.formName = decodeURI(this.formName) || "";
        this.currentTodoTaskInitAttCnt = 0;//当前待办任务初始时已上传附件数
        this.fileMaxNum = 9; // 附件默认最大数量
        this.fileNum = 0; // 附件现有数量
        this.setHeader();
        //动画在请求一起的时候 安卓会卡顿  动画完后请求
        if (utils.deviceInfo().isAndroid) {
            window.setTimeout(function () {
                _this.loadData();
            }, 300);
        } else {
            _this.loadData();
        }
    }

    PageLogic.prototype = {
        onPageResume: function () {
            this.applyHistory = {};
            this.item = [];
            this.setHeader();
            this.loadData();
        },
        setHeader: function () {
            try {

                var title = this.formName || "";
                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: title,
                    rightTitle: "",
                    rightValues: []
                }, function (b) {

                });
            } catch (e) {

            }
        },
        loadData: function () {
            var _this = this;
            this.pageview.showLoading({
                text: "努力加载中...",
                timeout: 8000,
                reLoadCallBack: function () {
                    _this._loadData();
                }
            });
            _this._loadData();
        },
        _loadData: function () {
            var _this = this,
                listAjaxConfig = {
                    url: '/process/getApply',
                    type: 'POST',
                    data: {
                        instId: this.pageview.params.instId || '',
                        taskId: this.pageview.params.taskId || '',
                        copyToId: this.pageview.params.copyToId || ''
                    },
                    success: function (listData) {
                        _this.applyHistory = {};
                        _this.detailData = listData.data;
                        _this.pageview.hideLoading(true);
                        if (listData.code === 0) {
                            if (_this.detailData.dataCollection) {
                                // _this.pageview.refs.result_text.$el.html("已提交");
                                // _this.pageview.refs.result_text.$el.show();
                                _this.pageview.refs.segment.$el.hide();
                            } else {
                                // _this.pageview.refs.result_text.$el.hide();
                                _this.pageview.refs.segment.$el.show();
                            }

                            window.needRefresCopyApproveListData = true;
                            var viewpager = _this.pageview.refs.top_view.components.viewpager;
                            _this.pageview.delegate('userinfo_name', function (target) {
                                _this.instName = listData.data.inst.name;
                                target.setText(listData.data.inst.name);
                            });
                            var jsonList = [];
                            var keyFeaturesList = [];
                            var jsonContent = {};
                            var fields = listData.data.inst.bpmForms ? listData.data.inst.bpmForms[0].fields : [];
                            for (var j = 0; j < fields.length; j++) {
                                var keyFeatures = {};
                                jsonContent = {};
                                var fieldContent = JSON.parse(fields[j].fieldContent);
                                var variableContent = JSON.parse(fields[j].variableContent);
                                var name = variableContent.name ? variableContent.name : "未命名";
                                jsonContent.title = name + ": ";
                                jsonContent.type = variableContent.type.name;
                                if (variableContent.type.kind) {
                                    jsonContent.kind = variableContent.type.kind;
                                }
                                if (listData.data.inst.formDataList && listData.data.inst.formDataList.length > 0) {
                                    jsonContent.content = listData.data.inst.formDataList[0][fields[j].tableFieldName];
                                }
                                if (fieldContent.keyFeatures) {
                                    var content = jsonContent.content;
                                    if (jsonContent.type === "boolean") {
                                        content = jsonContent.content === "1" ? "是" : "否";
                                    }
                                    keyFeatures.text = jsonContent.title + content;
                                }
                                if (!$.isEmptyObject(keyFeatures)) {
                                    keyFeaturesList.push(keyFeatures);
                                }
                                jsonList.push(jsonContent);
                            }
                            if (fields.length === 0 && listData.data.inst.iforms) {

                                jsonList = analysis.getAnalysis_ifroms(listData.data.inst.iforms, listData.data.inst.formDataList, listData.data.inst.currentActivityId);
                            }


                            var subFormsList = [];

                            var subForms = listData.data.inst.bpmForms ? listData.data.inst.bpmForms[0].subForms : [];
                            for (var subIdex = 0; subIdex < subForms.length; subIdex++) {

                                var subFormsJson = {};
                                var _fields = subForms[subIdex] ? subForms[subIdex].fields : [];
                                subFormsJson.title = subForms[subIdex].title;
                                subFormsJson.item = [];
                                for (var s_idex = 0; s_idex < _fields.length; s_idex++) {
                                    var s_variableContent = JSON.parse(_fields[s_idex].variableContent);
                                    var s_name = s_variableContent.name ? s_variableContent.name : "未命名";
                                    var s_type = s_variableContent.type.name;

                                    var formDataList = listData.data.inst.formDataList && listData.data.inst.formDataList[0][subForms[subIdex].tableName];

                                    var _formdata = formDataList > 0 && formDataList[0][_fields[s_idex].tableFieldName] ? formDataList[0][_fields[s_idex].tableFieldName] : "";
                                    subFormsJson.item.push({
                                        "name": s_name + "：",
                                        "type": s_type,
                                        "content": _formdata
                                    });

                                }
                                subFormsList.push(subFormsJson);
                            }

                            if (listData.data.inst.keyFeature) {
                                var json = [];
                                var keyFeature = listData.data.inst.keyFeature;
                                // var keyFeature = "名字:axiba,金额:120,申请事由:因为帅";
                                // var keyFeatureStr = listData.data.inst.keyFeature.split(";");
                                // for (var i = 0; i < keyFeatureStr.length; i++) {
                                //     jsonContent = {};
                                //     jsonContent.text = keyFeatureStr[i];
                                //     json.push(jsonContent);
                                // }
                                try {
                                    var keyFeatureJson = JSON.parse(keyFeature);
                                    if (keyFeatureJson) {
                                        keyFeatureJson.forEach(function (item, idx) {
                                            var jsonContent = {};
                                            jsonContent.text = item.key + ":" + item.value;
                                            json.push(jsonContent);
                                        });
                                    } else {
                                        if (keyFeature !== null && keyFeature !== "null") {
                                            var keyFeatureStr = keyFeature.split(";");
                                            for (var f = 0; f < keyFeatureStr.length; f++) {
                                                var jc = {};
                                                jc.text = keyFeatureStr[f];
                                                json.push(jc);
                                            }
                                        }
                                    }
                                } catch (e) {
                                    if (keyFeature !== null && keyFeature !== "null") {
                                        var keyfs = keyFeature.split(";");
                                        for (var ix = 0; ix < keyfs.length; ix++) {
                                            var jsonC1 = {};
                                            jsonC1.text = keyfs[ix];
                                            json.push(jsonC1);
                                        }
                                    }
                                }


                                _this.pageview.delegate('userinfo_repeat', function (target) {
                                    if (json && json.length > 0) {
                                        target.bindData(json);
                                    } else {
                                        target.$el.css({display: 'none'});
                                    }
                                });
                            }

                            //创建按钮
                            _this.applyHistory.taskId = _this.pageview.params.taskId;
                            _this.applyHistory.nodeFormID = listData.data.nodeFormID;
                            _this.applyHistory.currentUserId = listData.data.currentUserId;
                            _this.applyHistory.currentMemberId = listData.data.currentMemberId;
                            _this.applyHistory.currentUserName = listData.data.currentUserName;
                            _this.applyHistory.copyToEndTime = listData.data.copyToEndTime;
                            _this.applyHistory.instData = listData.data.inst;
                            _this.applyHistory.formDataList = listData.data.inst.formDataList || [];//表单数据
                            _this.applyHistory.variableData = listData.data.inst.variables;
                            _this.applyHistory.taskList = listData.data.inst.historicTasks || [];
                            _this.applyHistory.instanceTodoTasks = [];
                            _this.applyHistory.instanceDoneTasks = [];
                            _this.applyHistory.subFormDatas = [];
                            _this.applyHistory.bpmActivityForms = listData.data.inst.bpmActivityForms || []; //追加单据
                            _this.applyHistory.formDataMap = listData.data.inst.formDataMap || []; //追加单据数据
                            _this.applyHistory.formKey = _this.applyHistory.taskList.formKey;
                            _this.applyHistory.editFlag = listData.data.editFlag;

                            var historicActivityInstances = listData.data.inst.historicActivityInstances;
                            for (var h_idex = 0; h_idex < historicActivityInstances.length; h_idex++) {
                                if (historicActivityInstances[h_idex].activityType === "startEvent") {
                                    _this.applyHistory.photo = historicActivityInstances[h_idex].pic;
                                    _this.applyHistory.name = historicActivityInstances[h_idex].userName;
                                    break;
                                }
                            }
                            _this.pageview.delegate('user_icon', function (target) {
                                if (_this.applyHistory.photo && _this.applyHistory.photo.length > 4) {
                                    target.setSrc(_this.applyHistory.photo);
                                } else {
                                    target.setTitle(_this.applyHistory.name);
                                }
                            });
                            if (listData.data.inst.bpmForms && listData.data.inst.bpmForms.length > 0) {
                                _this.applyHistory.mainForm = listData.data.inst.bpmForms[0];
                                _this.applyHistory.formId = listData.data.inst.bpmForms[0].id;
                            } else if (listData.data.inst.iforms) {
                                _this.applyHistory.iForms = listData.data.inst.iforms[0];
                                _this.applyHistory.formId = listData.data.inst.iforms[0].pk_bo;
                            }
                            _this.initFormData();

                            if (_this.applyHistory.mainForm) {
                                //主表单上可能有分支buttons属性
                                var btns = _this.applyHistory.mainForm.buttons;
                                if (btns) {
                                    // console.debug("当前任务包含了分支=" + btns);
                                    _this.applyHistory.taskBtnVars = JSON.parse(btns);
                                }
                            }
                            if (_this.applyHistory.currentUserId) {
                                // console.log("当前人是:" + _this.applyHistory.currentUserId + ",当前参数任务是:" + _this.applyHistory.taskId);
                                $.each(_this.applyHistory.taskList, function (idx, task) {
                                    // console.debug("查找当前任务:taskId:" + task.id + ",assignee=" + task.assignee + ",endtime=" + task.endTime + ",deleteReason=" + task.deleteReason + "currentUserId:" + _this.applyHistory.currentUserId);

                                    if (task.deleteReason !== "deleted") {
                                        if (task.endTime === null || task.endTime.indexOf('9999') > -1) {
                                            _this.applyHistory.instanceTodoTasks.push(task);
                                            if (task.id === _this.applyHistory.taskId && task.assignee === _this.applyHistory.currentUserId) {
                                                // console.debug("找到当前用户" + _this.applyHistory.currentUserId + "的当前任务" + task.id + ",是1个审批任务");
                                                _this.applyHistory.currentTodoTask = task;
                                                _this.applyHistory.currentUserName = task.userName;
                                            } else if (task.processInstanceId === _this.applyHistory.taskId && task.assignee === _this.applyHistory.currentUserId) {
                                                _this.applyHistory.currentTodoTask = task;
                                                _this.applyHistory.currentUserName = task.userName;
                                            }
                                        } else {

                                            _this.applyHistory.instanceDoneTasks.push(task);
                                            if (task.id === _this.applyHistory.taskId && task.assignee === _this.applyHistory.currentUserId) {
                                                // console.debug("找到当前用户" + _this.applyHistory.currentUserId + "的当前任务" + task.id + ",是1个已办任务");
                                                _this.applyHistory.currentDoneTask = task;
                                                _this.applyHistory.currentUserName = task.userName;
                                            }
                                        }
                                    }
                                });
                            }

                            // fixme 这个是追加单据，需要加判断
                            window.setTimeout(function () {
                                if (viewpager.curPageViewItem.contentInstance.refs.moreBill) {
                                    if (_this.applyHistory.bpmActivityForms.length === 0) {
                                        viewpager.curPageViewItem.contentInstance.refs.moreBill.$el.hide();
                                    } else {
                                        viewpager.curPageViewItem.contentInstance.refs.moreBill.$el.show();
                                    }
                                }
                            }, 100);
                            _this.getSort();

                            window._applyHistory = _this.applyHistory;
                            window.setTimeout(function () {

                                if (viewpager.curPageViewItem.contentInstance.refs.subform_repeat) {
                                    viewpager.curPageViewItem.contentInstance.refs.subform_repeat.bindData(subFormsList);
                                }
                                if (viewpager.curPageViewItem.contentInstance.refs.detail_repeat) {
                                    viewpager.curPageViewItem.contentInstance.refs.detail_repeat.bindData(jsonList);
                                } else if (viewpager.curPageViewItem.contentInstance.refs.middle_flow_repeat) {
                                    viewpager.curPageViewItem.contentInstance.refs.middle_flow_repeat.bindData(_this.applyHistory.processInstances);
                                }

                                if (viewpager.curPageViewItem.contentInstance.refs.copyuser_repeat) {
                                    if (_this.applyHistory.instData.copyUserParticipants) {
                                        viewpager.curPageViewItem.contentInstance.refs.copyuser_item.$el.show();
                                        viewpager.curPageViewItem.contentInstance.refs.copyuser_repeat.bindData(_this.applyHistory.instData.copyUserParticipants);
                                    }
                                }
                            }, 100);
                            _this.pageview.delegate('result_logo', function (target) {
                                if (!_this.detailData.dataCollection) {
                                    _this.pageview.refs.result_text.$el.hide();
                                    //判断单据状态
                                    if (_this.applyHistory.instData.endTime && _this.applyHistory.instData.endTime.indexOf("9999") === -1) {
                                        //taskKey="结束";
                                        if (_this.applyHistory.instData.deleteReason) {
                                            // console.log("驳回");
                                            target.$el.find('img').attr('src', './imgs/refuse.png');
                                            setTimeout(function () {
                                                target.$el.show();
                                            }, 300);
                                            //动画效果
                                            setTimeout(function () {
                                                target.$el.css({'-webkit-transform': 'scale(.5)', opacity: '1'});
                                            }, 450);
                                        } else {
                                            // console.log("完成");
                                            setTimeout(function () {
                                                target.$el.show();
                                            }, 300);
                                            //动画效果
                                            setTimeout(function () {
                                                target.$el.css({'-webkit-transform': 'scale(.5)', opacity: '1'});
                                            }, 450);
                                        }
                                    } else {
                                        _this.pageview.refs.result_text.innerText.css("color", "#E7A757");
                                        _this.pageview.refs.result_text.innerText.html("审批中");
                                        _this.pageview.refs.result_text.$el.show();
                                        if (_this.applyHistory.currentTodoTask) {
                                            console.log("待办");
                                            // _this.pageview.refs.result_text.innerText.html("审批中");
                                            // console.log();
                                        } else {
                                            if (_this.applyHistory.currentUserType === "auditor") {
                                                console.log("已流转");
                                                // _this.pageview.refs.result_text.innerText.html("审批中");
                                            } else {
                                                console.debug("进行中");
                                                // _this.pageview.refs.result_text.innerText.html("审批中");
                                            }
                                        }
                                    }
                                }
                            });
                            //如果是加签任务则也不能创建菜单因为已经加签给别人了，当前人虽然还有任务但是不能再审批
                            var taskAuditDesc = _this.applyHistory.currentTodoTask && _this.applyHistory.currentTodoTask.taskAuditDesc;
                            if (taskAuditDesc && taskAuditDesc.indexOf("加签给") !== -1) {
                                console.warn("当前任务是加签任务则不能再做审批");
                                _this.item.push({label: "任务加签中，请等待加签审批结果"});
                                // $("#auditMenu").html("<div class='font-size-3 tab1-rigth-22'>任务加签中，请等待加签审批结果</div>");
                            } else {
                                /**
                                 * 每个任务是否支持 驳回、改派、加签、指派
                                 * 任务的审批有同意或者分支两种方式。
                                 * 如果没有分支，则显示同意(如果支持指派则显示指派 )按钮，
                                 *    然后根据 是否支持 驳回、改派、加签 生成其他按钮。
                                 * 如果有分支，则显示分支项目按钮，
                                 *    然后根据 是否支持 驳回、改派、加签 生成其他按钮。
                                 */
                                if (_this.applyHistory.currentTodoTask) {
                                    var activity = _this.applyHistory.currentTodoTask.activity;
                                    var rejectable = false, delegateable = false, addsignable = false;//assignable=false,
                                    if (activity !== null && activity.properties !== null) {
                                        //  assignable = activity.properties.assignAble;
                                        rejectable = activity.properties.rejectAble;
                                        delegateable = activity.properties.delegateAble;
                                        addsignable = activity.properties.addsignAble;
                                    }
                                    _this.item.push({label: "同意"});
                                    if (rejectable) {
                                        _this.item.push({label: "驳回"});
                                    }
                                    _this.item.push({label: "抄送"});
                                    if (delegateable) {
                                        _this.item.push({label: "改派"});
                                    }
                                    if (addsignable) {
                                        _this.item.push({label: "加签"});
                                    }
                                } else {
                                    if (_this.applyHistory.currentDoneTask !== null && _this.applyHistory.instanceTodoTasks.length > 0) {
                                        var lastDoneTask = _this.applyHistory.instanceDoneTasks[_this.applyHistory.instanceDoneTasks.length - 1];
                                        if (lastDoneTask && _this.applyHistory.currentDoneTask && _this.applyHistory.currentDoneTask.id === lastDoneTask.id && lastDoneTask.deleteReason === "completed") {
                                            var lableTxt = _this.applyHistory.currentDoneTask.taskAuditDesc ? "撤回审批" : '同意';
                                            _this.item.push({label: lableTxt});
                                        }
                                    }
                                }
                                if (_this.applyHistory.taskBtnVars && _this.applyHistory.taskBtnVars.length > 0) {
                                    //因为指派属于同意类型,所以对指派的判断放在分支前面
                                    $.each(_this.applyHistory.taskBtnVars, function (idx, fenzhiBtn) {
                                        _this.item.push({label: fenzhiBtn});
                                    });
                                }
                                if (!_this.applyHistory.copyToEndTime) {
                                    if (_this.applyHistory.nodeFormID) {
                                        if (!_this.applyHistory.copyToEndTime) {
                                            _this.item.push({label: "编辑", id: _this.applyHistory.nodeFormID});
                                        }
                                        if (!_this.applyHistory.formKey) {
                                            window.setTimeout(function () {
                                                if (viewpager.curPageViewItem.contentInstance.refs.btnAddDoc) {
                                                    viewpager.curPageViewItem.contentInstance.refs.btnAddDoc.$el.show();
                                                }
                                            }, 100);
                                        }
                                    } else {
                                        window.setTimeout(function () {
                                            if (viewpager.curPageViewItem.contentInstance.refs.btnAddDoc) {
                                                viewpager.curPageViewItem.contentInstance.refs.btnAddDoc.$el.hide();
                                            }
                                        }, 100);
                                    }
                                    if (_this.applyHistory.editFlag) {
                                        if (!_this.applyHistory.instData.endTime) {
                                            _this.item.push({label: "编辑", id: _this.applyHistory.instData.id});
                                        }
                                    }
                                }
                                if (_this.applyHistory.currentUserId === _this.applyHistory.instData.startUserId && _this.applyHistory.instData.deleteReason) {
                                    _this.item.push({label: "重新提交"});
                                }
                                //FIXME:xiba测试
                                // _this.item.push({label: "编辑", id: _this.applyHistory.nodeFormID});

                            }
                            _this.initBtn();
                        } else {
                            _this.pageview.showTip({text: listData.msg, duration: 2000});
                        }
                    },
                    error: function (listData) {
                    }
                };

            this.pageview.ajax(listAjaxConfig);
        },
        //显示按钮
        initBtn: function () {
            for (var idx = 0; idx < this.item.length; idx++) {
                if (this.item[idx].label.indexOf("撤回申请") > -1) {
                    this.item.splice(idx, 1);
                    break;
                }
            }
            if (this.item.length > 4) {
                var btnItem = [];
                var moreItem = [];
                for (var itemIdx = 0; itemIdx < this.item.length; itemIdx++) {
                    if (itemIdx >= 3) {
                        moreItem.push(this.item[itemIdx]);
                        // item.remove(itemIdx);
                    } else {
                        btnItem.push(this.item[itemIdx]);
                    }
                }
                if (btnItem.length === 0) {
                    this.pageview.refs.buttonGroup.$el.hide();
                    this.pageview.refs.buttonGroup.$el.css({"background-color": "rgb(247, 247, 247)"});
                    this.pageview.refs.buttonGroup.$el.css({"border-top": "1px solid #eee"});
                } else {
                    this.pageview.refs.buttonGroup.$el.show();
                    this.pageview.refs.buttonGroup.$el.css({"border-top": "1px solid #eee"});
                    this.pageview.refs.bottomToolBar.$el.css({"background-color": "rgb(255, 255, 255)"});
                    this.pageview.refs.buttonGroup.$el.css({"background-color": "rgb(255, 255, 255)"});
                }
                this.pageview.refs.moreRepeat.bindData(moreItem);
                this.pageview.refs.buttonGroup.bindData(btnItem);

                this.pageview.refs.bottomToolBar.$el.show();
                this.pageview.refs.splitline.$el.show();
                this.pageview.refs.moreBtn.$el.show();
            } else {
                if (this.item.length === 0) {
                    this.pageview.refs.bottomToolBar.$el.hide();
                    this.pageview.refs.buttonGroup.$el.css({"background-color": "rgb(247, 247, 247)"});
                    this.pageview.refs.buttonGroup.$el.css({"border-top": "rgb(247, 247, 247)"});

                } else {
                    this.pageview.refs.bottomToolBar.$el.show();
                    this.pageview.refs.buttonGroup.$el.css({"background-color": "rgb(255, 255, 255)"});
                    this.pageview.refs.bottomToolBar.$el.css({"background-color": "rgb(255, 255, 255)"});
                }
                this.pageview.refs.buttonGroup.bindData(this.item);
                this.pageview.refs.splitline.$el.hide();
                this.pageview.refs.moreBtn.$el.hide();
            }
        },
        //将表单数据进行初步解析
        initFormData: function () {
            var _this = this;
            var dataList = _this.applyHistory.formDataList;
            if (dataList.length === 0) {
                console.debug("表单数据不存在");
                return;
            }
            _this.applyHistory.mainFormData = dataList[0];
            //debugger;
            // console.debug("dataList==" + JSON.stringify(dataList[0]));
            var sfCnt = 0;
            $.each(dataList[0], function (k, v) {
                // console.debug("遍历表单数据:" + k + "=" + v);
                if ($.isArray(v)) {
                    // console.debug("发现子表单.tab=" + k);
                    sfCnt++;
                    //只考虑最多二级的表单
                    _this.applyHistory.subFormDatas[k] = v;//v是List<Map>结构
                } else {
                    _this.applyHistory.mainFormData[k] = v;
                }
            });
        },
        viewpager_init: function (sender, params) {
            this.viewpager = sender;
        },
        getSort: function () {
            var _this = this;
            var startTaskInstances = {};
            this.applyHistory.processInstances = [];
            this.applyHistory.instData.historicActivityInstances.forEach(function (item, index) {
                if (item.activityType === "startEvent") {
                    startTaskInstances.userName = item.userName;
                    startTaskInstances.activityType = item.activityType;
                    startTaskInstances.startTime = item.startTime;
                    startTaskInstances.endTime = item.endTime;
                    startTaskInstances.pic = item.pic;
                    startTaskInstances.assignee = _this.applyHistory.instData.startUserId;
                    startTaskInstances.memberId = item.memberId;
                }
            });
            // for (var i = 0; i < this.applyHistory.instData.historicTasks.length; i++) {
            // }
            var item = this.applyHistory.instData.historicTasks;
            // this.applyHistory.instData.historicTasks.forEach(function (item, idx) {
            if (item) {
                for (var x = item.length - 1; x >= 0; x--) {
                    var historicActivityInstances = _this.applyHistory.instData.historicActivityInstances;
                    var taskInstances = {};
                    // for (var i = 0; i < historicActivityInstances.length; i++) {
                    // if (item[x].taskDefinitionKey === historicActivityInstances[i].activityId) {
                    taskInstances.userName = item[x].userName;
                    taskInstances.activityType = "userTask";
                    taskInstances.startTime = item[x].startTime;
                    taskInstances.endTime = item[x].endTime;
                    taskInstances.pic = item[x].pic;
                    taskInstances.assignee = item[x].assignee;
                    taskInstances.taskId = item[x].id;
                    taskInstances.taskComments = item[x].taskComments;
                    taskInstances.dueDate = item[x].dueDate;
                    taskInstances.deleteReason = item[x].deleteReason;
                    taskInstances.taskAuditDesc = item[x].taskAuditDesc;
                    taskInstances.processDefinitionId = item[x].processDefinitionId;
                    taskInstances.memberId = item[x].memberId;
                    // }
                    // }
                    _this.applyHistory.processInstances.push(taskInstances);
                }
            }
            // });
            this.applyHistory.processInstances.push(startTaskInstances);
        },
        segment_change: function (sender, params) {
            var _this = this;
            if (!params.nochange) {
                var item = params.item;
                var itemData = item.datasource;
                var itemTitle = itemData.title;
                _this.getSort();
                if (itemTitle === "详情") {
                    this.initBtn();
                    this.viewpager.showItem("detailContent_detail", {type: "content"});
                } else if (itemTitle === "流程") {
                    this.initBtn();
                    this.viewpager.showItem("detailProcess_detail", {type: "process", parentThis: this});
                    window.setTimeout(function () {
                        _this.viewpager.curPageViewItem.contentInstance.refs.middle_flow_repeat.bindData(_this.applyHistory.processInstances);
                    }, 200);
                } else if (itemTitle === "附件") {

                    if (!this.applyHistory.instData.endTime) {
                        if (!this.applyHistory.instData.deleteReason) {
                            if (_this.applyHistory.currentUserId === _this.applyHistory.processInstances[0].assignee && _this.applyHistory.taskId === _this.applyHistory.processInstances[0].taskId) {
                                _this.pageview.refs.buttonGroup.bindData([{label: "上传附件"}]);
                            } else {
                                _this.pageview.refs.bottomToolBar.$el.hide();
                            }
                        } else {
                            _this.pageview.refs.bottomToolBar.$el.hide();
                        }
                    }
                    this.pageview.refs.splitline.$el.hide();
                    this.pageview.refs.moreBtn.$el.hide();
                    this.viewpager.showItem("detailAttachment_detail", {type: "attachment", parent: this});

                    // 给上传组件传入dom
                    setTimeout(function () {
                        // 异步因为需要新的dom渲染完
                        _this.initUploader(_this.pageview.refs.buttonGroup);
                    }, 500);
                }
            }
        },
        morePopover_init: function (sender, params) {
            this.morePopver = sender;
        },
        moreBtn_click: function (sender, params) {
            this.morePopver.show(sender);
        },
        moreRepeat_itemclick: function (sender, params) {
            this.buttonGroupClick(sender);
            this.morePopver.hide();
        },
        buttonGroup_itemclick: function (sender, params) {
            this.buttonGroupClick(sender);
        },
        // 显示出来的和pop隐藏的按钮公用点击
        buttonGroupClick: function (sender) {
            var _this = this,
                key = sender.datasource.label.replace(/ /g, ''),
                taskId = this.applyHistory.taskId,
                iforms = this.applyHistory.iForms,
                source = iforms ? iforms.source : '',
                taskDefinitionKey = this.applyHistory.instData.currentActivityId;
            //
            // this.detailData.inst.historicTasks.forEach(function (value, key) {
            //     if (value.assignee === _this.detailData.currentUserId) {
            //         taskId = value.id;
            //     }
            // });

            var para = {
                instanceId: this.detailData.inst.id,
                processId: this.detailData.inst.processDefinitionId,
                taskId: taskId,
                starter: this.detailData.inst.startUserId
            };
            var editPara = {
                id: this.pageview.params.instId,
                title: encodeURI(this.instName),
                procInstName: encodeURI(window._applyHistory.instData.name),
                formType: null,
                source: source,
                taskDefinitionKey: taskDefinitionKey
            };
            switch (key) {
                case '编辑':
                    editPara.formType = 'MODIFY';
                    this.pageview.replaceGo("form", editPara);
                    break;
                case '同意':
                    this.goAgreeAndAssign(para);
                    break;
                case '驳回':
                    this.goReject(para);
                    break;
                case '抄送':
                    this.goCopyTo(para);
                    break;
                case '加签':
                    this.goAddSign(para);
                    break;
                case '改派':
                    this.goDelegate(para);
                    break;
                case '撤回审批':
                    this.goResetApprove(para);
                    break;
                case '撤回申请':
                    this.goResetApply(para);
                    break;
                case '上传附件':
                    // 模拟点击
                    if (this.fileNum < this.fileMaxNum) {
                        $('.moxie-shim.moxie-shim-html5 input').click();
                    } else {
                        this.pageview.showTip({text: "最多上传" + this.fileMaxNum + "张图片", duration: 1000});
                    }
                    break;
                case '重新提交':
                    editPara.formType = 'reAdd';
                    this.pageview.replaceGo("form", editPara);
                    break;
                default:
                    console.error('未指定的按钮类型');
                    break;
            }
        },
        goAgreeAndAssign: function (para) {
            var _this = this;
            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            // 指派检查
            this.pageview.ajax({
                url: "process/assignCheck",
                type: "GET",
                data: {
                    "taskId": para.taskId
                },
                success: function (data) {
                    _this.pageview.hideLoading(true);

                    if (data.success) {
                        if (!data.data.assignAble) {
                            _this.pageview.go('deal', {
                                type: 1, // 同意
                                instanceId: para.instanceId,
                                processId: para.processId,
                                taskId: para.taskId,
                                formName: this.formName
                            });
                        } else {
                            window.localStorage.setItem('ASSIGN_CHECK_DATA', JSON.stringify(data));

                            _this.pageview.go('deal', {
                                type: 3, // 指派
                                instanceId: para.instanceId,
                                processId: para.processId,
                                taskId: para.taskId,
                                formName: this.formName
                            });
                        }
                    } else {
                        if (data.msg.indexOf("当前环节任务已完成") > -1) {
                            _this.pageview.showTip({text: '此任务已被修改或完成，请刷新或重新进入', duration: 800});
                            _this.applyHistory = {};
                            _this.item = [];
                            _this.loadData();
                        }
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                        // console.error(data.msg);
                    }
                },
                error: function (err) {
                    console.error('指派检查失败');
                }
            });
        },
        goReject: function (para) {
            this.pageview.go('deal', {
                type: 2,
                instanceId: para.instanceId,
                processId: para.processId,
                taskId: para.taskId,
                starter: para.starter
            });
        },
        goAddSign: function (para) {
            this.pageview.go('deal', {
                type: 4,
                instanceId: para.instanceId,
                processId: para.processId,
                taskId: para.taskId,
                starter: para.starter
            });
        },
        goDelegate: function (para) {
            var _this = this;

            try {
                window.yyesn.enterprise.selectContacts(function (b) {
                    if (b.error_code === "0") {
                        var itemData = b.data[0];
                        _this.delegatePerson = {
                            userName: itemData.name,
                            headImgUrl: itemData.avatar,
                            memberId: itemData.member_id
                        };

                        _this.delegateDialog = new Dialog({
                            mode: 3,
                            wrapper: _this.pageview.$el,
                            contentText: "确定要将审批单改派给" + itemData.name + "进行审批吗?",
                            btnDirection: "row",
                            buttons: [{
                                title: "取消",
                                style: {
                                    height: 45,
                                    fontSize: 16,
                                    color: c.titleColor,
                                    borderRight: '1px solid #eee'
                                },
                                onClick: function () {
                                    _this.delegateDialog.hide();
                                }
                            }, {
                                title: "确定",
                                style: {
                                    height: 45,
                                    fontSize: 16,
                                    color: "#37b7fd",
                                },
                                onClick: function () {
                                    _this.delegateDialog.hide();

                                    _this.doDelegate(para);
                                }
                            }]
                        });
                        _this.delegateDialog.show();
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
        doDelegate: function (para) {
            var _this = this;
            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            this.pageview.ajax({
                url: "process/delegateTask",
                type: "POST",
                data: {
                    instanceId: para.instanceId,
                    processId: para.processId,
                    taskId: para.taskId,
                    toAssignee: this.delegatePerson.memberId
                },
                success: function (data) {
                    _this.pageview.hideLoading(true);
                    if (data.success) {
                        _this.pageview.showTip({text: "改派成功", duration: 1000});
                        _this.applyHistory = {};
                        _this.item = [];
                        _this.loadData();
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (data) {
                    _this.pageview.showTip({text: data.msg, duration: 1000});
                }
            });
        },
        goCopyTo: function (para) {
            var _this = this;

            try {
                window.yyesn.enterprise.selectContacts(function (b) {
                    if (b.error_code === "0") {
                        var persons = b.data,
                            names = '',
                            num = 0,
                            contentText = '';

                        _this.copy_to_list = [];
                        for (var i = 0, j = persons.length; i < j; i++) {
                            var itemData = persons[i];
                            _this.copy_to_list.push(itemData);
                            // 只显示三个人
                            if (i < 3) {
                                names += itemData.name + '、';
                            }
                        }
                        // 去掉最后一个 "、" 号
                        names = names.substring(0, names.length - 1);
                        num = _this.copy_to_list.length;
                        if (num > 3) {
                            contentText = "确定要将" + names + "等" + num + "人加到抄送人中吗？";
                        } else {
                            contentText = "确定要将" + names + "加到抄送人中吗？";
                        }

                        _this.copyToDialog = new Dialog({
                            mode: 3,
                            wrapper: _this.pageview.$el,
                            contentText: contentText,
                            btnDirection: "row",
                            buttons: [{
                                title: "取消",
                                style: {
                                    height: 45,
                                    fontSize: 16,
                                    color: c.titleColor,
                                    borderRight: '1px solid #eee'
                                },
                                onClick: function () {
                                    _this.copyToDialog.hide();
                                }
                            }, {
                                title: "确定",
                                style: {
                                    height: 45,
                                    fontSize: 16,
                                    color: "#37b7fd"
                                },
                                onClick: function () {
                                    _this.copyToDialog.hide();
                                    _this.doCopyTo(para);
                                }
                            }]
                        });

                        _this.copyToDialog.show();
                    }
                }, {
                    mode: 1,
                    multi: 1
                }, function (b) {
                });
            } catch (e) {
                alert(JSON.stringify(e));
            }
        },
        doCopyTo: function (para) {
            var _this = this,
                assignees = '';

            this.copy_to_list.forEach(function (value, key) {
                assignees += value.member_id + ',';
            });

            assignees = assignees.substring(0, assignees.length - 1);
            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            this.pageview.ajax({
                url: "process/copyToTask",
                type: "POST",
                data: {
                    instanceId: para.instanceId,
                    processId: para.processId,
                    taskId: para.taskId,
                    assignees: assignees
                },
                success: function (data) {
                    _this.pageview.hideLoading(true);

                    if (data.success) {
                        _this.pageview.showTip({text: "抄送成功", duration: 1000});
                        _this.applyHistory = {};
                        _this.item = [];
                        _this.loadData();
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (data) {
                    _this.pageview.showTip({text: data.msg, duration: 1000});
                }
            });
        },
        goResetApply: function (para) {
            var _this = this;

            if (!_this.delegateDialog) {
                _this.delegateDialog = new Dialog({
                    mode: 3,
                    wrapper: _this.pageview.$el,
                    contentText: "确定要撤销该申请吗?",
                    btnDirection: "row",
                    buttons: [{
                        title: "取消",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: c.titleColor,
                            borderRight: '1px solid #eee'
                        },
                        onClick: function () {
                            _this.delegateDialog.hide();
                        }
                    }, {
                        title: "确定",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: "#37b7fd",
                        },
                        onClick: function () {
                            _this.delegateDialog.hide();
                            _this.pageview.showLoading({text: "努力加载中...", timeout: 8000});
                            _this.pageview.ajax({
                                url: "process/withdrawTask",
                                type: "POST",
                                data: {
                                    taskId: para.taskId
                                },
                                success: function (data) {
                                    _this.pageview.hideLoading(true);

                                    if (data.success) {
                                        _this.pageview.showTip({text: "撤回成功", duration: 1000});

                                    } else {
                                        _this.pageview.showTip({text: data.msg, duration: 1000});
                                    }
                                },
                                error: function (data) {
                                    _this.pageview.showTip({text: data.msg, duration: 1000});
                                }
                            });
                        }
                    }]
                });
            }
            _this.delegateDialog.show();
        },
        goResetApprove: function (para) {
            var _this = this;
            _this.delegateDialog = new Dialog({
                mode: 3,
                wrapper: _this.pageview.$el,
                contentText: "确定要撤销该审批吗?",
                btnDirection: "row",
                buttons: [{
                    title: "取消",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: c.titleColor,
                        borderRight: '1px solid #eee'
                    },
                    onClick: function () {
                        _this.delegateDialog.hide();
                    }
                }, {
                    title: "确定",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: "#37b7fd"
                    },
                    onClick: function () {
                        _this.delegateDialog.hide();

                        _this.pageview.showLoading({text: "努力加载中...", timeout: 8000});
                        _this.pageview.ajax({
                            url: "process/withdrawTask",
                            type: "POST",
                            data: {
                                taskId: para.taskId
                            },
                            success: function (data) {
                                _this.pageview.hideLoading(true);
                                if (data.success) {
                                    c.replaceUrl(_this.pageview.params.taskId, data.data, _this.pageview);
                                    _this.pageview.params.taskId = data.data;

                                    _this.pageview.showTip({text: "撤回成功", duration: 1000});
                                    _this.applyHistory = {};
                                    _this.item = [];
                                    _this.loadData();
                                } else {
                                    _this.pageview.showTip({text: data.msg, duration: 1000});
                                }
                            },
                            error: function (data) {
                                _this.pageview.showTip({text: data.msg, duration: 1000});
                            }
                        });
                    }
                }]
            });
            _this.delegateDialog.show();
        },
        //文件上传控件
        initUploader: function (sender) {
            var _this = this;
            this.loadToken(function (token) {
                _this.token = token;
            });

            var picker = sender.$el;
            var container = $('.flow_repeat');
            var fileLimit = this.fileMaxNum;
            if (!this.fileUploader) {
                this.fileUploader = new FileUploader(this.pageview, this);
                this.uploaderId = this.fileUploader.initUploader(picker, container, this.pageview.params.taskId, fileLimit);
                setTimeout(function () {
                    _this.fileUploader.updateUploaderSize();
                }, 100);
            }
        },
        loadFilesData: function () {
            this.viewpager.curPageViewItem.contentInstance.pageview.plugin._loadData();
        },
        loadToken: function (callbackFunc) {
            this.pageview.ajax({
                url: "user/getToken",
                success: function (token) {
                    callbackFunc(token);
                },
                error: function (token) {
                    console.error(token);
                }
            });
        },
    };
    return PageLogic;
});
