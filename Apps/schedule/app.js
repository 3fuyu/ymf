define(["utils"], function(utils) {
    var p = "开发";

     var host ="http://115.29.39.62/schedule";
    // var host ="http://115.29.39.62/wc";
    // var host ="http://192.168.2.135:8080";
    // var host ="http://192.168.2.135:8080";
     // var host ="http://10.21.2.13:8080/client-web-schedule";

    var taskhost = "http://115.29.39.62/task";
    if(p==="正式"){
      host ="/schedule";
      taskhost = "http://ezone.upesn.com/task";
    }

    return {
        init: function(PM) {

            PM.start({
                host: host,
                taskhost:taskhost,
                customerComponents: {
                   schedulecalendar:"./components/schedulecalendar",
                   dayview:"./components/dayview"
                },
                root: "index",
                baseSize: {
                    width: 375,
                    height: 667
                },
                remindDict:[{id:"0","label":"不提醒"},
                    {id:"1","label":"提前5分钟"},
                    {id:"2","label":"提前30分钟"},
                    {id:"3","label":"提前1小时"},
                    {id:"4","label":"提前2小时"},
                    {id:"5","label":"提前3小时"},
                    {id:"6","label":"提前1天"},
                    {id:"7","label":"提前2天"},
                    {id:"8","label":"提前3天"}],
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
                    // if (!arg.isForward && arg.fromPage == "index") {
                    //     window.yyesn.client.closePage();
                    // }
                }
            });

        }
    };
});
