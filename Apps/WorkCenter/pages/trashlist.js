/**
 * 回收站列表
 **/
define(["../logic/trashlist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
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
                    display: 'none'
                }
            },
            ToolBar: {
                type: "view",
                className: "displaynone",
                style: {
                    flexDirection: "row",
                    height: 50,
                    justifyContent:"center",
                    backgroundColor: "#fff",
                    borderTop: "1px solid #eee",
                    alignItems: "center"
                },
                root: ["selectedAll","emptyview", "recoverBtn"]
            },
            emptyview:{
                type:"view",
                style:{
                    flex:1
                }
            },
            selectedAll: {
                type: "radiobox",
                text: "全选",
                style: {
                    fontSize: 15,
                    width:70,
                    marginLeft:10,
                },
                textStyle: {
                    marginLeft: 8
                }
            },
            recoverBtn: {
                type: "text",
                text: "还原",
                style: {
                    width:90,
                    justifyContent: "center",
                    fontSize: 15,
                    marginRight:10,
                    padding: "3 15",
                    borderRadius: 5,
                    border: "1px solid #EEEEEE",
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
                    width: 40
                },
                // groupKey: "completedDate",
                // groupHeaderStyle: {
                //     height: 30,
                //     justifyContent: "center",
                //     alignItems: "center",
                //     backgroundColor: "#F2F3F4"
                // }, //
                // groupHeader: ["list_group_headertitle"],
                autoLoadData: true,
                ajaxConfig: {
                    url: "/main/getTasksByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                        code: 998,
                        order: 1000
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
                font: "wc_e90f",
                iconStyle:{
                    fontSize:80,
                    color:"#CCCCCC"
                },
                text:"回收站暂无内容",
                textPos:"bottom",
                textStyle:{
                    marginTop:5,
                    fontSize:15,
                    color:"#999999"
                },
            },
            // list_group_headertitle: {
            //     type: "text",
            //     style: {
            //         fontSize: 13,
            //     },
            //     text_bind: "completedDate"
            // },
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
                    flex: 1,
                    opacity: 0.5,
                    justifyContent: "center",
                },
                root: ["row_title", "row_center_wrapper"]
            },
            row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    paddingBottom: 5,
                    fontSize: 15,
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
                text_bind: "endTime",
                style: {
                    color: "#999",
                    fontSize: 13
                }
            },
            row_right: {
                type: "view",
                style: {
                    width: 50,
                    opacity: 0.5,
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
            },
            //end listview
            addInputWrapper: {
                type: "view",
                style: {
                    height: 50,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    borderTop: "1px solid #f1f1f1",
                    alignItems:"center"
                },
                root: ["dateIcon", "addInput","sureIcon"]
            },
            dateIcon: {
                type: "icon",
                font: "wc_e913",
                iconStyle:{
                    fontSize:28
                },
                style: {
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#bbbbbb"
                },

            },
            // addInputBlock: {
            //     type: "view",
            //     style: {
            //         flex: 1,
            //         height: 50,
            //         paddingTop:10,
            //         paddingBottom:10,
            //         paddingRight:10,
            //         backgroundColor: "#fff",
            //         flexDirection: "row",
            //     },
            //     root: ["addInput"]
            // },
            addInput: {
                type: "input",
                placeholder: "添加任务...",
                isInForm: true,
                style: {
                    flex: 1,
                    height: 30,
                    marginRight:10,
                    fontSize: 16,
                    paddingLeft:10,
                    borderRadius: "5px",
                    color: "#BBBBBB",
                    backgroundColor:"#F2F3F4"
                }
            },
            sureIcon: {
                type: "text",
                text: "添加",
                style: {
                    width: 50,
                    fontSize:16,
                    paddingRight:10,
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#37B7FD"
                }

            }

        },

    };

    return Re;
});
