/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;

        console.log(this.pageview.config.viewpagerParams);
    }

    pageLogic.prototype = {
        onPageLoad: function (c) {


        },
        onPageResume: function () {

        },
        add_btn_click: function (sender, params) {
            this.pageview.go("add");
        },
        mydayview_itemclick:function (c,id) {
            this.pageview.go("detail",{scheduleId:id});

        },
        body_reload:function(){
            this.onShowItem(this.parentSender,this.parentData);
        },
        onShowItem: function (sender, data) {
            var _this = this;
            this.parentSender = sender;
            this.parentData = data;
            this.pageview.showLoading();
            this.pageview.ajax({
                type: "GET",
                url: "/schedule/getDayList",
                data: {
                    date: data.date?data.date:new Date(data.rootPage.pageview.refs.calendarlist.curDate).getTime()
                },
                success: function (res) {
                    _this.pageview.hideLoading();
                    if(res.code === 0&&res.data.length===0){
                        _this.pageview.refs.mydayview.$el.hide();
                        _this.pageview.refs.nodata.$el.show();
                    }
                    if (res.code === 0&&res.data.length>0) {
                        _this.pageview.refs.mydayview.$el.show();
                        _this.pageview.refs.nodata.$el.hide();
                        _this.pageview.refs.mydayview.loadData(_this.pageview.refs.mydayview, res.data);
                    }
                }
            });
        }
    };
    return pageLogic;
});
