define(["../logic/selectApprovers", "../parts/common", 'utils'], function (pluginClass, c, utils) {
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
                    overflowX: "hidden"
                },
                root: ["list_repeat", "bottom_submit"]
            },
            list_repeat: {
                ref: true,
                type: "repeat",
                selectedMode: "m",
                root: ["list_repeat_item"],
                style: {
                    flexDirection: "column",
                    marginTop: 15,
                    paddingLeft: 15,
                    backgroundColor: "#fff"
                },
                itemStyle: {
                    borderBottom: "1px solid #eee"
                }
            },
            list_repeat_item: {
                type: "view",
                itemSelectClassName: "list_repeat_item_select",
                root: ["list_repeat_item_left", "list_repeat_item_middle", "list_repeat_item_right"],
                style: {
                    flexDirection: "row",
                    width: "100%",
                    height: 65,
                    alignItems: "center",
                }
            },
            list_repeat_item_left: {
                type: "image",
                src_bind: "pic",
                title_bind: "name",
                style: {
                    height: 40,
                    width: 40,
                    marginRight: 13,
                    borderRadius: "50%"
                }
            },
            list_repeat_item_middle: {
                type: "text",
                text_bind: "name",
                style: {
                    fontSize: 16,
                    color: "#262626",
                    flex: 1
                }
            },
            list_repeat_item_right: {
                type: "checkbox",
                style: {
                    width: 20,
                    height: 20,
                    marginRight: 13
                }
            },
            bottom_submit: {
                type: "button",
                mode: 2,
                text: "确定",
                style: {
                    height: 40,
                    backgroundColor: "#37b7fd",
                    color: "#fff",
                    width: "100%",
                    position: "absolute",
                    bottom: 0,
                    borderRadius: 0
                }
            }
        },

    };
    return Re;
});
