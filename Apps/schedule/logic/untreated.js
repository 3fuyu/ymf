/**
 * 添加
 **/
define(["../parts/common", "utils", "../components/dialog"], function (c, utils, Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
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
                                "title": "未处理",
                                "titleColor": "#292f33"
                            },
                        ],
                        "rightItems": []
                    });
                });
            } catch (e) {
            }
        },
        page_content_pulltorefresh: function (sender, params) {
            this.pageview.refs.listview.loadFirstPageData();
        },
        page_content_loadmore: function (sender, params) {
            this.pageview.refs.listview.loadNextPageData();
        },
        schedule_time_init: function (sender, params) {
            var st = utils.ConvertDateToStr(sender.datasource.startTime, "yyyy-MM-dd hh:mm");
            var et = utils.ConvertDateToStr(sender.datasource.endTime, "yyyy-MM-dd hh:mm");
            sender.config.text = st + ' 至 ' + et;
        },
        listview_parsedata: function (sender, params) {
            var data = params.data;
            console.log(data);
            //return [{},{},{},{},{},{},{},{},{},{}];
            if (data.code !== 0) {
                return false;
            }
            return data.data.data;
        },
        //
        // _loadData:function(index){
        //     var _this = this;
        //     var totalPages;
        //     var data = [];
        //     this.pageview.ajax({
        //         url: "/template/list",
        //         type: "GET",
        //         data: {
        //             pageNum:index,
        //             pageSize:19
        //         },
        //         success: function (data) {
        //             if (data.code === 0) {
        //                 totalPages = data.data.pages;
        //                 _this.pageview.delegate("repeat",function(target){
        //                     target.bindData(data.data.list);
        //                 });
        //             }
        //         },
        //         error: function () {
        //         }
        //     });
        //
        // },
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
                        _this.handle_schedule(1, _this.reject_id, _this.reject_sender);
                    }
                }]
            });


        },
        reject_btn_click: function (sender, params) {
            //拒绝日程
            this.deleteDialog.show();
            this.reject_sender = sender;
            this.reject_id = sender.datasource.id;
            // this.handle_schedule(1, sender.datasource.id, sender);
        },
        receive_btn_click: function (sender, params) {
            //接受日程
            this.handle_schedule(0, sender.datasource.id, sender);
        },
        repeat_main_click: function (sender, params) {
            this.pageview.go("detail", {scheduleId: sender.datasource.id});
        },
        listview_init:function(sender,params){
            this.listview = sender;
        },
        handle_schedule: function (type, id, sender) {
            //发送请求,type为1是拒绝,type为0是接受
            var _this = this;
            var reason = this.pageview.refs.reason_input.getValue();
            var replySource = utils.deviceInfo().isIOS?2:1;
            _this.pageview.refs.listview.reload();
            this.pageview.showLoading();
            this.pageview.ajax({
                url: "/schedule/handle",
                type: "POST",
                data: {
                    id: id,
                    type: type,
                    reason:reason,
                    replySource:replySource
                },
                success: function (data) {
                    _this.pageview.hideLoading();
                    if (data.code === 0) {
                        //remove当前行
                        if (type === 1) {
                            //拒绝
                            _this.deleteDialog.hide();
                            _this.pageview.refs.reason_input.$el.find("textarea").val("");
                            _this.pageview.showTip({
                                text: data.data.msg,
                                duration: 1000
                            });
                        }else {
                            _this.pageview.showTip({
                                text: data.data.msg,
                                duration: 1000
                            });
                        }
                        sender.parent.parent.remove();
                    }else if(data.code === 100010000){
                        //该日程被创建人删除后
                        _this.pageview.showTip({
                            text: data.msg,
                            duration: 1000
                        });
                        sender.parent.parent.remove();
                    }
                    if(_this.listview.rows.length === 0){
                         _this.listview.reload();
                          // _this.listview.showNodata(true);
                    }
                },
                error: function () {
                    _this.pageview.hideLoading();
                }
            });
        },
        onPageResume: function (sender, params) {
            this.setHeader();
            this.listview.loadFirstPageData();
        },
    };
    return pageLogic;
});
