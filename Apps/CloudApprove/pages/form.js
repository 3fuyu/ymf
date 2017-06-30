define(["../logic/form", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
            overflow: 'auto'
        },
        root: ["headerview", "headerpadding", "statusview"],
        components: {
            headerview: {
                type: "view",
                ref:true,
                className: "bottom-half-line",
                style: {
                    height: 44,
                    backgroundColor: "#fff",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 12
                },
                root: ["headertitle"]
            },
            headertitle: {
                type: "text",
                ref:true,
                style: {
                    height: "100%",
                    justifyContent: "center",
                    fontSize:16
                },
                text: ""
            },
            headerpadding: {
                type: "view",
                ref:true,
                style: {
                    height: 44
                }
            },
            statusview: {
                ref: true,
                type: "statusview"
            },
            body: {
                type: "view",
                style: {
                    flexDirction: "column",
                    width: "100%",
                    paddingBottom: 20
                },
                root: []
            },

            cc_line_warp: {
                type: "view",
                ref: true,
                style: {
                    backgroundColor: "#fff",
                    marginTop: 10
                },
                root: ["cc_line_title", "cc_line_repeat"]
            },
            cc_line_title: {
                type: "text",
                text: "抄送人",
                nextText: "",
                style: {
                    marginTop: 10,
                    paddingBottom: 10,
                    color: "333333",
                    fontSize: 14,
                    marginLeft: 14
                },
                nextTextStyle: {
                    color: "#999"
                },
            },

            cc_line_repeat: {
                type: "repeat",
                className: "line-repeat",
                ref: true,
                style: {
                    minHeight: 80,
                    flexWrap: "wrap",
                    paddingLeft: 6,
                    paddingBottom: 10,
                    flexDirection: "row"
                },
                subComponent: "add_cc_btn",
                itemStyle: {
                    width: 50,
                },
                root: ["cc_icon"]
            },

            cc_icon: {
                type: "icon",
                style: {
                    paddingTop: 10,
                    zIndex: 10
                },
                iconStyle: {
                    w: 32,
                    backgroundColor: "#eee",
                    borderRadius: "100%",
                    overflow: "hidden"
                },
                textStyle: {
                    marginTop: 3,
                    color: "#999999",
                    fontSize: 12
                },
                title_bind: "userName",
                src_bind: "headImgUrl",
                text_bind: "userName",
                textPos: "bottom"
            },
            add_cc_btn: {
                type: "image",
                src: "./imgs/addapprove.png",
                style: {
                    w: 32,
                    marginTop: 9,
                    marginLeft: 9,
                    backgroundColor: "#fff"
                },
            },

            approve_line_wrap: {
                type: "view",
                ref: true,
                style: {
                    backgroundColor: "#fff",
                    marginTop: 10,
                },
                root: ["approve_line_topview", "approve_line_repeat"]
            },
            approve_line_topview: {
                type: "view",
                style: {
                    flexDirection: "row"
                },
                root: ["approve_line_loadingtext", "approve_line_wrap_title"]
            },
            approve_line_loadingtext: {
                type: "text",
                ref: true,
                textStyle: {
                    fontSize: 14,
                    color: "red"
                },
                style: {
                    paddingTop: 10,
                    paddingBottom: 10,
                    marginLeft: 13
                },
                text: ""
            },
            approve_line_wrap_title: {
                type: "text",
                ref: true,
                text: "审批人",
                style: {
                    marginTop: 10,
                    paddingBottom: 10,
                    color: "333333",
                    fontSize: 14
                },
                nextTextStyle: {
                    color: "#999"
                },
                nextText: ""
            },
            approve_line_repeat: {
                type: "repeat",
                ref: true,
                className: "line-repeat displaynone",
                style: {
                    minHeight: 80,
                    flexWrap: "wrap",
                    paddingLeft: 2,
                    paddingBottom: 10,
                    flexDirection: "row"
                },
                subComponent: "add_approve_btn",
                itemStyle: {
                    width: 50,
                },
                root: ["approve_icon", "repeat_line"]
            },
            repeat_line: {
                type: "view",
                style: {
                    position: "absolute",
                    top: 24,
                    height: 2,
                    backgroundColor: "#eee",
                    left: 0,
                    right: 0,
                    zIndex: 2
                }
            },
            approve_icon: {
                type: "icon",
                style: {
                    paddingTop: 10,
                    zIndex: 10
                },
                iconStyle: {
                    w: 32,
                    backgroundColor: "#eee",
                    borderRadius: "100%",
                    overflow: "hidden"
                },
                textStyle: {
                    marginTop: 3,
                    color: "#999999",
                    fontSize: 12
                },
                title_bind: "userName",
                src_bind: "headImgUrl",
                text_bind: "userName",
                textPos: "bottom"
            },
            add_approve_btn: {
                type: "image",
                src: "./imgs/addapprove.png",
                style: {
                    w: 32,
                    marginTop: 9,
                    marginLeft: 9,
                    backgroundColor: "#fff"
                },
            },
            submitbtn: {
                type: "button",
                title: "提交",
                mode: 2,
                style: {
                    height: 44,
                    width: 345,
                    margin: "15 auto",
                    fontSize: 16,
                    backgroundColor: "#29b6f6"
                }
            }
        },

    };
    return Re;
});
