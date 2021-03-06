/**
 * Created by Gin on 17/2/27.
 */
define(["../logic/detailProcess", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: "#F7F7F7"
        },
        root: ["middle_flow_repeat"],
        components: {
            middle_flow_repeat: {
                type: "repeat",
                ref: true,
                style: {
                    background: "rgb(247, 247, 247)",
                    flexDirection: "column"
                },
                itemStyle: {
                    flexDirection: "row",
                    background: "rgb(247, 247, 247);"
                },
                // items: [{name: "陈展鹏", status: "审批中"}, {name: "陈展鹏", status: "审批中"}],
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
                    borderLeft: "solid 1px #e6e6e6",
                    background: "#e6e6e6",
                    height: "95%",
                    position: "absolute",
                    left: 22,
                    bottom: 29
                }
            },
            left_round: {
                type: "icon",
                font: "cap_e90a",
                ref: true,
                iconStyle: {
                    color: "#56CFAE",
                    borderRadius: "50%",
                    fontSize: 18,
                    backgroundColor: "#fff"
                },
                style: {
                    position: "absolute",
                    right: "-8px",
                    top: 42,
                    w: 18,
                    borderRadius: "50%",
                    zIndex: 11
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
                    borderRadius: 6,
                    paddingLeft: 10,
                    backgroundColor: "#fff",
                    boxShadow: "0px 0px 0px 1px #ededed"
                }
            },
            flow_right_arrow: {
                type: "text",
                text: " ",
                ref: true,
                style: {
                    display: "none",
                    position: "absolute",
                    top: 20,
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
                root: ["flow_right_content_left", "flow_right_content_middle", "flow_right_content_right", "flow_iconview"],
                style: {
                    flexDirection: "row",
                    alignItems: "flex-start",
                    padding: "12px 0",
                    position:"relative"
                }
            },
            flow_iconview: {
                type: "view",
                root: ["flow_remind", "flow_line", "flow_IM"],
                ref: true,
                style: {
                    position: "absolute",
                    right: 14,
                    bottom: 12,
                    flexDirection: "row",
                    borderRadius: "50%",
                    zIndex: 11
                    //justifyContent: "space-between"
                }
            },
            flow_right_content_left: {
                type: "image",
                src_bind: "pic",
                src: "pic",
                title_bind: "userName",
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
                text_bind: "userName",
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
                    flexDirection: "column",
                    paddingRight: 20
                }
            },
            flow_right_content_middle_bottom_title: {
                type: "text",
                text: "状态加载中...",
                style: {
                    fontSize: 14,
                    lineHeight: 21,
                    color: "#9E9E9E"
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
                src_bind: "pic",
                style: {
                    w: 40
                }
            },
            flow_right_content_right: {
                type: "text",
                text_bind: "startTime",
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
                    color: "#ADADAD",
                    zIndex: 10
                }
            },
            flow_remind: {
                type: "icon",
                font: "cap_e921",
                ref: true,
                iconStyle: {
                    color: "#9e9e9e",
                    borderRadius: "50%",
                    fontSize: 16
                },
                style: {
                    display: "none",

                }
            },
            flow_line: {
                type: "view",
                style: {
                    display: "none",
                    width: 2,
                    height: 15,
                    margin: "0 15",
                    borderRight:"solid 1px #ededed"
                }
            },
            flow_IM: {
                type: "icon",
                font: "cap_e920",
                ref: true,
                iconStyle: {
                    color: "#9e9e9e",
                    borderRadius: "50%",
                    fontSize: 16
                },
                style: {
                    // position: "absolute",
                    // right: 12,
                    // top: 38,
                    // w: 18,
                    // borderRadius: "50%",
                    // zIndex: 11
                }
            }
        }
    };
    return Re;

});