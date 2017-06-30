define(["utils","../components/commonCtl"],
function(utils,c) {

  function pageLogic(config) {
    this.pageview = config.pageview;
    this.id = this.pageview.params.id;
    this.token = this.pageview.params.token;

    this.isModifyAnswer = this.pageview.showPageParams.type === "modify";
    if (this.isModifyAnswer) {
      this.bindAnswerInfoWhenMidify();
    }

    this.setHeader();
  }

  pageLogic.prototype = {
    onPageResume:function(){
      this.setHeader();
    },
    test_click:function(){
      this.submit();
    },
    setHeader:function(){
      var _this = this;

      try{
        window.yyesn.client.setHeader(function(){},{
          type:2,
          title:"回答",
          rightTitle:"提交",
          //navColor:c.mainColor,
          rightValues : [
                  {key:'submit', value:'提交'},
                  ]
        },function(b){
          b.registerHandler("submit", function (data, responseCallback) {
            _this.submit();
          });
        });
      }catch(e){

      }
    },
    bindAnswerInfoWhenMidify: function() {
      //this.pageview.showPageParams.answerItem.rebind(data);
      var item_com = this.pageview.showPageParams.answerItem;
      var  answerData = item_com.datasource;

      var desInfo = utils.processHTMLMethod2(answerData.answerText);
      var imgUrls = [];
      for(var i=0,j=desInfo.imageDoms.length;i<j;i++){
        imgUrls.push({src:desInfo.imageDoms[i].src});
      }
      this.pageview.do("imagesRepeat",function(target){
        target.bindData(imgUrls,true);
      });
      this.pageview.do("answer_textarea",function(target){
        target.setValue(desInfo.curText);
      });
    },
    header_right_icon_init: function(sender, params) {
      if (this.isModifyAnswer) {
        sender.config.text = "修改";
      }
    },
    backIcon_click: function(sender, params) {
      if (this.pageview.ownerPage) {
        this.pageview.ownerPage.hideCurShowPage();
      } else {
        this.pageview.goBack();
      }
    },
    page_content_init: function(sender) {
      this.page_content = sender;
    },
    submit: function() {

      this.answer_textarea.blur();

      var _this = this;
      var answerText = $.trim(this.answer_textarea.getValue());
      answerText = answerText.replace(/\n/g,"<br/>");
      if (answerText.length < 3) {
        this.pageview.showTip({
          text: "回答过于简单！",
          withoutBackCover: true,
          duration: 1000,
          style: {
            width: 120
          }
        });
        return;
      }
      this.pageview.showLoading({
        text: "提交中...",
        timeout: 11000,
        // reLoadCallBack: function() {
        //   _this.submitAnswer(answerText);
        // }
      });

      this.submitAnswer(answerText);

    },
    imagesRepeat_init:function(sender){
      this.imagesRepeat = sender;
    },
    imagesRepeat_itemclick:function(sender,params){
      var imgs = [];
      for(var i=0,j=sender.parent.datasource.length;i<j;i++){
        imgs.push(sender.parent.datasource[i].src);
      }
      try{
        window.yyesn.client.viewImage({
          "files":imgs.join(","),
          "index":parseInt(params.index)
        });
      }catch(e){}
    },
    appendImages:function(desc){
      for(var i=0,j=this.imagesRepeat.datasource.length;i<j;i++){
        desc+= "<div><img src='"+this.imagesRepeat.datasource[i].src+"'/></div>";
      }
      return desc;
    },
    imageDelIcon_click:function(sender,params){
      sender.rowInstance.remove();
    },
    CameraIcon_click:function(){
      this.selectAttachment(4);
    },
    selectAttachment:function(type){
      c.selectAttachment(this,type);
    },
    addImageIcon_click:function(){
      this.selectAttachment(1);
    },
    photoIcon_click:function(){
      this.selectAttachment(1);
    },
    modifyAnswer:function(text){
      var _this = this;
      var data = this.pageview.showPageParams.answerItem.datasource;
      this.pageview.ajax({
        type: "POST",
        url: "answer/update",
        timeout: 10000,
        data: {
          id:data.id,
          answerText: text,
          token: this.token,
          timestamp: (new Date()).valueOf()
        },
        success: function(data) {
          if (data.code === 0) {
            _this.modiftSuccess(data.data,_this.pageview.showPageParams.answerItem);
          } else {
            _this.pageview.showTip({
              text: data.msg,
              duration: 4000
            });
          }
          _this.pageview.hideLoading();
        },
        error: function(error) {
          _this.pageview.showTip({
            text: "修改失败!请稍后再试",
            duration: 3000
          });
          _this.pageview.hideLoading();
        }
      });
    },
    submitAnswer: function(text) {
      var _this = this;
      text = this.appendImages(text);
      if (this.isModifyAnswer) {
        this.modifyAnswer(text);
        return;
      }
      this.pageview.ajax({
        type: "POST",
        url: "answer/add",
        timeout: 10000,
        data: {
          questionId: this.id,
          answerText: text,
          token: this.token,
          timestamp: (new Date()).valueOf()
        },
        success: function(data) {
          if (data.code === 0) {
            _this.submitSuccess(data.data);
          } else {
            _this.pageview.showTip({
              text: data.msg,
              duration: 4000
            });
          }
          _this.pageview.hideLoading();
        },
        error: function(error) {
          _this.pageview.showTip({
            text: "提交失败!请稍后再试",
            duration: 3000
          });
          _this.pageview.hideLoading();
        }
      });
    },
    modiftSuccess:function(data,item){
      item.rebind(data);
      this.pageview.goBack();
    },
    submitSuccess: function(data) {
      var DetailPageInstance = this.pageview.ownerPage;
      if (DetailPageInstance) {
        var answerRepeat = DetailPageInstance.plugin.answer_repeat;
        answerRepeat.insertItem(data, 0);
        DetailPageInstance.plugin._updateAnswerCount();
      }
      this.pageview.goBack();
    },
    answer_textarea_init: function(sender) {
      this.answer_textarea = sender;
      sender.focus();
    },
  };
  return pageLogic;
});
