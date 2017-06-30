/**
 *"待审批","我发起的"和"抄送给我的"通用页面 (type分别为"waitmeapprove","myapprove"和"copyapprove")
 */
define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        var type = this.pageview.params.type;
        this.fullPageKey = this.pageview.config.fullPageKey;
        this.listDataSource = [];
        this.searchValue = false;
        this.searchValue1 = false;
        this.searchKey = true;
        if (this.fullPageKey === "commonlist_waitmyapprove") {
            this.searchKey = false;
        } else if (this.fullPageKey === 'commonlist_waitmyapprovedone') {
            this.searchKey = true;
        }
        if (type === "myapprove") {
            window.needRefresMyApproveListData = false;
            // this.fullPageKey = "commonlist_myapprove";// or commonlist_waitmyapprovedone commonlist_waitmyapprove
        } else if (type === 'copyapprove') {
            window.needRefresCopyApproveListData = false;
            this.fullPageKey = "commonlist_copyapprove";
            // this.fullPageKey = "commonlist_copyapprove";// or commonlist_waitmyapprovedone commonlist_waitmyapprove
        }
        this.setHeader();
    }

    pageLogic.prototype = {
        body_init: function (sender) {
            this.body = sender;
        },
        setHeader: function () {

            var title = "审批";
            if (this.fullPageKey === "commonlist_myapproverunning") {
                title = "我发起的";

            } else if (this.fullPageKey === "commonlist_waitmyapprovedone") {
                title = "我已审批";

            } else if (this.fullPageKey === "commonlist_waitmyapprove") {
                title = "待我审批";
            } else if (this.fullPageKey === "commonlist_copyapprove") {
                title = "抄送我的";
            }
            window.pageViewTitle = title;
            try {
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
        searchBtn_click: function (sender, params) {
            this.pageview.refs.leftview.$el.hide();
            this.pageview.refs.searchInput.$el.show();
            this.pageview.refs.searchInput._focus();
            this.pageview.refs.approveSelector.hideDropDown();
        },
        searchview_init: function (sender, params) {
            sender.config.style.display = "none";
            // if (this.searchKey) {
            //     sender.config.style.display = "none";
            //     // this.pageview.refs.searchInput1.$el.show();
            // } else {
            //     sender.config.style.display = "show";
            // }
        },
        searchInput1_init: function (sender, params) {
            if (!this.searchKey) {
                sender.config.style.display = "none";
                // this.pageview.refs.searchInput1.$el.show();
            } else {
                sender.config.style.display = "show";
            }
        },
        searchInput1_cancel: function (sender, params) {
            var value = params.value;

            if (value || this.searchValue1) {
                this.searchValue1 = false;
                sender.input.val('');

                this.listviewSender.config.ajaxConfig.data.keyword = '';
                this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
            }
        },
        searchInput_cancel: function (sender, params) {
            var value = params.value;
            if (value || this.searchValue) {
                this.searchValue = false;
                sender.input.val('');

                this.listviewSender.config.ajaxConfig.data.keyword = '';
                this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
            }
            this.pageview.refs.leftview.$el.show();
            this.pageview.refs.searchInput.$el.hide();
        },
        approveSelector_menu1_loaddata: function (sender, params) {
            var successCallback = params.success;
            var errorCallback = params.error;
            var _this = this;
            var data = [
                {"name": "全部时间", "id": "taskTime_all", "group": "taskTime"},
                {"name": "今天", "id": "taskTime_today", "group": "taskTime"},
                {"name": "昨天", "id": "taskTime_yesterday", "group": "taskTime"},
                {"name": "两天前", "id": "taskTime_2more", "group": "taskTime"}
            ];
            successCallback(data);
        },

        approveSelector_menu0_loaddata: function (sender, params) {
            var successCallback = params.success;
            var errorCallback = params.error;
            var _this = this;
            var data = [
                {"name": "全部状态", "id": "dueDate_all", "group": "dueDate"},
                {"name": "正常", "id": "dueDate_normal", "group": "dueDate"},
                {"name": "逾期", "id": "dueDate_overdue", "group": "dueDate"}
            ];
            successCallback(data);
        },


        approveSelector_menu2_loaddata: function (sender, params) {
            var successCallback = params.success;
            var errorCallback = params.error;
            var _this = this;
            window.setTimeout(function () {
                //process/category
                var ajaxConfig = {
                    url: '/process/category',
                    type: 'POST',
                    data: {},
                    success: function (listData) {
                        var _listdata = [{"name": "全部类型", "id": "", "group": "type"}];
                        for (var idx = 0; idx < listData.data.length; idx++) {
                            var data = {"name": listData.data[idx].name, "id": listData.data[idx].id, "group": "type"};
                            _listdata.push(data);
                        }
                        successCallback(_listdata);
                    },
                    error: function (err) {

                    }
                };
                _this.pageview.ajax(ajaxConfig);
            });
        },
        approveSelector_menu0_itemClick: function (sender, params) {
            sender.rootInstance.hideDropDown();
            this.listviewSender.config.ajaxConfig.data.taskDue = sender.curSelectedItem.data.id;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        approveSelector_menu1_itemClick: function (sender, params) {
            sender.rootInstance.hideDropDown();
            this.listviewSender.config.ajaxConfig.data.taskDate = sender.curSelectedItem.data.id;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        approveSelector_menu2_itemClick: function (sender, params) {
            sender.rootInstance.hideDropDown();
            this.listviewSender.config.ajaxConfig.data.categoryIds = sender.curSelectedItem.data.id;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },

        searchInput_search: function (sender, params) {
            if (params.value) {
                this.searchValue = true;
            }

            this.pageview.refs.listview.ajaxConfig.data.start = 0;
            this.pageview.refs.listview.ajaxConfig.data.pageNum = 1;
            this.listviewSender.config.ajaxConfig.data.categoryIds = null;
            this.listviewSender.config.ajaxConfig.data.keyword = params.value;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        searchInput1_search: function (sender, params) {
            if (params.value) {
                this.searchValue1 = true;
            }
            this.pageview.refs.listview.ajaxConfig.data.start = 0;
            this.pageview.refs.listview.ajaxConfig.data.pageNum = 1;
            this.listviewSender.config.ajaxConfig.data.categoryIds = null;
            this.listviewSender.config.ajaxConfig.data.keyword = params.value;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        onPageResume: function () {

            this.pageview.refs.listview.ajaxConfig.data.start = 0;
            this.pageview.refs.listview.ajaxConfig.data.pageNum = 1;
            if (this.fullPageKey === "commonlist_myapproverunning") {
                if (window.needRefresMyApproveListData === true) {
                    window.needRefresMyApproveListData = false;
                    this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
                }
            }

            if (this.fullPageKey === "commonlist_copyapprove") {
                if (window.needRefresCopyApproveListData === true) {
                    window.needRefresCopyApproveListData = false;
                    this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
                }
            }
            this.setHeader();
        },

        body_pulltorefresh: function (sender, params) {
            this.pageview.refs.listview.ajaxConfig.data.start = 0;
            this.pageview.refs.listview.ajaxConfig.data.pageNum = 1;

            this.pageview.refs.listview.setAjaxConfigParams();
            this.pageview.refs.listview.loadFirstPageData();
        },
        body_reload: function (sender) {
            this.pageview.refs.listview.reload();
        },
        body_loadmore: function (sender, params) {
            var size = this.pageview.refs.listview.ajaxConfig.data.size;
            var start = this.pageview.refs.listview.ajaxConfig.data.start;
            var count = size + start;
            this.pageview.refs.listview.ajaxConfig.data.start = count;
            this.pageview.refs.listview.ajaxConfig.data.pageNum++;

            this.pageview.refs.listview.setAjaxConfigParams();
            this.pageview.refs.listview.loadNextPageData();
        },
        listview_rowclick: function (sender, params) {
            // 缓存数据
            window.nowFormData = sender.datasource;
            var instId, formDataName, taskId, copyToId = "";
            if (this.fullPageKey === "commonlist_myapproverunning" || this.fullPageKey === "commonlist_myapprovedone") {
                instId = sender.datasource.inst.id;
                formDataName = sender.datasource.inst.name;

                    taskId = sender.datasource.inst.id;
            } else if (this.fullPageKey === "commonlist_copyapprove") {
                instId = sender.datasource.procssInstId;
                formDataName = sender.datasource.title;
                taskId = sender.datasource.taskId;
                copyToId = sender.datasource.id;
                // console.log(sender.datasource);
            } else {

                if (sender.datasource.processInstance === undefined) {
                    instId = sender.datasource.historicProcessInstance.id;
                    formDataName = sender.datasource.historicProcessInstance.name;
                    taskId = sender.datasource.id;
                } else {
                    instId = sender.datasource.processInstance.id;
                    formDataName = sender.datasource.processInstance.name;
                    taskId = sender.datasource.id;
                }
            }
            if (formDataName.indexOf("的") > -1 && formDataName.indexOf("的") < formDataName.length) {
                formDataName = formDataName.substring((formDataName.indexOf("的")+1),formDataName.length);
            }
            this.pageview.go("detail", {
                taskId: taskId,
                instId: instId,
                copyToId: copyToId,
                formDataName: encodeURI(formDataName)
            });
        },
        listview_parsedata: function (sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }
            if (!data.data) {
                data.data = {
                    list: []
                };
            }
            return data.data.list;
        },
        listview_init: function (sender) {
            var url = '';
            sender.config.style.marginTop = 0;
            switch (this.fullPageKey) {
                case 'commonlist_waitmyapprove':
                    url += '/process/listTodo';
                    //process/listTodo
                    sender.config.style.marginTop = 5;
                    break;
                case 'commonlist_waitmyapprovedone':
                    url += '/process/listDone';
                    break;
                case 'commonlist_myapproverunning'://我发起的进行中?withState=true&finished=false
                    url = '/process/listHistory';
                    break;
                case 'commonlist_myapprovedone'://我发起的已完成
                    url = '/process/listHistory?withState=true&finished=true';
                    break;
                case 'commonlist_copyapprove':
                    url = '/process/listCopy';
                    break;
                default:
                    url = '/process/listTodo';
                    console.error('status未定义');
                    sender.config.style.marginTop = 5;
                    break;
            }

            this.listviewSender = sender;

            sender.config.ajaxConfig = {
                url: url,
                type: "POST",
                pageSize: 10,
                pageNumKey: "pageNum",
                data: {
                    pageNum: 1,
                    start: 0,
                    size: 10
                }
            };
            sender.config.autoLoadData = true;
        },

        row_feature_repeat_init: function (sender, params) {
            // if (this.fullPageKey !== "commonlist_copyapprove") {
            var keyFeature;
            if (sender.parent.datasource.keyFeature) {
                keyFeature = sender.parent.datasource.keyFeature;
            } else if (sender.parent.datasource.processInstance) {
                keyFeature = sender.parent.datasource.processInstance.keyFeature;
            }
            else if (sender.parent.datasource.inst) {
                keyFeature = sender.parent.datasource.inst.keyFeature;
            } else if (sender.parent.datasource.historicProcessInstance) {
                keyFeature = sender.parent.datasource.historicProcessInstance.keyFeature;
            } else if (sender.parent.datasource.historicProcessInstanceResponse) {
                keyFeature = sender.parent.datasource.historicProcessInstanceResponse.keyFeature;
            }

            var json = [];
            // var keyFeature = "名字:axiba,金额:120,申请事由:因为帅";
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
                        for (var i = 0; i < keyFeatureStr.length; i++) {
                            var jsonContent = {};
                            jsonContent.text = keyFeatureStr[i];
                            json.push(jsonContent);
                        }
                    }
                }
            } catch (e) {
                if (keyFeature !== null && keyFeature !== "null") {
                    var keyfs = keyFeature.split(";");
                    for (var ix = 0; ix < keyfs.length; ix++) {
                        var jsonContent1 = {};
                        jsonContent1.text = keyfs[ix];
                        json.push(jsonContent1);
                    }
                }
            }


            if (json.length === 0) {
                sender.config.style.display = 'none';
            }
            sender.bindData(json);
            // }
        },
        row_time_init: function (sender, params) {
            if (sender.config.text === null) {
                if (sender.datasource.startTime !== null && sender.datasource.startTime !== undefined) {
                    if (this.fullPageKey === "commonlist_waitmyapprovedone") {
                        var endTime = 0;

                        if (sender.datasource.endTime !== null) {
                            endTime = sender.datasource.endTime;
                        }
                        sender.config.text = utils.timestampToTimeStr(endTime, true);
                    } else {
                        sender.config.text = utils.timestampToTimeStr(sender.datasource.startTime, true);
                    }
                } else if (sender.datasource.inst) {
                    sender.config.text = utils.timestampToTimeStr(sender.datasource.inst.startTime, true);
                }

            } else {

                sender.config.text = utils.timestampToTimeStr(sender.config.text, true);

            }
        },
        row_state_init: function (sender, params) {//判断是否逾期(待审批的当前环节)
            // modifyTime
            // createTime
            if (this.fullPageKey !== 'commonlist_copyapprove') {
                var dueDate = sender.parent.datasource.dueDate;
                if ((dueDate && dueDate < new Date()) && this.fullPageKey === "commonlist_waitmyapprove") {
                    sender.config.style.display = "block";
                }
            }
        },
        row_status_init: function (sender, params) {//判断审批阶段状态
            var fullpagekey = this.fullPageKey;//根据fullpagekey来区分不同页面的不同tab
            if (fullpagekey === "commonlist_myapproverunning" || fullpagekey === "commonlist_myapprovedone") {
                //我发起的三种状态:审批中、已完成、已终止
                var state = sender.datasource.inst.state;
                if (sender.datasource.inst.processDefinitionId.indexOf("processKey") > -1) {
                    sender.config.text = '已提交';
                    sender.config.style.color = '#ADADAD';
                }
                else {
                    if (state === 'run') {
                        sender.config.text = '审批中';
                        sender.config.style.color = '#F39801';
                    } else if (state === "end") {
                        sender.config.text = '已完成';
                        sender.config.style.color = '#ADADAD';
                    } else if (state === "delete") {
                        sender.config.text = '已中止';
                        sender.config.style.color = '#F17868';
                    }
                }
            } else if (fullpagekey === "commonlist_waitmyapprovedone" || fullpagekey === "commonlist_waitmyapprove") {
                //待审批的三种状态:审批中(是否有逾期)、已完成、已终止
                if (fullpagekey === "commonlist_waitmyapprove") {

                    // if(!sender.datasource.processInstance) {
                    //     console.log(sender.datasource);
                    // }
                    var completed = sender.datasource.processInstance && sender.datasource.processInstance.completed;//sender.datasource.completed;
                    var ended = sender.datasource.processInstance.ended;//sender.datasource.ended;
                    if (completed) {
                        sender.config.text = '已完成';
                        sender.config.style.color = '#ADADAD';
                    } else if (ended) {
                        sender.config.text = '已中止';
                        sender.config.style.color = '#F17868';
                    }
                    else {
                        sender.config.text = '审批中';
                        sender.config.style.color = '#F39801';
                    }
                } else {
                    var taskInst = sender.datasource.historicProcessInstance;
                    var taskInstEnd = (taskInst ? taskInst.endTime !== null : false);//是否截止
                    var deleteReason = taskInst ? taskInst.deleteReason : null;//驳回原因
                    if (taskInstEnd) {//截止了
                        if (deleteReason === "stop") {
                            sender.config.text = '已中止';
                            sender.config.style.color = '#F17868';
                        } else if (deleteReason) {
                            sender.config.text = '已中止';
                            sender.config.style.color = '#F17868';
                        } else {
                            sender.config.text = '已完成';
                            sender.config.style.color = '#ADADAD';
                        }
                    } else {//没有截止
                        sender.config.text = '审批中';
                        sender.config.style.color = '#F39801';
                    }

//             		var deleteReason = sender.datasource.deleteReason;
//             		if(deleteReason === "completed"){
//             			sender.config.text = '已完成';
//	                    sender.config.style.color = '#ADADAD';
//             		}else if(deleteReason === "ACTIVITI_DELETED"){
//             			sender.config.text = '已终止';
//	                    sender.config.style.color = '#F17868';
//             		}else{
//             			sender.config.text = '审批中';
//	                    sender.config.style.color = '#F39801';
//             		}
                }

            }
        },
        row_image_init: function (sender, params) {
            if (this.fullPageKey === 'commonlist_myapproverunning' || this.fullPageKey === "commonlist_myapprovedone") {
                sender.config.style.backgroundColor = "#fff";
                sender.config.style.borderRadius = "";
                sender.config.style.height = 30;
                sender.config.style.width = 30;
                if (sender.datasource.inst.icon) {
                    sender.config.src = "./imgs/" + sender.datasource.inst.icon + ".png";
                } else {
                    sender.config.src = "./imgs/icon-1.png";
                }
            } else {
                //historicProcessInstance
                if (this.fullPageKey !== 'commonlist_copyapprove' && this.fullPageKey !== 'commonlist_waitmyapprove') {
                    if (sender.config.title === null) {
                        if (sender.datasource.historicProcessInstance.startParticipant) {
                            sender.config.title = sender.datasource.historicProcessInstance.startParticipant.name;
                        } else {
                            sender.config.title = "丢失";
                            sender.config.src = "丢失";
                        }
                    }
                    if (sender.datasource.historicProcessInstance && sender.datasource.historicProcessInstance.startParticipant) {
                        sender.config.src = sender.datasource.historicProcessInstance.startParticipant.pic ? sender.datasource.historicProcessInstance.startParticipant.pic : "none.jpg";

                    }
                    if (sender.datasource.historicProcessInstance && sender.datasource.historicProcessInstance.startParticipant) {
                        // console.log(sender.datasource.historicProcessInstance.startParticipant.name);
                        sender.config.title = sender.datasource.historicProcessInstance.startParticipant.name;
                    }

                } else if (this.fullPageKey !== 'commonlist_waitmyapprove' && this.fullPageKey !== 'commonlist_copyapprove') {
                    sender.config.title = sender.datasource.title;
                } else if (this.fullPageKey === 'commonlist_copyapprove') {

                    if (!sender.datasource.historicProcessInstanceResponse.startParticipant) {
                        sender.config.title = "丢失";
                        sender.config.src = "丢失";

                    } else {
                        sender.config.title = sender.datasource.historicProcessInstanceResponse.startParticipant.name;
                        sender.config.src = sender.datasource.historicProcessInstanceResponse.startParticipant.pic ? sender.datasource.historicProcessInstanceResponse.startParticipant.pic : "null.thumb.jpg";
                    }
                } else {
                    if (!sender.datasource.processInstance.startParticipant) {
                        sender.config.title = "丢失";
                        sender.config.src = "丢失";
                    } else {
                        // title_bind: "processInstance.startParticipant.name",
                        // src_bind: "processInstance.startParticipant.pic"
                        sender.config.title = sender.datasource.processInstance.startParticipant.name;
                        sender.config.src = sender.datasource.processInstance.startParticipant.pic ? sender.datasource.processInstance.startParticipant.pic : "null.thumb.jpg";
                    }
                }
            }
        },
        row_left_init: function (sender, params) {
            if (this.fullPageKey === 'commonlist_copyapprove' && sender.datasource.taskStatus.toString() === '0') {
                sender.setBadge(1, {
                    backgroundColor: "#F66C6C",
                    right: "50px",
                    fontSize: "0",
                    top: "3px",
                    height: "6px",
                    width: "6px",
                    padding: "0",
                    borderRadius: "30px",
                    boxShadow: "0px 0px 0px 1px #fff"
                });
            }
        },
        row_title_init: function (sender, params) {
            if (sender.config.text === null) {
                if (sender.datasource.historicProcessInstance !== undefined) {
                    sender.config.text = sender.datasource.historicProcessInstance.name;
                } else if (sender.datasource.inst !== undefined) {
                    sender.config.text = sender.datasource.inst.name;
                } else if (this.fullPageKey === 'commonlist_copyapprove') {
                    sender.config.text = sender.datasource.title;
                }

            }
        }
    };
    return pageLogic;
});
