/**
 * 更多模板页面绘制
 */
define(["../logic/moreTemplate", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
            overflowY: "auto"
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
                root: ["searchInput", "main_view"]
            },
            manageBtn: {
                type: "button",
                title: "管理",
                style: {
                    width: 50,
                    height: 20
                }
            },
            searchInput: {
                cancelBtnStyle: {
                    color: "#37B7FD",
                    fontSize: 15
                },
                style: {
                    backgroundColor: "#fff"
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
//          		display:"none",
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
            main_view: {
                type: "listview",
                nodata: "nodata",
                ref: true,
                style: {
                    fontSize: 16,
                    color: "#262626",
                    flexWrap: "wrap",//不加的话不会循环显示列表
                    flexDirection: "column"
                },
                rowStyle: {
                    width: "100%",
                    height: "100%"
                },
                root: ["template_item_title", "template_item_repeat"],
            },
            template_item_title: {
                type: "text",
                ref: true,
                text_bind: "category",
                textStyle: {
                    fontSize: 13,
                    color: "#9E9E9E",
                },
                style: {
                    width: "100%",
                    height: "25px",
                    padding: "6px 0 22px 12px",
                    backgroundColor: "#F7F7F7",
                    display: "block"
                }
            },
            template_item_repeat: {
                type: "repeat",
                style: {
                    flexWrap: "wrap"
                },
                ref: true,
                items_bind: "formList",
                itemClassName:"bottom-half-line right-half-line-before",
                itemStyle: {
                    width: "33.3%",
                    height: 120,
                    justifyContent: "center",
                    alignItems: "center",
                    // borderBottom: "1px solid #eee",
                    // borderRight: "1px solid #eee",
                    padding: "0 10px 0 10px",
                    backgroundColor: "#fff"
                },
                root: ["template_item"]
            },
            template_item: {
                type: "view",
                style: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#fff"
                },
                root: ["template_item_icon", "right_btn_container"]
            },
            template_item_icon: {
                type: "icon",
                src_bind: "icon",
                text_bind: "title",
                textPos: "bottom",
                iconStyle: {
                    w: 30
                },
                textStyle: {
                    fontSize: "13px",
                    color: "#666",
                    marginTop: 9
                },
            },
            right_btn_container: {
                type: "view",
                ref: true,
                style: {
                    perspective: 1000,

                    display: "none",
                    position: "absolute",
                    top: "8px",
                    right: "-2px",
                    width: "22px",
                    height: "22px"
                },
                root: ["right_btn"]
            },
            right_btn: {
                type: "view",
                ref: true,
                style: {
                    position: "relative",
                    height: "100%",
                    width: "100%"
                },
                root: ["right_btn_front", "right_btn_back"]
            },
            right_btn_front: {
                type: "icon",
                font: "cap_e90a",
                ref: true,
                style: {
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                    color: "#FC615D"
                },
                iconStyle: {
                    fontSize: "18px"
                }
            },
            right_btn_back: {
                type: "icon",
                font: "cap_e90a",
                ref: true,
                style: {
                    height: "100%",
                    width: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "#ccc",
                },
                iconStyle: {
                    fontSize: "18px"
                }
            }

        }
    };
    return Re;
});
