define(["utils"], function(utils) {
    var p = "开发";
//  var host ="http://121.42.30.191:9080/approve/api";
    // var host ="http://10.2.104.18:8080";//大致本机
    var host ="http://121.42.30.191:8880/approve-app";
    if(p==="正式"){
        host ="https://sp.upesn.com/approve/api";
    }else if(p==="生产测试"){
        host ="https://sp.upesn.com/approve/api";
    } else if (p === "gz") {
        host = "http://localhost:8080/approve-app";
    }
    return {
        init: function(PM) {

            PM.start({
                host: host,
                version:"1.2.0",
                versionkey:"approveversionkey",
                feature:"<div style='text-align:left'><div style='color:#666;font-size:15px;padding-bottom:2px'>新版本更新：</div><div class='feature-item'>1.支持多种应用场景的审批</div><div class='feature-item'>2.一键提交审批单据，快速了解审批流转情况</div><div class='feature-item'>3.审批消息推送，防止漏审</div></div>",
                customerComponents: {
                    ApproveSearchView:"./components/ApproveSearchView",
                },
                root: "index",
                baseSize: {
                    width: 375,
                    height: 667
                },
                beforeSendAjax: function(config) {
                    var pageInstance = config.pageviewInstance;
                    config.data = config.data || {};
                    config.data.token = pageInstance.params["token"];

                    config.xhrFields = true;
                },
                beforeGo: function(config) {
                    var pageInstance = config.pageviewInstance;
                    config.params.token = pageInstance.params.token||'';
                },
                onAjaxResponse: function(params) {
                    if (params.isSuccess) {
                        if (params.data) {
                            var flag = params.data.success;
                            if(flag === true){
                            	params.data.code = 0;//请求成功
                            }else{
                            	params.data.code = 500;//请求失败
                            }
                            if (params.data.code.toString() === "100010008") {
                                PM.showTip({
                                    text: "操作过期,两秒后会自动退出",
                                    duration: 3500,
                                    clickNoHide: true
                                });
                                try {
                                    window.setTimeout(function() {
                                        window.yyesn.client.closePage();
                                    }, 3500);
                                } catch (e) {}
                            }
                        }

                    }
                }
            });

        }
    };
});
