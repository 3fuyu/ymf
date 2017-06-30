/**
 * Created by 3fuyu on 17/3/1.
 */

define(["../parts/common", "utils"], function (c, utils) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.params = this.pageview.params;
        this.setHeader();
    }

    pageLogic.prototype = {
        body_init: function (sender) {
            this.body = sender;
        },
        loadData: function () {
            this.pageview.delegate('list_repeat', function (target) {
                var data = this.pageview.showPageParams.approverList.participants;
                target.bindData(data);
            });
        },
        setHeader: function () {
            var title = "选择审批人";
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
        list_repeat_init: function (sender, params) {
            var data = this.pageview.showPageParams.approverList.participants;
            sender.bindData(data);
        },
        list_repeat_item_init: function (sender, params) {

        },
        list_repeat_itemclick: function (sender, params) {
            var _this = this;
            sender.select();
        },
        bottom_submit_click: function (sender, params) {
            var selectData = this.processSubmitData(sender.parent.components.list_repeat.selectedItems),
                parentLogic = this.pageview.showPageParams.dealLogic;

            parentLogic.hasSelectData = selectData;
            parentLogic.hasSelectIndex = this.pageview.showPageParams.index;

            this.pageview.goBack();
        },
        processSubmitData: function (selectData) {
            var processData = [];

            selectData.forEach(function (value, key) {
                processData.push(value.datasource);
            });

            return processData;
        },
        onPageResume: function () {
            this.setHeader();
            this.loadData();
        }
    };
    return pageLogic;
});
