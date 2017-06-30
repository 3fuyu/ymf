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
            searchInput: {
                cancelBtnStyle: {
                    color: "#37B7FD",
                    fontSize: 15
                },
                style: {
                    backgroundColor: "#fff",
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
//          		display:"none",
                    width: "100%",
                    alineItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F2F4F4",
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
                    flexWrap: "wrap",
                    backgroundColor: "#fff"
                },
                ref: true,
                items_bind: "formList",
                itemStyle: {
                    width: "100%",
                    height: 70, /*150-19*/
                    justifyContent: "center",
                    alignItems: "flex-start",
                    borderBottom: "1px solid #eee",
                },
                root: ["template_item"]
            },
            template_item: {
                type: "view",
                style: {
                    width: "100%",
                    display: "flex",
                    flexDirection: "row"
                },
                root: ["template_item_icon", "template_item_detail", "right_btn"]
            },
            template_item_icon: {
                type: "icon",
                src_bind: "icon",
                iconStyle: {
                    w: 28,
                    h: 28,
                },
                style: {
                    w: 70
                }
            },
            template_item_detail: {
                type: "view",
                style: {
                    flex: 1,
                    height: "70px",
                    flexDirection: "column",
                    justifyContent: "center"
                },
                root: ["right_title", "right_introduce"]
            },
            right_title: {
                type: "text",
                ref: true,
                text_bind: "title",
                numberofline: 1,
                style: {
                    height: 16,
                    lineHeight: 16,
                    width: "80%"
                },
                textStyle: {//修饰组件中<span>这里面的字体样式</span>
                }
            },
            right_introduce: {
                type: "text",
                ref: true,
                text_bind: "desc",
                numberofline: 1,
                style: {
                    marginTop: 10,
                    width: "80%"
                }, textStyle: {
                    fontSize: "13px",
                    color: "#ADADAD",
                }

            },
            right_btn: {
                type: "button",
                text: "button",
                ref: true,
                text_bind: "added",
                style: {
                    color: "#FA4F52",
                    display: "none",
                    border: "1px solid #FA4F52",
                    borderRadius: "5px",
                    fontSize: "13px",
                    width: "50px",
                    height: "28",
                    position: "absolute",
                    top: "20px",
                    right: "10px",
                }
            }

        }
    };
    return Re;
});
