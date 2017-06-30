define(["utils","../components/commonCtl"],function(utils,c){

    function pageLogic(config){
      this.pageview = config.pageview;
      this.answerId = this.pageview.params.id;

      this.token = this.pageview.params.token;
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
            title:"评论",
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
        backIcon_click:function(sender,params){
          if(this.pageview.ownerPage){
            this.pageview.ownerPage.hideCurShowPage();
          }else{
            this.pageview.goBack();
          }
        },
        submit:function(sender,params){
          var _this = this;
          var commentText = $.trim(this.comment_textarea.getValue());
          if(commentText.length===0){
            this.pageview.showTip({
              text:"请填写评论！",
              withoutBackCover:true,
              timeout:2000
            });
            return;
          }

          this.page_content.showLoading({
            text:"提交中...",
            timeout:11000,
            reLoadCallBack:function(){
              _this.submitComment(commentText);
            }
          });
          this.submitComment(commentText);
        },
        page_content_init:function(sender,params){
          this.page_content = sender;
        },
        comment_textarea_init:function(sender,params){
          this.comment_textarea = sender;
          this.comment_textarea.focus();
        },
        submitSuccess:function(data){
          if(this.pageview.ownerPage){
            var listPage = this.pageview.ownerPage;
            var listview = listPage.plugin.listview;
            var QueDetaiPage = listPage.prePageView;
            listview.insertRow(data,0);
            if(QueDetaiPage){
             var answercountIcon = QueDetaiPage.plugin.selectedAnswerRow.refs.re_answercount_icon;
             answercountIcon.selected();
             var count = answercountIcon.getText();
             if(!count||isNaN(count)){
              count = 1;
             }else{
              count = parseInt(count)+1;
             }
             answercountIcon.setText(count);

            }
          }
          this.pageview.goBack();
        },
        submitComment:function(commentText){
          var _this = this;
          this.pageview.ajax({
            url:"comment/add",
            type:"POST",
            timeout:10000,
            data:{
              answerId:this.answerId,
              commentText:commentText,
              token:this.token,
              timestamp:(new Date()).valueOf()
            },
            success:function(data){
              if(data.code === 0){
                _this.submitSuccess(data.data);
              }else{
                _this.pageview.showTip({
                  text:data.msg,
                  duration:4000
                });
              }
              _this.page_content.hideLoading();
            },
            error:function(e){
              _this.pageview.showTip({
                text:"提交失败!请稍后再试",
                duration:3000
              });
              _this.page_content.hideLoading();
            }
          });
        },
    };
    return pageLogic;
});
