define(["../logic/deal", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: "#F2F3F4"
        },
        root: ["main_view", "submit", "add_sign_bottom_poplayer"],
        components: {
            main_view: {
                type: "view",
                // 指派 驳回 加签
                root: ["agree_assign", "reject_process", "add_sign", "input_textarea"],
                style: {
                    flexDirection: "column",
                    paddingBottom: 15,
                }
            },
            agree_assign: {
                type: "view",
                ref: true,
                style: {
                    display: "none",
                    minHeight: 50,
                    marginBottom: 10,
                    fontSize: 15,
                    flexDirection: "column"
                },
                root: ["agree_assign_title", "agree_assign_list_repeat"]
            },
            agree_assign_title: {
                type: "text",
                text: "请选择指派环节的审批人",
                numberofline: 2,
                style: {
                    paddingLeft: 13,
                    fontSize: 13,
                    height: 30
                }
            },
            agree_assign_list_repeat: {
                type: "repeat",
                ref: true,
                itemClassName: 'form-row',
                root: ["agree_assign_list_repeat_item"],
                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff"
                },
                itemStyle: {
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ddd",
                    flexDirection: "row",
                }
            },
            agree_assign_list_repeat_item: {
                type: "view",
                className: 'form-row',
                root: ["agree_assign_list_repeat_title", "agree_assign_list_repeat_content", "agree_assign_list_repeat_icon"],
                style: {
                    flexDirection: "row",
                    width: "100%"
                }
            },
            agree_assign_list_repeat_title: {
                type: "text",
                text_bind: "activityName",
                style: {
                    height: 50,
                    fontSize: 15,
                    paddingLeft: 13,
                    flexDirection: "row"
                }
            },
            agree_assign_list_repeat_content: {
                type: "text",
                textPos: "left",
                ref: true,
                text: "请选择审批人",
                font: "icomoon_e913",
                numberofline: 1,
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    paddingLeft: 20
                },
                textStyle: {
                    height: 50,
                    lineHeight: 50
                }
            },
            agree_assign_list_repeat_icon: {
                type: "icon",
                font: "icomoon_e913",
                numberofline: 5,
                iconStyle: {
                    color: "#BBBBBB",
                    fontSize: 14
                },
                style: {
                    width: 10,
                    justifyContent: "flex-end",
                    paddingRight: 16,
                    paddingLeft: 20
                }
            },
            reject_process: {
                type: "view",
                root: ["reject_process_title", "reject_process_repeat"],
                style: {
                    display: "none",
                    flexDirection: "column",
                    marginBottom: 10
                }
            },
            reject_process_title: {
                type: "text",
                text: "请选择驳回环节",
                style: {
                    height: 30,
                    width: "100%",
                    paddingLeft: 13,
                    fontSize: 13,
                    color: "#666"
                }
            },
            reject_process_repeat: {
                type: "repeat",
                text: "123",
                ref: true,
                root: ["reject_process_repeat_item"],
                style: {
                    flexDirection: "column",
                },
                itemSelectedClassName: "reject_process_selected",
                itemStyle: {
                    borderBottom: "1px solid #ddd"
                }
            },
            reject_process_repeat_item: {
                type: "view",
                root: ["reject_process_repeat_item_left", "reject_process_repeat_item_right"],
                style: {}
            },
            reject_process_repeat_item_left: {
                type: "text",
                text_bind: "activityName",
                style: {
                    backgroundColor: "#fff",
                    height: 50,
                    fontSize: 15,
                    paddingLeft: 13,
                    flexDirection: "row"
                }
            },
            reject_process_repeat_item_right: {
                type: "icon",
                font: "cap_e903",
                style: {
                    display: "none",
                    fontSize: "16",
                    color: "#29B6F6",
                    position: "absolute",
                    right: 15,
                    top: 0,
                    height: 50,
                    lineHeight: 50
                }
            },
            add_sign: {
                type: "view",
                ref: true,
                root: ["add_sign_person", "add_sign_way"],
                style: {
                    display: "none",
                    flexDirection: "column"
                }
            },
            add_sign_person: {
                type: "view",
                style: {
                    backgroundColor: "#fff",
                    marginBottom: 10,
                    marginTop: 10,
                },
                root: ["add_sign_person_title", "add_sign_person_repeat"]
            },
            add_sign_person_title: {
                type: "text",
                text: "加签人",
                nextText: "(点击头像删除人员)",
                style: {
                    marginTop: 10,
                    paddingBottom: 10,
                    color: "#333333",
                    fontSize: 16,
                    marginLeft: 14
                },
                nextTextStyle: {
                    color: "#999",
                    marginLeft: 10,
                    fontSize: 12
                },
            },

            add_sign_person_repeat: {
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
                subComponent: "add_sign_person_btn",
                itemStyle: {
                    width: 50,
                },
                root: ["add_sign_person_icon"]
            },

            add_sign_person_icon: {
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
            add_sign_person_btn: {
                type: "image",
                src: "./imgs/addapprove.png",
                style: {
                    w: 32,
                    marginTop: 9,
                    marginLeft: 9,
                    backgroundColor: "#fff"
                },
            },
            add_sign_way: {
                type: "view",
                className: 'form-row',
                root: ["add_sign_way_left", "add_sign_way_middle", "add_sign_way_right"],
                style: {
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    marginBottom: 10,
                    fontSize: 16
                }
            },
            add_sign_way_left: {
                type: "text",
                text: "加签方式",
                style: {
                    color: "#333",
                    height: 50,
                    fontSize: 16,
                    paddingLeft: 13,
                    flexDirection: "row"
                }
            },
            add_sign_way_middle: {
                type: "text",
                textPos: "left",
                ref: true,
                text: "请选择加签方式",
                font: "icomoon_e913",
                numberofline: 1,
                style: {
                    flex: 1,
                    color: "#ADADAD",
                    justifyContent: "flex-end",
                    paddingLeft: 20
                },
                textStyle: {
                    height: 50,
                    lineHeight: 50
                }
            },
            add_sign_way_right: {
                type: "icon",
                font: "icomoon_e913",
                numberofline: 5,
                iconStyle: {
                    color: "#BBBBBB",
                    fontSize: 14
                },
                style: {
                    width: 10,
                    justifyContent: "flex-end",
                    paddingRight: 16,
                    paddingLeft: 20
                }
            },
            input_textarea: {
                type: "textarea",
                ref: true,
                max: 200,
                limitStyle: {
                    right: 10,
                    color: "#aaa",
                    display: "none"
                },
                numStyle: {},
                maxStyle: {},
                placeholder: "请输入同意理由（非必填, 200字以内）",
                style: {
                    height: 150,
                    paddingLeft: 15,
                    paddingRight: 15,
                    fontSize: 15,
                    paddingTop: 15,
                    width: "100%"
                },

            },
            images_repeat: {
                type: "repeat",
                ref: true,
                subComponentAlwaysShow: true,
                root: ["image", "image_del_icon"],
                style: {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 10,
                    paddingLeft: 10
                },
                itemStyle: {
                    w: 90,
                    justifyContent: "center",
                    alignItems: "center",
                },
                subComponent: "add_image_icon"
            },
            add_image_icon: {
                type: "icon",
                text: "＋",
                style: {
                    w: 80,
                    backgroundColor: "#fff",
                    marginTop: 5,
                    marginLeft: 5,
                    border: "1px dashed rgb(207,207,207)",
                },
                textStyle: {
                    color: "rgb(207,207,207)",
                    fontSize: 28
                },
            },
            image: {
                type: "image",
                src_bind: "src",
                src: "",
                style: {
                    w: 80,
                    backgroundColor: "rgba(0,0,0,.1)"
                }
            },
            image_del_icon: {
                type: "icon",
                font: "icomoon_e909",
                style: {
                    position: "absolute",
                    right: 8,
                    border: "2px solid #fff",
                    borderRadius: "100%",
                    backgroundColor: "#fff",
                    top: 8
                },
                iconStyle: {
                    color: "#FC505F",
                    fontSize: 17
                }
            },
            submit: {
                type: "button",
                title: "提交",
                style: {
                    fontSize: 16,
                    height: 45,
                    backgroundColor: "#37B7FD",
                    border: "none",
                    color: "#fff",
                    margin: 15,
                    width: "auto"
                }
            },
            add_sign_bottom_poplayer: {
                type: "poplayer",
                mode: "bottom",
                style: {
                    backgroundColor: "#f2f3f4",
                    flexDirection: "column",
                    width: "100%"
                },
                root: ["add_sign_bottom_poplayer_title", "add_sign_bottom_poplayer_repeat"]
            },
            add_sign_bottom_poplayer_title: {
                type: "text",
                text: "请选择",
                style: {
                    color: "#9E9E9E",
                    backgroundColor: "F7F7F7",
                    height: 28,
                    fontSize: 12,
                    paddingLeft: 12
                }
            },
            add_sign_bottom_poplayer_repeat: {
                type: "repeat",
                itemSelectedClassName: "add_sign_bottom_poplayer_select",
                items: [{id: '1', title: "会签", placeholder: "所有加签人并行处理才完成"},{id: '2', title: "抢占", placeholder: "只有一个加签人处理完即完成"}],
                root: ["add_sign_bottom_poplayer_repeat_item"],
                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff"
                }
            },
            add_sign_bottom_poplayer_repeat_item: {
                type: "view",
                root: ["add_sign_bottom_poplayer_repeat_item_left", "add_sign_bottom_poplayer_repeat_item_right"],
                style: {
                    flex: 1,
                    height: 50,
                    borderBottom: "1px solid #eee",
                    color: "#333",
                    fontSize: 14,
                    paddingLeft: 12
                }
            },
            add_sign_bottom_poplayer_repeat_item_left: {
                type: "text",
                text_bind: "title",
                nextText_bind: "placeholder",
                style: {
                    flex: 1,
                    height: 50,
                    color: "#333",
                    fontSize: 14,
                },
                nextTextStyle: {
                    marginLeft: 10,
                    color: "#9E9E9E"
                }
            },
            add_sign_bottom_poplayer_repeat_item_right: {
                type: "icon",
                font: "cap_e903",
                style: {
                    display: "none",
                    fontSize: "16",
                    color: "#29B6F6",
                    position: "absolute",
                    right: 15,
                    top: 0,
                    height: 50,
                    lineHeight: 50
                }
            }
        }
    };
    return Re;
})
;
