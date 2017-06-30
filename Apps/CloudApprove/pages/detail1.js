define(["../logic/detail1", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: "#f2f3f4"
        },
        root: ["top_view", "bottom_repeat", "morePopover"],
        components: {
            top_view: {
                type: "view",
                ref: true,
                style: {
                    flex: 1,
                    overflowY: "scroll",
                    background: "#f2f3f4",
                    "-webkit-backface-visibility": "hidden", //隐藏转换的元素的背面
                    "-webkit-transform-style": "preserve-3d", //使被转换的元素的子元素保留其 3D 转换
                    "-webkit-transform": "translate3d(0,0,0)"
                },
                root: ["userinfo_warp", "middle_detail_repeat", "middle_layout_detail_repeat", "middle_cc_list", "middle_flow_repeat"]
            },
            userinfo_warp: {
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    background: "#fff",
                    padding: "14px 0 9px 0"
                },
                root: ["user_icon", "userinfo_rightwarp", "result_logo"]
            },
            user_icon: {
                type: "image",
                ref: true,
                style: {
                    w: 40,
                    backgroundColor: "#eee",
                    marginLeft: 10,
                    marginRight: 10,
                    borderRadius: "100%"
                }
            },
            userinfo_rightwarp: {
                type: "view",
                style: {
                    flex: 1,
                    justifyContent: "center"
                },
                root: ["userinfo_name", "userinfo_status"]
            },
            result_logo: {
                type: "image",
                src: "./imgs/agree.png",
                ref: true,
                style: {
                    display: "none",
                    position: "absolute",
                    top: -10,
                    width: 160,
                    right: -10,
                    opacity: "0",
                    background: "#fff",
                    transition: "all 150ms ease",
                    "-webkit-backface-visibility": "hidden", //隐藏转换的元素的背面
                    "-webkit-transform-style": "preserve-3d", //使被转换的元素的子元素保留其 3D 转换
                    "-webkit-transform": "translate3d(0,0,0)"
                }
            },
            userinfo_name: {
                type: "text",
                ref: true,
                text: "加载中...",
                style: {
                    color: "#292F33",
                    fontSize: 16,
                    lineHeight: 16,
                    marginBottom: 8
                }
            },
            userinfo_status: {
                type: "text",
                text: "加载中...",
                ref: true,
                style: {
                    fontSize: 14,
                    lineHeight: 14,
                    color: "#8C8D8E"
                }
            },
            middle_detail_repeat: {
                type: "repeat",
                root: ["middle_detail_repeat_item"],
                itemClassName: "middle_detail_repeat_item",
                ref: true,
                style: {
                    fontSize: 14,
                    lineHeight: 14,
                    background: "#fff",
                    alignItems: "flex-start",
                    flexDirection: "column",
                },
                itemStyle: {}
            },
            middle_detail_repeat_item: {
                type: "view",
                ref: true,
                root: ["middle_detail_repeat_item_left", "middle_detail_repeat_item_right"],
                style: {
                    width: "100%",
                    flexDirection: "row"
                }
            },
            middle_detail_repeat_item_left: {
                type: "text",
                text_bind: "title",
                style: {
                    alignItems: "flex-start",
                    color: "#999",
                    marginRight: "15px",
                    marginLeft: "15px",
                    marginTop: 3
                }
            },
            middle_detail_repeat_item_right: {
                type: "statusview",
                defaultKey: "middle_detail_repeat_item_right_text",
                style: {
                    color: "#333",
                    flex: 1,
                    lineHeight: 21
                }
            },
            middle_detail_repeat_item_right_text: {
                type: "text",
                text_bind: "value",
                style: {
                    color: "#333",
                    flexWrap: "wrap",
                    flex: 1,
                    paddingRight: "15px",
                    wordBreak: "break-all",
                }
            },
            middle_detail_repeat_item_right_img_repeat: {
                type: "repeat",
                ref: true,
                root: ["middle_detail_repeat_item_right_img_repeat_item"],
                style: {
                    flexWrap: "wrap",
                    flex: 1,
                    marginLeft: 15,
                    marginBottom: 10
                },
                itemStyle: {
                    marginTop: 10,
                    lineHeight: 21,
                    marginRight: 10
                }
            },
            middle_detail_repeat_item_right_img_repeat_item: {
                type: "image",
                src_bind: "src",
                style: {
                    w: 79
                }
            },
            middle_layout_detail_repeat: {
                type: "repeat",
                root: ["middle_detail_repeat_item_repeat_title", "middle_detail_repeat_item_repeat"],
                itemClassName: "middle_detail_repeat_item",
                ref: true,
                style: {
                    fontSize: 16,
                    lineHeight: 16,
                    background: "#fff",
                    alignItems: "flex-start",
                    paddingBottom: 15,
                    flexDirection: "column"
                },
                itemStyle: {
                    flexDirection: "column",
                    width: "100%"
                }
            },
            middle_detail_repeat_item_repeat_title: {
                type: "text",
                text: "明细",
                style: {
                    color: "#999",
                    fontSize: 14,
                    lineHeight: 14
                }
            },
            middle_detail_repeat_item_repeat: {
                type: "repeat",
                text_bind: "value",
                ref: true,
                root: ["middle_detail_repeat_item_repeat_item"],
                style: {
                    width: "100%",
                    flexDirection: "column",
                    fontSize: 14,
                    lineHeight: 14
                },
                itemStyle: {
                    lineHeight: 21
                },
            },
            middle_detail_repeat_item_repeat_item: {
                type: "view",
                root: ["middle_detail_repeat_item_repeat_item_left", "middle_detail_repeat_item_repeat_item_right"],
                style: {
                    width: "100%",
                    flexDirection: "row"
                }
            },
            middle_detail_repeat_item_repeat_item_left: {
                type: "text",
                text_bind: "title",
                style: {
                    alignItems: "flex-start",
                    color: "#999",
                    marginRight: 10,
                    marginLeft: 15
                }
            },
            middle_detail_repeat_item_repeat_item_right: {
                type: "statusview",
                defaultKey: "middle_detail_repeat_item_right_text",
                style: {
                    flex: 1,
                }
            },
            middle_detail_repeat_item_repeat_item_right_text: {
                type: "text",
                text_bind: "value",
                style: {
                    color: "#333",
                    flexWrap: "wrap",
                    flex: 1,
                    paddingRight: "15px",
                    wordBreak: "break-all"
                }
            },
            middle_cc_list: {
                type: "view",
                root: ["middle_cc_list_top", "middle_cc_list_middle", "middle_cc_list_bottom"],
                style: {
                    flexDirection: "column",
                }
            },
            middle_cc_list_top: {
                type: "icon",
                text: "展开更多",
                font: "ap_e901",
                ref: true,
                iconStyle: {
                    fontSize: 8,
                    marginRight: 5
                },
                style: {
                    backgroundColor: "#fff",
                    color: "#999",
                    fontSize: 11,
                    height: 28,
                    borderTop: "1px solid #EBEFF4",
                    borderBottom: "1px solid #EBEFF4",
                }
            },
            middle_cc_list_middle: {
                type: "view",
                className: "displaynone",
                root: ["middle_cc_list_title", "middle_cc_list_repeat"],
                style: {
                    flexDirection: "column",
                    background: "#fff"
                }
            },
            middle_cc_list_title: {
                type: "view",
                root: ["middle_cc_list_title_left", "middle_cc_list_title_right"]
            },
            middle_cc_list_title_left: {
                type: "text",
                text: "抄送人",
                style: {
                    paddingLeft: 15,
                    fontSize: 14,
                    color: "#333"
                }
            },
            middle_cc_list_title_right: {
                type: "text",
                text: "（审批人全部同意后，将抄送给以下人员）",
                style: {
                    fontSize: 14,
                    color: "#ccc"
                }
            },
            middle_cc_list_repeat: {
                type: "repeat",
                className: "line-repeat",
                ref: true,
                style: {
                    minHeight: 80,
                    flexWrap: "wrap",
                    paddingLeft: 6,
                    paddingBottom: 10,
                    flexDirection: "row",
                    background: "#fff"
                },
                itemStyle: {
                    width: 50,
                },
                root: ["middle_cc_list_repeat_item"]
            },
            middle_cc_list_repeat_item: {
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
            middle_cc_list_bottom: {
                type: "icon",
                text: "收起更多",
                font: "ap_e900",
                className: "displaynone",
                iconStyle: {
                    fontSize: 8,
                    marginRight: 5
                },
                style: {
                    backgroundColor: "#fff",
                    color: "#999",
                    fontSize: 11,
                    height: 28,
                    borderTop: "1px solid #EBEFF4",
                    borderBottom: "1px solid #EBEFF4",
                }
            },
            middle_flow_repeat: {
                type: "repeat",
                ref: true,
                style: {
                    background: "#F2F3F4",
                    flexDirection: "column",
                    paddingBottom: 20
                },
                itemStyle: {
                    flexDirection: "row",
                    background: "#F2F3F4"
                },
                root: ["flow_left", "flow_right"]
            },
            flow_left: {
                type: "view",
                ref: true,
                root: ["left_line", "left_round"],
                style: {
                    width: 24
                }
            },
            left_line: {
                type: "text",
                text: " ",
                ref: true,
                style: {
                    width: 2,
                    background: "#5FC5FD",
                    height: "100%",
                    position: "absolute",
                    left: 22,
                    bottom: 26
                }
            },
            left_round: {
                type: "text",
                text: " ",
                ref: true,
                style: {
                    position: "absolute",
                    right: "-4px",
                    top: 49,
                    w: "10px",
                    borderRadius: "50%",
                    background: "#5FC5FD"
                }
            },
            flow_right: {
                type: "view",
                ref: true,
                root: ["flow_right_arrow", "flow_right_content"],
                style: {
                    flex: 1,
                    left: 25,
                    top: 20,
                    marginBottom: 20,
                    marginRight: 48,
                    borderRadius: 10,
                    paddingLeft: 10,
                    backgroundColor: "#fff"
                }
            },
            flow_right_arrow: {
                type: "text",
                text: " ",
                ref: true,
                style: {
                    position: "absolute",
                    top: 24,
                    left: -9,
                    width: 0,
                    height: 0,
                    borderTop: "10px solid transparent",
                    borderRight: "10px solid #fff",
                    borderBottom: "10px solid transparent"
                }
            },
            flow_right_content: {
                type: "view",
                ref: true,
                root: ["flow_right_content_left", "flow_right_content_middle", "flow_right_content_right"],
                style: {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    padding: "12px 0"
                }
            },
            flow_right_content_left: {
                type: "image",
                src_bind: "avatar",
                title_bind: "name",
                style: {
                    w: 40,
                    backgroundColor: "#eee",
                    borderRadius: "50%",
                    marginRight: 14,
                    top: 1
                }
            },
            flow_right_content_middle: {
                type: "view",
                root: ["flow_right_content_middle_top", "flow_right_content_middle_bottom"],
                style: {
                    flexDirection: "column",
                    flex: 1,
                    marginRight: 14,
                    top: 3
                }
            },
            flow_right_content_middle_top: {
                type: "text",
                text_bind: "name",
                style: {
                    fontSize: 16,
                    lineHeight: 16,
                    marginBottom: 4,
                    color: "#292F33"
                }
            },
            flow_right_content_middle_bottom: {
                type: "view",
                root: ["flow_right_content_middle_bottom_title", "flow_right_content_middle_bottom_image_repeat"],
                style: {
                    flexDirection: "column"
                }
            },
            flow_right_content_middle_bottom_title: {
                type: "text",
                text_bind: "status",
                style: {
                    fontSize: 14,
                    lineHeight: 21,
                    color: "#999",
                }
            },
            flow_right_content_middle_bottom_image_repeat: {
                type: "repeat",
                ref: true,
                root: ["flow_right_content_middle_bottom_image_repeat_item"],
                style: {
                    flexWrap: "wrap"
                },
                itemStyle: {
                    margin: "5px 10px 5px 0"
                }
            },
            flow_right_content_middle_bottom_image_repeat_item: {
                type: "image",
                src_bind: "thumb_src",
                style: {
                    w: 40,
                }
            },
            flow_right_content_right: {
                type: "text",
                text_bind: "time",
                style: {
                    fontSize: 12,
                    lineHeight: 12,
                    height: '100%',
                    marginRight: 14,
                    position: "absolute",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    right: 0,
                    top: 0,
                    color: "#999",
                    zIndex: 10
                }
            },
            bottom_repeat: {
                type: "repeat",
                ref: true,
                style: {
                    borderTop: "1px solid #DDDDDD",
                    height: 48,
                    flexDirection: "row",
                    display: "none",
                    bottom: -50,
                    background: "#fff",
                    transition: "all 800ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
                },
                itemStyle: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                },
                splitStyle: {
                    height: 15,
                    marginTop: 18,
                    width: 1,
                    backgroundColor: "rgb(227, 227, 227)"
                },
                root: ['bottom_repeat_text']
            },
            bottom_repeat_text: {
                type: "text",
                text_bind: "title",
                style: {
                    flex: 1,
                    fontSize: 16,
                    lineHeight: 16,
                    color: "#37B7FD"
                }
            },
            morePopover: {
                type: "popover",
                root: ["moreRepeat"],
                animate: {mode: "2"},
                bkCoverStyle: {
                    backgroundColor: "rgba(230, 230, 230, 0.2)"
                },
                arrowStyle: {
                    backgroundColor: "#fff",
                    zIndex: 2,
                    "-webkit-box-shadow": "9px 8px 13px rgb(203, 203, 203)",
                    "box-shadow": "9px 8px 13px rgb(203, 203, 203)",
                },
                style: {
                    "-webkit-box-shadow": "0px 8px 13px rgb(203, 203, 203)",
                    "box-shadow": "0px 8px 13px rgb(203, 203, 203)",
                    width: 100,
                    backgroundColor: "#fff",
                    height: "auto",
                    borderRadius: "7px"
                }
            },
            moreRepeat: {
                type: "repeat",
                ref: true,
                items: [],
                root: ["moreRepeat_item"],
                style: {
                    flexDirection: "column",
                    flex: 1,
                    paddingTop: 4,
                    paddingBottom: 4,
                },
                itemStyle: {
                    height: 40,
                    justifyContent: "center",
                    alignItems: "stretch"
                }
            },
            moreRepeat_item: {
                type: "text",
                text: "测试",
                text_bind: "title",
                style: {
                    flex: 1,
                    justifyContent: "center"
                },
                textStyle: {
                    fontSize: 15,
                    color: "#292f33"
                }
            },
            messageDialog: {
                type: "view",
                root: ["message_top", "message_middle", "message_bottom"],
                style: {
                    flexDirection: "column",
                    width: 280
                }
            },
            message_top: {
                type: "view",
                root: ["message_top_left", "message_top_right"],
                style: {
                    display: "flex",
                    justifyContent: "center",
                    height: "45px",
                    alignItems: "center",
                    flexDirection: "row"
                }
            },
            message_top_left: {
                type: "text",
                text: "发消息给：",
                style: {
                    fontSize: 15,
                    color: "#999"
                }
            },
            message_top_right: {
                type: "text",
                text: "3fuyu",
                text_bind: "userName",
                style: {
                    fontSize: 16,
                    color: "#333"
                }
            },
            message_middle: {
                type: "view",
                root: ["message_middle_left", "message_middle_right"],
                style: {
                    width: "90%",
                    margin: "0 auto",
                    alignItems: "center",
                    borderRadius: 4,
                    marginBottom: 15,
                    padding: 10,
                    background: "#f5f5f5",
                    flexDirection: "row"
                }
            },
            message_middle_left: {
                type: "image",
                defaultSrc: "./imgs/2.png",
                style: {
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    marginRight: 9
                }
            },
            message_middle_right: {
                type: "text",
                text: "有张审批单据需要您审批，快去看看吧！",
                style: {
                    fontSize: 14,
                    flexWrap: "wrap",
                    flex: 1
                }
            },
            message_bottom: {
                type: "view",
                root: ["message_bottom_cancel", "message_bottom_submit"],
                style: {
                    borderTop: "1px solid #eee",
                    flexDirection: "row",
                    justifyContent: "center",
                    height: 44
                }
            },
            message_bottom_cancel: {
                type: "text",
                text: "取消",
                style: {
                    fontSize: 16,
                    color: "#333",
                    borderRight: "1px solid #eee",
                    width: "50%",
                    justifyContent: "center"
                }
            },
            message_bottom_submit: {
                type: "text",
                text: "确定",
                style: {
                    fontSize: 16,
                    color: "#37B7FD",
                    width: "50%",
                    justifyContent: "center"
                }
            }
        }
    };
    return Re;
});
