define(["pm", "../components/commonCtl", "utils"],
function(PM, c, utils) {
//https://www.zybuluo.com/junhong-cai/note/484648
  function pageLogic(config) {
    this.pageview = config.pageview;
    this.prePage = this.pageview.prePageView;
    this.id = this.pageview.params.id;
    this.token = this.pageview.params.token;
    this.accountId = this.pageview.params.accountId;

    if (this.prePage) {
      this.selectedRow = this.prePage.plugin.curSelectedRow;
      this.selectedRowDataSource = this.selectedRow.datasource;
    }

  }
  pageLogic.prototype = {

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
        url: "/question/share",
        type: "GET",
        timeout: 7000,
        data: {
          id: this.id,
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

        target.close();
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

      this.pageview.do("que_mark_repeat",
      function(target) {
        target.bindData(c.convertLabelStrToJson(data.label));
      });
    },
    que_mark_repeat_init:function(sender){
      this.que_mark_repeat = sender;
    },
    answer_repeat_init:function(sender){
      this.answer_repeat = sender;
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
      if(data.answers.length>0){

      }
    },

    answer_btn_click: function() {
      this.pageview.showPage({
        pageKey: "addanswer",
        mode: "fromBottom"
      });
    },
    header_right_icon_click: function(sender, params) {
      this.sharePoplayer.show();
    },

    re_up_icon_init:function(sender,params){
      if(sender.datasource.isLike===0){
        sender.selected();
      }
    },
    selfActionPoplayer_init:function(sender,params){
      this.selfActionPoplayer = sender;
    },
    selfActionBar_init:function(sender,params){
      this.selfActionBar = sender;
    },

    re_top_view_click:function(sender,params){
      if(sender.datasource.accountId.toString() === this.accountId.toString()){
        this.selectedAnswerRow = sender.rowInstance;
        this.selfActionPoplayer.show();
      }

    },
    cancelSelfActionIcon_click:function(sender,prams){
      this.selfActionPoplayer.hide();
    },
    shareCancelIcon_click: function() {
      this.sharePoplayer.hide();
    },

    re_time_init:function(sender,params){
      sender.config.text  =utils.timestampToTimeStr(sender.datasource.createTime);
    },
    sharePoplayer_init: function(sender, params) {
      this.sharePoplayer = sender;
    }
  };
  return pageLogic;
});
