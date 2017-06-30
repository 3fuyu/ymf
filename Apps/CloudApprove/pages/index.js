/**
 * 首页的上下分类
 **/
define(["../logic/index", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
        },
        root: ["topfixed", "bottomview"],
        components: {
            topfixed: {
                type: "view",
                style: {
                    width: "100%",
                    position: "absolute",
                    zIndex: "11",
                    backgroundColor: "#f7f7f7",
                    flexDirection: "column"
                },
                root: ["topview", "topfixedbar"]
            },
            topfixedbar: {
                type: "view",
                style: {
                    height: "10px"
                }
            },
            topview: {
                type: "view",
                style: {
                    height: 105,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    width: "100%"
                },
                root: ["topview_left", "topview_middle", "topview_right"]
            },
            topview_left: {
                type: "view",
                style: {
                    paddingTop: 8,
                    flex: 1,
                    justifyContent: "center",//flex布局水平居中
                    alignItems: "center",//垂直居中
                    flexDirection: "row"
                },
                root: ["waitme_approve_icon", "first_split_line"]
            },
            waitme_approve_icon: {
                type: "icon",
                ref: true,
                src: "./imgs/yunshen_approving.png?v=1",
                text: "待审批",
                textPos: "bottom",
                textStyle: {
                    fontSize: "13px",
                    color: "#666"
                },
                iconStyle: {
                    w: 25,
                    marginBottom: 8,
                    boderRight: "1px solid #EDEDED",
                },
            },
            first_split_line: {
                type: "view",
                className:"right-half-line",
                style: {
                    position: "absolute",
                    top: "40px",
                    right: "0px",
                    width: "1px",
                    height: "25px",
                    alineItems: "center",//垂直居中
                    // backgroundColor: "#EDEDED",
                    // borderRight: "1px solid #EDEDED"
                }
            },
            topview_middle: {
                type: "view",
                style: {
                    paddingTop: 8,
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["my_approve_icon", "second_split_line"]
            },
            my_approve_icon: {
                type: "icon",
                ref: "true",
                src: "./imgs/yunshen_applied_yet.png?v=1",//1.已申请的处理完了;2.已申请未处理完(默认未处理完)
                text: "我发起的",
                textPos: "bottom",
                textStyle: {
                    fontSize: "13px",
                    color: "#666",
                },
                iconStyle: {
                    marginBottom: 8,
                    w: 25
                }
            },
            second_split_line: {
                type: "view",
                className:"right-half-line",
                style: {
                    width: "1px",
                    height: "25px",
                    position: "absolute",
                    right: "0px",
                    top: "40px",
                    // backgroundColor: "#EDEDED",
                    // borderRight: "1px solid #EDEDED"
                }
            },
            topview_right: {
                type: "view",
                style: {
                    paddingTop: 8,

                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["copy_approve_icon"]
            },
            copy_approve_icon: {
                type: "icon",
                ref: true,
                src: "./imgs/yunshen_copy2me.png?v=1",
                text: "抄送我的",
                textPos: "bottom",
                textStyle: {
                    fontSize: "13px",
                    color: "#666",
                },
                iconStyle: {
                    marginBottom: 8,
                    w: 25
                }
            },
            bottomview: {
                type: "view",
                style: {
                    position: "absolute",
                    top: 115,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflowY: 'auto'
                },
                root: ["app_repeat"]
            },
            app_repeat: {
                type: "repeat",
                ref: true,
                className: "app-repeat index-repeat-item",
                itemClassName:"bottom-half-line right-half-line-before",
                subComponent: "more_template_end",
                nodata: "app_repeat_nodata",
                style: {
                    flexWrap: "wrap"
                },
                itemStyle: {
                    width: "33.3%",
                    height: 110,
                    justifyContent: "center",
                    alignItems: "center",
                    // borderBottom: "1px solid #eee",
                    padding: "0 10px 0 10px",
                    background: "#fff"
                },
                root: ["app_repeat_icon"]
            },
            app_repeat_nodata: {
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
            app_repeat_icon: {
                type: "icon",
                font: "",
                ref: true,
                className: "icon",
                iconStyle: {
                    w: 30
                },
                textStyle: {
                    fontSize: "13px",
                    color: "#666",
                    marginTop: 9
                },
                text_bind: "title",
                textPos: "bottom"
            },
            more_template_end: {
                type: "icon",
                src: "./imgs/more-btn.png",
                text: "更多",
                ref: true,
                className: "icon form-row",
                iconStyle: {
                    w: 30
                },
                textStyle: {
                    fontSize: "13px",
                    color: "#666",
                    marginTop: 9
                },
                style: {
                    display: "none",
                    width: "33.3%",
                    height: 110,
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    borderRight: "1px solid #eee",
                    padding: "0 6px 0 6px",
                    background: "#fff"
                },
                textPos: "bottom"
            }

        },

    };
    return Re;
});
