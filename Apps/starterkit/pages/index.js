/**
 * 首页的上下分类
 **/
define(["../logic/index", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content", "createIcon"],
        components: {
            createIcon: {
                type: "icon",
                text: "创建清单",
                font: "icomoon_e904",
                style: {
                    height: 50,
                    backgroundColor: "#fff"
                },
                textStyle: {
                    fontSize: 16,
                    marginLeft: 4,
                    color: c.mainColor
                },
                iconStyle: {
                    fontSize: 16,
                    color: c.mainColor
                }

            },
            page_content: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto"
                },
                root: ["first_repeat", "mid_label", "second_repeat"]
            },
            first_repeat: {
                type: "repeat",
                ref: true,

                root: ["first_repeat_label", "first_repeat_val"],
                itemStyle: {
                    flexDirection: "row",
                    height: 50,
                    borderBottom: "1px solid #eee"
                },
                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff"
                }
            },
            first_repeat_label: {
                type: "text",
                text_bind: "name",
                style: {
                    flex: 1,
                    marginLeft: 10,
                    fontSize: 16,
                    color: c.titleColor
                }
            },
            first_repeat_val: {
                type: "text",
                text_bind: "count",
                style: {
                    flex: 1,
                    marginRight: 10,
                    justifyContent: "flex-end",
                    color: "#999",
                    fontSize: 15
                }
            },
            mid_label: {
                type: "text",
                text: "分类待办",
                style: {
                    height: 30,
                    paddingLeft: 10,
                    fontSize: 13,
                    backgroundColor: "#F2F3F4",
                    color: "#666"
                }
            },
            second_repeat: {
                type: "repeat",
                ref: true,

                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff",
                    paddingLeft: 10,
                },
                itemStyle: {
                    flexDirection: "row",
                    height: 50,
                    borderBottom: "1px solid #eee"
                },
                root: ["second_repeat_icon", "second_repeat_val"]
            },
            second_repeat_icon: {
                type: "icon",
                font: "todo_e907",
                text_bind: "name",
                style: {
                    flex: 1,
                    justifyContent: "flex-start"
                },
                textStyle: {
                    color: "#333",
                    fontSize: 15,
                    marginLeft: 8
                },
                iconStyle: {
                    color: "#06CF86",
                    fontSize: 18,
                    opacity: 0.6
                }
            },
            second_repeat_val: {
                type: "text",
                style: {
                    flex: 1,
                    marginRight: 10,
                    justifyContent: "flex-end",
                    color: "#999",
                    fontSize: 15
                },
                text_bind: "count"
            }

        },

    };
    return Re;
});
