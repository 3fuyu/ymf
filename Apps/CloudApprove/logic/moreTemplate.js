/**
 * 更多模板页面逻辑代码
 */
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.isAdmin = (this.pageview.params.isAdmin === "true" ? true : false) || false;
        this.inAdmin = (this.pageview.params.inAdmin === "true" ? true : false) || false;

        this.setHeader();
    }

    pageLogic.prototype = {

        onPageResume: function () {
            if (this.goWhere === "adminMoreTemplate") {
                this.inAdmin = false;
                this.body_pulltorefresh();//不用每次返回都刷新数据
            }
            this.setHeader();
        },
        setHeader: function (entrance) {
            var _this = this,
                rightTitle = '';

            if (this.isAdmin && !this.inAdmin) {
                rightTitle = '管理';
            } else if (this.isAdmin && this.inAdmin) {
                rightTitle = '完成';
            }

            try {
                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: "更多",
                    rightTitle: rightTitle,
                    rightValues: [
                        {key: 'submit', value: rightTitle},
                    ]
                }, function (b) {
                    b.registerHandler("submit", function (data, responseCallback) {

                        if (_this.inAdmin) {
                            _this.inAdmin = !_this.inAdmin;
                            _this.pageview.goBack();
                        } else {
                            _this.goWhere = "adminMoreTemplate";
                            _this.inAdmin = !_this.inAdmin;
                            _this.pageview.go("moreTemplate", {inAdmin: _this.inAdmin, isAdmin: _this.isAdmin});
                        }
                    });
                });
            } catch (e) {

            }
        },
        body_init: function (sender) {
            this.body = sender;
        },
        main_view_init: function (sender) {
            var _this = this;

            _this.listviewSender = sender;
            this.start = new Date();
            sender.config.ajaxConfig = {
                url: '/form/moreListForm',
                type: "POST",
                pageSize: 1,//每篇加载多少数目
                pageNumKey: "pageNum",
                data: {
                    pageNum: 1,
                    start: 0,
                    size: 100,
                    isManager: _this.inAdmin ? 'true' : 'false'
                }
            };
            sender.config.autoLoadData = true;
        },
        //上拉加载更多
        body_loadmore: function (sender, params) {
            var size = this.pageview.refs.main_view.ajaxConfig.data.size;
            var start = this.pageview.refs.main_view.ajaxConfig.data.start;
            var count = size + start;
            this.pageview.refs.main_view.ajaxConfig.data.start = count;
            this.pageview.refs.main_view.ajaxConfig.data.pageNum++;

            this.pageview.refs.main_view.setAjaxConfigParams();
            this.pageview.refs.main_view.loadNextPageData();
        },

        //下拉加载第一页
        body_pulltorefresh: function (sender, params) {
            this.pageview.refs.main_view.ajaxConfig.data.start = 0;
            this.pageview.refs.main_view.ajaxConfig.data.pageNum = 1;
            this.pageview.refs.main_view.setAjaxConfigParams();
            this.pageview.refs.main_view.loadFirstPageData();
        },

