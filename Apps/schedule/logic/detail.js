/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../components/dialog"], function (c, utils, Dialog) {
    var demoData = {
        "code": 0,
        "data": {
            "id": 1,
            "title": "迭代开发",
            "describe": "这是一个好厉害的日程，很重要，大家要重视好努力好努力",
            "startTime": 1472828749000,
            "endTime": 1472828749000,
            "wholeDay": 1,
            "repeat": 1,
            "endRepeaTime": 1472828749000,
            "importance": 1,
            "completeStatus": 0,
            "longitude": "123.123",
            "latitude": "123.123",
            "location": "aaa",
            "role": 1,
            "user": {
                "id": 1,
                "userName": "aa",
                "headImgUrl": "http:........",
                "memberId": "10087"
            },
            "joinusers": [
                {
                    "id": 1,
                    "userName": "aa",
                    "headImgUrl": "http:........",
                    "memberId": "10087"
                }
            ],
            "shareusers": [
                {
                    "id": 1,
                    "userName": "aa",
                    "headImgUrl": "http:........",
                    "memberId": "10087"
                }
            ],
            "logs": [
                {
                    "id": 1,
                    "userId": 10,
                    "userName": "aa",
                    "avatar": "http://aaa.com/aa.jpg",
                    "reason": "添加参与人"
                }
            ]
        }
    };

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.topViewCloseHeight = null;
        this.mode = "回复";
        this.id = this.pageview.params.scheduleId;    //日程id
        this.loadData(this.id);

        //this.users={};
        //参与人数组
        this.participantsData = [];
        //共享人数组
        this.shareData = [];
        this.setHeader();
    }

    pageLogic.prototype = {
        setHeader: function () {
            var _this = this;
            try {
                window.yyesn.ready(function () {
                    window.yyesn.register({
                        rightvalue: function (d) {
                        }
                    });
                    window.yyesn.client.configNavBar(function (d) {
                    }, {
                        "centerItems": [
                            {
                                "title": "日程详情",
                                "titleColor": "#292f33"
                            },
                        ],
                        "rightItems": []
                    });
                });
            } catch (e) {
            }
        },
        morePopover_init: function (sender, params) {
            this.morePopover = sender;
        },
        moreRepeat_itemclick: function () {
            console.log(arguments);
        },
        loadData: function (id) {
            var _this = this;
            this.pageview.showLoading({
                text: "正在加载...",
                timeout: 9000,
                reLoadCallBack: function () {
                    _this._loadData(id);
                }
            });
            _this._loadData(id);
        },
        _loadData: function (id) {
            var _this = this;
            this.pageview.ajax({
                url: "/schedule/detail/" + id,
                type: "GET",
                timeout: 8000,
                data: {
                    pageSize: 200000
                },
                success: function (data) {
                    if (data.code === 0) {
                        _this.data = data.data;
                        _this.userIds = [];
                        _this.data.joinUsers.forEach(function (it) {
                            _this.userIds.push(it.memberId);
                        });
                        _this.data.shareUsers.forEach(function (it) {
                            _this.userIds.push(it.memberId);
                        });
                        _this.userIds.push(data.data.user.memberId);
                        _this.loadSuccess(data.data);

                        _this.participantsData = data.data.joinUsers;
                        _this.shareData = data.data.shareUsers;
                    } else if (data.code === 100010000) {
                        _this.pageview.hideLoading();
                        _this.pageview.showTip({
                            text: "该日程已经删除",
                            duration: 2000
                        });
                        setTimeout(function () {
                            if (_this.pageview.params.type && _this.pageview.params.type.toString() === '1') {
                                window.yyesn.client.closePage();
                            } else {
                                _this.pageview.goBack();
                            }
                        }, 2000);
                    } else if(data.code === 1000100001){
                        _this.pageview.hideLoading();
                        _this.pageview.showTip({
                            text: "该日程已经拒绝",
                            duration: 2000
                        });
                        setTimeout(function () {
                            if (_this.pageview.params.type && _this.pageview.params.type.toString() === '1') {
                                window.yyesn.client.closePage();
                            } else {
                                _this.pageview.goBack();
                            }
                        }, 2000);
                    }
                    //_this.pageview.hideLoading(false);
                }, error: function (e) {
                    _this.pageview.hideLoading(false);
                }
            });
        },
        joinUsers_init: function (sender, params) {
            this.joinUsers = sender;
        },
        shareUsers_init: function (sender, params) {
            this.shareUsers = sender;
        },
        getRef: function (name) {
            return this.pageview.refs[name];
        },
        //this.reminddata=this.pageview.pageManager.appConfig.remindDict;
        loadSuccess: function (data) {
            this.pageview.hideLoading(true);
            var _this = this;
            // data = demoData.data;
            this.data = data;
            this.pageview.delegate("name", function (target) {
                var title = data.title;
                if (data.importance === 1) {
                    title = "<span style='position:relative;top:-2px;zoom:.6;color:#FF4E5B;line-height:13px;padding:4px 5px;margin-right:4px;border:1px solid #FF4E5B;border-radius:5px;font-size:10px'>重要</span>" + title;
                }
                target.setText(title);
            });

            this.pageview.delegate("time", function (target) {
                var startTimeInfo = utils.getDateInfo(new Date(data.startTime));
                var endTimeInfo = utils.getDateInfo(new Date(data.endTime));
                var startTimeStr;
                var endTimeStr;
                startTimeStr = startTimeInfo.year + " " + startTimeInfo.month + "-" + startTimeInfo.day + " " + startTimeInfo.hourStr + ":" + startTimeInfo.minStr;
                endTimeStr = endTimeInfo.year + " " + endTimeInfo.month + "-" + endTimeInfo.day + " ";


                if (data.wholeDay === 0) {
                    //非全天
                    endTimeStr = endTimeStr + endTimeInfo.hourStr + ":" + endTimeInfo.minStr;
                } else {
                    //全天
                    endTimeStr = endTimeStr + "23:59";
                }
                target.setText(startTimeStr + " 至 " + endTimeStr);
            });
            this.pageview.delegate("describe", function (target) {
                //描述
                if (data.describe) {
                    target.setText(data.describe.replace(/\n/g, '<br>'));
                    target.$el.removeClass("displaynone");
                } else {
                    target.$el.addClass("displaynone");
                }
            });
            this.pageview.delegate("remind", function (target) {
                //提醒
                if (data.remind !== 0) {
                    var index = data.remind;
                    target.$el.removeClass("displaynone");
                    target.setText(_this.pageview.pageManager.appConfig.remindDict[index].label);
                } else {
                    target.$el.addClass("displaynone");
                }
            });
            this.pageview.delegate("creator", function (target) {
                //创建人
                target.setText(data.user.userName);
            });
            this.pageview.delegate("repeat", function (target) {
                //重复,0:永不,1:每天,2:每周,3:每月,4:每年
                var repeat = data.repeat;
                var repeatStr = "";
                switch (repeat) {
                    case 0:
                        repeatStr = "永不";
                        break;
                    case 1:
                        repeatStr = "每天";
                        break;
                    case 2:
                        repeatStr = "每周";
                        break;
                    case 3:
                        repeatStr = "每月";
                        break;
                    case 4:
                        repeatStr = "每年";
                        break;
                }
                target.setText(repeatStr);
            });
            this.pageview.delegate("status", function (target) {
                //0未开始 1进行中 2已结束
                var status = data.status;
                if (status === 0) {
                    target.setText("未开始");
                    target.$el.addClass("notStart_status");
                } else if (status === 1) {
                    target.setText("进行中");
                    target.$el.addClass("ongoing_status");
                } else {
                    target.setText("已结束");
                    target.$el.addClass("end_status");
                }
            });
            this.pageview.delegate("joinUsers", function (target) {
                //参与人
                var joinUsers = data.joinUsers;
                if (joinUsers.length === 0) {
                    //target.setText("无");
                    target.$el.addClass("displaynone");
                } else {
                    target.$el.removeClass("displaynone");
                    var arry = [];
                    for (var i = 0; i < joinUsers.length; i++) {
                        if (joinUsers[i].status === 0) {
                            arry[i] = joinUsers[i].userName;
                        } else if (joinUsers[i].status === 1) {
                            arry[i] = joinUsers[i].userName + "(已接受)";
                        } else if (joinUsers[i].status === 2) {
                            arry[i] = joinUsers[i].userName + "(已拒绝)";
                        } else {
                            arry[i] = joinUsers[i].userName;
                        }
                    }
                    target.setText(arry.join("，"));
                }
            });
            this.pageview.delegate("shareUsers", function (target) {
                //共享人
                var shareUsers = data.shareUsers;
                if (shareUsers.length === 0) {
                    //target.setText("无");
                    target.$el.addClass("displaynone");
                }
                else {
                    target.$el.removeClass("displaynone");
                    var arry = [];
                    for (var i = 0; i < shareUsers.length; i++) {
                        if (shareUsers[i].status === 0) {
                            arry[i] = shareUsers[i].userName;
                        } else if (shareUsers[i].status === 1) {
                            arry[i] = shareUsers[i].userName + "(已接受)";
                        } else if (shareUsers[i].status === 2) {
                            arry[i] = shareUsers[i].userName + "(已拒绝)";
                        } else {
                            arry[i] = shareUsers[i].userName;
                        }
                    }
                    target.setText(arry.join("，"));
                }
            });
            this.pageview.delegate("location", function (target) {
                //地点
                if (data.location) {
                    target.$el.removeClass("displaynone");
                    target.setText(data.location);
                }
                else {
                    target.$el.addClass("displaynone");
                    //target.setText("无");
                }
            });
            this.pageview.delegate("bottom_action_repeat", function (target) {
                var popoverActions = [];
                var actions = [{label: "接受", "icon": "sc_e900"}, {
                    label: "拒绝",
                    "icon": "sc_e919"
                }];
                if (data.role === 1) {//1创建者，2参与人，3被共享人
                    // actions = [{label: "回复", "icon": "sc_e917"}, {label: "编辑", "icon": "sc_e90c"}, {
                    //     label: "群聊",
                    //     "icon": "sc_e90d"
                    // }, {label: "", "icon": "sc_e90e"}];
                    actions = [{label: "回复", "icon": "sc_e91a"}, {label: "编辑", "icon": "sc_e90c"}, {
                        label: "微邮",
                        "icon": "sc_e92e"
                    }, {label: "", "icon": "sc_e90e"}];
                    popoverActions = [{title: "共享"}, {title: "邀请"}, {title: "删除"}];
                } else if (data.role === 2 && data.roleStatus == 1) {
                    actions = [{label: "回复", "icon": "sc_e91a"}, {label: "微邮", "icon": "sc_e92e"}, {
                        label: "邀请", "icon": "sc_e92f"
                    }, {label: "共享", "icon": "sc_e930"}];
                    // popoverActions = [{title: "共享"}, {title: "邀请"}, {title: "微邮"}, {title: "群聊"}];
                } else if (data.role === 3 && data.roleStatus == 1) {
                    actions = [{label: "回复", "icon": "sc_e91a"}, {label: "微邮", "icon": "sc_e92e"}];
                    //popoverActions = [{title: "微邮"}, {title: "群聊"}];
                }
                target.bindData(actions);

                _this.pageview.delegate("moreRepeat", function (moreRepeat) {
                    moreRepeat.bindData(popoverActions);
                });

            });
            _this.pageview.delegate("viewpager", function (target) {
                setTimeout(function () {
                    if (target.curPageViewItem.contentInstance.config.pageKey === "detailComment") {
                        //当前页面为回复
                        target.curPageViewItem.contentInstance.delegate("comment_repeat", function (target) {
                            target.bindData(data.scheduleComments);
                        });
                        target.curPageViewItem.contentInstance.delegate("comment_nodata", function (target) {
                            if (data.scheduleComments.length === 0) {
                                target.$el.removeClass("displaynone");
                            } else {
                                target.$el.addClass("displaynone");
                            }

                        });
                    } else if (target.curPageViewItem.contentInstance.config.pageKey === "detailActionrecords") {
                        //当前页面为操作记录
                        target.curPageViewItem.contentInstance.delegate("repeat", function (target) {
                            target.bindData(data.loggers);
                        });
                    }
                    else {
                        //当前页面为文件
                        target.curPageViewItem.contentInstance.delegate("repeat", function (target) {
                            target.bindData(data.scheduleFiles);
                        });
                        target.curPageViewItem.contentInstance.delegate("file_nodata", function (target) {
                            if(data.scheduleFiles.length > 0){
                                target.$el.addClass("displaynone");
                            }else{
                                target.$el.removeClass("displaynone");
                            }
                        });
                    }
                }, 500);
            });
            // this.pageview.refs.viewpager.curPageViewItem.contentInstance.delegate("comment_repeat", function (target) {
            //     target.bindData(data.scheduleComments);
            // });
        },
        reason_input_count_init:function(sender, params){
            this.reason_input_count = sender;
        },
        reason_input_compositionend: function (sender, params) {
            //日程描述输入
            var reasonVal = sender.$el.find('textarea').val();
            var length = reasonVal.length;
            this.reason_input_count.setText(100 - length);
            if (length > 100) {
                this.reason_input_count.$el.css("color", "#ff4e5b");
            }
            else {
                this.reason_input_count.$el.css("color", "#cccccc");
            }
        },
        onPageLoad: function () {
            var _this = this;

            this.deleteDialog = new Dialog({
                mode: 3,
                wrapper: this.pageview.$el,
                title: "拒绝理由",
                createContent: function(contentBody) {
                    _this.pageview.getComponentInstanceByComKey("add_reason_input_area", null, null,
                        function(comInstance) {
                            contentBody.append(comInstance.$el);
                            _this.add_reason_input_area = comInstance;
                        },
                        function() {});
                },
                btnDirection: "row",
                buttons: [{
                    title: "取消",
                    style: {
                        height: 50,
                        fontSize: 16,
                        color: c.titleColor,
                        borderRight: "1px solid #EEEEEE"
                    },
                    onClick: function() {
                        _this.deleteDialog.hide();
                    }
                }, {
                    title: "提交",
                    style: {
                        height: 50,
                        fontSize: 16,
                        color: "#37B7FD"
                    },
                    onClick: function() {
                        _this.handle_schedule(1);
                    }
                }]
            });


        },
        bottom_action_repeat_itemclick: function (sender, params) {
            var label = sender.datasource.label;
            var _this = this;
            if (sender.datasource.icon === "sc_e90e") {
                this.morePopover.show(sender);
            } else if (label === "编辑") {
                // this.pageview.go("add", this.data);
                this.pageview.showPage({pageKey: "add", mode: "fromBottom",nocache:true, params: {data: this.data}});
                if(this.pageview.innerPages.add){
                    this.pageview.innerPages.add.plugin.setHeader();
                }
            } else if (label === "回复") {
                this.pageview.showPage({pageKey: "commentform", mode: "fromBottom", params: {data: this.data}});
            } else if (label == "微邮") {
                //、、、、、、、

                this.pageview.ajax({
                    url: "/schedule/users",
                    type: "GET",
                    timeout: 100000,
                    data: {
                        ids: _this.userIds.join(',')
                    },
                    success: function (data) {
                        if (data.code === 0) {
                            var users = [];
                            data.data.forEach(function (it) {
                                users.push({avatar: it.headImgUrl, name: it.userName, member_id: it.memberId});
                            });
                            users.push({
                                avatar: _this.data.user.avatar,
                                name: _this.data.user.userName,
                                member_id: _this.data.user.memberId
                            });
                            window.yyesn.enterprise.sendMemail(function () {

                            }, {users: users});
                        }
                    }
                });
                //yyesn.enterprise.sendMemail(function(d){ alert(JSON.stringify(d)) },{ "users": [{ 'mobile': '13120215037', 'avatar': 'dd', 'name': '张三', 'member_id': 11 }] });
            } else if (label == "邀请") {
                _this._invite();
            } else if (label == "共享") {
                _this._share();
            } else if (label == "接受") {
                this.handle_schedule(0);
            } else if (label == "拒绝") {
                this.deleteDialog.show();
            }
        },
        handle_schedule: function (type) {
            //发送请求,type为1是拒绝,type为0是接受
            var _this = this;
            var reason = this.pageview.refs.reason_input.getValue();
            var replySource = utils.deviceInfo().isIOS?2:1;
            this.pageview.showLoading();
            this.pageview.ajax({
                url: "/schedule/handle",
                type: "POST",
                data: {
                    id: this.id,
                    type: type,
                    reason:reason,
                    replySource:replySource
                },
                success: function (data) {
                    _this.pageview.hideLoading();
                    if (data.code === 0) {
                        if (type === 1) {
                            //拒绝
                            _this.deleteDialog.hide();
                            _this.pageview.refs.reason_input.$el.find("textarea").val("");
                            _this.pageview.showTip({
                                text: data.data.msg,
                                duration: 2000
                            });
                        } else {
                            _this.pageview.showTip({
                                text: data.data.msg,
                                duration: 2000
                            });
                        }
                        setTimeout(function () {
                            if (_this.pageview.params.type && _this.pageview.params.type.toString() === '1') {
                                window.yyesn.client.closePage();
                            } else {
                                //_this.pageview.goBack();
                            }
                        }, 2000);
                    }else if(data.code === 1000100011 ){
                        _this.pageview.showTip({
                            text: "您没有操作权限",
                            duration: 2000
                        });
                        setTimeout(function () {
                            if (_this.pageview.params.type && _this.pageview.params.type.toString() === '1') {
                                window.yyesn.client.closePage();
                            } else {
                               // _this.pageview.goBack();

                            }
                        }, 2000);
                    }

                },
                error: function () {
                    _this.pageview.hideLoading();
                }
            });
        },
        _share: function () {
            //共享人
            var _this = this;
            window.yyesn.enterprise.selectContacts(function (d) {
                // alert(JSON.stringify(d));
                _this.addUser(d, 3);
            }, {
                nav_title: '选择共享人',

            });
        },
        _invite: function () {
            //邀请参与人
            var _this = this;
            window.yyesn.enterprise.selectContacts(function (d) {
                // alert(JSON.stringify(d));
                _this.addUser(d, 2);
                //_this.inviteMans=d.data;
            }, {
                nav_title: '选择邀请人',
            });
        },
        addUser: function (data, role) {
            //添加参与人或者分享人ajax请求
            var _this = this;
            var users = [];
            var addItems = [];
            var addUsers = [];
            var tips = "";
            if (role === 2) {
                tips = "日程邀请成功";
            } else {
                tips = "日程分享成功";
            }
            data.data.forEach(function (it) {
                var needPush = true;
                for (var i = 0; i < _this.userIds.length; i++) {
                    if (_this.userIds[i].toString() === it.member_id.toString()) {
                        needPush = false;
                        break;
                    }
                }
                if (needPush) {
                    users.push(it.member_id);
                    addItems.push(it.name);
                    it.userName = it.name;
                    addUsers.push(it);
                }
            });
            if (users.length > 0) {
                _this.userIds = _this.userIds.concat(users);
                this.pageview.showLoading({
                    text: ""
                });
                // alert(users.join(','));
                _this.pageview.ajax({
                    url: "/schedule/addUser?token=" + _this.pageview.params.token,
                    type: "POST",
                    timeout: 10000,
                    // contentType: "application/json;charset=utf-8",
                    // data: JSON.stringify({id:_this.data.id,updateType:1,changedRepeat:0,shareUsers:users.join(',')}),
                    data: {
                        scheduleId: _this.id,
                        ids: users.join(','),
                        role: role
                    },
                    success: function (data) {
                        _this.pageview.hideLoading();
                        if (data.code !== 0) {
                            _this.pageview.showTip({
                                text: "您没有操作权限",
                                duration: 2000
                            });
                            setTimeout(function () {
                                if (_this.pageview.params.type && _this.pageview.params.type.toString() === '1') {
                                    window.yyesn.client.closePage();
                                } else {
                                    //_this.pageview.goBack();

                                }
                            }, 2000);
                            return;
                        }
                        _this.pageview.showTip({
                            text: tips,
                            duration: 2000
                        });
                        if (role === 2) {
                            //参与人添加
                            var addStr = addItems.join("，");
                            // if (_this.participantsData.length > 0) {
                            //     _this.joinUsers.setText(_this.joinUsers.getText() + "，" + addStr);
                            // } else {
                            if (addItems.length > 0) {
                                _this.joinUsers.$el.removeClass("displaynone");
                                var jtext = _this.joinUsers.getText();
                                if (jtext) {
                                    jtext = jtext + "，";
                                }else{
                                    jtext="";
                                }
                                _this.joinUsers.setText(jtext + addStr);
                            }

                            _this.data.joinUsers = _this.data.joinUsers.concat(addUsers);
                            // alert(JSON.stringify(_this.data.joinUsers));
                            //}
                            //_this.participantsData = _this.participantsData.concat(data.data);
                            // alert(data.data);
                            // alert(JSON.stringify(_this.participantsData));
                        } else {
                            //分享人添加
                            var addStr1 = addItems.join("，");
                            // if (_this.shareData.length > 0) {
                            //     _this.shareUsers.setText(_this.shareUsers.getText() + "，" + addStr1);
                            // } else {
                            if (addItems.length > 0) {
                                _this.shareUsers.$el.removeClass("displaynone");
                                var text = _this.shareUsers.getText();
                                if (text) {
                                    text = text + "，";
                                }else{
                                    text="";
                                }
                                _this.shareUsers.setText(text + addStr1);
                            }

                            _this.data.shareUsers = _this.data.shareUsers.concat(addUsers);
                            // alert(JSON.stringify(_this.data.shareUsers));
                            //}
                            //_this.shareData = _this.shareData.concat(data.data);
                            // alert(data.data);
                            // alert(JSON.stringify(_this.shareData));
                        }
                    },
                    error: function () {
                        _this.pageview.hideLoading();
                    }
                });
            } else {
                _this.pageview.showTip({
                    text: "创建人、邀请人或共享人不能重复",
                    duration: 2000
                });
            }
        },
        moreRepeat_icon_init: function (sender, params) {
            if (sender.datasource.title === "删除") {
                sender.config.textStyle.color = "#FF4E5B";
            }
        },
        moreRepeat_icon_click: function (sender, params) {
            var _this = this;
            if (sender.datasource.title === "删除") {
                this.showDelTips();
            }
            else if (sender.datasource.title === "共享") {
                try {
                    _this._share();
                } catch (e) {

                }
            }
            else if (sender.datasource.title === "邀请") {
                try {
                    _this._invite();
                } catch (e) {

                }
            }
            this.morePopover.hide();
        },
        showDelTips: function () {
            //根据日程是否是重复日程进行不同的提示
            var _this = this;
            if (this.data.repeat === 0) {
                //非重复
                this.deleteDialog = new Dialog({
                    mode: 1,
                    title:"删除日程",
                    wrapper: this.pageview.$el,
                    contentText: "确定要删除该日程吗？",
                    btnDirection: "row",
                    buttons: [{
                        title: "取消",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: c.titleColor,
                            borderRight: "1px solid #EEEEEE"
                        },
                        onClick: function () {
                            _this.deleteDialog.hide();
                        }
                    }, {
                        title: "确定",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: c.titleColor
                        },
                        onClick: function () {
                            _this.deleteSche(0);
                            _this.deleteDialog.hide();
                        }
                    }]
                });
                this.deleteDialog.show();
            }
            else {
                this.tips_poplayer.show();
            }
        },
        segment_change: function (sender, params) {
            var title = params.item.datasource.title;

            if (title === "操作记录") {
                this.loadData(this.id); //点击操作记录重新刷新数据
                this.pageview.delegate("body", function (target) {
                    target.hideLoadMore();
                    window.setTimeout(function () {
                        target.hideLoadMore();

                    }, 500);
                });
                this.pageview.delegate("stickyplaceholder", function (target) {
                    target.$el.removeClass("displaynone");
                });
                this.pageview.refs.viewpager.showItem("detailActionrecords", {data: this.data.loggers || []});
            } else if (title === "文件") {
                this.pageview.delegate("body", function (target) {
                    target.hideLoadMore();
                    window.setTimeout(function () {
                        target.hideLoadMore();
                    }, 500);
                });
                this.pageview.delegate("stickyplaceholder", function (target) {
                    target.$el.removeClass("displaynone");
                });
                this.pageview.refs.viewpager.showItem("detailFiles", {data: this.data.scheduleFiles || []});
            } else if (title === "回复") {
                this.pageview.refs.body.showLoadMore();
                this.pageview.delegate("stickyplaceholder", function (target) {
                    target.$el.addClass("displaynone");
                });

                this.pageview.refs.viewpager.showItem("detailComment", {data: this.data.scheduleComments || []});
                this.pageview.refs.body.canLoadMore = this.pageview.refs.viewpager.curPageViewItem.contentInstance.hasMoreData;//segment切换导致页面跳动 scroll会把canLoadMore设成false
            }
            this.mode = title;
        },

        toggle_btn_click: function (sender) {
            if (this.topViewCloseHeight === null) {
                this.topViewCloseHeight = this.pageview.refs.top_view.$el.height();
            }
            this.pageview.refs.body.refreshStickyHeaderIndices();
            if (sender.getText() === "展开") {
                sender.setText("收起");
                sender.setIcon("sc_e907");
                this.pageview.refs.top_view.$el.css({"height": "auto"});
            } else {
                sender.setText("展开");
                sender.setIcon("sc_e90f");
                this.pageview.refs.top_view.$el.css({"height": this.topViewCloseHeight});
            }

        },
        setCommentRepeat: function (data) {
            this.pageview.refs.viewpager.items.detailComment.contentInstance.delegate("comment_repeat", function (target) {
                if (data) {
                    target.insertItem(data, 0);
                }

            });
            this.pageview.refs.viewpager.items.detailComment.contentInstance.delegate("comment_nodata", function (target) {
                if (data) {
                    target.$el.addClass("displaynone");
                }

            });
        },
        tips_poplayer_init: function (sender, params) {
            this.tips_poplayer = sender;
        },
        tips_cancel_btn_click: function () {
            this.tips_poplayer.hide();
        },
        tips_first_btn_click: function (sender, params) {
            //仅删除当前日程
            this.deleteSche(0);
            this.tips_poplayer.hide();
        },
        tips_second_btn_click: function (sender, params) {
            //删除其未来的重复日程
            this.deleteSche(1);
            this.tips_poplayer.hide();
        },
        tips_third_btn_click: function (sender, params) {
            //所有的重复日程
            this.deleteSche(2);
            this.tips_poplayer.hide();
        },
        deleteSche: function (type) {
            //删除日程请求
            var _this = this;
            this.pageview.showLoading({
                text: "正在处理中..."
            });
            this.pageview.ajax({
                url: "/schedule/delete/" + _this.id,
                type: "POST",
                timeout: 10000,
                data: {
                    deleteType: type
                },
                success: function (data) {
                    if (data.code === 0) {
                        _this.replyData = data.data;
                        _this.pageview.showTip({
                            text: "删除日程成功",
                            duration: 2000
                        });
                    } else {

                    }
                    _this.pageview.hideLoading();
                    setTimeout(function () {
                        if (_this.pageview.params.type && _this.pageview.params.type.toString() === '1') {
                            window.yyesn.client.closePage();
                        } else {
                            _this.pageview.goBack();

                        }
                    }, 2000);

                },
                error: function (e) {
                    _this.pageview.hideLoading();
                    _this.pageview.showTip({
                        text: "提交失败!请稍后再试",
                        duration: 3000
                    });
                }
            });
        },
        onPageResume: function () {
            this.setHeader();
        },
    };
    return pageLogic;
});
