define(["../parts/common", "utils", "../../../components/dialog", "../parts/timepicker"], function (c, utils,Dialog,timepicker) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.id = this.pageview.params.scheduleId;    //日程id
        // this.selectedData = this.pageview.showPageParams.selectedData;
        this.setHeader();
    }

    pageLogic.prototype = {
        onPageLoad: function() {
            var _this = this;

        },
        onPageResume: function (sender, params) {
            this.setHeader();
        },
        setHeader: function() {
            var _this = this;
            try {
                window.yyesn.ready(function () {
                    window.yyesn.register({
                        rightvalue: function (d) {
                        }
                    });
                    window.yyesn.client.configNavBar(function (d) {}, {
                        "centerItems":[
                            {"title":"回复",
                                "titleColor":"#292f33"},
                        ],
                        "rightItems":[
                        ]
                    });
                });
            }catch (e) {}
        },
        comment_input_init:function(sender,params){
            this.comment_input = sender;
        },
        comment_input_compositionend:function(sender,params){
            //回复输入
            var commentVal = sender.$el.find("textarea").val();
            var length = commentVal.length;
            this.comment_count.setText(length);
            if(length>500){
                this.comment_count.$el.css("color","#ff4e5b");
            }
            else{
                this.comment_count.$el.css("color","#cccccc");
            }
        },
        comment_count_init:function(sender,params){
            this.comment_count = sender;
        },
        submitIcon_click:function(){
            //提交回复数据
            var _this = this;
            var replySource = utils.deviceInfo().isIOS?2:1;
            var commentVal = this.comment_input.getValue().trim();
            if(!commentVal){
                _this.pageview.showTip({
                    text: "回复内容不能为空",
                    duration: 2000
                });
                return;
            }
            this.pageview.showLoading({
                text:"正在处理中..."
            });
            this.pageview.ajax({
                url: "/scheduleComment/reply",
                type: "POST",
                timeout: 10000,
                data: {
                    scheduleId:_this.id,
                    content:commentVal,
                    replySource:replySource
                },
                success: function(data) {
                    if (data.code === 0) {
                        _this.pageview.ownerPage.plugin.setCommentRepeat(data.data);
                        // _this.replyData = data.data;
                        _this.pageview.showTip({
                            text: "提交回复成功",
                            duration: 2000
                        });
                        setTimeout(function(){
                            _this.pageview.close();
                            _this.comment_input.$el.find("textarea").val("");
                            _this.comment_count.setText("0");
                        },2000);
                    } else {

                    }
                    _this.pageview.hideLoading();
                },
                error: function(e) {
                    _this.pageview.hideLoading();
                    _this.pageview.showTip({
                        text: "提交失败!请稍后再试",
                        duration: 3000
                    });
                    // _this.page_content.hideLoading();
                }
            });
        },
        onPageClose: function() {
            // this.selectedData = null;
        },
    };
    return pageLogic;
});