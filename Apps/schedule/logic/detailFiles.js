/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.data = this.pageview.viewpagerParams.data;

        this.parentBody = (this.pageview.config.viewpager.pageview.refs.body);
    }

    //yyesn.client.previewFile(function(d){ alert(JSON.stringify(d)) },{ "fid": "113" });

    pageLogic.prototype = {
        onPageLoad: function () {
            var _this = this;
            this.pageview.do("repeat",
                function (target) {
                    target.bindData(_this.data);
                });
            this.pageview.do("file_nodata",
                function (target) {
                    if(_this.data.length === 0){
                        target.$el.removeClass("displaynone");
                    }else{
                        target.$el.addClass("displaynone");
                    }

                });
        },
        timesize_init: function (sender, params) {
            var timeStr = utils.timestampToTimeStr(sender.datasource.createTime);
            sender.config.text = timeStr;
        },
        repeat_itemclick: function (sender, p) {
            //window.yyesn.client.previewFile(function(d){ alert(JSON.stringify(d)) },{ "fid": "113" });

                var imgs=[];
                var index=0;
                sender.parent.datasource.forEach(function (it,i) {
                    if(it.filePath){
                        imgs.push(it.filePath);
                    }
                    if(it.filePath===sender.datasource.filePath){
                        index=i;
                    }
                });
                var data = {function: "viewImage", parameters: {files: imgs.join(','), index: index}};
                window.WebViewJavascriptBridge.send(JSON.stringify(data), function (responseData) {
                });


            // if(imgs.length>0){
            //     window.yyesn.client.viewImage(function (d) {
            //     }, {
            //         files: imgs.join(','),
            //         index: index
            //     });
            // }

        }
    };
    return pageLogic;
});
