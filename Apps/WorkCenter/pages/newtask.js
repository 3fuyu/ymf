define(["../logic/newtask", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var today = new Date();
    var deadlineStr = c.formatTime(today,'yyyy-MM-dd');
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content"],
        components: {
            submitIcon: {
                type: "icon",
                text: "提交",
                style: {
                    marginTop:20,
                    borderRadius:8,
                    height: 50,
                    backgroundColor: "#37b7fd",
                    marginRight:15,
                },
                textStyle: {
                    fontSize: 16,
                    marginLeft: 4,
                    color: "#fff"
                },
                iconStyle: {
                    fontSize: 16,
                    color: c.mainColor
                }

            },
            page_content: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto",
                    backgroundColor: "#fff",
                },
                root: ["todo_title", "second_group"]
            },


            imagesRepeat: {
                type: "repeat",
                ref: true,
                items: [],
                root: ["image", "imageDelIcon"],
                style: {
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 5,
                    paddingLeft: 5
                },
                itemStyle: {
                    w: 90,
                    justifyContent: "center",
                    alignItems: "center",
                },
                subComponent: "addImageIcon"
            },
            addImageIcon: {
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
                    fontSize: 49
                },
            },
            imageDelIcon: {
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
            image: {
                type: "image",
                src_bind: "src",
                src: "",
                style: {
                    w: 80,
                    backgroundColor: "rgba(0,0,0,.1)"
                }
            },
            todo_title: {
                ref: true,
                type: "textarea",

                placeholder: "输入任务内容",
                style: {
                    fontSize: 16,
                    paddingRight: 14,
                    paddingLeft: 14,
                    paddingTop: 14,
                    backgroundColor: "#fff",
                    height: 145
                }
            },
            second_group: {
                type: "view",
                style: {
                    backgroundColor: "#fff",
                    paddingLeft: 14,
                },
                root: ["category_wrapper",  "deadline_wrapper","submitIcon"]
            },
            category_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 14,
                    borderBottom: "1px solid #eee",
                    borderTop: "1px solid #eee"
                },
                root: ["category_title", "category_value","category_icon"]
            },
            category_title: {
                type: "text",
                text: "选择清单",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            category_value: {
                type: "text",
                ref:true,
                text: "收集箱",
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                }
            },
            category_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            remindtime_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 14,
                    borderBottom: "1px solid #eee"
                },
                root: ["remindtime_title", "remindtime_value", "remindtime_icon"]
            },
            remindtime_title: {
                type: "text",
                text: "提醒时间",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            remindtime_value: {
                ref: true,
                type: "text",
                text: "",
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                }
            },
            remindtime_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            deadline_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 14,
                    borderBottom: "1px solid #eee"
                },
                root: ["deadline_title", "deadline_value","deadline_icon"]
            },
            deadline_title: {
                type: "text",
                text: "到期时间",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            deadline_value: {
                ref: true,
                type: "text",
                text: deadlineStr,
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                }
            },
            deadline_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            important_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 14
                },
                root: ["important_title", "important_switch_wrapper"]
            },
            important_title: {
                type: "text",
                text: "标记重要",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            important_switch_wrapper: {
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                },
                root: ["important_value"]
            },
            important_value: {
                ref: true,
                type: "switch",
                selectedBackgroundColor: c.mainColor,
                style: {
                    width: 58,
                    height: 30
                }
            },
            rmark_textarea: {
                ref: true,
                type: "textarea",
                placeholder: "备注",
                style: {
                    marginTop: 10,
                    fontSize: 14,
                    paddingLeft: 14,
                    paddingRight: 14,
                    paddingTop: 14,
                    backgroundColor: "#fff",
                    height: 130
                }
            }



        },

    };

    return Re;
});
