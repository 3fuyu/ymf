define(["../parts/common", "utils", "../../../components/dialog", "../parts/timepicker"], function (c, utils,Dialog,timepicker) {


    function pageLogic(config) {
        this.pageview = config.pageview;

        this.selectedData = this.pageview.showPageParams.selectedData;

        this.repaetData = [{id:"0","label":"永不"},
            {id:"1","label":"每天"},
            {id:"2","label":"每周"},
            {id:"3","label":"每月"},
            {id:"4","label":"每年"}];
    }

    pageLogic.prototype = {
        onPageLoad: function() {
            var _this = this;
            this.pageview.do("cycle_repeat",
                function(target) {
                    target.bindData(_this.repaetData);
                    _this.bindSelectedItemData();
                });
        },
        bindSelectedItemData:function(){
            var _this = this;
            this.cycle_repeat.eachItem(function(item) {
                if (item.datasource.id.toString() === _this.selectedData.repeat_id.toString()) {
                    item.select();
                }
            });
        },
        cycle_repeat_init:function(sender, params){
            this.cycle_repeat = sender;
        },
        cycle_repeat_itemclick: function(sender, params) {
            sender.select();
            this._selected(sender.datasource.id, sender.datasource.label);
        },
        _selected: function(repeat_id, repeat_name) {
            var _this = this;
            this.selectedData = {
                repeat_id: repeat_id,
                repeat_name: repeat_name
            };
            this.pageview.close();

        },
        onPageClose: function() {
            this.pageview.ownerPage.plugin.setRepeatFromSelector(this.selectedData.repeat_id, this.selectedData.repeat_name);
            this.selectedData = null;
        },
    };
    return pageLogic;
});