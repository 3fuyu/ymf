/**
 * 已完成列表
 **/
define(["../logic/donelist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["testEditor", "page_content", "ToolBar"],
        components: {
            testEditor: {
                type: "button",
                title: "编辑",
                mode: 2,
                style: {
                    display:"none",
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
                root: ["selectedAll", "completeBtn", "moveToBtn"]
            },
            selectedAll: {
                type: "radiobox",
                text: "全选",
                style: {
                    flex: 1,
                    fontSize: 15,
                    justifyContent: "flex-start",
                    paddingLeft:14

                },
                textStyle: {
                    marginLeft: 8
                }
            },
            completeBtn: {
                type: "text",
                text: "转待办",
                style: {
                    flex: 1,
                    height: 48,
                    justifyContent: "center",
                    fontSize: 15,
                    color: c.mainColor
                }
            },
            moveToBtn: {
                type: "text",
                text: "移动",
                style: {
                    flex: 1,
                    justifyContent: "center",
                    fontSize: 15,
                    height: 48,
                    color: c.mainColor
                }
            },
            page_content: {
                type: "view",
                style: {
                    flex: 1,
                    marginTop: 10
                },
                root: ["todo_listview"]
            },
            //start listview
            todo_listview: {
                type: "listview",
                selectedMode: "m",
                leftBlock: {
                    key: "row_radiobox_wraper",
                    width: 50
                },
                groupKey: "completedDate",
                groupHeaderStyle: {
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f0f4f6"
                },
                groupHeader: ["list_group_headertitle"],
                autoLoadData: true,
                ajaxConfig: {
                    url: "/main/getTasksByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                        code:1004,
                        order:1001,
                        pageSize: 20
                    }
                },
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    height: 73,
                    borderBottom:"1px solid #EEEEEE",
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
                    w:80
                },
                text:"您还没有已完成任务，赶紧去行动吧",
                textPos:"bottom",
                textStyle:{
                    marginTop:16,
                    fontSize:15,
                    color:"#999999"
                },
                src:"./imgs/notask@2x.png"
            },
            list_group_headertitle: {
                type: "text",
                style: {
                    fontSize: 14,
                },
                text_bind: "completedDate"
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
                    width: 50,
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
                    height:70,
                    flex: 1,
                    justifyContent: "center",
                },
                root: ["row_title", "row_center_wrapper"]
            },
            row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    paddingTop: 5,
                    paddingBottom: 5,
                    fontSize: 16,
                    color: "#333333"
                },
            },
            row_center_wrapper:{
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "stretch"
                },
                root: ["row_time"]
            },
            row_time: {
                type: "text",
                text_bind: "completedTime",
                style: {
                    display:"none",
                    color: "#999",
                    fontSize: 14
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
                font: "wc_e90c",
                disableParentSelect: true,
                selectedClassName: "flag-selected",
                iconStyle: {
                    color: "#CCCCCC"
                },
                style:{
                    width: "inherit",
                    height: "76"
                }
            }
            //end listview

        },

    };

    return Re;
});
