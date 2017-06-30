define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.countNum = this.pageview.params.countNum;
    }

    pageLogic.prototype = {
        onPageResume: function () {
            // 调用子页面刷新方法
            if (window.changeFormStatus) {
                this.viewpager.curPageViewItem.contentInstance.refs.listview.loadFirstPageData({parentAnimate:true});
            }
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
        loadNum:function(){
            var _this = this;

            // this.pageview.ajax({
            //     type:"POST",
            //     url:"/process/myDataCount",
            //     data:{},
            //     success:function(data){
            //         if(data.code===0){
            //             if(data.data.running!==undefined&&data.data.running!==null){
            //                 _this.myapproveLabel.setText("进行中("+data.data.running+")");
            //             }
            //         }
            //     },
            //     error:function(e){
            //
            //     }
            // });
        },
        segment_item_init:function(sender){
            var title = sender.datasource.title;
            if(title==="进行中"){
                this.myapproveLabel = sender;

                if(this.countNum!==undefined&&this.countNum!==null){
                    sender.config.text = "进行中("+this.countNum+")";
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

                if (itemTitle === "已完成") {
//                  this.viewpager.curPageViewItem.contentInstance.refs.approveSelector.hideDropDown();
                    this.viewpager.showItem("commonlist_myapprovedone", {type: "done"});
                } else {
                    this.viewpager.showItem("commonlist_myapproverunning", {type: "waiting"});
                }
            }
        }
    };
    return pageLogic;
});
