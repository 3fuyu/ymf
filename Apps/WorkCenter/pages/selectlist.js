define(["../logic/selectlist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
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
                    overflowY: "auto",
                    flex: 1
                },
                root: ["noCategory_Item", "category_repeat"]
            },
            noCategory_Item: {
                type: "view",
                ref: "true",
                root: ["noCategory_icon", "noCategory_selecticon"],
                style: {
                    height: 50,
                    alignItems: "center",
                    flexDirection: "row",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid #eee",
                }
            },
            noCategory_icon: {
                type: "icon",
                font: "todo_e907",
                text: "收集箱",
                iconStyle: {
                    color: "#06CF86",
                    opacity: 0,
                    fontSize: 17,
                    paddingRight: 6,
                    paddingLeft: 6
                },
                style: {
                    flex: 1,
                    justifyContent: "flex-start"
                },
                textStyle: {
                    color: c.titleColor,
                    fontSize: 16
                },
            },
            noCategory_selecticon: {
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
            category_repeat: {
                type: "repeat",
                selectedMode: "s",
                ref: true,
                subComponentAlwaysShow: true,
                leftBlock: {
                    key: "item_del_icon",
                    width: 40
                },
                rightBlock: {
                    key: "item_sort_icon",
                    width: 70
                },
                sortHandle: "item_sort_icon",
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
                    flexDirection: "column",
                    backgroundColor: "#fff"
                },


                root: ["item_del_icon", "category_icon", "item_select_icon", "item_sort_icon"]
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
            item_sort_icon: {
                type: "icon",
                font: "todo_e908",
                iconStyle: {
                    fontSize: 17
                },
                style: {
                    overflow: "hidden",
                    width: 0,
                    height: "100%"
                }
            },
            category_icon: {
                type: "icon",
                font: "todo_e907",
                text: "分类",
                text_bind: "name",
                iconStyle: {
                    color: "#06CF86",
                    opacity: 0,
                    fontSize: 17,
                    paddingRight: 6,
                    paddingLeft: 6
                },
                textStyle: {
                    color: c.titleColor,
                    fontSize: 16
                },
                style: {
                    flex: 1,
                    justifyContent: "flex-start"
                }
            },
            item_del_icon: {
                type: "icon",
                font: "todo_e90b",
                iconStyle: {
                    color: "red",
                    fontSize: 17
                },
                style: {
                    overflow: "hidden",
                    width: 0,
                    height: "100%"
                }
            },

            category_input: {
                type: "input",
                ref: true,
                placeholder: "输入分类(2-10个字以内)",
                style: {
                    width: "92%",
                    paddingLeft: 10,
                    margin: "auto",
                    fontSize: 16,
                    height: 45,
                    border: "none",
                    backgroundColor: "#F2F3F4",
                    borderRadius: "4px"
                }
            },


            //start listview

            //end listview

        },

    };

    return Re;
});
