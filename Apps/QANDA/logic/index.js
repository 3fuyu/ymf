define(["../components/commonCtl","utils"],function(c,utils){

    function pageLogic(config){
      this.pageview = config.pageview;
      this.token = this.pageview.params.token||"";
      this.accountId =this.pageview.params.accountId;
      // this.accountId = 1;
      // alert(this.accountId);
      this.setHeader();
    }
    pageLogic.prototype = {
      onPageResume:function(sender,params){
        var _this = this;
        this.setHeader();

      },
      new_wrapper_init:function(sender,params){
        this.new_wrapper = sender;
      },
      page_segment_change:function(sender,params){
        var title = params.item.datasource.title;
        if(title=="热问榜"||title=="推荐"){
          this.pageview.showTip({
            text:"敬请期待",
            duration:1000,
            style:{
              width:120
            },
          });
          return true;
        }
        return false;
      },
      setHeader:function(){
        try{
          window.yyesn.client.setHeader(function(){},{
            type:2,
            title:"问答",
            rightTitle:"",
            //navColor:c.mainColor,
            rightValues:[],
          },function(b){

          });
        }catch(e){

        }
      },
        submitbtn_click:function(sender,params){
            this.pageview.go("addque",{token:this.token,accountId:this.accountId});
        },
        hot_wrapper_init:function(sender,params){
        },
        new_listview_rowclick:function(sender,params){
          this.curSelectedRow = sender;
          this.pageview.go("quedetail",{id:sender.datasource.id,token:this.token,accountId:this.accountId});
        },
        new_row_mark_repeat_init:function(sender,prams){
          sender.config.items=c.convertLabelStrToJson(sender.config.items);
        },
        new_listview_beforeload:function(sender,params){
          sender.setAjaxConfigParams({
            timestamp:(new Date()).valueOf(),
            token:this.token
          });
        },
        new_listview_init:function(sender,params){
          this.new_listview = sender;
        },

        new_listview_parsedata:function(sender,params){
          var data = params.data;
          if(data.code!==0){
            return false;
          }
          return data.data;
        },

        backIcon_click:function(sender,params){
          try{
            window.yyesn.client.closePage();
          }catch(e){

          }
        },
        searchinput_click:function(sender,params){
          this.pageview.go("search",{token:this.token,accountId:this.accountId});
        },
        recommend_searchinput_click:function(sender,params){
          this.pageview.go("search",{token:this.token,accountId:this.accountId});
        },
        hot_searchinput_click:function(sender,params){
        },
        new_row_up_icon_init:function(sender,params){
          if(sender.datasource.isLikes===0){
            sender.selected();
          }
        },
        new_row_up_icon_click:function(sender){
          c.upQue({
            sender:sender,
            pageview:this.pageview,
            token:this.token,
            id:sender.datasource.id
          });
        },
        page_content_init:function(sender,params){
          this.page_content = sender;
        },
        new_wrapper_loadmore:function(sender,params){
          this.new_listview.loadNextPageData();
        },
        new_wrapper_pulltorefresh:function(sender,params){
          this.new_listview.loadFirstPageData();

        },
        new_row_time_init:function(sender,params){
          sender.config.text  =utils.timestampToTimeStr(sender.datasource.createTime);
        },
    };
    return pageLogic;
});
