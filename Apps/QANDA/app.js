define(["utils"],function(utils){
    var hostname = window.location.hostname;
    var url = "http://115.29.39.62/question";//115环境
    var host = hostname.indexOf('localhost') > -1 ? url: "/question";
    host = url;
    return {
        init:function(PM){
            PM.start({
                host:host,
                customerComponents:{
                  QueListDescCtl:"./components/QueListDescCtl",
                  ContentLabelCtl:"./components/ContentLabelCtl"
                },
                root:"index",
                baseSize:{width:375,height:667},
                beforeSendAjax:function(config){
                  var userId = config.pageviewInstance.params.userId||"";
                  config.data.userId = userId;
                  config.data.url = window.location.href.split("index.html")[0]+"index.html#quedetail";
                },
                beforeGo:function(config){
                  var pageInstance = config.pageviewInstance;
                  config.params.userId = pageInstance.params.userId||"";
                },
                onAjaxResponse:function(params){
                  if(params.isSuccess){
                    if(params.data){
                      var code = params.data.code;
                      if(code.toString()==="100010008"){
                        PM.showTip({
                          text:"操作过期,两秒后会自动退出",
                          duration:2500,
                          clickNoHide:true
                        });
                        try{
                          window.setTimeout(function(){
                            window.yyesn.client.closePage();
                          },2500);
                        }catch(e){}
                      }
                    }

                  }
                },
                routerChange:function(arg){
                  var action = arg.params.action;
                  if(arg.toPage==="index"&&action){
                    if(action!=="delQuestion"){
                      PM.go("quedetail",{id:arg.params.questionId,accountId:arg.params.accountId,token:arg.params.token});
                    }
                  }

                  if(!arg.isForward&&arg.fromPage=="addque"&&arg.params.from){
                    window.yyesn.client.closePage();
                  }
                  if(!arg.isForward&&arg.fromPage=="index"){
                    window.yyesn.client.closePage();
                  }
                }
            });

        }
    };
});
