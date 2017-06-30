/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils"], function(c, utils) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.accountId = this.pageview.params.accountId;

        this.setHeader();
    }
    pageLogic.prototype = {
        createIcon_click: function() {
            this.pageview.go("add", {
                mode: 'add'
            });
        },
        onPageResume: function(sender, params) {
            this._loadData();
            this.setHeader();
        },
        setHeader: function() {
            var _this = this;
            try {
                window.yyesn.client.setHeader(function() {}, {
                    type: 2,
                    title: "清单",
                    rightTitle: "已完成",
                    rightValues: [{
                        key: 'done',
                        value: '已完成'
                    }]
                }, function(b) {
                    b.registerHandler("done", function(data, responseCallback) {
                        _this.pageview.go("donelist");
                    });
                });
            } catch (e) {

            }
        },

        onPageLoad: function() {
            var _this = this;

            this.pageview.showLoading({
                text: "正在加载...",
                timeout: 9000,
                reLoadCallBack: function() {
                    _this._loadData();
                }
            });
            this._loadData();
        },
        _loadData: function() {
            var _this = this;
            this.pageview.ajax({
                type: "GET",
                url: "/list/entryStatistics",
                timeout: 80000,
                data: {},
                success: function(data) {
                    if (data.code === 0) {
                        _this.pageview.hideLoading();
                        var newnormalData = [],
                            normalData = data.data.normal,
                            classData = data.data.class;
                        //如果normal的数据count为0,删除掉
                        for (var i = 0; i < normalData.length; i++) {
                            if (normalData[i].count > 0) {
                                newnormalData.push(normalData[i]);
                            }
                        }
                        _this.pageview.do("first_repeat", function(target) {
                            target.bindData(newnormalData);
                        });

                        _this.pageview.do("second_repeat", function(target) {
                            target.bindData(classData);
                        });
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    // _this.pageview.hideLoading();
                    _this.pageview.showLoadingError();
                }
            });
        },
        first_repeat_itemclick: function(sender, params) {
            var label = sender.datasource.name;
            switch (label) {
                case "重要":
                    this.pageview.go("todaylist", {
                        listtype: 1002
                    });
                    break;
                case "全部":
                    this.pageview.go("todaylist", {
                        listtype: 1003
                    });
                    break;
                case "今日":
                    this.pageview.go("todaylist", {
                        listtype: 1000
                    });
                    break;
                case "最近七天":
                    this.pageview.go("recentlylist", {
                        listtype: 1001
                    });
                    break;
                default:
            }
        },

        second_repeat_itemclick: function(sender, params) {
            var code = sender.datasource.code;
            var name = encodeURI(sender.datasource.name);
            this.pageview.go("filterlist", {
                listid: code,
                name: name
            });
        },
    };
    return pageLogic;
});
