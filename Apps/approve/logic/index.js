define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {


    function pageLogic(config) {
        this.countNum = 0;
        this.pageview = config.pageview;
        this.loadData();

        this.loadNum();

        var _this = this;


        window.setTimeout(function () {

            var featureStr = _this.pageview.pageManager.appConfig.feature;
            var versionkey = _this.pageview.pageManager.appConfig.versionkey;
            if (!versionkey) {
                alert("没有配置 versionkey");
            }
            var newestversion = _this.pageview.pageManager.appConfig.version;
            var curVerison = window.localStorage.getItem(versionkey) || "0";
            if (newestversion !== curVerison) {
                window.localStorage.setItem(versionkey, newestversion);
                if (featureStr && featureStr.length > 0) {
                    _this.pageview.showDialog("dialog");
                    _this.pageview.delegate("featureText", function (target) {
                        target.setText(featureStr);
                    });
                }
            }

        }, 222);
        this.setHeader();
    }


    pageLogic.prototype = {

        featureBtn_click: function () {
            this.pageview.hideDialog("dialog");
        },
        onPageResume: function () {
            this.loadNum();
            this.setHeader();

        },
        setHeader: function () {
            var _this = this;
            try {
                window.yyesn.client.setHeader(function () {}, {
                    type: 2,
                    title: "审批",
                    rightTitle: "帮助",
                    rightValues: [
                        {key: 'submit', value: '帮助'},
                    ]
                }, function (b) {
                    b.registerHandler("submit", function (data, responseCallback) {
                        _this.pageview.go("help");
                    });
                });
            } catch (e) {

            }
        },

        loadNum: function () {
            var _this = this;

            this.pageview.ajax({
                type: "GET",
                url: "index/myApproveNum",
                data: {},
                success: function (data) {
                    if (data.code === 0) {
                        _this.countNum = data.data.count;

                        _this.pageview.delegate("waitme_approve_icon", function (target) {
                            target.setBadge(data.data.count, {
                                backgroundColor: "#F66C6C",
                                right: "-15px",
                                top: "-10px"
                            });
                        });
                    }
                },
                error: function (e) {

                }
            });

            this.pageview.ajax({
                type: "GET",
                url: "index/ccNum",
                data: {},
                success: function (data) {
                    if (data.code === 0) {
                        _this.pageview.delegate("copy_approve_icon", function (target) {
                            target.setBadge(data.data.count, {
                                backgroundColor: "#F66C6C",
                                right: "-15px",
                                top: "-10px"
                            });
                        });
                    }
                },
                error: function (e) {

                }
            });
        },
        loadData: function () {
            var _this = this;
            this.pageview.showLoading({
                text: "努力加载中...",
                timeout: 9000,
                reLoadCallBack: function () {
                    _this._loadData();
                }
            });

            _this._loadData();

        },
        _loadData: function () {
            var _this = this;

            this.pageview.ajax({
                url: '/index/templateList',
                type: 'GET',

                success: function (data) {
                    _this._loadSuccess(data.data);
                }
            });
        },
        _loadSuccess: function (data) {
            data = data || [];
            var len = data.length;
            if (len > 0) {
                var n = len % 3;
                if (n !== 0) {
                    n = 3 - n;
                }
                for (var i = 0; i < n; i++) {
                    data.push({});
                }
            }

            this.pageview.hideLoading(true);
            this.pageview.delegate("app_repeat", function (target) {
                target.bindData(data);
            });
        },
        app_repeat_itemclick: function (sender, params) {
            var name = sender.datasource.name;
            var id = sender.datasource.id;
            if (name !== null && name !== undefined) {
                this.pageview.go("form", {templateid: id, name: encodeURI(name)});
            } else {
                sender.$el.addClass('no-result');
            }
        },
        app_repeat_iteminit: function (sender, params) {
            var name = sender.datasource.name;

            // 没有模板内容增加类来区分点击态
            if (name === null || name === undefined) {
                sender.$el.addClass('no-result');
            }
        },
        onPageBeforeLeave: function (sender, params) {
            if (params.isForward !== true) {
                window.yyesn.client.closePage();
                return false;
            }
        },
        topview_left_click: function () {
            this.pageview.go("waitmeapprove", {type: "waitmeapprove", countNum: this.countNum});
        },
        topview_middle_click: function () {
            this.pageview.go("commonlist", {type: "myapprove"});
        },
        topview_right_click: function () {
            this.pageview.go("commonlist", {type: "copyapprove"});
        }
    };
    return pageLogic;
});
