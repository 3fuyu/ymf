/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils,Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.datasource = this.pageview.showPageParams.items;

        this.originalData = utils.copy(this.datasource);
        this.isItemSort = this.pageview.showPageParams.type ==="item";
        this.setHeader();
    }

    pageLogic.prototype = {
        setHeader: function() {
          try {
            window.yyesn.ready(function () {
              window.yyesn.register({
                rightvalue: function (d) {
                }
              });
              window.yyesn.client.configNavBar(function (d) {}, {
                "centerItems":[
                  {"title":"排序",
                    "titleColor":"#292f33"},
                ],
                "rightItems":[
                ]
              });
            });
          }catch (e) {

          }
          // try {
          // window.yyesn.client.setHeader(function () {
          //   }, {
          //     type: 2,
          //     title: "排序",
          //     rightTitle: "",
          //     rightValues: [],
          // }, function (b) {});
          // } catch (e) {}
      },
      sort_repeat_init:function(sender,params){
        this.sort_repeat = sender;
        sender.config.items = this.datasource;
        sender.startSort();
      },
      item_icon_init:function(sender,params){
        if(this.isItemSort){
          sender.config.font = "wc_e90d";
          sender.config.iconStyle.color = "#A5A7AA";
        }
      },
      onPageClose:function(){
        var originalDict = {};
        for(var i=0,j=this.originalData.length;i<j;i++){
          var id = this.originalData[i].id.toString();
          originalDict[id] = i+1;
        }
        var curDataSource = this.sort_repeat.datasource;
        var curDict = {};
        for(var n=0,m=curDataSource.length;n<m;n++){
          var iid = curDataSource[n].id.toString();
          curDict[iid] = n+1;
        }
        var result = [];
        var sortHasChanged = false;
        for(var key in curDict){
          if(curDict[key]!==originalDict[key]){
            sortHasChanged = true;
            result.push({"id":parseInt(key),"sort":curDict[key]});
          }
        }
        if(!sortHasChanged){
          this.pageview.ownerPage.plugin.noNeedReloadData = true;
          return;
        }
        this.pageview.ownerPage.plugin.noNeedFolderListReLoadData = true;
        if(this.isItemSort){
          this.pageview.ownerPage.plugin.sortBillItem(result, this.pageview.showPageParams.folderID);
        }else{
          this.pageview.ownerPage.plugin.sortFolder(result);
        }
      }

    };
    return pageLogic;
});
