/**
 * 首页的上下分类
 **/
define(["../logic/index", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
            overflowY:"auto"
        },
        root: [ "topview", "bottomview"],
        components: {

            dialog: {
                type: "view",
                style: {
                    width: 281,
                    height: 336,
                    flexDirction: "column",
                    overflow: "hidden"
                },
                root: ["featureImg", "featureContent", "featureBtn"]
            },
            featureImg: {
                type: "image",
                style: {
                    height: 134
                },
                src: "./imgs/feature.png"
            },
            featureContent: {
                type: "view",
                style: {
                    flex: 1,
                    fontSize: 14,
                    padding: "20",
                    overflow: "auto"
                },
                root: ["featureText"]
            },
            featureText: {
                type: "text",
                style: {
                    color: "#999999"
                },
                ref: true
            },
            featureBtn: {
                type: "text",
                text: "知道了",
                style: {
                    height: 45,
                    borderTop: "1px solid #E2E8ED",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 16,
                    color: "#0093FF"
                }
            },
            topview: {
                type: "view",
                style: {
                    height: 110,
                    backgroundColor: "#fff",
                    flexDirection: "row"
                },
                root: ["topview_left", "topview_middle", "topview_right"]
            },
            topview_left: {
                type: "view",
                style: {
                    paddingTop:8,

                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["waitme_approve_icon"]
            },
            waitme_approve_icon: {
                type: "icon",
                ref: true,
                src: "./imgs/wait.png?v=1",
                text: "待我审批",
                textPos: "bottom",
                textStyle: {
                    fontSize: "13px",
                    color: "#666666",
                    marginTop: 10
                },
                iconStyle: {
                    w: 45
                }
            },
            topview_middle: {
                type: "view",
                style: {
                    paddingTop:8,
                    
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["my_approve_icon"]
            },
            my_approve_icon: {
                type: "icon",
                src: "./imgs/my.png?v=1",
                text: "我发起的",
                textPos: "bottom",
                textStyle: {
                    fontSize: "13px",
                    color: "#666666",
                    marginTop: 10
                },
                iconStyle: {
                    w: 45
                }
            },
            topview_right: {
                type: "view",
                style: {
                    paddingTop:8,

                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["copy_approve_icon"]
            },
            copy_approve_icon: {
                type: "icon",
                ref: true,
                src: "./imgs/copy_me.png?v=1",
                text: "抄送我的",
                textPos: "bottom",
                textStyle: {
                    fontSize: "13px",
                    color: "#666666",
                    marginTop: 10
                },
                iconStyle: {
                    w: 45
                }
            },
            bottomview: {
                type: "view",
                style: {
                    marginTop: 20,
                    backgroundColor: "#fff"
                },
                root: ["app_repeat"]
            },
            app_repeat: {
                type: "repeat",
                ref: true,
                className: "app-repeat",
                style: {
                    flexWrap: "wrap"
                },
                itemStyle: {
                    width: "33.3%",
                    height: 110,
                    justifyContent: "center",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    padding: "0 6px 0 6px"
                },

                root: ["app_repeat_icon"]
            },
            app_repeat_icon: {
                type: "icon",
                src_bind: "logo",
                defaultSrc: "./imgs/1.png",
                iconStyle: {
                    w: 40
                },
                textStyle: {
                    fontSize: "12px",
                    color: "#666666",
                    marginTop: 9
                },
                text_bind: "name",
                textPos: "bottom"
            }

        },

    };
    return Re;
});
