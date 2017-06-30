/**
 * 今日列表、重要列表、全部列表
 **/

define(["../logic/todaylist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["testEditor", "addInputWrapper", "page_content", "ToolBar", "morePopover"],
        components: {
            testEditor: {
                type: "button",
                title: "编辑",
                mode: 2,
                style: {
                    display: 'none'
                }
            },
            addInputWrapper: {
                type: "view",
                style: {
                    height: 50,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    borderBottom:"1px solid #eee"
                },
                root: ["addIcon", "addInput"]
            },
            addIcon: {
                type: "icon",
                font: "todo_e902",
                style: {
                    width: 50,
                    fontSize: 35,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#9097ff"
                },

            },
            addInput: {
                type: "input",
                placeholder: "输入清单内容",
                isInForm: true,
                style: {
                    flex: 1,
                    height: 50,
                    fontSize: 16
                }
            },
            ToolBar: {
                type: "view",
                className: "displaynone",
                style: {
                    flexDirection: "row",
                    height: 50,
                    backgroundColor: "#fff",
                    borderTop: "1px solid #eee",
                    alignItems: "center"
                },
                splitStyle: {
                    height: 15,
                    borderLeft: "1px solid #eee"
                },
                root: ["selectedAll", "completeBtn", "setImportantBtn", "moreBtn"]
            },
            selectedAll: {
                type: "radiobox",
                text: "全选",
                style: {
                    flex: 1,
                    fontSize: 15,
                    justifyContent: "flex-start",
                    marginLeft:9
                },
                textStyle: {
                    marginLeft: 8
                }
            },
            completeBtn: {
                type: "text",
                text: "完成本单",
                style: {
                    flex: 1,
                    height: 48,
                    justifyContent: "center",
                    fontSize: 15,
                    color: c.mainColor
                }
            },
            setImportantBtn: {
                type: "text",
                text: "标记重要",
                style: {
                    flex: 1,
                    justifyContent: "center",
                    fontSize: 15,
                    height: 48,
                    color: c.mainColor
                }
            },
            moreBtn: {
                type: "icon",
                font: "icomoon_e90d",
                style: {
                    flex: 1,
                    height: 48,
                    justifyContent: "center",
                    fontSize: 18,
                    color: c.mainColor
                }
            },

            morePopover: {
                type: "popover",
                root: ["moreRepeat"],
                animate: {
                    mode: "2"
                },
                bkCoverStyle: {
                    backgroundColor: "rgba(230, 230, 230, 0.2)"
                },
                offset: {
                    x: 10
                },
                arrowStyle: {
                    backgroundColor: "#fff",
                    zIndex: 2,
                    "-webkit-box-shadow": "9px 8px 13px #9C9C9C",
                    "box-shadow": "9px 8px 13px #9C9C9C",
                },
                style: {
                    "-webkit-box-shadow": "0px 8px 13px #9C9C9C",
                    "box-shadow": "0px 8px 13px #9C9C9C",
                    width: 90,
                    backgroundColor: "#fff",
                    height: "80",
                    paddingTop: 5,
                    paddingBottom: 4,
                    borderRadius: "7px"
                }
            },
            moreRepeat: {
                type: "repeat",
                items: [{
                    title: "移动至"
                }, {
                    title: "删除"
                }],
                root: ["moreRepeat_icon"],
                style: {
                    flexDirection: "column",
                    flex: 1
                },
                itemStyle: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "stretch"
                }
            },
            moreRepeat_icon: {
                type: "icon",
                text: "",
                text_bind: "title",
                style: {
                    flex: 1
                },
                textStyle: {
                    fontSize: 16,
                    color: "#292f33"
                }
            },


            page_content: {
                type: "view",
                style: {
                    flex: 1
                },
                root: ["todo_listview"]
            },
            //start listview
            todo_listview: {
                type: "listview",
                selectedMode: "m",
                isCanCollapse:true,
                groupKey: "className",
                leftBlock: {
                    key: "row_radiobox_wraper",
                    width: 40
                },
                groupHeaderStyle: {
                    height: 34,
                    paddingLeft: 10,
                    alignItems: "center",
                    backgroundColor: "#F2F3F4"
                },
                groupHeader: ["list_group_headertitle"],
                autoLoadData: true,
                ajaxConfig: {
                    url: "/list/getListByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                        pageNo: 1,
                        code: 1003
                    }
                },
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    borderBottom:"1px solid #EEEEEE"
                },
                root: ["row_radiobox_wraper", "row_checkbox_wrapper", "row_main_wrapper"]
            },
            nodata:{
                type:"view",
                style:{
                    flexDirection:"column",
                    alignItems:"center",
                    flex:500,
                    justifyContent: "center"

                },
                root:["nodata_image"]
            },
            nodata_image:{
                type:"icon",
                iconStyle:{
                    width:70,
                    height:80
                },
                text:"今日未创建清单,赶紧去行动吧",
                textPos:"bottom",
                textStyle:{
                    marginTop:16,
                    fontSize:15,
                    color:"#999999"
                },
                src:"./imgs/space_tips.png"
            },
            row_checkbox_wrapper: {
                type: "view",
                disableParentSelect: true,
                root: ["row_checkbox"],
                ref: true,
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 54,
                },
            },
            row_checkbox: {
                type: "checkbox",
                selectedStyle:{
                    backgroundColor:"#ccc",
                    border:"1px solid #ccc",
                },
            },
            row_radiobox_wraper: {
                type: "view",
                root: ["row_radiobox"],
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 0,
                },
            },
            row_radiobox: {
                type: "radiobox"
            },

            row_main_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    flex: 1
                },
                root: ["row_left", "row_right"]
            },
            row_left: {
                type: "view",
                style: {
                    flex: 1,
                    paddingLeft: 5
                },
                root: ["row_title", "row_time"]
            },
            row_title: {
                type: "text",
                text_bind: "content",
                numberofline: 1,
                style: {
                    paddingTop: 16,
                    paddingBottom: 4,
                    fontSize: 14,
                    color: "#333"
                },
            },
            list_group_headertitle: {
                type: "text",
                style: {
                    fontSize: 13
                },
                text_bind: "className"
            },
            row_time: {
                type: "text",
                text_bind: "endTime",
                style: {
                    paddingTop: 2,
                    paddingBottom: 10,
                    color: "#999",
                    fontSize: 13
                }
            },
            row_right: {
                type: "view",
                style: {
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["row_flag"]
            },
            row_flag: {
                type: "icon",
                font: "todo_e906",
                disableParentSelect: true,
                selectedClassName: "flag-selected",
                iconStyle: {
                    color: "#CCCCCC"
                }
            }
            //end listview

        },

    };

    return Re;
});
