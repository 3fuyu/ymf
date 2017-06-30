define(["utils","../components/commonCtl"],function(utils,c){

    function pageLogic(config){
      this.pageview = config.pageview;
      this.id = this.pageview.params.id;
      this.token = this.pageview.params.token;

      this.userId =this.pageview.params.userId||"";
      this.setHeader();
    }
    pageLogic.prototype = {
      onPageResume:function(){
        this.setHeader();
      },
      setHeader:function(){
        try{
          window.yyesn.client.setHeader(function(){},{
            type:2,
            title:"评论",

            //navColor:c.mainColor,
            rightTitle:"",
            rightValues:[],
          },function(b){

          });
        }catch(e){

        }
      },
        backIcon_click:function(sender,params){
          this.pageview.goBack();
        },
        // comment_input_click:function(){
        //   this.pageview.showPage({
        //     pageKey:"comment",
        //     nocache:true,
        //     mode:"fromBottom"
        //   });
        // },
        listview_init:function(sender){
          this.listview = sender;
        },
        listview_beforeload:function(sender,params){
          sender.setAjaxConfigParams({
            id:this.id ,
          token:this.token,
          timestamp:(new Date()).valueOf()});
        },
        listview_parsedata:function(sender,params){
          return params.data.data;
        },
        page_content_pulltorefresh:function(sender,params){
          this.listview.loadFirstPageData();
        },
        page_content_loadmore:function(sender,params){
          this.listview.loadNextPageData();
        },

        row_time_init:function(sender,params){
          sender.config.text  =utils.timestampToTimeStr(sender.datasource.createTime);
        },
        comment_input_init:function(sender,params){
          var _this = this;
          this.comment_input = sender;

        },
        comment_input_focus:function(sender,params){
          var _this = this;
          window.setTimeout(function(){
            _this.page_content.$el.scrollTop(0);
          },200);
        },
        comment_input_keyup:function(sender,params){
          var text = $.trim(sender.getValue());
          if(params.e.keyCode === 13){
            if(text === ""){
              return;
            }
            this.submit_btn.setDisabled(true);
            this.submit(text);
          }else{
            if(text === ""){
              this.submit_btn.setDisabled(true);
            }else{
              this.submit_btn.setDisabled(false);
            }
          }
        },
        submit_btn_init:function(sender,params){
          this.submit_btn = sender;
          sender.setDisabled(true);
        },
        submit_btn_click:function(sender,params){
          var text = $.trim(this.comment_input.getValue());
          if(text!==""){
            this.submit_btn.setDisabled(true);
            this.submit(text);
          }
        },
        submit:function(val){
          var _this = this;
          this.comment_input.setValue("");
          var commentText = $.trim(val);
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
            timeout:11000
          });
          this.submitComment(commentText);
        },
        page_content_init:function(sender,params){
          this.page_content = sender;
        },

        submitSuccess:function(data){
          this.comment_input.blur();
          this.page_content.$el.scrollTop(0);
            var listview = this.listview;
            var QueDetaiPage = this.pageview.prePageView;
            listview.insertRow(data,0);
            if(QueDetaiPage){
             var answercountIcon = QueDetaiPage.plugin.selectedAnswerRow.refs.re_answercount_icon;
            //  answercountIcon.selected();
             var count = answercountIcon.getText();
             if(!count||isNaN(count)){
              count = 1;
             }else{
              count = parseInt(count)+1;
             }
             answercountIcon.setText(count);
            }
        },
        submitComment:function(commentText){
          var _this = this;
          this.pageview.ajax({
            url:"comment/add",
            type:"POST",
            timeout:10000,
            data:{
              answerId:this.pageview.params.id,
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
