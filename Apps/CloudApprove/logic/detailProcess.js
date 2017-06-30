/**
 * Created by Gin on 17/2/27.
 */
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {
    function PageLogic(config) {
        var _this = this;
        this.pageview = config.pageview;
        this.parentThis = this.pageview.viewpagerParams.parentThis;
    }

    PageLogic.prototype = {
        flow_right_content_right_init: function (sender, params) {
            if (sender.datasource.activityType === "startEvent") {
                var operateTime = (sender.datasource.endTime === null ? sender.datasource.startTime : sender.datasource.endTime);
                sender.config.text = utils.timestampToTimeStr(new Date(operateTime).getTime(), true);
            } else if (sender.datasource.activityType === "userTask") {
                this.setAnalysis(sender, "time");
            } else {
                sender.rowInstance.$el.hide();
            }
        },
        flow_right_content_middle_bottom_title_init: function (sender, params) {
            if (sender.datasource.activityType === "startEvent") {
                sender.config.text = "提交了申请";
            } else {
                this.setAnalysis(sender, "status");
            }
        },
        left_round_init: function (sender, params) {
            this.setAnalysis(sender, "icon");
        },
        flow_line_init: function (sender, params) {
            if (sender.datasource.assignee !== this.applyHistory.currentUserId) {
                var tAudit = sender.datasource.taskAuditDesc || (sender.datasource.endTime && sender.datasource.endTime.indexOf("9999") === -1 ? "同意" : "待办");
                if (tAudit === "待办" && sender.datasource.deleteReason === null) {
                    sender.config.style.display = "block";
                } else if (sender.datasource.deleteReason !== "completed" && sender.datasource.deleteReason !== "withdraw" && sender.datasource.deleteReason !== "deleted" && sender.datasource.deleteReason !== "delete" && (tAudit.indexOf("指派") > -1 || tAudit.indexOf("改派") > -1 || tAudit.indexOf("改签") > -1 || tAudit.indexOf("被加签") > -1 )) {
                    sender.config.style.display = "block";
                }
            }
        },
        flow_IM_init: function (sender, params) {
            if (sender.datasource.assignee === this.applyHistory.currentUserId) {
                sender.config.style.display = "none";
            }
        },
        flow_remind_init: function (sender, params) {
            this.setAnalysis(sender, "remind");
        },
        flow_remind_click: function (sender, params) {
            var _this = this;

            this.pageview.go('deal', {
                type: 5, // 提醒
                instId: _this.applyHistory.instData.id,
                taskId: _this.applyHistory.taskId,
                currentUserId: _this.applyHistory.currentUserId,
                currentUserName: encodeURI(_this.applyHistory.currentUserName),
                assignee: sender.datasource.assignee,
                instName: encodeURI(_this.applyHistory.instData.name),
                processDefinitionId: sender.datasource.processDefinitionId,
                formInstanceId: this.applyHistory.formId
            });
        },
        flow_right_content_left_init: function (sender, params) {
            if (!sender.datasource.pic) {
                var _title = utils.getImgTitle(sender.datasource.userName);
                sender.setTitle(_title);
                sender.config.style.backgroundColor = utils.getImgBg(_title);
            }
        },
        setAnalysis: function (sender, type) {

            this.applyHistory = window._applyHistory;
            if (type === "time") {
                if (sender.datasource.endTime && sender.datasource.endTime.indexOf("9999") === -1) {
                    sender.config.text = utils.timestampToTimeStr(new Date(sender.datasource.endTime).getTime(), true);
                } else {
                    sender.config.text = "";
                }
            } else if (type === "status") {
                var msg = "";
                if (sender.datasource.taskComments && sender.datasource.taskComments.length > 0) {
                    msg = " 意见:" + sender.datasource.taskComments[0].message;
                    if (sender.datasource.deleteReason === "ACTIVITI_DISAGREE" && sender.datasource.taskComments[0].message === "jumpToActivity") {
                        msg = "";
                    }
                }
                var taskAuditDesc = sender.datasource.taskAuditDesc || (sender.datasource.endTime && sender.datasource.endTime.indexOf("9999") === -1 ? "同意" : "待办");
                if (taskAuditDesc.indexOf("驳回") !== -1 || taskAuditDesc.indexOf("中止申请") !== -1) {
                    sender.config.style.color = "#F17868";

                } else if (taskAuditDesc === "待办" && sender.datasource.deleteReason === null) {
                    sender.config.style.color = "#F39801";
                } else if (sender.datasource.deleteReason === "ACTIVITI_DELETED") {
                    sender.config.style.color = "#F17868";
                    taskAuditDesc = taskAuditDesc || "中止申请";
                } else if (sender.datasource.deleteReason === "completed" && taskAuditDesc.indexOf("指派") === -1 && taskAuditDesc.indexOf("改派") === -1 && taskAuditDesc.indexOf("改签") === -1 && taskAuditDesc.indexOf("被加签") === -1) {
                    taskAuditDesc = taskAuditDesc || "同意";
                }

                sender.config.text = taskAuditDesc + " " + msg;
            } else if (type === "icon") {

                var taskAudit = sender.datasource.taskAuditDesc || (sender.datasource.endTime && sender.datasource.endTime.indexOf("9999") === -1 ? "同意" : "待办");
                if (taskAudit.indexOf("驳回") !== -1 || taskAudit.indexOf("中止申请") !== -1) {
                    sender.config.iconStyle.color = "#F17868";
                    sender.config.font = "cap_e90e";
                } else if (taskAudit === "待办" && sender.datasource.deleteReason === null) {
                    sender.config.font = "cap_e90b";
                    sender.config.iconStyle.color = "#F39801";
                } else if (sender.datasource.deleteReason === "ACTIVITI_DELETED") {
                    sender.config.iconStyle.color = "#F17868";
                    sender.config.font = "cap_e90e";
                } else if (sender.datasource.deleteReason === "completed" && taskAudit.indexOf("指派") === -1 && taskAudit.indexOf("改派") === -1 && taskAudit.indexOf("改签") === -1 && taskAudit.indexOf("被加签") === -1) {
                    taskAudit = "同意";
                } else if (sender.datasource.deleteReason !== "completed" && sender.datasource.deleteReason !== "withdraw" && sender.datasource.deleteReason !== "deleted" && sender.datasource.deleteReason !== "delete" && (taskAudit.indexOf("指派") > -1 || taskAudit.indexOf("改派") > -1 || taskAudit.indexOf("改签") > -1 || taskAudit.indexOf("被加签") > -1 || taskAudit.indexOf("加签给") > -1)) {
                    sender.config.font = "cap_e90b";
                    sender.config.iconStyle.color = "#F39801";
                } else if (sender.datasource.deleteReason === "completed" && (taskAudit.indexOf("指派") > -1 || taskAudit.indexOf("改派") > -1 || taskAudit.indexOf("改签") > -1 || taskAudit.indexOf("被加签") > -1 || taskAudit.indexOf("加签给") > -1)) {
                }
            } else if (type === "remind") {
                if (sender.datasource.assignee !== this.applyHistory.currentUserId) {
                    var tAudit = sender.datasource.taskAuditDesc || (sender.datasource.endTime && sender.datasource.endTime.indexOf("9999") === -1 ? "同意" : "待办");
                    if (tAudit === "待办" && sender.datasource.deleteReason === null) {
                        sender.config.style.display = "block";
                    } else if (sender.datasource.deleteReason !== "completed" && sender.datasource.deleteReason !== "withdraw" && sender.datasource.deleteReason !== "deleted" && sender.datasource.deleteReason !== "delete" && (tAudit.indexOf("指派") > -1 || tAudit.indexOf("改派") > -1 || tAudit.indexOf("改签") > -1 || tAudit.indexOf("被加签") > -1)) {
                        sender.config.style.display = "block";
                    }
                }
            }
        },
        flow_IM_click: function (sender, params) {
            var _this = this,
                userId = window._applyHistory.currentMemberId + '' || '',
                receiver = sender.datasource.memberId + '' || '',
                receiverName = sender.datasource.userName || '',
                receiverMemberId = sender.datasource.memberId + '',
                url = window.location.href,
                title = window._applyHistory.instData.name,
                dialogTitle = '确定要和' + receiverName + '聊天吗？',
                content = '',
                jsonContent = '';

            // 内容显示成关键字段，如果没有关键字段则和标题内容一样  处理关键字段
            try {
                var keyFeatureJson = JSON.parse(window._applyHistory.instData.keyFeature);
                if (keyFeatureJson) {
                    keyFeatureJson.forEach(function (item, idx) {
                        jsonContent += item.key + ":" + (item.value || "暂无") + ";";
                    });
                }

                content = jsonContent;
            } catch (e) {
                content = title;
            }
            if (!content) {
                content = title;
            }

            this.sendIMDialog = new Dialog({
                mode: 3,
                wrapper: this.parentThis.pageview.$el,
                contentText: dialogTitle,
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
                        _this.sendIMDialog.hide();
                    }
                }, {
                    title: "确定",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: "#37b7fd",
                    },
                    onClick: function () {
                        _this.sendIMDialog.hide();

                        _this.pageview.showLoading({text: "请稍后..."});
                        _this.pageview.ajax({
                            url: "/esn/sendIM",
                            type: "POST",
                            data: {
                                title: title,
                                content: content,
                                url: url,
                                userid: userId,
                                receiver: receiver
                            },
                            success: function (data) {
                                _this.pageview.hideLoading(true);

                                if (data.success) {
                                    try {
                                        window.yyesn.enterprise.openChatWindow(function (b) {
                                            if (b.error_code === "0") {
                                            }
                                        }, {
                                            chat_mode: '0',
                                            send_id: receiverMemberId.toString(),
                                            send_name: receiverName.toString()
                                        }, function (b) {

                                        });
                                    } catch (e) {
                                        alert(JSON.stringify(e));
                                    }
                                } else {
                                    _this.pageview.showTip({text: data.msg, duration: 1000});
                                }
                            },
                            error: function (data) {
                                _this.pageview.hideLoading(true);
                                _this.pageview.showTip({text: data.msg, duration: 1000});
                            }
                        });
                    }
                }]
            });

            this.sendIMDialog.show();


        }
    };
    return PageLogic;
});
