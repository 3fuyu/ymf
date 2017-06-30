/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
    }

    function getFirstAndLastMonthDay(year, month) {
        var firstdate = year + '-' + month + '-01' + " " + "00:00:00";
        var day = new Date(year, month, 0);
        var lastdate = year + '-' + month + '-' + day.getDate() + ' ' + "23:59:59";//获取当月最后一天日期
        //给文本控件赋值。同下
        return {firstDate: new Date(firstdate).getTime(), lastDate: new Date(lastdate).getTime()};
    }

    pageLogic.prototype = {
        schedule_listview_init: function (sender, params) {
            var ctime = new Date();
            sender.config.ajaxConfig.data = {
                date: ctime.getTime()
            };
        },
        onPageLoad: function () {

        },
        schedule_listview_didmount: function (sender) {
            sender.loadFirstPageData();
        },

        row_top_left_init: function (sender, params) {
            if (sender.datasource.role == 3) {
                //被共享
                sender.config.iconStyle.backgroundColor = "rgb(255, 207, 14)";
                sender.config.font = 'sc_e92b';

            }
        },
        row_bottom_tag_init: function (sender, params) {
            if (sender.datasource.importance === 0) {
                sender.$el.addClass("displaynone");
            }
        },
        row_top_right_init: function (sender, params) {

        },
        body_reload: function (sender) {
            this.pageview.refs.schedule_listview.loadFirstPageData();
        },
        schedule_listview_rowclick: function (sender, params) {
            this.pageview.go("detail", {scheduleId: sender.datasource.id});
        },
        schedule_listview_parsedata: function (sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }
            for (var i = 0; i < data.data.length; i++) {
                var endTimeInfo = utils.getDateInfo(new Date(data.data[i].endTime));
                var startTimeInfo = utils.getDateInfo(new Date(data.data[i].startTime));
                data.data[i].startTimeStr = startTimeInfo.month + "-" + startTimeInfo.day + " " + startTimeInfo.hourStr + ":" + startTimeInfo.minStr;
                if (data.data[i].wholeDay === 0) {
                    data.data[i].endTimeStr = endTimeInfo.month + "-" + endTimeInfo.day + " " + endTimeInfo.hourStr + ":" + endTimeInfo.minStr + " 结束";
                } else {
                    data.data[i].endTimeStr = endTimeInfo.month + "-" + endTimeInfo.day + " " + "23:59" + " 结束";
                }
                data.data[i].startTimeStr = startTimeInfo.year + "-" + data.data[i].startTimeStr;
                data.data[i].endTimeStr = endTimeInfo.year + "-" + data.data[i].endTimeStr;

            }
            return data.data;
        },

    };
    return pageLogic;
});
