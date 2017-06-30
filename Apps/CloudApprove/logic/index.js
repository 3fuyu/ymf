define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {


    function pageLogic(config) {
        this.countNum = 0;
        this.toBeApproveNum = 0;//待审批的数量
        this.myApproveNum = 0;//我发起的
        this.copy2MeNum = 0;//抄送我的
        this.pageview = config.pageview;
        this.loadNum();
        this.loadData();
        this.setHeader();
        this.getUserInfo();


    }


    pageLogic.prototype = {
        onPageResume: function () {//第二次打开页面的时候触发该事件
            this.loadNum();
            this.setHeader();

        },
        getUserInfo: function () {
            this.pageview.ajax({
                url: '/user/getMeInfo',
                type: "GET",
                success: function (data) {
                    if (data.success) {
                        window.currentUserInfo = data.data;
                    }
                }
            });
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

        /**
         * 获取顶部未处理的数据
         */
        loadNum: function () {
            var _this = this;
            this.pageview.ajax({
                type: "POST",
                url: "/process/myDataCount",
                data: {},
                success: function (data) {
                    if (data.success === true) {
                        var dataObj = data.data;
                        _this.toBeApproveNum = parseInt(dataObj.todo);
                        _this.myApproveNum = parseInt(dataObj.running);
                        _this.copy2MeNum = parseInt(dataObj.copyTo);
                        //显示待审批数量
                        _this.pageview.delegate("waitme_approve_icon", function (target) {
                            var num = _this.toBeApproveNum > 99 ? "99+" :_this.toBeApproveNum;
                            target.setBadge(num, {
                                backgroundColor: "#F66C6C",
                                right: "-15px",
                                top: "-10px"
                            });
                        });
                        //初始化我发起的图标
                        _this.pageview.delegate("my_approve_icon", function (target) {
                            if (_this.myApproveNum === 0) {
                                target.$el.find('.yy-icon-img img')
                                .attr("src", "./imgs/yunshen_applied_finish.png?v=1");
                            }
                        });
                        //显示抄送我的数量
                        _this.pageview.delegate("copy_approve_icon", function (target) {
                            var num = _this.copy2MeNum > 99 ? "99+" :_this.copy2MeNum;
                            target.setBadge(num, {
                                backgroundColor: "#F66C6C",
                                right: "-8px",
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
                url: '/form/listForm',
                type: 'POST',
                data: {//默认显示20个常用模板
                    size: "20",
                    start: "0"
                },

                success: function (data) {
                    _this._loadSuccess(data.data);
                },
                error: function (data) {
                    _this.pageview.showTip({text: data.msg, duration: 1000});
                }
            });
        },
        _loadSuccess: function (data) {
            this.pageview.hideLoading(true);
            if (!data || data.list.length === 0) {//没有数据的时候特殊处理
                data = {
                    list: []
                };
            } else {
                this.pageview.delegate("more_template_end", function (target) {
                    target.$el.css({display: ""});
                });
            }
            var dataList = data.list;
            this.pageview.delegate("app_repeat", function (target) {
                target.bindData(dataList);
            });

        },
        app_repeat_itemclick: function (sender, params) {
            var title = sender.datasource.title,
                formId = sender.datasource.formId,
                source = sender.datasource.source,
                formType = 'NEW';
            if (title !== null && title !== undefined) {
                this.pageview.go("form", {templateid: formId, title: encodeURI(title), source: source, formType: formType});
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
            window.pageViewTitle = null;
            this.pageview.go("waitmeapprove", {type: "waitmeapprove", countNum: this.toBeApproveNum});
        },
        topview_middle_click: function () {
            this.pageview.go("myapprove", {type: "myapprove", countNum: this.myApproveNum});
        },
        topview_right_click: function () {
            this.pageview.go("commonlist", {type: "copyapprove", countNum: this.copy2MeNum});
        },
        more_template_end_click: function (e) {
            var _this = this;

            this.pageview.ajax({//判断是否为管理员
                url: '/user/isAdmin',
                type: 'POST',
                data: {},
                success: function (data) {
                    if (data.success === true) {
                        var isAdmin = data.data ? true : false;

                        _this.pageview.go("moreTemplate", {isAdmin: isAdmin});
                    }
                }
            });
        },

        /**
         * 初始化icon
         * @param {Object} sender
         * @param {Object} params
         */
        app_repeat_icon_init: function (sender, params) {
            sender.datasource.c = sender.datasource.icon || 'icon-1';

            sender.config.src = './imgs/' + sender.datasource.c + '.png';
        },
        app_repeat_introduce_init: function (sender, params) {
            if (!sender.datasource.desc) {
                sender.config.style.display = 'none';
            }
        }
    };
    return pageLogic;
});
