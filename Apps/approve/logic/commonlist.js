define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        var type = this.pageview.params.type;
        this.fullPageKey = this.pageview.config.fullPageKey;
        this.searchValue = '';

        if (type === "myapprove") {
            window.needRefresMyApproveListData = false;
            this.fullPageKey = "commonlist_myapprove";// or commonlist_waitmyapprovedone commonlist_waitmyapprove
        } else if (type === 'copyapprove') {
            window.needRefresCopyApproveListData = false;
            this.fullPageKey = "commonlist_copyapprove";// or commonlist_waitmyapprovedone commonlist_waitmyapprove
        }
        this.setHeader();
    }

    pageLogic.prototype = {
        body_init: function (sender) {
            this.body = sender;
        },

        setHeader: function () {
            var title = "审批";
            if (this.fullPageKey === "commonlist_myapprove") {
                title = "我发起的";

            } else if (this.fullPageKey === "commonlist_waitmyapprovedone") {
                title = "我已审批";

            } else if (this.fullPageKey === "commonlist_waitmyapprove") {
                title = "待我审批";
            } else if (this.fullPageKey === "commonlist_copyapprove") {
                title = "抄送我的";
            }
            try {
                window.yyesn.client.setHeader(function () {}, {
                    type: 2,
                    title: title,
                    rightTitle: "",
                    rightValues: [],
                }, function (b) {

                });
            } catch (e) {

            }
        },
        searchview_search: function (sender, params) {
            this.listviewSender.config.ajaxConfig.data.title = params.value;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        onPageResume: function () {
            if (this.fullPageKey === "commonlist_myapprove") {
                if (window.needRefresMyApproveListData === true) {
                    window.needRefresMyApproveListData = false;
                    this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
                }
            }

            if (this.fullPageKey === "commonlist_copyapprove") {
                if (window.needRefresCopyApproveListData === true) {
                    window.needRefresCopyApproveListData = false;
                    this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
                }
            }
            this.setHeader();

        },
        searchview_cancel: function (sender, params) {
            var value = params.value;

            if (value) {
                sender.input.val('');

                this.listviewSender.config.ajaxConfig.data.title = '';
                this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
            }
        },
        body_pulltorefresh: function (sender, params) {
            this.pageview.refs.listview.loadFirstPageData();
        },
        body_reload: function (sender) {
            this.pageview.refs.listview.reload();
        },
        body_loadmore: function (sender, params) {
            this.pageview.refs.listview.loadNextPageData();
        },
        listview_rowclick: function (sender, params) {
            // 缓存数据
            window.nowFormData = sender.datasource;

            this.pageview.go("detail", {
                formId: sender.datasource.formId,
                formDataName: encodeURI(sender.datasource.templateName),
                ccId: sender.datasource.ccId || ''
            });
        },
        listview_parsedata: function (sender, params) {
            var data = params.data;

            if (data.code !== 0) {
                return false;
            }
            if (!data.data) {
                data.data = {
                    items: []
                };
            }
            return data.data.items;
        },
        listview_init: function (sender) {
            var url = '';

            switch (this.fullPageKey) {
                case 'commonlist_waitmyapprove':
                    url += '/formdata/getlist/0';
                    break;
                case 'commonlist_waitmyapprovedone':
                    url += '/formdata/getlist/1';
                    break;
                case 'commonlist_myapprove':
                    url = '/formdata/mylist';
                    break;
                case 'commonlist_copyapprove':
                    url = '/formdata/cclist';
                    break;
                default:
                    url = '/formdata/getlist/0';
                    console.error('status未定义');
                    break;
            }
            this.listviewSender = sender;

            sender.config.ajaxConfig = {
                url: url,
                type: "GET",
                pageSize: 20,
                pageNumKey: "pageNum",
                data: {
                    code: 1004,
                    order: 1001,
                    pageNum: 1,
                    pageSize: 20,
                }
            };
            sender.config.autoLoadData = true;
        },
        row_time_init: function (sender, params) {
            sender.config.text = utils.timestampToTimeStr(sender.config.text);
        },
        row_status_init: function (sender, params) {
            var status = sender.datasource.formDataResult || '',
                approveResult = sender.datasource.approverResult || '';

            status = status.toString();

            if (status === '0' && approveResult === '0') {
                if (this.fullPageKey === 'commonlist_myapprove') {
                    sender.config.text = '等待' + sender.datasource.approverName + '的审批';
                } else {
                    sender.config.text = '待审批';
                }

                sender.config.style.color = '#F5C464';
            } else if (status === '0' && approveResult === '1') {
                if (this.fullPageKey === 'commonlist_myapprove') {
                    sender.config.text = '等待' + sender.datasource.approverName + '的审批';
                } else {
                    sender.config.text = '审批中...(已通过)';
                }

                sender.config.style.color = '#F5C464';
            } else if (status === '1') {
                sender.config.text = '审批通过';
            } else if (status === '2') {
                sender.config.text = '审批拒绝';
                sender.config.style.color = '#FD8282';
            } else if (status === '3') {
                sender.config.text = '已撤销';
                sender.config.style.color = '#8C8D8E';
            }
        },
        row_image_init: function (sender, params) {
            if (this.fullPageKey === 'commonlist_myapprove') {
                sender.config.src = sender.datasource.templateLogo;
            } else {
                sender.config.src = sender.config.src + '.thumb.jpg';
            }


        },
        row_left_init: function (sender, params) {
            if (this.fullPageKey === 'commonlist_copyapprove' && sender.datasource.isRead.toString() === '0') {
                sender.setBadge(1, {
                    backgroundColor: "#F66C6C",
                    right: "14px",
                    fontSize: "0",
                    top: "3px",
                    height: "8px",
                    width: "8px",
                    padding: "0",
                    boxShadow: "0px 0px 0px 1px #fff"
                });
            }
        },
        row_title_init: function (sender, params) {
            sender.config.text = sender.datasource.name + '的' + sender.datasource.templateName;
        }
    };
    return pageLogic;
});
