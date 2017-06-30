define(["../components/commonCtl",'utils'],function(c,utils){

    function pageLogic(config){
      this.pageview = config.pageview;
      this.seed = 0;
      this.isInLoading = false;
      this.searchHistorKey = "@*#^#^&!212sh";
      this.token = this.pageview.params.token||"";
      this.accountId = this.pageview.params.accountId;
      this.setHeader();
    }
    pageLogic.prototype = {
      onPageResume:function(){
        this.setHeader();
      },
      setHeader:function(){
        var _this = this;

        try{
          window.yyesn.client.setHeader(function(){},{
            type:2,
            title:"问题库",
            //navColor:c.mainColor,
            rightTitle:"提问",
            rightValues : [
                    {key:'goToAddQue', value:'提问'},
                    ]
          },function(b){
            b.registerHandler("goToAddQue", function (data, responseCallback) {
              _this.goToAddQue();
            });
          });
        }catch(e){

        }
      },
        goToAddQue:function(sender,params){
          this.pageview.showPage({
            pageKey:"addque",
            mode:"fromBottom"
          });
        },
        backIcon_click:function(sender,params){
          this.pageview.goBack();
        },
        search_listview_init:function(sender,params){
          this.search_listview = sender;
        },
        body_init:function(sender){
          this.listviewbody = sender;
        },
        searchview_init:function(sender){
          this.searchview = sender;
        },
        historySearch_repeat_init:function(sender){
          this.historySearch_repeat = sender;
          this.bindHistoryRepeat(this.getSearchHistory());
        },
        clearHistoryBtn_click:function(sender){
           window.localStorage.removeItem(this.searchHistorKey);
           this.historySearch_repeat.bindData([]);
        },
        historySearch_repeat_itemclick:function(sender,params){
          this.searchview.search(sender.datasource.title,true);
        },
        bindHistoryRepeat:function(data){
          var re = [];
          for(var i=data.length-1;i>=0;i--){
            re.push({title:data[i]});
          }
          this.historySearch_repeat.bindData(re);
        },
        reload:function(){
          this.search_listview.reload();
        },
        search_row_que_name_init:function(sender,params){
          try{
            var text = sender.config.text;
            var r = new RegExp("("+this.keyword.replace(/[(){}.+*?^$|\\\[\]]/g, "\\$&")+")","ig");
            text = text.replace(r,"<b style='color:rgb(115, 213, 28);'>"+this.keyword+"</b>");
            sender.config.text = text;
          }catch(e){}
        },
        searchview_change:function(sender){
          var _this = this;
          this.listviewbody.showLoading({
            style:{
              alignItems:"flex-start",
              paddingTop:80
            },
            timeout:4000,
            reLoadCallBack:function(){
              _this.reload.call(_this);
            }
          });

          var keyWord =$.trim(sender.val());
          if(this.isInLoading){
            return;
          }

          if(keyWord===""){
            this.isInLoading = false;
            this.listviewbody.hideLoading();
            return;
          }

          this.search_listview.setAjaxConfigParams({
             pageNo:0,
             title:keyWord,
             token:this.token,
             timestamp:(new Date()).valueOf()
           });
          this.isInLoading = true;
          this.search_listview.loadFirstPageData();
          this.keyword = keyWord;
        },
        search_row_mark_repeat_init:function(sender,prams){
          sender.config.items=c.convertLabelStrToJson(sender.config.items);
        },
        getSearchHistory:function(){
          var storage = window.localStorage;
          var searchHistory = storage.getItem(this.searchHistorKey);
          var sh_arr = [];
          if(searchHistory){
            try{
              sh_arr = JSON.parse(searchHistory);
              if(!(sh_arr instanceof Array)){
                sh_arr = [];
              }
            }catch(e){

            }
          }
          return sh_arr;
        },
        addSearchHistroy:function(str){
          var storage = window.localStorage;
          var sh_arr = this.getSearchHistory();
          var index = sh_arr.indexOf(str);
          if(index>=0){
            sh_arr.splice(index,1);
          }else{
            if(sh_arr.length>20){
              sh_arr.splice(0,1);
            }
          }
          sh_arr.push(str);
          this.bindHistoryRepeat(sh_arr);
          storage.setItem(this.searchHistorKey,JSON.stringify(sh_arr));
        },
        body_loadmore:function(sender,params){
          this.search_listview.loadNextPageData();
        },
        search_listview_afterload:function(sender,params){
          if(params.isFirstLoad){
            if(this.searchview.value()!==params.params.title){
              this.searchview_change(this.searchview.input);
            }
          }
        },
        search_listview_rowclick:function(sender,params){
          this.curSelectedRow = sender;
          this.pageview.go("quedetail",{id:sender.datasource.id,token:this.token,accountId:this.accountId});
        },
        search_listview_beforeload:function(sender,params){
          sender.setAjaxConfigParams({
            timestamp:(new Date()).valueOf(),
            token:this.token
          });
        },
        search_row_up_icon_init:function(sender,params){
          if(sender.datasource.isLikes===0){
            sender.selected();
          }
        },
        search_row_up_icon_click:function(sender){
          c.upQue({
            sender:sender,
            token:this.token,
            pageview:this.pageview,
            id:sender.datasource.id
          });
        },
        search_listview_parsedata:function(sender,params){
          var _this = this;
          if(params.params.title){
            this.addSearchHistroy(params.params.title);
          }
          this.isInLoading = false;
          window.setTimeout(function(){
            _this.listviewbody.hideLoading();
          },200);
          var data = params.data;
          if(data.code!==0){
            return false;
          }
          return data.data;

        },
        search_row_time_init:function(sender,params){
          sender.config.text  =utils.timestampToTimeStr(sender.datasource.createTime);
        },
    };
    return pageLogic;
});
