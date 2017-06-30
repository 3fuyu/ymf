define([], function () {
    function pageLogic(config) {
        this.pageview = config.pageview;
        this.setHeader();
    }

    pageLogic.prototype = {
        onPageResume: function () {
            this.setHeader();
        },
        setHeader: function () {
            var _this = this;
            try {
                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: "帮助",

                    rightTitle: "",
                    //navColor:c.mainColor,
                    rightValues: []
                }, function (b) {

                });
            } catch (e) {

            }
        },

        list_itemclick: function (sender, params) {
            // alert(params.index)

            if (params.index === 0) {
                this.pageview.go("initiationApproval");
                // this.pageview.showPage({pageKey:"additionApproval",mode:"fromRight"});
            } else if (params.index === 1) {
                this.pageview.go("additionApproval");
                // this.pageview.showPage({pageKey:"additionApproval",mode:"fromRight"});
            } else if (params.index === 2) {
                this.pageview.go("setApprovers");
            } else {
                this.pageview.go("detailComponent");
            }

        }
    };
    return pageLogic;
});
