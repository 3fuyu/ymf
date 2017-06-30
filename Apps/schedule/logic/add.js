/**
 * 添加
 **/
define(["../parts/common", "utils", "../../../components/dialog", "../parts/timepicker"], function (c, utils, Dialog, timepicker) {


    function pageLogic(config) {
        // debugger;
        this.pageview = config.pageview;

        this.year = new Date().getFullYear();
        this.todayDate = new Date();
        this.allDayvalue = false;  //是否为全天日程
        this.startTimePicker = null;
        this.endTimePicker = null;
        this.maxFilesNum = 9;  //最多9张图片
        this.mode = "NEW";// or MODIFY
        this.data = this.pageview.showPageParams.data;  //用showpage过来的
        // this.data = this.pageview.params;   //跳页过来的
        this.defaultDate = this.pageview.params.currentDateStr?this.pageview.params.currentDateStr.replace(/-/g, '/'):'';
        this.hasModify = false;  //是否有修改
        this.isModifySuccess = false;  //是否修改成功
        if (this.data) {
            //编辑模式
            this.mode = "MODIFY";
            //将数据渲染上
            // this.pageview.refs.theme_title_tips;
            // debugger;
            this.renderData(this.data);
        }
        if (this.defaultDate) {
            this.user = this.pageview.params.self?JSON.parse(this.pageview.params.self):'';
            this.mode = "NEW";
            this.setDefaultTime();
        }
        var self = this;
        //全天日程控件,yyyy-MM-dd
        this.allDayTimePicker = new timepicker();
        this.allDayTimePicker.mapping.yyyy.start = (this.year);
        this.allDayTimePicker.mapping.yyyy.end = (this.year + 4);
        this.allDayTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
            .setMinValue((this.year) + "-1-1 00:00")
            .bind("clear", function () {
            })
            .bind("ok", function (valStr) {
                self.setTimeStr(valStr);
            })
            .bind("cancel", function () {
            });
        //非全天日程控件,yyyy-MM-dd hh:mm
        this.notAllDayTimePicker = new timepicker();
        this.notAllDayTimePicker.mapping.yyyy.start = (this.year);
        this.notAllDayTimePicker.mapping.yyyy.end = (this.year + 4);
        this.notAllDayTimePicker.setMode("yyyy-MM-dd hh:mm").setParent(this.pageview.$el[0]).done()
            .setMinValue((this.year) + "-1-1 00:00")
            .bind("clear", function () {
            })
            .bind("ok", function (valStr) {
                self.setTimeStr(valStr);
            })
            .bind("cancel", function () {
            });
        //重复结束时间控件
        this.repeatTimePicker = new timepicker();
        this.repeatTimePicker.mapping.yyyy.start = (this.year);
        this.repeatTimePicker.mapping.yyyy.end = (this.year + 4);
        this.repeatTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
            .setMinValue((this.year) + "-1-1 00:00")
            .bind("clear", function () {
            })
            .bind("ok", function (valStr) {
                self.setrepeatTimeStr(valStr);
            })
            .bind("cancel", function () {
            });
        //提醒数据
        this.reminddata = this.pageview.pageManager.appConfig.remindDict;
        this.selectedRemindData = this.reminddata[0];
        //重复选项
        this.repeatData = {
            repeat_id: 0,
            repeat_name: "永不"
        };
        //参与人数组
        this.participantsData = [];
        //共享人数组
        this.shareData = [];
        //选择地点数据
        // this.placeData = {};

        // this.bindData();
        this.setHeader();
        this.canSub=true;
    }

    pageLogic.prototype = {

        onPageResume: function (sender, params) {
            this.setHeader();
        },
        setHeader: function () {
            var _this = this,
                title = "";
            if (this.mode === "MODIFY") {
                title = "编辑";
            } else {
                title = "新增日程";
            }
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
                                "title": title,
                                "titleColor": "#292f33"
                            },
                        ],
                        "rightItems": []
                    });
                });
            } catch (e) {
            }
        },
        setDefaultTime: function () {
            //新增日程时,设置默认开始时间和结束时间,结束时间默认晚于开始时间1个小时
            var _this = this;
            var tt = 60 * 1000 * 10;
            var defaultTime = this.defaultDate + " " + utils.ConvertDateToStr(this.todayDate, "hh:mm");
            var startTimestamp = Math.round((new Date(defaultTime)).getTime() / tt) * tt;
            var endTimestamp = Math.round((new Date(defaultTime)).getTime() / tt) * tt + tt * 60 / 10;
            this.pageview.delegate("startTime_value", function (target) {
                //开始时间填充
                var startStr = utils.ConvertDateToStr(startTimestamp, "yyyy-MM-dd hh:mm");
                target.setText(startStr);
            });
            this.pageview.delegate("endTime_value", function (target) {
                //结束时间填充
                var endStr = utils.ConvertDateToStr(endTimestamp, "yyyy-MM-dd hh:mm");
                target.setText(endStr);
            });
            this.pageview.delegate("repeat_startTime_value", function (target) {
                //重复开始时间填充
                target.setText(_this.formatTimestamp(startTimestamp));
            });
        },
        renderData: function (data) {
            var _this = this;
            data.user.name = data.user.userName;
            data.user.member_id = data.user.memberId;
            this.user = data.user;
            //_this.selectedMans.push(data.user);
            this.pageview.delegate("theme_title_input", function (target) {
                //主题填充
                target.setValue(data.title);
            });
            this.pageview.delegate("allDay_value", function (target) {
                //全天日程按钮
                if (data.wholeDay === 1) {
                    target.setValue(true);
                    _this.allDayvalue = true;
                } else {
                    target.setValue(false);
                    _this.allDayvalue = false;
                }

            });
            this.pageview.delegate("startTime_value", function (target) {
                //开始时间填充
                if (data.wholeDay === 1) {
                    //全天 yyyy-MM-dd week
                    target.setText(_this.formatTimestamp(data.startTime));
                }
                else {
                    target.setText(_this.formatTimestamp(data.startTime, "yyyy-MM-dd hh:mm"));
                }
            });
            this.pageview.delegate("endTime_value", function (target) {
                //结束时间填充
                if (data.wholeDay === 1) {
                    //全天 yyyy-MM-dd week
                    target.setText(_this.formatTimestamp(data.endTime));
                }
                else {
                    target.setText(_this.formatTimestamp(data.endTime, "yyyy-MM-dd hh:mm"));
                }
            });
            this.pageview.delegate("important_value", function (target) {
                //重要按钮
                if (data.importance === 1) {
                    target.setValue(true);
                    this.importantvalue = true;
                }
                else {
                    target.setValue(false);
                    this.importantvalue = false;
                }

            });
            this.pageview.delegate("describe_textarea", function (target) {
                //描述填充
                target.setValue(data.describe);
            });
            this.pageview.delegate("describe_textarea_count", function (target) {
                //描述统计
                target.setText(data.describe.length);
            });
            this.pageview.delegate("remind_radiolist", function (target) {
                //提醒
                var index = data.remind;
                var defaultSelectedData = _this.reminddata[index];
                target.setSelectedValue([defaultSelectedData]);
                _this.selectedRemindData = {
                    id: index,
                    label: _this.reminddata[index].label
                };
            });
            this.pageview.delegate("repeat_value", function (target) {
                //重复填充
                var repaetId = data.repeat;
                var label = "";
                switch (repaetId) {
                    case 0:
                        label = "永不";
                        break;
                    case 1:
                        label = "每天";
                        break;
                    case 2:
                        label = "每周";
                        break;
                    case 3:
                        label = "每月";
                        break;
                    case 4:
                        label = "每年";
                        break;
                }
                _this.repeatData.repeat_id = repaetId;
                _this.repeatData.repeat_name = label;
                target.setText(label);
            });
            this.pageview.delegate("remind_value", function (target) {
                //提醒填充
                var index = data.remind;
                target.setText(_this.reminddata[index].label);
            });
            this.pageview.delegate("repeat_time_group", function (target) {
                //是否有重复,显示重复选项
                if (data.repeat !== 0) {
                    target.$el.removeClass("displaynone");
                }
                else {
                    target.$el.addClass("displaynone");
                }
            });
            this.pageview.delegate("repeat_startTime_value", function (target) {
                //重复开始时间填充
                if(data.repeatStartTime){
                    target.setText(_this.formatTimestamp(data.repeatStartTime));
                }else{
                    target.setText(_this.formatTimestamp(data.startTime));
                }
            });
            this.pageview.delegate("repeat_endTime_value", function (target) {
                //重复结束时间填充
                if(data.repeatEndTime){
                    target.setText(_this.formatTimestamp(data.repeatEndTime));
                }
            });
            this.pageview.delegate("participants_value", function (target) {
                //参与人填充
                if (data.joinUsers.length !== 0) {
                    for (var i = 0; i < data.joinUsers.length; i++) {
                        data.joinUsers[i].name = data.joinUsers[i].userName;
                        data.joinUsers[i].member_id = data.joinUsers[i].memberId;
                        //_this.selectedMans.push(data.joinUsers[i]);
                    }
                    target.bindData(data.joinUsers);
                    _this.participantsData = data.joinUsers;
                }
            });
            this.pageview.delegate("participants_title_count", function (target) {
                //参与人总计填充
                target.setText("已选" + data.joinUsers.length + "人");
            });
            this.pageview.delegate("share_value", function (target) {
                //分享人填充
                if (data.shareUsers.length !== 0) {
                    for (var i = 0; i < data.shareUsers.length; i++) {
                        data.shareUsers[i].name = data.shareUsers[i].userName;
                        data.shareUsers[i].member_id = data.shareUsers[i].memberId;
                        //_this.selectedMans.push(data.shareUsers[i]);
                    }
                    target.bindData(data.shareUsers);
                    _this.shareData = data.shareUsers;
                }
            });
            this.pageview.delegate("share_title_count", function (target) {
                //分享人总计填充
                target.setText("已选" + data.shareUsers.length + "人");
            });
            this.pageview.delegate("place_value", function (target) {
                //地点填充
                if (data.location) {
                    target.setText(data.location);
                    _this.placeData = {};
                    _this.placeData.addrstr = data.location;
                    _this.placeData.latitude = data.latitude;
                    _this.placeData.longitude = data.longitude;
                }
            });
            this.pageview.delegate("file_repeat", function (target) {
                //文件填充
                target.empty();//先清空
                var files = data.scheduleFiles;
                for (var i = 0; i < files.length; i++) {
                    files[i].path = files[i].filePath;
                    files[i].fname = files[i].fileName;
                    target.addItem(files[i]);
                }
                _this.maxFilesNum = _this.maxFilesNum - files.length;

            });
        },
        formatTimestamp: function (timestamp, format) {
            var timeStr = "";
            var timeInfo = utils.getDateInfo(timestamp);
            if (format === "yyyy-MM-dd hh:mm") {
                timeStr = timeInfo.year + "-" + timeInfo.monthStr + "-" + timeInfo.dayStr + " " + timeInfo.hourStr + ":" + timeInfo.minStr;
            }
            else {
                //yyyy-MM-dd week
                timeStr = timeInfo.year + "-" + timeInfo.monthStr + "-" + timeInfo.dayStr + " 周" + timeInfo.weekStr;
            }
            return timeStr;
        },

        add_btn_click: function (sender, params) {
            this.pageview.go("add");
        },
        allDay_value_change: function (sender, params) {
            this.allDayvalue = params.value;
            sender.setValue(this.allDayvalue);
            var startVal = this.startTime_value.getText();
            var endVal = this.endTime_value.getText();
            if (this.allDayvalue) {
                //yyyy-MM-dd week
                if (startVal !== "") {
                    var startTimeInfo = utils.getDateInfo(startVal);
                    var startStr1 = startVal.substr(0, startVal.indexOf(" ") + 1) + "周" + startTimeInfo.weekStr;
                    this.startTime_value.setText(startStr1);

                }
                if (endVal !== "") {
                    var endTimeInfo = utils.getDateInfo(endVal);
                    var endStr1 = endVal.substr(0, endVal.indexOf(" ") + 1) + "周" + endTimeInfo.weekStr;
                    this.endTime_value.setText(endStr1);
                }
            }
            else {
                //yyyy-MM-dd hh:mm
                if (startVal !== "") {
                    var startStr = startVal.substr(0, startVal.indexOf(" ") + 1);
                    this.startTime_value.setText(startStr + "00:00");
                }
                if (endVal !== "") {
                    var endStr = endVal.substr(0, endVal.indexOf(" ") + 1);
                    this.endTime_value.setText(endStr + "00:00");
                    // this.endTime_value.setText(endVal+" 00:00");
                }
            }
        },
        important_value_change: function (sender, params) {
            this.importantvalue = params.value;
            sender.setValue(this.importantvalue);
        },
        setTimeStr: function (valStr) {
            var timeInfo = utils.getDateInfo(valStr);
            var tt = 60 * 1000 * 10;
            if (this.isSelectStart) {
                if (this.allDayvalue) {
                    //yyyy-MM-dd week
                    this.startTime_value.setText(valStr + " 周" + timeInfo.weekStr);
                    if (utils.compareDate(this.startTime_value.getText(), this.endTime_value.getText()) > 0) {
                        // alert("开始时间不能晚于结束时间");
                    }
                }
                else {
                    //yyyy-MM-dd hh:mm
                    //var startTimestamp = Math.round((new Date(valStr.replace(/-/g,'/'))).getTime()/tt)*tt;
                    var startStr = utils.ConvertDateToStr(timeInfo.timestamp, "yyyy-MM-dd hh:mm");
                    this.startTime_value.setText(startStr);
                }
                //选择开始时间后,重复开始时间也确定了
                var repeatStart = timeInfo.year + "-" + timeInfo.month + "-" + timeInfo.day + " 周" + timeInfo.weekStr;
                this.repeat_startTime_value.setText(repeatStart);
            }
            else {
                if (this.allDayvalue) {
                    //yyyy-MM-dd week
                    this.endTime_value.setText(valStr + " 周" + timeInfo.weekStr);
                }
                else {
                    //yyyy-MM-dd hh:mm
                    // var endTimestamp = Math.round((new Date(valStr.replace(/-/g,'/'))).getTime()/tt)*tt;
                    var endStr = utils.ConvertDateToStr(timeInfo.timestamp, "yyyy-MM-dd hh:mm");
                    this.endTime_value.setText(endStr);
                }
            }
            this.checkTime();
        },
        setrepeatTimeStr: function (valStr) {
            //设置重复时间
            var timeInfo = utils.getDateInfo(valStr);
            //yyyy-MM-dd week
            this.repeat_endTime_value.setText(valStr + " 周" + timeInfo.weekStr);
        },
        checkTime: function () {
            //校验时间,开始时间不能晚于开始时间
            var isFalseTime = false;
            if (!this.startTime_value.getText() || !this.endTime_value.getText()) {
                return;
            }
            if (this.allDayvalue) {
                //yyyy-MM-dd week
                var startStr = this.startTime_value.getText().substr(0, this.startTime_value.getText().indexOf(" "));
                var endStr = this.endTime_value.getText().substr(0, this.endTime_value.getText().indexOf(" "));
                if (utils.compareDate(startStr, endStr) > 0) {
                    // alert("开始时间不能晚于结束时间");
                    isFalseTime = true;
                }
            }
            else {
                //yyyy-MM-dd hh:mm
                if (utils.compareTime(this.startTime_value.getText(), this.endTime_value.getText()) > 0) {
                    // alert("开始时间不能晚于结束时间");
                    isFalseTime = true;
                }
            }

            if (isFalseTime) {
                //开始时间晚于结束时间,需纠正时间控件值
                if (this.isSelectStart) {
                    this.endTime_value.setText(this.startTime_value.getText());
                }
                else {
                    this.startTime_value.setText(this.endTime_value.getText());
                }
            }

            if (this.repeat_endTime_value.getText()) {
                //修正重复结束时间
                var repaetend = this.repeat_endTime_value.getText().substr(0, this.repeat_endTime_value.getText().indexOf(" "));
                var startTime = this.startTime_value.getText().substr(0, this.startTime_value.getText().indexOf(" "));
                if (utils.compareDate(startTime, repaetend) > 0) {
                    this.repeat_endTime_value.setText(this.repeat_startTime_value.getText());
                }
            }
        },
        startTime_value_init: function (sender, params) {
            this.startTime_value = sender;
        },
        startTime_value_click: function (sender, params) {
            this.isSelectStart = true;
            if (this.allDayvalue) {
                this.allDayTimePicker.setTitle("开始时间");
                this.allDayTimePicker.show(sender.getText());
            } else {
                this.notAllDayTimePicker.setTitle("开始时间");
                this.notAllDayTimePicker.show(sender.getText());
            }

        },
        endTime_value_init: function (sender, params) {
            this.endTime_value = sender;
        },
        endTime_value_click: function (sender, params) {
            this.isSelectStart = false;
            if (this.allDayvalue) {
                this.allDayTimePicker.setTitle("结束时间");
                this.allDayTimePicker.show(sender.getText());
            } else {
                this.notAllDayTimePicker.setTitle("结束时间");
                this.notAllDayTimePicker.show(sender.getText());
            }
        },
        theme_title_input_compositionend: function (sender, params) {
            if (sender.getValue().length > 50) {
                this.pageview.refs.theme_title_tips.$el.removeClass("displaynone");
            }
            else {
                this.pageview.refs.theme_title_tips.$el.addClass("displaynone");
            }
        },
        participants_value_click: function (sender, params) {
            //选择参与人
            var _this = this;
            try {
                window.yyesn.enterprise.selectContacts(function (data) {
                        // _this.participantsData = data.data;
                        // alert(JSON.stringify(_this.participantsData));
                        if (data.data) {
                            var selected = [];
                            _this.shareData.forEach(function (it) {
                                selected.push(it);
                            });
                            if(_this.user){
                                selected.push(_this.user);
                            }
                            var norepeatMan = [];
                            var rep = false;
                            data.data.forEach(function (it, index) {
                                var needpush = true;
                                if (selected.length > 0) {
                                    for(var ii=0;ii<selected.length;ii++){
                                        if (selected[ii].member_id.toString() !== it.member_id.toString()) {
                                            //norepeatMan.push(it);
                                            needpush = true;
                                        } else {
                                            rep = true;
                                            needpush = false;
                                            break;
                                        }
                                    }
                                }
                                if (needpush===true) {
                                    norepeatMan.push(it);
                                }
                            });
                            _this.participantsData =norepeatMan;
                            //_this.participantsData = _this.filterData(_this.participantsData,_this.shareData);
                            var num = _this.participantsData.length;
                            var arry = _this.participantsData.slice(0, 6);
                            //alert(JSON.stringify(arry));
                            _this.pageview.refs.participants_title_count.setText("已选" + num + "人");
                            _this.pageview.delegate("participants_value", function (target) {
                                target.bindData(arry);
                            });
                            if (rep) {
                                _this.pageview.showTip({
                                    text: "创建人、邀请人或共享人不能重复",
                                    duration: 2000
                                });
                            }
                        }

                    },
                    {
                        nav_title: '选择参与人',
                        nav_color: '#37B7FD',
                        select_list: _this.participantsData
                    });
            } catch (e) {

            }

        },
        more_wrapper_click: function (sender, params) {
            //展开更多
            // if(this.pageview.refs.collapse_group.$el.hasClass("displaynone")){
            //     this.pageview.refs.collapse_group.$el.removeClass("displaynone");
            // }else{
            //     this.pageview.refs.collapse_group.$el.addClass("displaynone");
            // }
            sender.$el.addClass("displaynone");
            this.pageview.refs.collapse_group.$el.removeClass("displaynone");
        },
        remind_radiolist_init: function (sender, params) {
            var defaultSelectedData = this.reminddata[0];
            sender.setSelectedValue([defaultSelectedData]);

        },
        remind_radiolist_loaddata: function (sender, params) {
            params.success(this.reminddata);
        },
        remind_radiolist_selected: function (sender, params) {
            this.remind_value.setText(params.selectedValue[0].label);
            this.selectedRemindData = params.selectedValue[0];
        },
        remind_value_click: function (sender, params) {
            this.pageview.refs.remind_radiolist.show();
        },
        remind_value_didmount: function (sender, params) {
            this.remind_value = sender;
            sender.setText(this.reminddata[0].label);
        },
        repeat_value_init: function (sender, params) {
            this.repeat_value = sender;
        },
        setRepeatFromSelector: function (id, name) {
            //返回设置重复选项
            this.repeat_value.setText(name);
            this.repeatData.repeat_id = id;
            this.repeatData.repeat_name = name;
            if (this.repeatData.repeat_id === "0") {
                this.pageview.refs.repeat_time_group.$el.addClass("displaynone");
            }
            else {
                this.pageview.refs.repeat_time_group.$el.removeClass("displaynone");
            }
        },
        repeat_value_click: function (sender, params) {
            var _this = this;
            var startVal = this.startTime_value.getText();
            var endVal = this.endTime_value.getText();
            if (startVal !== "" && endVal !== "") {
                this.pageview.showPage({
                    pageKey: "repeatCycle",
                    mode: "fromBottom",
                    nocache: true,
                    params: {
                        selectedData: _this.repeatData
                    }
                });
            } else {
                this.pageview.showTip({
                    text: "请先选择开始时间和结束时间",
                    duration: 2000
                });
            }
        },
        repeat_startTime_value_init: function (sender, params) {
            this.repeat_startTime_value = sender;
        },
        repeat_endTime_value_init: function (sender, params) {
            this.repeat_endTime_value = sender;
        },
        repeat_endTime_value_click: function (sender, params) {
            this.repeatTimePicker.setTitle("结束重复时间");
            this.repeatTimePicker.setMinValue(this.startTime_value.getText());
            this.repeatTimePicker.show(sender.getText());
        },
        describe_textarea_count_init: function (sender, params) {
            this.describe_textarea_count = sender;
        },
        describe_textarea_compositionend: function (sender, params) {
            //日程描述输入
            var describeVal = sender.$el.find('textarea').val();
            var length = describeVal.length;
            this.describe_textarea_count.setText(length);
            if (length > 1000) {
                this.describe_textarea_count.$el.css("color", "#ff4e5b");
            }
            else {
                this.describe_textarea_count.$el.css("color", "#cccccc");
            }
        },
        place_value_click: function (sender, params) {
            //跳转原生选择地图控件
            var _this = this;
            try {
                window.yyesn.client.selectMap(function (data) {
                    _this.placeData = data.data;
                    sender.setText(data.data.addrstr);
                }, {
                    nav_title: '选择地点',
                    nav_color: '#37B7FD',
                    radius: 100
                });
            } catch (e) {

            }
        },
        share_value_click: function (sender, params) {
            //选择分享人
            var _this = this;
            try {
                window.yyesn.enterprise.selectContacts(function (data) {
                        //_this.shareData = data.data;

                        var selected = [];
                        _this.participantsData.forEach(function (it) {
                            selected.push(it);
                        });
                        if(_this.user){
                            selected.push(_this.user) ;
                        }
                        //alert(JSON.stringify(selected))
                        var norepeatMan = [];
                        var rep = false;
                        data.data.forEach(function (it, index) {
                            var needpush = true;
                            if (selected.length > 0) {
                                for(var ii=0;ii<selected.length;ii++){
                                    if (selected[ii].member_id.toString() !== it.member_id.toString()) {
                                        //norepeatMan.push(it);
                                        needpush = true;
                                    } else {
                                        rep = true;
                                        needpush = false;
                                        break;
                                    }
                                }
                            }
                            if (needpush===true) {
                                norepeatMan.push(it);
                            }
                        });
                        _this.shareData = norepeatMan;
                        var num = _this.shareData.length;
                        var arry = _this.shareData.slice(0, 6);
                        _this.pageview.refs.share_title_count.setText("已选" + num + "人");
                        _this.pageview.delegate("share_value", function (target) {
                            target.bindData(arry);
                        });
                        if (rep) {
                            _this.pageview.showTip({
                                text: "邀请或共享人不能重复",
                                duration: 2000
                            });
                        }
                    },
                    {
                        nav_title: '选择分享人',
                        nav_color: '#37B7FD',
                        select_list: _this.shareData
                    });
            } catch (e) {

            }
        },
        //整合提交数据
        getSubmitData: function () {
            var param = {};
            var startTimestamp = 0;
            var endTimestamp = 0;

            // param.userId = 0;   //用户id fixed here

            param.title = this.pageview.refs.theme_title_input.getValue();   //日程标题
            param.describe = this.pageview.refs.describe_textarea.getValue(); //日程描述
            param.wholeDay = this.allDayvalue ? 1 : 0;
            param.importance = this.importantvalue ? 1 : 0;
            if (this.allDayvalue) {
                //全天日程
                var startStr = this.startTime_value.getText().substr(0, this.startTime_value.getText().indexOf(" "));
                var endStr = this.endTime_value.getText().substr(0, this.endTime_value.getText().indexOf(" "));
                startTimestamp = utils.getDateInfo(startStr+" 00:00").timestamp;
                endTimestamp = utils.getDateInfo(endStr+" 23:59").timestamp;
            }
            else {
                //非全天日程
                startTimestamp = utils.getDateInfo(this.startTime_value.getText()).timestamp;
                endTimestamp = utils.getDateInfo(this.endTime_value.getText()).timestamp;
            }
            param.startTime = startTimestamp;  //开始时间戳
            // param.startTime = "1482147000000";  //开始时间戳
            // param.endTime = "1482147000000";      //结束时间戳
            param.endTime = endTimestamp;      //结束时间戳
            param.remind = this.selectedRemindData.id;      //提醒
            param.repeat = this.repeatData.repeat_id;      //重复选项
            if (parseInt(param.repeat) !== 0) {
                var startrepeatStr = this.repeat_startTime_value.getText().substr(0, this.repeat_startTime_value.getText().indexOf(" "));
                param.repeatStartTime = utils.getDateInfo(startrepeatStr).timestamp;  //重复开始时间
                if(this.repeat_endTime_value.getText() !== ""){
                    var endrepeatStr = this.repeat_endTime_value.getText().substr(0, this.repeat_endTime_value.getText().indexOf(" "));
                    param.repeatEndTime = utils.getDateInfo(endrepeatStr).timestamp;  //重复结束时间
                }
            }else{
                delete param.repeatStartTime;
                delete param.repeatEndTime;
            }
            param.completeStatus = 0;   //任务状态(0 未完成 1 已完成)
            if (this.placeData) {
                //地点数据
                param.longitude = this.placeData.longitude;
                param.latitude = this.placeData.latitude;
                param.location = this.placeData.addrstr;
            }
            if (this.participantsData.length) {
                //参与人数据
                var arry = [];
                for (var i = 0; i < this.participantsData.length; i++) {
                    arry[i] = this.participantsData[i].member_id;
                }
                param.joinUsers = arry.join(",");
            }else{
                param.joinUsers = "";
            }
            if (this.shareData.length) {
                //共享人数据
                var arry2 = [];
                for (var j = 0; j < this.shareData.length; j++) {
                    arry2[j] = this.shareData[j].member_id;
                }
                param.shareUsers = arry2.join(",");
            }else{
                param.shareUsers = "";
            }
            if (this.file_repeat.datasource.length > 0) {
                var dataArr = this.file_repeat.datasource;
                var arry1 = [];
                for (var k = 0; k < dataArr.length; k++) {
                    arry1[k] = {};
                    arry1[k].path = dataArr[k].path;
                    arry1[k].fname = dataArr[k].fname;
                    // arry1[i] = JSON.stringify(arry[i]);
                }
                param.files = arry1;
            }
            // var files = [{
            //     path:"http://imgsrc.baidu.com/forum/w%3D580/sign=d730a14c5266d0167e199e20a729d498/ace87d094b36acafc036b47d7cd98d1000e99c60.jpg",
            //     fname:"test"
            // }, {
            //     path:"http://imgsrc.baidu.com/forum/w%3D580/sign=d730a14c5266d0167e199e20a729d498/ace87d094b36acafc036b47d7cd98d1000e99c60.jpg",
            //     fname:"test"
            // }];
            // param.files = files;
            return JSON.stringify(param);
        },
        bindData: function () {
            //测试用
            // var data = [{
            //     fname:"协同工作首页1.jpg",
            //     path:"./imgs/space_tips.png",
            // },{
            //     fname:"协同工作首页2.jpg",
            //     path:"./imgs/space_tips.png",
            // },{
            //     fname:"协同工作首页3.jpg",
            //     path:"./imgs/space_tips.png",
            // }];
            // this.pageview.do("file_repeat",function(target){
            //     target.bindData(data,true);
            // });
        },
        file_add_btn_click: function (sender, params) {
            //跳转原生选择图片
            var _this = this;
            if (this.maxFilesNum === 0) {
                this.pageview.showTip({
                    text: "最多上传9张图片",
                    duration: 2000
                });
                return;
            }
            try {
                window.yyesn.client.selectAttachment(function (data) {
                    _this.maxFilesNum = _this.maxFilesNum - data.data.length;
                    for (var i = 0; i < data.data.length; i++) {
                        _this.file_repeat.addItem(data.data[i]);
                    }
                }, {
                    maxselectnum: _this.maxFilesNum,
                    type: "1"
                });
            } catch (e) {

            }
        },
        file_repeat_init: function (sender, params) {
            this.file_repeat = sender;
        },
        file_del_btn_click: function (sender, params) {
            sender.rowInstance.remove();
            this.maxFilesNum++;
        },
        //过滤选择人员,参与人和分享人不能有交集
        filterData: function (data1, data2) {
            //根据data2来过滤data1的数据
            //参与人数组 this.participantsData
            //共享人数组 this.shareData
            var isRepeat = false;
            var _this = this;
            for (var i = 0; i < data2.length; i++) {
                for (var j = data1.length - 1; j >= 0; j--) {
                    if (data1[j].id === data2[i].id) {
                        data1.splice(j, 1);
                        isRepeat = true;
                        break;
                    }
                }
            }
            if (isRepeat) {
                _this.pageview.showTip({
                    text: "创建人、邀请人或共享人不能重复",
                    duration: 2000
                });
            }
            return data1;
        },
        //跨天日程不能设置重复
        checkRepeat:function(){
            if(this.endTime_value.getText() !== "" && this.startTime_value.getText() !== ""){
                var startStr = this.startTime_value.getText().replace(/-/g, '/');
                var endStr = this.endTime_value.getText().replace(/-/g, '/');
                if(this.allDayvalue){
                    //全天日程
                    startStr = startStr.substr(0,startStr.indexOf(" "));
                    endStr = startStr.substr(0,endStr.indexOf(" "));
                }
                var startTime = new Date(startStr);
                var endTime = new Date(endStr);

                if(utils.compareDate(startTime,endTime)===0){
                   return true;
                }else{
                    if(parseInt(this.repeatData.repeat_id)!==0){
                        return false;
                    }
                }
                return true;
            }

        },
        //检验必填数据
        checkParams: function () {
            var tips = "";
            var title = this.pageview.refs.theme_title_input.getValue();   //日程标题
            var describe = this.pageview.refs.describe_textarea.getValue();   //日程描述
            if (describe.length > 1000) {
                tips = "日程描述不能超过1000字";
            }
            if (this.endTime_value.getText() === "") {
                tips = "请选择结束时间";
            }
            if (this.startTime_value.getText() === "") {
                tips = "请选择开始时间";
            }
            if(!this.checkRepeat()){
                tips = "跨天日程不能选择重复";
            }
            if (title === "") {
                tips = "请填写日程主题";
            }
            if (title.length > 50) {
                tips = "日程主题不能超过50字";
            }
            if (tips !== "") {
                this.pageview.showTip({
                    text: tips,
                    duration: 2000
                });
                return false;
            } else {
                return true;
            }

        },
        //编辑状态时,获取修改的数据
        getModifyData: function (isAll) {
            var params = {};
            params.changedRepeat = 0;  //0 没有修改重复，1修改了重复
            params.updateType = isAll ? 1 : 0;  //0 仅修改此日程, 1 修改所有将来日程
            var nowdata = JSON.parse(this.getSubmitData());   //当前表单数据
            if (this.data.title !== nowdata.title) {
                params.title = nowdata.title;
                this.hasModify = true;
            }
            if (this.data.describe !== nowdata.describe) {
                params.describe = nowdata.describe;
                this.hasModify = true;
            }
            if (this.data.wholeDay !== nowdata.wholeDay) {
                params.wholeDay = nowdata.wholeDay;
                this.hasModify = true;
            }
            if (this.data.startTime !== nowdata.startTime) {
                params.startTime = nowdata.startTime;
                this.hasModify = true;
            }
            if (this.data.endTime !== nowdata.endTime) {
                params.endTime = nowdata.endTime;
                this.hasModify = true;
            }
            if (parseInt(this.data.remind) !== parseInt(nowdata.remind)) {
                params.remind = nowdata.remind;
                this.hasModify = true;
            }
            if (parseInt(this.data.repeat) !== parseInt(nowdata.repeat)) {
                params.repeat = nowdata.repeat;
                params.changedRepeat = 1;
                this.hasModify = true;
            }
            if (parseInt(nowdata.repeat) !== 0) {
                //有重复
                if (this.data.repeatStartTime !== nowdata.repeatStartTime) {
                    params.repeatStartTime = nowdata.repeatStartTime;
                    params.changedRepeat = 1;
                    this.hasModify = true;
                }
                if (this.data.repeatEndTime !== nowdata.repeatEndTime) {
                    if(utils.compareDate(this.data.repeatEndTime,nowdata.repeatEndTime)!==0){
                        params.repeatEndTime = nowdata.repeatEndTime;
                        params.changedRepeat = 1;
                        this.hasModify = true;
                    }

                }
            }
            if (this.data.importance !== nowdata.importance) {
                params.importance = nowdata.importance;
                this.hasModify = true;
            }
            if (this.data.location !== nowdata.location) {
                params.location = nowdata.location;
                params.longitude = nowdata.longitude;
                params.latitude = nowdata.latitude;
                this.hasModify = true;
            }
            if (this.file_repeat.datasource.length > 0) {
                var dataArr = this.file_repeat.datasource;
                var arry = [];
                for (var i = 0; i < dataArr.length; i++) {
                    arry[i] = {};
                    arry[i].path = dataArr[i].path;
                    arry[i].fname = dataArr[i].fname;
                    if (dataArr[i].fileId) {
                        arry[i].id = dataArr[i].fileId;
                    }
                    // arry[i] = JSON.stringify(arry[i]);
                }
                params.files = arry;
                // this.hasModify = true;  //不一定改变
            }
            else {
                if (this.data.scheduleFiles.length > 0) {
                    params.files = [];
                    this.hasModify = true;
                }
            }
            params.joinUsers = nowdata.joinUsers;
            params.shareUsers = nowdata.shareUsers;
            if (this.participantsData.length !== this.data.joinUsers.length) {
                this.hasModify = true;
            }
            if (this.shareData.length !== this.data.shareUsers.length) {
                this.hasModify = true;
            }
            params.id = this.data.id;
            return JSON.stringify(params);
        },
        file_repeat_itemclick: function (sender, params) {

            var imgs = [];
            var index = 0;
            // alert('asdasdsadasda');
            // alert(JSON.stringify(sender.datasource));
            //
            // this.file_repeat.datasource.forEach(function (it,i) {
            //
            //     if(it.filePath){
            //         imgs.push(it.filePath);
            //     }
            //     if(it.filePath===sender.datasource.filePath){
            //         index=i;
            //     }
            // });
            var data = {function: "viewImage", parameters: {files: sender.datasource.path, index: 0}};
            window.WebViewJavascriptBridge.send(JSON.stringify(data), function (responseData) {
            });
        },
        //提交数据
        submitIcon_click: function (sender, params) {
            var _this = this;
            if(_this.canSub===false){
                return;
            }
            if (this.checkParams()&&_this.canSub) {
                if (this.mode === "MODIFY") {
                    //处于编辑状态
                    var data = JSON.parse(this.getModifyData());
                    if (!this.hasModify) {
                        _this.pageview.showTip({
                            text: "字段未发生修改",
                            duration: 2000
                        });
                        return;
                    }
                    if (this.data.repeat > 0) {
                        //本身是重复日程
                        if (data.changedRepeat === 1) {
                            var tips = '本次修改针对所有将来的重复日程,</br>确定保存修改嘛？';
                            this.modifyDialog = new Dialog({
                                mode: 1,
                                wrapper: this.pageview.$el,
                                contentText: tips,
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
                                        _this.modifyDialog.hide();
                                    }
                                }, {
                                    title: "确定",
                                    style: {
                                        height: 45,
                                        fontSize: 16,
                                        color: c.titleColor
                                    },
                                    onClick: function () {
                                        var params = _this.getModifyData(true);
                                        _this.send_update(params);
                                        _this.modifyDialog.hide();
                                    }
                                }]
                            });
                            this.modifyDialog.show();
                        } else {
                            this.tips_poplayer.show();
                        }

                    } else {
                        //本身是非重复日程,则直接修改
                        var param = JSON.parse(this.getModifyData(true));
                        param.updateType = param.changedRepeat;   //非重复日程,如果不修改重复,则只修改当前日程
                        _this.canSub=false;
                        _this.send_update(JSON.stringify(param));
                    }


                }
                else {
                    //创建
                    // alert(this.getSubmitData());
                    this.pageview.showLoading({
                        text: "正在处理中..."
                    });
                    _this.canSub=false;
                    this.pageview.ajax({
                        url: "/schedule/create?token=" + this.pageview.params.token,
                        type: "POST",
                        timeout: 1000000,
                        contentType: "application/json;charset=utf-8",
                        data: _this.getSubmitData(),
                        success: function (data) {
                            if (data.code === 0) {
                                _this.pageview.hideLoading();
                                _this.pageview.showTip({
                                    text: "创建日程成功",
                                    duration: 2000
                                });
                                setTimeout(function () {
                                    _this.pageview.goBack();
                                },2000);
                            } else {
                                _this.canSub=true;
                            }
                            // _this.page_content.hideLoading();
                        },
                        error: function(e) {
                            _this.canSub=true;
                            _this.pageview.hideLoading();
                            _this.pageview.showTip({
                                text: "提交失败!请稍后再试",
                                duration: 3000
                            });
                            // _this.page_content.hideLoading();
                        }
                    });
                }
            }

        },
        send_update: function (params) {
            var _this = this;
            if (this.hasModify) {
                this.pageview.showLoading({
                    text: "正在处理中..."
                });
                this.pageview.ajax({
                    url: "/schedule/update?token=" + this.pageview.params.token,
                    type: "POST",
                    timeout: 100000,
                    contentType: "application/json;charset=utf-8",
                    data: params,
                    success: function (data) {
                        if (data.code === 0) {
                            _this.isModifySuccess = true;
                            _this.pageview.hideLoading();
                            _this.pageview.showTip({
                                text: "修改日程成功",
                                duration: 2000
                            });
                            setTimeout(function () {
                                _this.pageview.ownerPage.plugin.loadData(data.data.id);
                                _this.pageview.close();
                            },2000);

                        } else {
                            _this.canSub=true;
                        }
                        // _this.page_content.hideLoading();
                    },
                    error: function (e) {
                        _this.canSub=true;
                        _this.pageview.showTip({
                            text: "提交失败!请稍后再试",
                            duration: 3000
                        });
                        _this.pageview.hideLoading();
                    }
                });
            }
        },
        tips_first_btn_click: function (sender, params) {
            //仅修改当前日程
            var param = this.getModifyData(false);
            this.send_update(param);
            this.tips_poplayer.hide();

        },
        tips_second_btn_click: function (sender, params) {
            //修改所有将来重复日程
            var param = this.getModifyData(true);
            this.send_update(param);
            this.tips_poplayer.hide();
        },
        tips_poplayer_init: function (sender, params) {
            this.tips_poplayer = sender;
        },
        tips_cancel_btn_click: function () {
            this.tips_poplayer.hide();
        },
        onPageClose: function() {
            if(!this.isModifySuccess){
                this.renderData(this.data);
            }
            this.canSub = true;
        },
    };
    return pageLogic;
});
