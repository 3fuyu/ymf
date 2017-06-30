/**
 * Created by Gin on 17/3/7.
 */

define(["../logic/subformDetail", "../parts/common"], function (pluginClass, c) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["body"],
        components: {
            body:{
                type:"view",
                root:["detail_repeat","subform_repeat"],
                style:{
                    "flex-direction": "column"
                }
            },

            subform_repeat: {
                type: "repeat",
                ref: true,
                root: ["subform_view"],
                style: {
                    display: "inline",
                    width: "100%",
                    backgroundColor: "#fff",
                },
                itemStyle: {
                    borderBottom: "solid 1px #EDEDED",
                    minHeight: 40,
                    flexDirection: "row"
                }
                // items:[{title:"a",item:[{name:"1"},{name:"2"}]}]
            },
            subform_view: {
                type: "view",
                root: ["subform_view_title", "subform_view_item"],
                style: {
                    flexDirection: "column",
                    width: "100%"
                }
            },
            subform_view_title: {
                type: "text",
                text_bind: "title",
                preText: "1",
                preTextStyle: {
                    backgroundColor: "#F39801",
                    color: "rgb(255, 255, 255)",
                    borderRadius: "50%",
                    fontSize: 12,
                    w: 15,
                    lineHeight: 14,
                    marginRight: 4,
                    textAlign: "center"
                },
                style: {
                    backgroundColor: "rgb(251,251,251)",
                    color: "#9E9E9E",
                    fontSize: 13,
                    paddingLeft: 14,
                    height: 40
                }
            },
            subform_view_item: {
                type: "repeat",
                root: ["subform_view_item_title", "subform_view_item_content"],
                style: {
                    display: "inline",
                    width: "100%",
                    backgroundColor: "#fff"
                },
                itemStyle: {
                    minHeight: 30,
                    flexDirection: "row"
                }
            },
            subform_view_item_title: {
                type: "text",
                text_bind: "name",
                style: {
                    color: "#9E9E9E",
                    fontSize: 13,
                    paddingLeft: 14
                }
            },
            subform_view_item_content: {
                type: "text",
                text_bind: "content",
                style: {
                    color: "#262626",
                    fontSize: 13
                }
            },
            detail_repeat: {
                type: "repeat",
                ref: true,
                root: ["detail_view"],
                style: {
                    display: "inline",
                    width: "100%",
                    backgroundColor: "#fff",
                    marginTop: 10
                },
                itemStyle: {
                    borderBottom: "solid 1px #EDEDED",
                    minHeight: 40,
                    flexDirection: "row",
                    widht: "100%"
                }
                // items: [{title: "标题1", content: "内容11"}, {title: "标题2", content: "内容2"}, {title: "标题3", content: "内容3"}]
            },
            detail_view: {
                type: "view",
                root: ["detail_item_title", "detail_item_content", "detail_item_files"],
                style:{
                    flexDirection: "row",
                    width:"100%"
                }
            },
            detail_item_title: {
                type: "text",
                text: "title:",
                text_bind: "title",
                style: {
                    color: "#9E9E9E",
                    fontSize: 13,
                    paddingLeft: 14,
                    paddingRight: 20,
                    widht: "100%"
                }
            },
            detail_item_content: {
                type: "text",
                text: "content",
                text_bind: "content",
                numberofline: 1,
                style: {
                    flex:1,
                    color: "#262626",
                    fontSize: 13
                }
            },
            detail_item_files: {
                type: "repeat",
                ref: true,
                root: ["detail_files_view"],
                style: {
                    display: "inline",
                    width: "100%",
                    backgroundColor: "#fff"
                },
                itemStyle: {
                    height: 40,
                    flexDirection: "row"
                }
            },
            detail_files_view: {
                type: "view",
                style: {
                    flexDirection: "row",
                    width: "100%"
                },
                root: ["detail_files_view_left", "detail_files_view_right"]
            },
            detail_files_view_left: {
                type: "image",
                style: {
                    w: 34,
                    margin: "4px 8px 0 10px",
                },
                src: "./imgs/link.png"
            },
            detail_files_view_right: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    flex: 1,
                    color: "#262626",
                    fontSize: 13,
                    paddingRight:10
                }
            }
        }
    };
    return Re;
});