define(["utils"], function(utils) {
    return {
        init: function(PM) {
            PM.start({
                // host:"http://localhost:3333/",
                // host: "http://10.21.2.113:8084/",
                // host: "http://115.29.39.62/clist/",
                host: "http://10.21.3.18:7004/clist/",
                customerComponents: {
                    // name:"./components/path",
                },
                root: "index",
                baseSize: {
                    width: 375,
                    height: 667
                },
                beforeSendAjax: function(config) {
                    // var pageInstance = config.pageviewInstance;
                    // config.data.token = pageInstance.params["token"];
                    // config.data.pushSalt = pageInstance.params["pushSalt"];
                    // alert(pageInstance.params.token);
                    config.data.token = '123456';
                },
                beforeGo: function(config) {
                    var pageInstance = config.pageviewInstance;
                    config.params.token = pageInstance.params.token;
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
