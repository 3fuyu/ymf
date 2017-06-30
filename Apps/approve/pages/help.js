define(["../logic/help", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["body"],
        components: {
            body: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                },
                root: ["list"]
            },
            list: {
                type: "repeat",
                itemStyle: {
                    // border:"solid 1px"
                    height: 50

                },
                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff"
                },
                items: [
                    {
                        label: "如何发起审批？"
                    },
                    {
                        label: "如何添加审批模板？"
                    },
                    {
                        label: "如何设置审批流程？"
                    },
                    {
                        label: "什么是明细组件？"
                    }
                ],
                root: ["view"]
            },
            view: {
                type: "view",
                style: {
                    borderBottom: "solid 1px #eee",
                    marginLeft: 20,
                    height: 50,
                    lineHeight: 50,
                    flexDirection: "row",
                    justifyContent: "space-between"
                },
                root: ["label", "icon"]
            },
            label: {
                type: "text",
                text_bind: "label",
                style: {
                    color: "#333",
                    fontSize: 15
                }
            },
            icon: {
                type: "icon",
                font: "icomoon_e913",
                style: {
                    marginRight: 20,
                    color: "#bbb",
                    fontSize: 15
                }
            }
        }
    };
    return Re;
});
