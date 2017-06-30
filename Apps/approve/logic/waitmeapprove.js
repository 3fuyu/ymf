define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.countNum = this.pageview.params.countNum;
    }

    pageLogic.prototype = {
        onPageResume: function () {
            // 调用子页面刷新方法
            if (window.changeFormStatus) {
                this.viewpager.curPageViewItem.contentInstance.plugin.pageview.refs.listview.loadFirstPageData({parentAnimate:true});
            }
            this.loadNum();
            this.setHeader();
        },

        setHeader: function () {
            var curItemFullPageKey = this.viewpager.curPageViewItem.contentInstance.config.fullPageKey;
            var title = "审批";
            if (curItemFullPageKey === "commonlist_waitmyapprovedone") {
                title = "我已审批";

            } else if (curItemFullPageKey === "commonlist_waitmyapprove") {
                title = "待我审批";
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

        loadNum:function(){
            var _this = this;


            this.pageview.ajax({
                type:"GET",
                url:"index/myApproveNum",
                data:{},
                success:function(data){
                    if(data.code===0){
                        if(data.data.count!==undefined&&data.data.count!==null){
                            _this.waitmeapproveLabel.setText("待我审批("+data.data.count+")");
                        }
                    }
                },
                error:function(e){

                }
            });
        },
        segment_item_init:function(sender){
            var title = sender.datasource.title;
            if(title==="待我审批"){
                this.waitmeapproveLabel = sender;
                if(this.countNum!==undefined&&this.countNum!==null){
                    sender.config.text = "待我审批("+this.countNum+")";
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
                    this.viewpager.showItem("commonlist_waitmyapprovedone", {type: "done"});
                } else {
                    this.viewpager.showItem("commonlist_waitmyapprove", {type: "waiting"});
                }
            }
        }
    };
    return pageLogic;
});
