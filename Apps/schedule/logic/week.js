/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils,Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
     }

    pageLogic.prototype = {
      add_btn_click:function(sender,params){
        this.pageview.go("add");
      }

    };
    return pageLogic;
});
