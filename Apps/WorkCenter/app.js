define(["utils"], function(utils) {
    var p = "正式";
    var host ="http://115.29.39.62/wc/";
    var taskhost = "http://115.29.39.62/task";
    if(p==="正式"){
      host ="/wc";
      taskhost = "https://ezone.upesn.com/task";
    }
    return {
        init: function(PM) {

            PM.start({
                host: host,
                taskhost:taskhost,
                customerComponents: {
                   wccalendar:"./components/wccalendar",
                   folderlist:"./components/folderlist"
                },
                root: "index",
                baseSize: {
                    width: 375,
                    height: 667
                },
                beforeSendAjax: function(config) {
                    var pageInstance = config.pageviewInstance;
                    config.data.token = pageInstance.params["token"];
                    config.data.pushSalt = pageInstance.params["pushSalt"];
                    // alert(pageInstance.params.token);
                    //  config.data.token = '123456';
                },
                beforeGo: function(config) {
                    var pageInstance = config.pageviewInstance;
                    config.params.token = pageInstance.params.token||'123456';
                    config.params.pushSalt = pageInstance.params.pushSalt;
                    // alert(pageInstance.params.token);
                },
                onAjaxResponse: function(params) {
                    if (params.isSuccess) {
                        if (params.data) {
                            var code = params.data.code;
                            if (code.toString() === "100010008") {
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
                },
                routerChange: function(arg) {
                    if (!arg.isForward && arg.fromPage == "index") {
                        window.yyesn.client.closePage();
                    }
                }
            });

        }
    };
});
