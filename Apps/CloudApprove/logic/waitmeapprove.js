define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.countNum = this.pageview.params.countNum;
        this.loadNum();
    }

    pageLogic.prototype = {
        onPageResume: function () {
            // 调用子页面刷新方法
            if (window.changeFormStatus) {
                this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate: true});
            }
            this.loadNum();
            this.setHeader();
        },

        setHeader: function () {

            var title = "审批";
            if (window.pageViewTitle === "commonlist_myapproverunning") {
                title = "我发起的";

            } else if (window.pageViewTitle === "commonlist_waitmyapprovedone") {
                title = "我已审批";

            } else if (window.pageViewTitle === "commonlist_waitmyapprove") {
                title = "待我审批";
            } else if (window.pageViewTitle === "commonlist_copyapprove") {
                title = "抄送我的";
            }
            // window.pageViewTitle = title;
            try {
                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: title,
                    rightTitle: "",
                    rightValues: []
                }, function (b) {

                });
            } catch (e) {

            }
        },
        loadNum: function () {
            var _this = this;

            this.pageview.ajax({
                type: "GET",
                url: "/process/myDataCount",
                data: {},
                success: function (data) {
                    if (data.code === 0) {
                        if (data.data.todo !== undefined && data.data.todo !== null) {
                            _this.waitmeapproveLabel.setText("待我审批(" + data.data.todo + ")");
                        }
                    }
                },
                error: function (e) {

                }
            });
        },
        searchview_init: function (sender, params) {
            this.searchview = sender;
            if (window.pageViewTitle) {
                sender.config.style.display = "none";
                if (window.pageViewTitle === "commonlist_waitmyapprove") {
                    sender.config.style.display = "block";
                }
            } else {
                sender.config.style.display = "block";
            }
        },
        segment_item_init: function (sender) {
            var title = sender.datasource.title;
            if (title === "待我审批") {
                this.waitmeapproveLabel = sender;
                if (this.countNum !== undefined && this.countNum !== null) {
                    sender.config.text = "待我审批(" + this.countNum + ")";
                }
            }
        },
        viewpager_init: function (sender, params) {
            this.viewpager = sender;
        },
        segment_change: function (sender, params) {
            if (!params.nochange) {
                var item = params.item;
                var itemData = item.datasource;
                var itemTitle = itemData.title;

                if (itemTitle === "我已审批") {
                    this.searchview.$el.hide();
                    this.pageview.refs.approveSelector.hideDropDown();
                    this.viewpager.showItem("commonlist_waitmyapprovedone", {type: "done"});
                } else {
                    this.searchview.$el.show();
                    this.viewpager.showItem("commonlist_waitmyapprove", {type: "waiting"});
                }
            }
        },
        searchBtn_click: function (sender, params) {
            this.pageview.refs.leftview.$el.hide();
            this.pageview.refs.searchInput.$el.show();
            this.pageview.refs.searchInput._focus();
            this.pageview.refs.approveSelector.hideDropDown();
        },
        searchInput_cancel: function (sender, params) {
            var value = params.value;
            if (value || this.searchValue) {
                this.searchValue = false;
                sender.input.val('');

                // this.viewpager.curPageViewItem.contentInstance.listview.config.ajaxConfig.data.keyword = '';
                this.viewpager.curPageViewItem.contentInstance.refs.listview.config.ajaxConfig.data.keyword = '';
                this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate: true});
            }

            this.pageview.refs.leftview.$el.show();
            this.pageview.refs.searchInput.$el.hide();
        },
        searchInput_search: function (sender, params) {
            if (params.value) {
                this.searchValue = true;
            }
            this.viewpager.curPageViewItem.contentInstance.refs.listview.config.ajaxConfig.data.categoryIds = null;
            this.viewpager.curPageViewItem.contentInstance.refs.listview.config.ajaxConfig.data.keyword = params.value;
            this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        approveSelector_menu1_loaddata: function (sender, params) {
            var successCallback = params.success;
            var errorCallback = params.error;
            var _this = this;
            var data = [
                {"name": "全部时间", "id": "taskTime_all", "group": "taskTime"},
                {"name": "今天", "id": "taskTime_today", "group": "taskTime"},
                {"name": "昨天", "id": "taskTime_yesterday", "group": "taskTime"},
                {"name": "两天前", "id": "taskTime_2more", "group": "taskTime"}
            ];
            successCallback(data);
        },

        approveSelector_menu0_loaddata: function (sender, params) {
            var successCallback = params.success;
            var errorCallback = params.error;
            var _this = this;
            var data = [
                {"name": "全部状态", "id": "dueDate_all", "group": "dueDate"},
                {"name": "正常", "id": "dueDate_normal", "group": "dueDate"},
                {"name": "逾期", "id": "dueDate_overdue", "group": "dueDate"}
            ];
            successCallback(data);
        },


        approveSelector_menu2_loaddata: function (sender, params) {
            var successCallback = params.success;
            var errorCallback = params.error;
            var _this = this;
            window.setTimeout(function () {
                //process/category
                var ajaxConfig = {
                    url: '/process/category',
                    type: 'POST',
                    data: {},
                    success: function (listData) {
                        var _listdata = [{"name": "全部类型", "id": "", "group": "type"}];
                        for (var idx = 0; idx < listData.data.length; idx++) {
                            var data = {"name": listData.data[idx].name, "id": listData.data[idx].id, "group": "type"};
                            _listdata.push(data);
                        }
                        successCallback(_listdata);
                    },
                    error: function (err) {

                    }
                };
                _this.pageview.ajax(ajaxConfig);
            });
        },
        approveSelector_menu0_itemClick: function (sender, params) {
            sender.rootInstance.hideDropDown();
            this.viewpager.curPageViewItem.contentInstance.refs.listview.config.ajaxConfig.data.taskDue = sender.curSelectedItem.data.id;
            this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        approveSelector_menu1_itemClick: function (sender, params) {
            sender.rootInstance.hideDropDown();
            this.viewpager.curPageViewItem.contentInstance.refs.listview.config.ajaxConfig.data.taskDate = sender.curSelectedItem.data.id;
            this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        approveSelector_menu2_itemClick: function (sender, params) {
            sender.rootInstance.hideDropDown();
            this.viewpager.curPageViewItem.contentInstance.refs.listview.config.ajaxConfig.data.categoryIds = sender.curSelectedItem.data.id;
            this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate: true});
        }
    };
    return pageLogic;
});
