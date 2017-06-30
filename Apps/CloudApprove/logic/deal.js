define(["../parts/common", "utils"], function (c, utils) {
    function pageLogic(config) {
        this.pageview = config.pageview;
        this.params = this.pageview.params || {};
        this.comment = '';
        this.setHeader();
        this.selectAssignList = []; // 总的选择流程中人的数组
        this.add_sign_select_list = []; // 加签选中人的数组
        this.hasSelectIndex = 0;
        this.reminderLock = false; // 催办锁
    }

    pageLogic.prototype = {
        onPageResume: function () {
            this.processSelectAssignList();
            this.reRenderAssignList();
        },
        processSelectAssignList: function () {
            var _this = this,
                alreadyExist = false;

            this.selectAssignList.forEach(function (value, key) {
                if (key === _this.hasSelectIndex) {
                    alreadyExist = true;
                    value = _this.hasSelectData;
                }
            });

            if (!alreadyExist && _this.hasSelectData) {
                this.selectAssignList.push(_this.hasSelectData);
            }
        },
        reRenderAssignList: function () {
            var names = '',
                needChangeItem = this.agreeAssignList[this.hasSelectIndex].components.agree_assign_list_repeat_item.components.agree_assign_list_repeat_content;

            if (this.hasSelectData && this.hasSelectData.length !== 0) {
                // 需要更改名称的item

                this.hasSelectData.forEach(function (value, key) {
                    names += value.name + ';';
                });
            } else {
                names = '请选择审批人';
            }
            needChangeItem.setText(names);
        },
        setHeader: function () {
            var _this = this;
            var title = this.formName || "";

            try {
                if (this.params.type === '1' && _this.params.userName) {
                    title = '转交给' + decodeURI(_this.params.userName);
                } else if (this.params.type === '5') {
                    title = '催办';
                } else {
                    title = '审批意见';
                }

                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: title,
                    rightTitle: "",
                    rightValues: [],
                }, function (b) {
                });
            } catch (e) {

            }
        },
        main_view_init: function (sender, params) {
            // 1 通过 2 驳回 3 指派 4 加签 5 催办
            if (this.params.type === '2') {
                this.beforeReject();
            } else if (this.params.type === '3') {
                this.beforeAssign();
            } else if (this.params.type === '4') {
                this.beforeAddSign();
            }
        },
        beforeReject: function (sender, params) {
            var _this = this;

            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            this.pageview.ajax({
                url: '/process/rejectCheck',
                type: 'POST',
                data: {
                    taskId: this.params.taskId
                },
                success: function (data) {
                    _this.pageview.hideLoading(true);

                    _this.pageview.delegate('reject_process_repeat', function (target) {
                        _this.rejectList = data.data;
                        if (data.msg && data.msg.indexOf("BPM数据不存在") > -1) {
                            _this.pageview.showTip({text: '此单据已被修改，请刷新或重新进入！', duration: 1000});

                            window.changeFormStatus = true;

                            setTimeout(function () {
                                _this.pageview.goBack();
                            }, 1000);
                        } else {
                            _this.rejectList.forEach(function (value, key) {
                                if (!value.activityName) {
                                    value.activityName = '环节名称未定义（审批人：';
                                    if (value.participants && value.participants.length > 0) {
                                        value.activityName += (value.participants[0].name || '未指定') + '）';
                                    }
                                }
                            });

                            _this.rejectList.push({
                                activityName: '终止流程',
                                placeholder: '终止当前审批流并通知发起人',
                                activityId: '-2'
                            });

                            target.bindData(_this.rejectList);
                        }
                    });
                }
            });
        },
        beforeAssign: function (sender, params) {
            var _this = this;

            _this.currentTaskAsign = JSON.parse(window.localStorage.getItem('ASSIGN_CHECK_DATA')).data;

            _this.pageview.delegate('agree_assign', function (target) {
                target.$el.show();
            });

            if (_this.currentTaskAsign.assignAble) {
                _this.initAssignList(_this.currentTaskAsign.assignInfo);
            } else {
                var desc = _this.currentTaskAsign.description;
                _this.pageview.showTip({text: "任务不支持指派." + (desc ? desc : "")});
            }
        },
        beforeAddSign: function (sender, params) {
            var _this = this;

            this.pageview.delegate('add_sign', function (target) {
                target.$el.show();
            });
        },
        beforeReminder: function () {

        },
        initAssignList: function (assignInfo) {
            if (assignInfo === null) {
                return;
            }

            var assignInfoItems = assignInfo.assignInfoItems || [],
                length = assignInfoItems.length;

            console.info("可选指派环节数量:" + length);
            if (length === 0) {
                return;
            }

            this.pageview.delegate('agree_assign_list_repeat', function (target) {
                target.bindData(assignInfoItems);
            });
        },
        reject_process_init: function (sender, params) {
            if (this.params.type === '2') {
                sender.config.style.display = 'flex';
            }
        },
        reject_process_repeat_item_init: function (sender, params) {
            // 只有一个选项时默认选中
            if (this.rejectList.length === 1) {
                sender.parent.select();
                this.activityId = -2; // 终止
            }
        },
        // 拒绝列表
        reject_process_repeat_itemclick: function (sender, params) {
            sender.select();
            if (sender.datasource.activityId === '-2') {
                this.activityId = -2; // 终止
            } else {
                this.activityId = sender.datasource.activityId;
            }
        },
        input_textarea_init: function (sender, params) {
            if (this.params.type === '1') {
                sender.config.placeholder = '请输入同意理由（非必填, 200字以内）';
            } else if (this.params.type === '2') {
                sender.config.placeholder = '请输入拒绝理由（非必填, 200字以内）';
            } else if (this.params.type === '3') {
                sender.config.placeholder = '请输入同意理由（非必填, 200字以内）';
            } else if (this.params.type === '5') {
                sender.config.placeholder = '请输入催办内容 （200字以内）';
            }
        },
        input_textarea_didmount: function (sender, params) {
            if (this.params.type === '5') {
                var text = decodeURI(this.params.currentUserName) + '催您审批 “' + decodeURI(this.params.instName) + '”，赶快去处理吧。';
                sender.setValue(text);
            }
        },
        // 指派列表
        agree_assign_list_repeat_itemclick: function (sender, params) {
            var _this = this;

            this.pageview.delegate('agree_assign_list_repeat', function (target) {
                // 同意时流程列表数据
                _this.agreeAssignList = target.components || [];
            });

            this.pageview.showPage({
                pageKey: 'selectApprovers',
                mode: 'fromRight2',
                nocache: true,
                params: {
                    taskId: _this.params.taskId,
                    dealLogic: _this,
                    approverList: sender.datasource,
                    index: params.index
                }
            });
        },
        add_sign_person_right_repeat_init: function (sender, params) {
            sender.bindData(this.add_sign_select_list);
        },
        add_sign_person_repeat_itemclick: function (sender, params) {
            var itemMemberID = sender.datasource.memberId.toString();

            if (this.add_sign_select_list) {
                for (var i = this.add_sign_select_list.length - 1; i >= 0; i--) {
                    if (this.add_sign_select_list[i].member_id.toString() === itemMemberID) {
                        this.add_sign_select_list.splice(i, 1);
                    }
                }
            }
            sender.remove();
        },
        add_sign_person_btn_click: function (sender, params) {
            var _this = this;

            try {
                window.yyesn.enterprise.selectContacts(function (b) {
                    if (b.error_code === "0") {
                        var persons = b.data;
                        _this.pageview.refs.add_sign_person_repeat.empty();
                        _this.add_sign_select_list = [];
                        for (var i = 0, j = persons.length; i < j; i++) {
                            var itemData = persons[i];
                            _this.add_sign_select_list.push(itemData);
                            _this.pageview.refs.add_sign_person_repeat.addItem({
                                userName: itemData.name,
                                headImgUrl: itemData.avatar,
                                memberId: itemData.member_id
                            });
                        }
                    }
                }, {
                    mode: 1,
                    multi: 1,
                    select_list: _this.add_sign_select_list || []
                }, function (b) {
                });
            } catch (e) {
                alert(JSON.stringify(e));
            }
        },
        add_sign_bottom_poplayer_init: function (sender, params) {
            this.poplayer = sender;
        },
        add_sign_way_click: function (sender, params) {
            this.poplayer.show();
        },
        add_sign_bottom_poplayer_repeat_itemclick: function (sender, params) {
            var _this = this;

            this.pageview.delegate('add_sign_way_middle', function (target) {
                target.setText(sender.datasource.title);
                _this.selectAssignWay = sender.datasource.title;
                _this.selectAssignWayKey = sender.datasource.title === '会签' ? '1' : '0';
            });

            sender.select();
            this.poplayer.hide();
        },
        agree_assign_list_repeat_title_init: function (sender, params) {
            sender.config.text = sender.config.text || '环节名称未定义';
        },
        submit_click: function (sender, params) {
            var para = {},
                _this = this;

            para.instanceId = this.params.instanceId; // 1 同意 2 不同意 3 指派 4 加签
            para.taskId = this.params.taskId;
            para.comment = sender.parent.components.main_view.components.input_textarea.$el.find('textarea')
                .val() || '';
            para.processId = this.params.processId;

            para.comment = this.beforeSubmit(para.comment);

            if (this.params.type === '1') {
                // 同意

                this.doAgree(para);
            } else if (this.params.type === '2') {
                // 驳回

                this.doReject(para);
            } else if (this.params.type === '3') {
                // 指派

                this.doAssign(para);
            } else if (this.params.type === '4') {
                // 加签

                this.doAddSign(para);
            } else if (this.params.type === '5') {
                // 催办

                this.doReminder(para);
            }
        },
        // 同意
        doAgree: function (_para) {
            var _this = this,
                para = _para,
                url = '';

            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            // 追加单据
            if (this.params.isAdd) {
                var addData = window.localStorage.getItem('ADDITIONAL_FORM_DATA');

                url = '/process/saveActivityFormAndAudit';
                para = $.extend(para, {formData: addData, businessKey: this.params.businessKey});
            } else {
                url = '/process/audit';

                // 审批意见回写
                para.formData = this.addTaskCommentPara();
            }

            this.pageview.ajax({
                url: url,
                data: para,
                type: 'POST',
                success: function (data) {
                    _this.pageview.hideLoading(true);
                    console.log(data);
                    if (data.code === 0) {
                        _this.pageview.showTip({text: '审批成功！', duration: 800});

                        window.changeFormStatus = true;

                        setTimeout(function () {
                            // 追加退两格
                            if (_this.params.isAdd) {
                                _this.pageview.goBack(-2);
                            } else {
                                _this.pageview.goBack(-1);
                            }
                            // _this.pageview.replaceGo('detail', {
                            //     instId: _this.params.instanceId || '',
                            //     formId: _this.params.taskId || '',
                            //     formName: _this.params.formName
                            // });
                        }, 800);
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        // 驳回
        doReject: function (para) {
            var _this = this;

            para.activityId = this.activityId;
            para.starter = this.params.starter;

            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

            this.pageview.ajax({
                url: '/process/rejectTask',
                data: para,
                type: 'POST',
                success: function (data) {
                    _this.pageview.hideLoading(true);

                    if (data.code === 0) {
                        _this.pageview.showTip({text: '驳回成功！', duration: 800});

                        window.changeFormStatus = true;

                        setTimeout(function () {
                            _this.pageview.goBack();
                        }, 800);
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        // 指派
        doAssign: function (para) {
            var alreadySelect = false,
                _this = this,
                assignInfoItemsCopy = utils.copy(_this.currentTaskAsign.assignInfo.assignInfoItems);

            assignInfoItemsCopy.forEach(function (value, key) {
                value.participants = [];

                _this.selectAssignList.forEach(function (_value, _key) {
                    if (key === _key) {
                        value.participants = _value;
                        alreadySelect = true;
                    }
                });
            });

            // 追加单据指派时增加的数据
            if (this.params.isAdd) {
                var addData = window.localStorage.getItem('ADDITIONAL_FORM_DATA');

                _this.currentTaskAsign.assignInfo.formData = addData;
            }

            if (!alreadySelect) {
                this.pageview.showTip({text: '请选择1个或多个指派环节中的1个或多个用户！', duration: 4000});
                return false;
            } else {
                this.currentTaskAsign.assignInfo.assignInfoItems = JSON.stringify(assignInfoItemsCopy);

                this.pageview.showLoading({text: "努力加载中...", timeout: 8000});

                // 审批意见会写多传的参数
                var formData = this.addTaskCommentPara();

                this.pageview.ajax({
                    url: "process/actionTask",
                    type: "POST",
                    data: $.extend({
                        instanceId: para.instanceId,
                        processId: para.processId,
                        formData: formData,
                        comment: para.comment
                    }, _this.currentTaskAsign.assignInfo),
                    success: function (data) {
                        _this.pageview.hideLoading(true);

                        if (data.success) {
                            _this.doComment(para);
                            _this.pageview.showTip({text: "指派成功", duration: 1000});
                            setTimeout(function () {
                                // 追加退两格
                                if (_this.params.isAdd) {
                                    _this.pageview.goBack(-2);
                                } else {
                                    _this.pageview.goBack(-1);
                                }
                                // _this.pageview.replaceGo('detail', {
                                //     instId: _this.params.instanceId || '',
                                //     formId: _this.params.taskId || '',
                                //     formName: _this.params.formName
                                // });
                            }, 1100);
                        } else {
                            _this.pageview.showTip({text: data.msg, duration: 1000});
                        }
                    },
                    error: function () {
                        _this.pageview.showTip({text: "指派失败", duration: 1000});
                    }
                });
            }
        },
        // 评论
        doComment: function (para) {
            var _this = this;

            if (para.comment) {
                this.pageview.ajax({
                    url: "process/addComment",
                    type: "POST",
                    data: {
                        instanceId: para.instanceId,
                        comment: para.comment,
                        taskId: para.taskId
                    },
                    success: function () {
                    },
                    error: function () {
                        _this.pageview.showTip({text: "评论失败", duration: 1000});
                    }
                });
            }
        },
        // 加签
        doAddSign: function (para) {
            var _this = this,
                assignees = this.add_sign_select_list,
                assigneeIds = '';

            if (assignees.length === 0) {
                this.pageview.showTip({text: "请选择加签人", duration: 1000});
                return;
            }

            if (!this.selectAssignWayKey) {
                this.pageview.showTip({text: "请选择加签方式", duration: 1000});
                return;
            }

            assignees.forEach(function (value, key) {
                if (key !== (assignees.length - 1)) {
                    assigneeIds += value.member_id + ',';
                } else {
                    assigneeIds += value.member_id;
                }
            });

            this.pageview.showLoading({text: "努力加载中...", timeout: 8000});
            this.pageview.ajax({
                url: "process/counterSignAddTask",
                type: "POST",
                data: {
                    instanceId: para.instanceId,
                    processId: para.processId,
                    taskId: para.taskId,
                    assignees: assigneeIds,
                    counterSignType: this.selectAssignWayKey
                },
                success: function (data) {
                    _this.pageview.hideLoading(true);
                    if (data.success) {
                        _this.doComment(para);
                        _this.pageview.showTip({text: "加签成功", duration: 1000});
                        setTimeout(function () {
                            _this.pageview.goBack();
                        }, 1100);
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function () {
                    _this.pageview.showTip({text: "加签失败", duration: 1000});
                }
            });
        },
        add_sign_bottom_poplayer_repeat_iteminit: function (sender, params) {
            var _this = this;

            if (sender.datasource.title === "抢占") {
                sender.select();

                this.pageview.delegate('add_sign_way_middle', function (target) {
                    target.setText('抢占');
                    _this.selectAssignWay = '抢占';
                    _this.selectAssignWayKey = '0';
                });
            }
        },
        doReminder: function (para) {
            var _this = this;

            if (!para.comment) {
                this.pageview.showTip({text: "请输入催办内容", duration: 1000});
                return false;
            }

            // 如果没锁
            if (!this.reminderLock) {
                this.pageview.showLoading({text: "处理中..."});
                this.reminderLock = true; // 加锁

                this.pageview.ajax({
                    url: "esn/sendTaskMessage",
                    timeout: 15000,
                    type: "POST",
                    data: {
                        processInstanceId: this.params.instId,
                        fromUserId: this.params.currentUserId,
                        toUserId: this.params.assignee,
                        message: para.comment,
                        taskId: this.params.taskId,
                        formInstanceId: this.params.formInstanceId,
                        processDefinitionId: this.params.processDefinitionId
                    },
                    success: function (data) {
                        _this.pageview.hideLoading(true);
                        if (data.success) {
                            _this.pageview.showTip({text: "催办成功", duration: 1000});
                            setTimeout(function () {
                                _this.reminderLock = false; // 解锁
                                _this.pageview.goBack();
                            }, 1000);
                        } else {
                            _this.pageview.showTip({text: data.msg, duration: 1000});
                            _this.reminderLock = false; // 解锁
                        }
                    },
                    error: function (data) {
                        _this.pageview.hideLoading(true);
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                        _this.reminderLock = false; // 解锁
                    }
                });
            }
        },
        // 审批意见回写增加的参数
        addTaskCommentPara: function () {
            var formDataList = window._formData,
                applyHistory = window._applyHistory,
                formData = {};

            if ($.isArray(formDataList) && formDataList.length > 0 && formDataList[0]) {
                formData = {
                    formData: formDataList,
                    pkValue: applyHistory.formDataList[0].pk_boins,
                    version: applyHistory.formDataList[0].version,
                    pk_temp: applyHistory.formDataList[0].pk_temp,
                    tableName: applyHistory.iForms.bo_tablename
                };
                formData = JSON.stringify(formData);
            } else {
                formData = '';
            }
            return formData;
        },
        beforeSubmit: function (content) {
            return this.filterEmoji(content);
        },
        filterEmoji: function (content) {
            if (!content) return '';

            var emojireg = content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|[\uD800-\uDBFF]|[\uDC00-\uDFFF]/g, "");
            return emojireg;
        }

    };

    return pageLogic;
});
