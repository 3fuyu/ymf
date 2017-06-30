/**
 * 今日列表、重要列表、全部列表
 **/

define(["../logic/todaylist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["testEditor","segment_filter", "page_content", "ToolBar", "morePopover", "addInputWrapper"],
        components: {
            testEditor: {
                type: "button",
                title: "编辑",
                mode: 2,
                style: {
                    display: 'none'
                }
            },
            segment_filter:{
                type:"segment_android",
                items:[
                    {title:"按到期时间"},
                    {title:"按创建时间"},
                    {title:"按清单"},
                    {title:"按字母"}
                ],
                root:["segment_filter_item"],
                style:{
                    height:45,
                    backgroundColor: "#fff"
                }
            },
            segment_filter_item:{
                type:"text",
                text:"test",
                text_bind:"title",
                selectedClassName:"yy-sgm-item-selected-android",
                style:{color:"#8899a6",fontSize:15}
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
                    title: "移除"
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
                ref:true,
                style: {
                    flex: 1,
                    marginTop:10
                },
                root: ["todo_listview","completeListBtn","haddone_listview"]
            },
            list_group_headertitle: {
                type: "text",
                style: {
                    fontSize: 13,
                },
                text_bind: "listName"
            },
            //start listview
            todo_listview: {
                type: "listview",
                selectedMode: "m",
                isCanCollapse:false,
                otherGroupName:"收集箱",
                leftBlock: {
                    key: "row_radiobox_wraper",
                    width: 40
                },
                 groupHeaderStyle: {
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#F2F3F4"
                }, //
                groupHeader: ["list_group_headertitle"],
                autoLoadData: true,
                ajaxConfig: {
                    url: "/main/getTasksByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                        order: 1001,
                        code: 1000
                    }
                },
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    height:"70",
                    borderBottom:"1px solid #EEEEEE"
                },

                root: ["row_radiobox_wraper", "row_checkbox_wrapper", "row_main_wrapper"]
            },
            nodata:{
                type:"view",
                style:{
                    flexDirection:"column",
                    alignItems:"center",
                    justifyContent: "center"

                },
                root:["nodata_image"]
            },
            nodata_image:{
                type:"icon",
                style:{
                    marginTop:150
                },
                iconStyle:{
                    w:80
                },
                text:"今日未创建任务,赶紧去行动吧",
                textPos:"bottom",
                textStyle:{
                    marginTop:16,
                    fontSize:15,
                    color:"#999999"
                },
                src:"./imgs/notask@2x.png"
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
                root: ["row_left", "row_flag"]
            },
            row_left: {
                type: "view",
                style: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start"
                },
                root: ["row_title","row_leftDown"]
            },
            row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    paddingTop:12,
                    paddingBottom:3,
                    fontSize: 15,
                    color: "#333"
                },
            },
            row_leftDown:{
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start"
                },
                root: ["row_team", "row_time"]
            },
            row_team: {
                type: "icon",
                font: "wc_e91b",
                iconStyle:{
                    color:"#BBBBBB",
                    marginRight:5,
                    marginTop:1,
                    fontSize:14
                },
            },
            row_time: {
                type: "text",
                text_bind: "endTime",
                style: {
                    color: "#999",
                    fontSize: 13
                }
            },
            // row_right: {
            //     type: "view",
            //     style: {
            //         width: 50,
            //         justifyContent: "center",
            //         alignItems: "center"
            //     },
            //     root: ["row_flag"]
            // },
            row_flag: {
                type: "icon",
                font: "wc_e90c",
                disableParentSelect: true,
                selectedClassName: "flag-selected",
                iconStyle: {
                    color: "#CCCCCC"
                },
                style:{
                    width: "50",
                    height: "76"
                }
            },


            //end listview

            completeListBtn: {
                type:"text",
                ref:true,
                text:"查看已完成",
                style: {
                    justifyContent: "center",
                    fontSize: 14,
                    margin:"10 auto",
                    color: "#666666",
                    paddingTop:"5",
                    width: "40%",
                    borderRadius:5,
                    paddingBottom:"5",
                    paddingLeft:"25",
                    paddingRight:"25",
                    backgroundColor:"#e6e7e8"
                },
            },
            haddone_listview: {
                type: "listview",
                selectedMode: "m",
                autoLoadData:false,
                leftBlock: {
                    key: "row_radiobox_wraper",
                    width: 40
                },
                ajaxConfig: {
                    url: "/main/getTasksByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                        order: 1000,
                        pageNo:1,
                        pageSize: 20,
                        code: 1000001
                    }
                },
                style: {
                    // display: "none"
                },
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    height:"70",
                    borderBottom:"1px solid #EEEEEE"
                },
                // root:[]
                root: ["done_row_radiobox_wraper", "done_row_checkbox_wrapper", "done_row_main_wrapper"]
            },
            done_row_checkbox_wrapper: {
                type: "view",
                disableParentSelect: true,
                root: ["done_row_checkbox"],
                ref: true,
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 50,
                },
            },
            done_row_checkbox: {
                type: "checkbox",
                selectedStyle:{
                    backgroundColor:"#ccc",
                    border:"1px solid #ccc",
                },
            },
            done_row_radiobox_wraper: {
                type: "view",
                root: ["row_radiobox"],
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 0,
                },
            },
            done_row_radiobox: {
                type: "radiobox"
            },

            done_row_main_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    flex: 1
                },
                root: ["done_row_left", "done_row_flag"]
            },
            done_row_left: {
                type: "view",
                style: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start",
                },
                root: ["done_row_title", "done_row_leftDown"]
            },
            done_row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    paddingTop:12,
                    paddingBottom:3,
                    fontSize: 15,
                    color: "#333"
                },
            },
            done_row_leftDown:{
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start"
                },
                root: ["done_row_team", "done_row_time"]
            },
            done_row_team: {
                type: "icon",
                font: "wc_e91b",
                iconStyle:{
                    color:"#BBBBBB",
                    marginRight:5,
                    marginTop:1,
                    fontSize:14
                },
            },
            done_row_time: {
                type: "text",
                text_bind: "endTime",
                style: {
                    color: "#999",
                    fontSize: 13
                }
            },
            // done_row_right: {
            //     type: "view",
            //     style: {
            //         width: 50,
            //         justifyContent: "center",
            //         alignItems: "center"
            //     },
            //     root: ["done_row_flag"]
            // },
            done_row_flag: {
                type: "icon",
                font: "wc_e90c",
                disableParentSelect: true,
                selectedClassName: "flag-selected",
                iconStyle: {
                    color: "#CCCCCC"
                },
                style:{
                    width: "50",
                    height: "76"
                }
            },


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
                className:"wc-date-icon",
                text:"",
                textStyle:{
                    position:"absolute",
                    top:8,
                    left:"50%",
                    color:"#0093ff",
                    fontSize:13

                },
                iconStyle:{
                    fontSize:24
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
                    color: "#333333",
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
