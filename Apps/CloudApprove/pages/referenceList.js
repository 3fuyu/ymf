define(["../logic/referenceList", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
        },
        root: ["body", "bottom"],
        components: {
            body: {
                type: "view",
                style: {
                    flex: 1,
                    overflowX: "hidden",
                    overflowY: "auto"
                },
                // root: ["searchInput", "listview"]  因后台不支持，第一版隐藏搜索框
                root: ["listview"] // 因后台不支持，第一版隐藏搜索框
            },
            searchInput: {
                cancelBtnStyle: {
                    color: "#37B7FD",
                    fontSize: 15
                },
                style: {
                    backgroundColor: "#fff",
                    display: "none",
                    borderBottom: "1px solid rgb(226, 232, 237)"

                },
                iconStyle: {},
                placeholder: "搜索标题",
                font: "ap_e903",
                ref: true,
                type: "simplesearchview"
            },
            nodata: {
                ref: "true",
                type: "icon",
                text: "暂无内容",
                textPos: "bottom",
                src: "./imgs/yunshen_nodata.png?v=1",
                textStyle: {
                    fontSize: "15px",
                    color: "#ADADAD",
                    paddingLeft: 11,
                    paddingTop: 10
                },
                style: {
                    width: "100%",
                    alineItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F7F7F7",
                    paddingTop: 180,
                },
                iconStyle: {
                    w: 80,
                    h: 80
                }
            },
            listview: {
                ref: true,
                type: "listview",
                nodata: "nodata",
                rowStyle: {
                    flexDirection: "row",
                    paddingTop: 12,
                    paddingBottom: 12,
                    borderBottom: "1px solid #eee"
                },
                style: {
                    flexDirection: "column",
                },
                root: ["row_left_repeat", "row_right_statusview"]
            },
            row_left_repeat: {
                type: "repeat",
                root: ["row_text_repeat_item"],
                style: {
                    flexDirection: "column",
                    marginLeft: 15
                },
            },
            row_text_repeat_item: {
                type: "text",
                text_bind: "value",
                style: {
                    fontSize: 14
                }
            },
            row_right_statusview: {
                type: "statusview",
                ref: true,
                defaultKey: "row_right_radiobox",
                style: {
                    flex: 1,
                    width: 100,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 15
                },
            },
            row_right_checkbox: {
                type: "checkbox",
            },
            row_right_radiobox: {
                type: "radiobox",
                style: {},
                radioStyle: {},
                selectedRadioStyle: {
                    fontSize: 22
                }
            },
            bottom: {
                type: "view",
                style: {
                    display: "none",
                    height: 60,
                    borderTop: "1px solid #ddd",
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    alignItems: "center"
                },
                root: ["bottom_left", "bottom_right"]
            },
            bottom_left: {
                type: "text",
                text: "已选择 0",
                ref: true,
                style: {
                    alignItems: "flex-start",
                    fontSize: 15,
                    color: "#333",
                    marginLeft: 15,
                    justifyContent: "center"
                }
            },
            bottom_right: {
                type: "view",
                root: ["bottom_right_btn"],
                style: {
                    flex: 1,
                    alignItems: "flex-end"
                }
            },
            bottom_right_btn: {
                type: "button",
                text: "确定",
                mode: 2,
                style: {
                    backgroundColor: "#29B6F6",
                    color: "#fff",
                    height: 35,
                    width: 62,
                    marginRight: 15
                }
            }
        },

    };
    return Re;
});
