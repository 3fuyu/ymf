define(["../logic/repeatCycle", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content"],
        components: {
            page_content: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto",
                    backgroundColor: "#f2f3f4",
                },
                root: ["cycle_repeat"]
            },
            cycle_repeat:{
                type: "repeat",
                selectedMode: "s",
                className:"cycle_repeat",
                ref: true,
                itemStyle: {
                    height: 50,
                    alignItems: "center",
                    flexDirection: "row",
                    overflow: "hidden",
                    borderBottom: "1px solid #eee",
                    width: "100%",
                    backgroundColor: "#fff"
                },
                style: {
                    marginTop:10,
                    paddingLeft:15,
                    flexDirection: "column",
                    backgroundColor: "#fff"
                },
                root: ["cycle_icon", "item_select_icon"]
            },
            item_select_icon: {
                type: "icon",
                selectedClassName: "category-selected",
                font: "icomoon_e90a",
                iconStyle: {
                    color: c.mainColor,
                    fontSize: 19
                },
                style: {
                    width: 40,
                    opacity: 0
                }
            },
            cycle_icon: {
                type: "text",
                text_bind: "label",
                style: {
                    color: c.titleColor,
                    fontSize: 16,
                    flex: 1,
                    justifyContent: "flex-start"
                }
            },
        },
    };
    return Re;
});