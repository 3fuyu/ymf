define(["utils","../components/commonCtl"],
function(utils,c) {

  function pageLogic(config) {
    this.pageview = config.pageview;

    this.token = this.pageview.params.token;
    this.fromType = this.pageview.params.from;//页面来源，1表示来自签到页面的提问跳转

    this.isModifyQue = this.pageview.showPageParams.type === "modify";

    if(this.isModifyQue){
      this.queData = this.pageview.showPageParams.queData;
      this.bindQueInfoWhenModify();
    }
    this.setHeader();
    this.canSubmit = true;
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
          title:"提问",
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
    imagesRepeat_init:function(sender,params){
      this.imagesRepeat = sender;
    },
    bindQueInfoWhenModify:function(){
      var queData = this.queData;
      var desInfo = utils.processHTMLMethod2(queData.description);
      var imgUrls = [];
      for(var i=0,j=desInfo.imageDoms.length;i<j;i++){
        imgUrls.push({src:desInfo.imageDoms[i].src});
      }
      this.pageview.do("label_repeat",function(target){
        target.bindData(c.convertLabelStrToJson(queData.label),true);
      });
      this.pageview.do("imagesRepeat",function(target){
        target.bindData(imgUrls,true);
      });
      this.pageview.do("queName",function(target){
        target.setValue(queData.title);
      });
      this.pageview.do("queDesc",function(target){
        target.setValue(desInfo.curText);
      });
    },
    setLabelValue: function(datasource) {
      this.label_repeat.bindData(datasource,true);
    },
    addlabel_wrapper_click: function(sender, prams) {
      this.pageview.showPage({
        pageKey: "addlabel",
        //inRouter:true,
        mode: "fromBottom",
        params:{labels:this.label_repeat.datasource}
      });
    },
    header_right_icon_init: function(sender, params) {
      if (this.isModifyQue) {
        sender.config.text = "修改";
      }
    },


    queName_init: function(sender, params) {
      this.queName = sender;


    },
    queDesc_init: function(sender, params) {
      this.queDesc = sender;
    },
    submit: function() {


      this.queName.blur();
      this.queDesc.blur();

      var _this = this;
      var queName = $.trim(this.queName.getValue());
      var queDesc = $.trim(this.queDesc.getValue());
      queDesc = queDesc.replace(/\n/g,"<br/>");
      var warn = null;
      if (queName === "") {
        warn = "问题名称必填";
      } else if (queName.length < 6) {
        warn = "问题过于简单！";
      } else if (queName.length > 50) {
        warn = "问题不能超过50个字！";
      }
      if (warn !== null) {
        this.pageview.showTip({
          text: warn,
          withoutBackCover: true,
          style: {
            width: 160
          },
          duration: 1800
        });
        return;
      }



      var label =c.convertLabelJsonToStr(this.label_repeat.datasource);

      this.pageview.showLoading({
        text: "提交中...",
        timeout: 9000,
        reLoadCallBack: function() {
          _this.submitData(queName, queDesc, label);
        }
      });

      this.submitData(queName, queDesc, label);
    },
    test_click:function(){
      this.submit();
    },
    modifySuccess:function(data){
      this.pageview.ownerPage.hideCurShowPage();
      var quelistselectedrow = this.pageview.showPageParams.quelistselectedrow;
      if(quelistselectedrow){
        quelistselectedrow.rebind(data);
      }
      this.pageview.ownerPage.plugin.datasource = data;
      this.pageview.ownerPage.plugin.bindQueMainInfo(data);
    },
    ModifyData:function(queName, queDesc, label){
      var _this = this;
      this.pageview.ajax({
        type: "POST",
        url: "/question/update",
        timeout: 8000,
        data: {
          id:this.queData.id,
          title: queName,
          description: queDesc,
          label: label || "",
          token: this.token,
          timestamp: (new Date()).valueOf()
        },
        success: function(data) {
          _this.canSubmit = true;
          if (data.code === 0) {
            _this.modifySuccess(data.data);
          } else {
            _this.pageview.showTip({
              text: data.msg,
              duration: 4000
            });
          }
          _this.pageview.hideLoading();
        },
        error: function(error) {
          _this.canSubmit = true;
          _this.pageview.showTip({
            text: "网络异常导致修改失败!请稍后再试",
            duration: 3000
          });
          _this.pageview.hideLoading();
        }
      });
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
    submitData: function(queName, queDesc, label) {
      if(!this.canSubmit){
        return;
      }
      var _this = this;
      queDesc = this.appendImages(queDesc);


      this.canSubmit = false;

      if (this.isModifyQue) {
        this.ModifyData(queName, queDesc, label);
        return;
      }

      this.pageview.ajax({
        type: "POST",
        url: "/question/add",
        timeout: 8000,
        data: {
          title: queName,
          description: queDesc,
          label: label || "",
          token: this.token,
          timestamp: (new Date()).valueOf()
        },
        success: function(data) {
          _this.canSubmit = true;
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
          _this.canSubmit = true;
          _this.pageview.showTip({
            text: "网络异常导致提交失败!请稍后再试",
            duration: 3000
          });
          _this.pageview.hideLoading();
        }
      });
    },
    submitSuccess: function(data) {
        var _this = this;
      if (this.pageview.prePageView) {
        var new_listview = this.pageview.prePageView.plugin.new_listview;
        if (new_listview) {
          new_listview.insertRow(data, 0);
        }
        this.pageview.prePageView.plugin.new_wrapper.$el.scrollTop(0);
      }
      _this.pageview.showTip({
        text: "提交成功",
        duration: 2000
      });
      setTimeout(function(){
          if(_this.fromType){
              window.yyesn.client.closePage();
          } else {
              this.pageview.goBack();
          }
        },2000);

    },
    page_content_init: function(sender, params) {
      this.page_content = sender;
    },
    label_repeat_init: function(sender) {
      this.label_repeat = sender;
    },
    backIcon_click: function(sender, params) {
      this.pageview.goBack();
    }
  };
  return pageLogic;
});
