define(["pm", "../components/commonCtl", "utils","../../../components/dialog"],
function(PM, c, utils,dialog) {

  function pageLogic(config) {
    var _this = this;
    this.pageview = config.pageview;
    this.prePage = this.pageview.prePageView;
    this.id = this.pageview.params.id;
    this.token = this.pageview.params.token;
    this.accountId = this.pageview.params.accountId;

    if (this.prePage) {
      this.selectedRow = this.prePage.plugin.curSelectedRow;
      this.selectedRowDataSource = this.selectedRow.datasource;
    }
    this.deleteDialog = null;


    this.setHeader();

  }
  pageLogic.prototype = {
    onPageResume:function(){
      this.setHeader();
      if(this.hasAnswerRecode()){
        this.pageview.do("answer_btn",function(target){
          target.changeStatus("modify");
        });
      }
    },
    setHeader:function(){
      var _this = this;
      try{
        window.yyesn.client.setHeader(function(){},{
          type:2,
          title:"问题详情",
          //navColor:c.mainColor,
          rightTitle:"分享",
          rightValues : [
                  {key:'share', value:'分享'},
                  ]
        },function(b){
          b.registerHandler("share", function (data, responseCallback) {
            _this.showShare();
          });
        });
      }catch(e){

      }
    },
    re_self_icon_init:function(sender,params){
      if(sender.datasource.accountId&&sender.datasource.accountId.toString() === this.accountId.toString()){
        sender.config.style = sender.config.style||{};
        sender.config.style.display = "block";
      }
    },
    QueLabelWrapper_init:function(sender){
      this.QueLabelWrapper = sender;
    },
    page_content_init: function(sender, params) {
      var _this = this;
      this.page_content = sender;
      sender.showLoading({
        timeout: 7500,
        reLoadCallBack:function(e){
          _this._loaddata(sender);
        }
      });

      this._loaddata();
    },
    _loaddata:function(){
      var _this = this;
      this.pageview.ajax({
        url: "/question/details",
        type: "GET",
        timeout: 7000,
        data: {
          id: this.id,
          token:this.token,
          timestamp:(new Date()).valueOf()
        },
        success: function(data) {
          if(data.code!==0){
            _this.pageview.showTip({
              text:data.msg,
              duration:1000
            });
          }else{
            _this._binddata(data.data);
          }

          _this.page_content.hideLoading();
        },
        error: function(e) {
          _this.page_content.showLoadingError();
        }
      });
    },
    onPageLoad: function(sender) {
      if (this.selectedRowDataSource) {
        this.bindQueMainInfo(this.selectedRowDataSource);
      }
    },
    bindQueMainInfo: function(data) {
      this.pageview.do("QueTitle",
      function(target) {
        target.setText(data.title);
      });

      this.pageview.do("Que_username",
      function(target) {
        target.setText(data.userName);
      });


      this.pageview.do("Que_Desc",function(target){
        target.setText(data.description);
      });

      this.pageview.do("QueTitle",
      function(target) {
        target.setText(data.title);
      });

      this.pageview.do("Que_time",
      function(target) {
        target.setText(utils.timestampToTimeStr(data.createTime));
      });

      this.pageview.do("Que_answercount",
      function(target) {
        target.setText(data.answerNum);
      });
      var labels = c.convertLabelStrToJson(data.label);
      this.pageview.do("que_mark_repeat",
      function(target) {
        target.bindData(labels);
      });

      if(data.accountId.toString() !== this.accountId.toString()){
        this.pageview.do("QueLabelWrapper",function(target){
          if(labels.length===0){
              target.$el.addClass("displaynone");
          }else{
            target.$el.addClass("qaa-nomyque-labelwrapper");
          }
        });
      }
    },
    que_mark_repeat_init:function(sender){
      this.que_mark_repeat = sender;
    },
    modifyLabel:function(labelData){
      this.page_content.showLoading({
        text: "提交中...",
        timeout: 10000,
        reLoadCallBack:null
      });
      var _this = this;
      var label = c.convertLabelJsonToStr(labelData);
      this.pageview.ajax({
        type: "POST",
        url: "/question/update",
        timeout: 8000,
        data: {
          id:this.datasource.id,
          title: this.datasource.title,
          description: this.datasource.description,
          label: label,
          token: this.token,
          timestamp: (new Date()).valueOf()
        },
        success: function(data) {
          if (data.code === 0) {
            _this.datasource.label =label;
            if(data.data.accountId.toString()!== _this.accountId.toString()){
              if(labelData.length>0){
                _this.QueLabelWrapper.$el.removeClass("displaynone");
              }else{
                _this.QueLabelWrapper.$el.addClass("displaynone");
              }
            }

            _this.que_mark_repeat.bindData(labelData);
            if(_this.selectedRow){
              _this.selectedRow.rebind(data.data);
            }
          } else {
            _this.pageview.showTip({
              text: data.msg,
              duration: 4000
            });
          }
          _this.page_content.hideLoading();
        },
        error: function(error) {
          _this.pageview.showTip({
            text: "修改失败!请稍后再试",
            duration: 3000
          });
          _this.page_content.hideLoading();
        }
      });


    },
    answer_repeat_init:function(sender){
      this.answer_repeat = sender;
    },
    que_mark_modifyicon_click:function(sender,params){
      this.pageview.showPage({
        pageKey: "addlabel",
        mode: "fromBottom",
        params:{"type":"modify",labels:c.convertLabelStrToJson(this.datasource.label)}
      });
    },
    setLabelValue:function(){

    },
    _binddata: function(data) {
      if (!this.selectedRowDataSource) {
        this.bindQueMainInfo(data);
      }


      this.datasource = data;
      this.pageview.do("answer_repeat",function(target) {
        target.bindData(data.answers || []);
      });

      if( data.accountId.toString() === this.accountId.toString()){
        this.setPermissions();
      }else{
        // 不是自己的问题
        if(this.hasAnswerRecode()){
          this.pageview.do("answer_btn",function(target){
            target.changeStatus("modify");
          });
        }
      }

      if(data.answers.length>0){
        this.pageview.do("selfActionBar",function(target){
          target.components[0].setDisabled(true);
        });
      }
    },

    setPermissions:function(){
      this.pageview.do("bottomBar",function(target){
        target.change("selfActionBar");
      });
      this.pageview.do("que_mark_modifyicon",function(target){
        target.$el.removeClass("displaynone");
      });
    },
    answer_btn_click: function(sender) {



      if(sender.status==="modify"){
        this.selectedAnswerRow  = this._getMyAnswerItem();
        this.page_content.$el.scrollTop(this.selectedAnswerRow.$el.offset().top);
        this.pageview.showPage({
            pageKey:"addanswer",
            mode:"fromBottom",
            nocache:true,
            params:{type:"modify",answerItem:this.selectedAnswerRow}
          });

        return;
      }
      if(this.hasAnswerRecode()){
        return;
      }
      this.pageview.showPage({
        pageKey: "addanswer",
        nocache:true,
        mode: "fromBottom"
      });

    },
    re_answercount_icon_click: function(sender, params) {
      this.selectedAnswerRow = sender.rowInstance;
      this.pageview.go("commentlist", {id:sender.datasource.id,token:this.token,accountId:this.accountId});
    },
    showShare: function() {
      var content = "";
      try{
        if(this.datasource.description){
          var info= utils.processHTMLMethod2(this.datasource.description);
          if(content.length>30){
            content.substring(0,30);
          }
        }
        var preIndex = window.location.href.split("#quedetail")[0];
        var url = preIndex +"#share?id="+this.id;
        var imgurl = preIndex.split("/index.html")[0]+"/imgs/LOGO@3x.png";
        window.yyesn.client.share({
          'content': content.replace("%",""),
          'title': this.datasource.title.replace("%",""),
          'imgUrl': imgurl,
          'url':url
        });
      }catch(e){
        alert(JSON.stringify(e));
      }

    },

    re_up_icon_click:function(sender,params){

      var url = "/answer/like";
      var isCancel = false;
      if(sender.datasource.isLike===0){
        isCancel = true;
        url = "/answer/cancelLike";
      }
      var text =isCancel?parseInt(sender.getText())-1: parseInt(sender.getText())+1;
      text = text<0?0:text;
      var _this = this;
      sender.datasource.isLike = isCancel?1:0;
      var data = {};
      if(isCancel){
        sender.unSelected();
        data = {
          answerId:sender.datasource.id,
          token:this.token,
          timestamp:(new Date()).valueOf()
        };
      }else{
        sender.selected();
        data = {
          id:sender.datasource.id,
          token:this.token,
          timestamp:(new Date()).valueOf()
        };
      }
      sender.setText(text);
      this.pageview.ajax({
        type:"POST",
        url:url,
        timeout:7000,
        data:data,
        success:function(data){
          if(data.code!==0&&data.code!=100020002){
            sender.unSelected();
            sender.datasource.isLike = 1;
          }
          if(data.code!==0){
            if(isCancel){
              sender.selected();
              sender.datasource.isLike = 0;
              sender.setText(text+1);
            }else{
              sender.setText(text-1);
            }
            _this.pageview.showTip({
              text:data.msg,
              duration:2000
            });
          }
        },
        error:function(e){
          if(isCancel){
            sender.selected();
            sender.datasource.isLike = 0;
            sender.setText(text+1);
          }else{
            sender.unSelected();
            sender.datasource.isLike = 1;
            sender.setText(text-1);
          }
        }
      });
    },
    re_up_icon_init:function(sender,params){
      if(sender.datasource.isLike===0){
        sender.selected();
      }
    },

    selfActionPoplayer_init:function(sender,params){
      this.selfActionPoplayer = sender;
    },
    cancelSelfActionIcon_click:function(){
      this.selfActionPoplayer.hide();
    },
    selfActionBar_init:function(sender,params){
      this.selfActionBar = sender;
    },
    ModifyAnswerIcon_click:function(sender,params){

      this.selfActionPoplayer.hide();
      this.pageview.showPage({
          pageKey:"addanswer",
          mode:"fromBottom",
          nocache:true,
          params:{type:"modify",answerItem:this.selectedAnswerRow}
        });

    },

    // 删除的问题已经存在
    deleteQue:function(){
      this.deleteDialog.hide();
      this.pageview.showLoading({
        text:"正在删除",
        timeout:10000
      });
      var _this = this;
      this.pageview.ajax({
        type:"POST",
        url:"/question/delete",
        timeout:8000,
        data:{
          id:this.datasource.id,
          token:this.token||"",
          timestamp:(new Date()).valueOf()
        },
        success:function(data){
          _this.pageview.hideLoading();
          if(data.code===0){
            if(_this.selectedRow){
              _this.selectedRow.remove();
            }
            _this.pageview.goBack();
          }else{
            if(data.code===100020004){
              _this._loaddata();
              _this.selfActionBar.components[0].setDisabled(true);
            }
            _this.pageview.showTip({
              text:data.msg,
              duration:2000
            });
          }
        },
        error:function(e){
          _this.pageview.showTip({
            text:"删除失败！请稍后再试",
            duration:2000
          });
          _this.pageview.hideLoading();
        }
      });
    },
    showDeleteDialog:function(){
      var _this = this;
      if(!this.deleteDialog){
        this.deleteDialog = new dialog({
          mode:3,
          wrapper:this.pageview.$el,
          contentText:"确定删除当前问题吗？",
          btnDirection:"row",
          buttons:[
            {
              title:"删除",
              style:{
                height:45,
                fontSize:16,
                borderRight:"1px solid #EEEEEE",
                color:"rgb(255, 78, 91)"
              },
              onClick:function(){
                _this.deleteQue();
              }
            },
            {
              title:"取消",
              style:{
                height:45,
                fontSize:16,
                color:c.titleColor,
              },
              onClick:function(){
                _this.deleteDialog.hide();
              }
            }
          ]
        });
      }
      this.deleteDialog.show();
    },


    _getMyAnswerItem:function(){
      var _this = this;
      var myAnswerItem = this.answer_repeat.getItem(function(item){
        return item.datasource.accountId.toString() === _this.accountId.toString();
      });
      return myAnswerItem;
    },
    hasAnswerRecode:function(){
      var myAnswerItem = this._getMyAnswerItem();
      if(myAnswerItem){

        return true;
      }
      return false;
    },
    selfActionBar_itemclick:function(sender,params){
      var title = sender.datasource.title;
      var _this = this;
      if(title==="修改"){
        this.pageview.showPage({
          pageKey:"addque",
          nocache:true,
          mode:"fromBottom",
          params:{type:"modify",queData:this.datasource,quelistselectedrow:this.selectedRow}
        });
      }else if(title=="删除"){
        this.showDeleteDialog();
      }else if(title=="回答"){

        if(this.hasAnswerRecode()){
          this.pageview.showTip({
            text:"您已经回答过该问题,请找到您的问题进行修改",
            duration:1200,
            style:{
              width:200
            }
          });
          return;
        }
        this.pageview.showPage({
          pageKey:"addanswer",
          nocache:true,
          mode:"fromBottom",
          params:{type:"new"}
        });
      }
    },
    DelteModifyIcon_click:function(sender,params){
      var _this = this;
      this.selfActionPoplayer.hide();

      this.pageview.showLoading({
        text:"删除中...",
        duration:9000,
        reLoadCallBack:function(){
            _this._deleteAnswer();
        }
      });

      this._deleteAnswer();

    },
    _deleteAnswer:function(){
      var _this = this;
      this.pageview.ajax({
        type:"POST",
        url:"/answer/delete",
        timeout:8000,
        data:{
          id:this.selectedAnswerRow.datasource.id,
          token:this.token||"",
          timestamp:(new Date()).valueOf()
        },
        success:function(data){

          _this.pageview.do("answer_btn",function(target){
            target.changeStatus();
          });

          _this.pageview.hideLoading();
          if(data.code===0){
              _this.selectedAnswerRow.remove();
              _this._updateAnswerCount();
          }else{
            _this.pageview.showTip({
              text:data.msg,
              duration:2000
            });
          }
        },
        error:function(e){
          _this.pageview.showTip({
            text:"删除失败！请稍后再试",
            duration:2000
          });
          _this.pageview.hideLoading();
        }
      });
    },
    _updateAnswerCount:function(){
      var _this = this;
      this.pageview.do("Que_answercount",function(target) {
        target.setText(_this.answer_repeat.datasource.length);
      });
      var selectedRow = this.pageview.plugin.selectedRow;
      if(selectedRow&&selectedRow.refs){
        var row_answernum_icon =selectedRow.refs.new_row_answernum_icon||selectedRow.refs.search_row_answernum_icon;
        if(row_answernum_icon){
          row_answernum_icon.setText(this.answer_repeat.datasource.length);
        }
      }
    },
    re_top_view_click:function(sender,params){
      if(sender.datasource.accountId.toString() === this.accountId.toString()){
        this.selectedAnswerRow = sender.rowInstance;
        this.selfActionPoplayer.show();
      }

    },

    shareCancelIcon_click: function() {
      this.sharePoplayer.hide();
    },
    backIcon_click: function(sender, params) {
      PM.goBack();
    },

    re_time_init:function(sender,params){
      sender.config.text  =utils.timestampToTimeStr(sender.datasource.createTime);
    },

  };
  return pageLogic;
});
