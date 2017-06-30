/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;

        this.hasMoreData = true;
        this.data = this.pageview.viewpagerParams.data; //评论数据
        this.parentBody = (this.pageview.config.viewpager.pageview.refs.body);

    }

    pageLogic.prototype = {
        // AvatarMd5: function (str) {
        //     var reg = /^[A-Za-z]+$/,
        //         name = reg.test(str) ? str.slice(0, 2) : str.slice(str.length - 2, str.length),
        //         md5_str = md5.createHash(str),
        //         first_Ele = isNaN(parseInt(md5_str.slice(0, 1)))
        //             ? md5_str.slice(0, 1).toLowerCase().charCodeAt() - 97
        //             : md5_str.slice(0, 1),
        //         map_color = ['29d4ff', '1594ff', 'ffa92f', 'b587fa', '06cf86', 'fa6771', '73d51c', '8991ff'],
        //         color = '#' + map_color[first_Ele % 8];
        //
        //     return {
        //         name: name,
        //         color: color
        //     };
        // },
        onPageLoad: function () {
            var _this = this;
            // var data = [{},{},{},{},{},{},{}];
            // this.pageview.do("comment_repeat",
            //     function (target) {
            //         target.bindData(_this.data);
            //
            //         _this.pageview.do("comment_nodata",
            //             function (target) {
            //                 if(_this.data.length === 0){
            //                     target.$el.removeClass("displaynone");
            //                 }else{
            //                     target.$el.addClass("displaynone");
            //                 }
            //             });
            //     });
        },
        row_content_init:function (sender,params) {
            sender.config.text=sender.config.text.replace(/\n/g,'<br>');
        },
        comment_time_init: function (sender, params) {
            var timeStr = utils.timestampToTimeStr(sender.datasource.createTime);
            sender.config.text = timeStr;
        },
        // content_canpulltorefresh:function(sender,params){
        //   return this.parentBody.$el.scrollTop() <=0;
        // },
        // content_pulltorefresh:function(sender){
        //   this.pageview.refs.listview.loadFirstPageData();
        // },

    };
    return pageLogic;
});