//      body_reload: function (sender) {
//          this.pageview.refs.main_view.reload();
//      },
        //处理数据(下拉加载的数据)
        main_view_parsedata: function (sender, params) {
            var ajaxData = params.data,//ajax返回的数据
                _this = this;
            if (ajaxData.success !== true) {
                return false;
            }
            if (!ajaxData.data) {
                ajaxData.data = {
                    list: []
                };
            }
            if (ajaxData.data.list.length === 0) {
                //返回数据为空 默认赋值造假数据
            }

            return ajaxData.data.list;
        },

        main_view_afterload: function (sender, params) {
            var length = sender.rows.length; //获得上一页最后一个分组的下标

            if (params.isFirstLoad === false && params.data.length > 0) {//第二次加载数据,并且有数据返回

                if (sender.rows[length - 1].datasource.formList[0].categoryId === params.data[0].formList[0].categoryId) {
                    sender.$el.find(".template_item_title").last().css("display", "none");
                }
            }
        },
        right_btn_click: function (sender, params) {
            var _this = this;
            if (sender.datasource.phoneEnabled === "true") {
                _this.phoneEnabledDialog = new Dialog({
                    mode: 3,
                    wrapper: _this.pageview.$el,
                    contentText: "你确定要停用此表单吗？",
                    btnDirection: "row",
                    buttons: [{
                        title: "取消",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: c.titleColor,
                            borderRight: '1px solid #eee'
                        },
                        onClick: function () {
                            _this.phoneEnabledDialog.hide();
                        }
                    }, {
                        title: "确定",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: "#37b7fd",
                        },
                        onClick: function () {
                            _this.phoneEnabledDialog.hide();
                            _this.change_state(sender, params);
                        }
                    }]
                });
                _this.phoneEnabledDialog.show();
            } else {
                _this.change_state(sender, params);
            }
        },
        change_state: function (sender, params) {
            var _this = this,
                token = "",
                _sender = sender,
                formId = sender.datasource.formId,
                formCode = sender.datasource.code,
                formName = sender.datasource.title,
                phoneEnabled = sender.datasource.phoneEnabled,
                newState = "";

            if (phoneEnabled === "true") {
                newState = "false";//状态变为停用
            } else {
                newState = "true";//状态变为启用
            }

            var title = newState === 'true' ? '启用中...' : '停用中...';

            this.pageview.showLoading({text: title});

            _this.pageview.ajax({//获取token
                url: '/user/getToken',
                type: 'POST',
                data: {},
                success: function (data) {
                    if (data.success === true) {
                        var myToken = data.data.token;
                        this.pageviewInstance.params.token = myToken;
                        _this.pageview.ajax({
                            url: '/form/updateTemplate',
                            type: 'POST',
                            data: {
                                "formId": formId,
                                "formCode": formCode,
                                "formName": formName,
                                "newState": newState,
                                "token": myToken
                            },
                            success: function (_data) {
                                _this.pageview.hideLoading();
                                if (_data.success === true) {
                                    if (newState === "true") {//已经渲染好了，只能改变DOM,不能改变config了
                                        _sender.$el.css({
                                            transform: "rotateY(0deg) translateZ(0)",
                                            "-webkit-transform": "rotateY(0deg) translateZ(0)"
                                        });

                                        _sender.datasource.phoneEnabled = "true";
                                    } else {
                                        _sender.$el.css({
                                            transform: "rotateY(180deg) translateZ(0)",
                                            "-webkit-transform": "rotateY(180deg) translateZ(0)"
                                        });
                                        _sender.datasource.phoneEnabled = "false";
                                    }
                                }
                            },
                            error: function (_data) {
                                _this.pageview.showTip({text: _data.msg, duration: 1000});
                            }
                        });
                    } else if (data.success === false) {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (data) {
                    _this.pageview.showTip({text: data.msg, duration: 1000});
                }
            });
        },
        template_item_click: function (sender, params) {
            var _this = this;
            // 管理员模式不可以看详情
            if (_this.inAdmin) {
                return false;
            }
            var title = sender.datasource.title,
                formId = sender.datasource.formId,
                source = sender.datasource.source,
                type = sender.datasource.type,
                formType = 'NEW';

            if (title !== null && title !== undefined) {
                this.goWhere = "form";

                this.pageview.go("form", {
                    templateid: formId,
                    title: encodeURI(title),
                    formType: formType,
                    source: source,
                });
            } else {
                sender.$el.addClass('no-result');
            }
        },
        template_item_icon_init: function (sender, params) {
            sender.config.src = './imgs/' + (sender.datasource.icon ? sender.datasource.icon : "icon-1" ) + '.png';
        },
        searchBtn_click: function (sender, params) {
            this.pageview.refs.main_view.$el.hide();
            this.pageview.refs.searchInput.$el.show();
            this.pageview.refs.searchInput._focus();
            this.pageview.refs.approveSelector.hideDropDown();
        },
        searchInput_cancel: function (sender, params) {
            var value = params.value;

            if (value) {
                sender.input.val('');

                this.listviewSender.config.ajaxConfig.data.keyword = '';
                this.pageview.refs.main_view.loadFirstPageData({parentAnimate: true});
            }

            this.pageview.refs.main_view.$el.show();
        },
        searchInput_search: function (sender, params) {
            this.listviewSender.config.ajaxConfig.data.keyword = params.value;
            this.pageview.refs.main_view.loadFirstPageData({parentAnimate: true});
        },
        template_item_repeat_init: function (sender, params) {
            if (sender.datasource && sender.datasource.formList) {
                var length = sender.datasource && sender.datasource.formList.length;

                if (length % 3 !== 0) {
                    var num = 3 - length % 3;
                    for (var i = 0; i < num; i++) {
                        sender.datasource.formList.push({
                            type: "forEmptyCss"
                        });
                    }
                }
            }
        },
        template_item_init: function (sender, params) {
            // 为了样式更好看，正好凑整
            if (sender.datasource.type && sender.datasource.type === 'forEmptyCss') {
                sender.config.style.display = "none";
            }
        },
        right_btn_container_init: function (sender, params) {
            if (this.inAdmin) {
                sender.config.style.display = '';
            }
        },
        right_btn_init: function (sender, params) {
            var phoneEnabled = sender.datasource.phoneEnabled === "false" ? false : true;

            if (this.inAdmin) {
                sender.config.style.transition = "0.6s";
                sender.config.style.transformStyle = "preserve-3d";
                sender.config.style["-webkit-transform-style"] = "preserve-3d";

                if (!phoneEnabled) {
                    sender.config.style.transform = "rotateY(180deg) translateZ(0)";
                    sender.config.style["-webkit-transform"] = "rotateY(180deg) translateZ(0)";
                }
            }
        },
        right_btn_front_init: function (sender, params) {
            var phoneEnabled = sender.datasource.phoneEnabled === "false" ? false : true;

            if (this.inAdmin) {
                sender.config.style.backfaceVisibility = "hidden";
                sender.config.style["-webkit-backface-visibility"] = "hidden";
            }
        },
        right_btn_back_init: function (sender, params) {
            var phoneEnabled = sender.datasource.phoneEnabled === "false" ? false : true;

            if (this.inAdmin) {
                sender.config.style.backfaceVisibility = "hidden";
                sender.config.style["-webkit-backface-visibility"] = "hidden";
                sender.config.style.transform = "rotateY(180deg) translateZ(0)";
                sender.config.style["-webkit-transform"] = "rotateY(180deg) translateZ(0)";
            }
        }
    };
    return pageLogic;
});
