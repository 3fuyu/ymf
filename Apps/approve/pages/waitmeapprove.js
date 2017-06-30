/**
 * 首页的上下分类
 **/
define(["../logic/waitmeapprove", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["segment", "viewpager"],
        components: {
            segment: {
                type: "segment_android",
                items: [{title: "待我审批"}, {title: "我已审批"}],
                root: ["segment_item"],
                indicatorStyle: {
                    backgroundColor: "#37B7FD"
                },
                style: {height: 40, backgroundColor: "#fff"}
            },
            segment_item: {
                type: "text",
                text: "test",
                text_bind: "title",
                selectedClassName: "ar-sgm-item-selected-android",
                style: {
                    color: "#8899a6",
                    fontSize: 13,
                    textAlign: "center",
                    justifyContent: "center",
                    width: '100%',
                    borderRight: "1px solid #eee"
                }
            },
            viewpager: {
                type: "viewpager",
                defaultKey: "commonlist_waitmyapprove",
                style: {
                    flex: 1
                }
            }
        },

    };
    return Re;
});
