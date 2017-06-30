/**
 * 我发起的
 **/
define(["../logic/myapprove", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["viewpager"],
        components: {
            segment: {
                type: "segment_android",
                items: [{title: "进行中"}, {title: "已完成"}],
                root: ["segment_item"],
                indicatorStyle: {
                    backgroundColor: "#29B6F6"
                },
                style: {height: 40, backgroundColor: "#fff"}
            },
            segment_item: {
                type: "text",
                text:"加载中...",
                text_bind: "title",
                selectedClassName: "ar-sgm-item-selected-android",
                style: {
                    color: "#262626",
                    fontSize: 13,
                    textAlign: "center",
                    justifyContent: "center",
                    width: '100%',
                    borderRight: "1px solid #eee"
                }
            },
            viewpager: {
                type: "viewpager",
                defaultKey: "commonlist_myapproverunning",
                style: {
                    flex: 1
                }
            }
        },

    };
    return Re;
});
