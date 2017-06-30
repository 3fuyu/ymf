/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.data = this.pageview.viewpagerParams.data; //操作历史数据
        this.setData(this.data);
    }

    pageLogic.prototype = {
        repeat_iteminit: function (sender, params) {
            var index = sender.config.index;
            var allLength = sender.parent.initSourceLength;
            if (index === 0) {
                sender.$el.addClass("action-record-first");
            }
            if (index == allLength - 1) {
                sender.$el.addClass("action-record-last");
            }
        },
        record_time_init: function (sender, params) {
            var timeStr = utils.timestampToTimeStr(sender.datasource.createTime);
            sender.config.text = timeStr;
        },
        record_content_init: function (sender,p) {
            if(sender){
                sender.config.text=sender.datasource.reason?sender.datasource.reason.replace(/\n/g,'<br>'):'';
            }
        },
        setData: function (data) {
            this.pageview.do("repeat",
                function (target) {
                    target.bindData(data);
                    // _this.bindSelectedItemData();
                });
        },

    };
    return pageLogic;
});
