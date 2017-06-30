/**
 * 更多模板页面逻辑代码
 */
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.entrance = this.pageview.params.entrance;
        this.isAdmin = this.pageview.params.isAdmin;
    }


    pageLogic.prototype = {

        onPageResume: function () {
            var _this = this;
            _this.judgeAdmin();
            _this.body_pulltorefresh();//不用每次返回都刷新数据
        },

        judgeAdmin: function () {
            var _this = this;
            this.pageview.ajax({//判断是否为管理员
                url: '/user/isAdmin',
                type: 'POST',
                data: {},
                success: function (data) {
                    if (data.success === true) {
                        _this.isAdmin = data.data;//将当前用户是否为管理员存储
                        _this.setHeader(data.data, _this.entrance);
                    } else if (data.success === false) {
                        //请求接口失败,不显示"管理入口"
                        _this.setHeader(false, _this.entrance);
                    }
                }
            });
        },
        setHeader: function (isAdmin, entrance) {
            var _this = this;
            if (isAdmin === true && entrance === undefined) {//是管理员显示"管理"入口
                try {
                    window.yyesn.client.setHeader(function () {
                    }, {
                        type: 2,
                        title: "更多",
                        rightTitle: "管理",
                        rightValues: [
                            {key: 'submit', value: '管理'},
                        ]
                    }, function (b) {
                        b.registerHandler("submit", function (data, responseCallback) {
                            _this.pageview.go("moreTemplate", {entrance: "fromManage"});
                        });
                    });
                } catch (e) {

                }
            } else if (isAdmin === false || entrance === "fromManage") {
                try {
                    window.yyesn.client.setHeader(function () {
                    }, {
                        type: 2,
                        title: "审批",
                        rightTitle: ""
                    });
                } catch (e) {

                }
            }
        },

        body_init: function (sender) {
            this.body = sender;
            this.judgeAdmin();
        },
        main_view_init: function (sender) {
            var _this = this,
                url = '/form/moreListForm';

            this.listviewSender = sender;
            sender.config.ajaxConfig = {
                url: url,
                type: "POST",
                pageSize: 1,//每篇加载多少数目
                pageNumKey: "pageNum",
                data: {
                    pageNum: 1,
                    start: 0,
                    size: -1,
                    isManager: _this.entrance ? 'true' : 'false'
                }
            };
            sender.config.autoLoadData = true;
        },
        right_title_init: function (sender) {
            var _this = this;
            if (_this.entrance !== "fromManage") {
                sender.config.style.marginRight = 25;
            }
        },
        right_introduce_init: function (sender) {
            var _this = this;
            if (_this.entrance !== "fromManage") {
                sender.config.style.marginRight = 25;
            }
            if (sender.config.text.length === 0) {
                sender.config.style.display = "none";
            }
        },

        right_btn_init: function (sender, params) {
            var _this = this;
            if (_this.entrance === "fromManage") {
//				sender.pageview.$el.css("display","flex");//TODO 和下面效果一样的
                sender.config.style.display = "flex";
                if (sender.datasource.phoneEnabled === "true") {
                    sender.config.text = "停用";
                } else {
                    sender.config.text = "启用";
                    sender.config.style.color = '#29B6F6';
                    sender.config.style.borderColor = "#29B6F6";
                }
            } else {
                sender.config.style.display = "none";
            }

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
            var ajaxData = params.data;//ajax返回的数据
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
            var _sender = sender;
            var _params = params;
            if (sender.datasource.phoneEnabled === "true") {
                _this.btnTxt = "你确定要停用此表单吗？";
            } else {
                _this.btnTxt = "你确定要启用此表单吗？";
            }
            this.opt_dialogue(_sender, _this.btnTxt, _params);
        },
        opt_dialogue: function (_sender, btnTxt, _params) {
//      	var _senderCp = _sender;
//      	var _paramsCp = _params;
            var _this = this;
            _this._senderCp = _sender;
            _this._paramsCp = _params;
            _this._btnTxtCp = btnTxt;
            _this.chexiaoDialog = new Dialog({
                mode: 3,
                wrapper: _this.pageview.$el,
                contentText: _this._btnTxtCp,
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
                        _this.chexiaoDialog.hide();
                    }
                }, {
                    title: "确定",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: "#37b7fd",
                    },
                    onClick: function () {
                        _this.chexiaoDialog.hide();
                        _this.change_state(_this._senderCp, _this._paramsCp);
                    }
                }]
            });
            _this.chexiaoDialog.show();
        },
        change_state: function (sender, params) {
            var _this = this;
            var token = "";
            var _sender = sender;
            var formId = sender.datasource.formId;
            var formCode = sender.datasource.code;
            var formName = sender.datasource.title;
            var phoneEnabled = sender.datasource.phoneEnabled;
            var newState = "";
            if (phoneEnabled === "true") {
                newState = "false";//状态变为停用
            } else {
                newState = "true";//状态变为启用
            }
            _this.pageview.ajax({//获取token
                url: '/user/getToken',
                type: 'POST',
                data: {},
                success: function (data) {
                    if (data.success === true) {
                        myToken = data.data.token;
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
                            success: function (data) {
                                if (data.success === true) {
                                    if (newState === "true") {//已经渲染好了，只能改变DOM,不能改变config了
                                        _sender.$el[0].innerText = "停用";
                                        _sender.$el[0].style.color = "#FA4F52";
                                        _sender.$el[0].style.borderColor = "#FA4F52";
                                        _sender.datasource.phoneEnabled = "true";
                                    } else {
                                        _sender.$el[0].innerText = "启用";
                                        _sender.$el[0].style.color = '#29B6F6';
                                        _sender.$el[0].style.borderColor = "#29B6F6";
                                        _sender.datasource.phoneEnabled = "false";
                                    }
//			                		console.log(_sender);
//			                		window.location.reload();
                                }
                            },
                            error: function () {
//			                    alert("更新模板状态失败!");
                            }
                        });
                    } else if (data.success === false) {
//                  	alert("管理员用户信息验证失败");
                    }
                }
            });
        },
        template_item_click: function (sender, params) {
            var _this = this;
            if (_this.entrance === "fromManage") {
                return false;
            }
//          var formId = sender.datasource.formId;
            var title = sender.datasource.title,
                formId = sender.datasource.formId,
                source = sender.datasource.source,
                formType = 'NEW';

            if (title !== null && title !== undefined) {
                this.pageview.go("form", {
                    templateid: formId,
                    title: encodeURI(title),
                    formType: formType,
                    source: source
                });
            } else {
                sender.$el.addClass('no-result');
            }
        },
        template_item_icon_init: function (sender, params) {
            // var iconNum = Math.floor(Math.random() * 20 + 1);
            sender.config.src = './imgs/' + (sender.datasource.icon ? sender.datasource.icon :"icon-1" )+ '.png';
        },
        searchBtn_click: function (sender, params) {
            this.pageview.refs.main_view.$el.hide();
            this.pageview.refs.searchInput.$el.show();
            this.pageview.refs.searchInput._focus();
            this.pageview.refs.approveSelector.hideDropDown();
        },
        searchInput_init: function (sender, params) {
            // if (this.searchKey) {
            //     sender.config.style.display = "show";
            // } else {
            //     sender.config.style.display = "none";
            // }
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

    };
    return pageLogic;
});
