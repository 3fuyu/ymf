/**
 * Created by Gin on 17/3/10.
 */
define(["../parts/currency", "utils"], function (c, utils) {
    function pageLogic(config) {
        var _this = this;
        this.pageview = config.pageview;
        this.currentId = this.pageview.params.id;
        // this.subforms = window._applyHistory.mainForm.subForms;
        console.log(window._applyHistory);
    }

    pageLogic.prototype = {
        list_repeat_init:function (sender, params) {
            sender.bindData(window._applyHistory.bpmActivityForms);
        },
        list_repeat_itemclick:function (sender, params) {
            // console.log(sender.datasource);
            this.pageview.go("subformDetail", {id: sender.datasource.id});
        }
    };
    return pageLogic;
});
