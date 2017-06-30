/**
 * 最近七天列表
 **/

define(["../logic/recentlylist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["testEditor", "segment_filter","page_content", "ToolBar", "morePopover", "addInputWrapper"],
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
                    borderLeft: "1px solid #ccc"
                },
                root: ["selectedAll", "completeBtn", "setImportantBtn", "moreBtn"]
            },
            selectedAll: {
                type: "radiobox",
                text: "全选",
                style: {
                    flex: 1,
                    fontSize: 15,
                    justifyContent: "center",
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
                    borderBottom:"1px solid #EEEEEE",
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
              ref:true,
                type: "view",
                style: {
                    flex: 1
                },
                root: ["todo_listview","completeListBtn","haddone_listview"]
            },
            //start listview
            todo_listview: {
                type: "listview",
                selectedMode: "m",
                otherGroupName:"收集箱",
                groupKey: "endTimeStr",
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
                        order: 1000,
                        code: 1001
                    }
                },
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    borderBottom: "1px solid #eee",
                    height:"70"
                },
                root: ["row_radiobox_wraper", "row_checkbox_wrapper", "row_main_wrapper"]
            },
            nodata:{
                type:"view",
                style:{
                    flexDirection:"column",
                    alignItems:"center",
                    justifyContent: "center",
                    marginTop:150
                },
                root:["nodata_image"]
            },
            nodata_image:{
                type:"icon",
                iconStyle:{
                    w:80
                },
                text:"最近未创建任务,赶紧去行动吧",
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
            list_group_headertitle: {
                type: "text",
                style: {
                    fontSize: 13,
                },
                text_bind: "endTimeStr"
            },
            row_main_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "center",
                    flex: 1,
                },
                root: ["row_left", "row_right"]
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
                    fontSize: 15,
                    width:"100%",
                    marginTop:12,
                    marginBottom:2,
                    color: "#333333"
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
                root: ["row_team", "row_endTime"]
            },
            row_team: {
                type: "icon",
                font: "wc_e91b",
                iconStyle:{
                    color:"#BBBBBB",
                    marginRight:5,
                    marginTop:3,
                    marginLeft:20,
                    fontSize:14
                },
            },
            row_endTime:{
                type: "text",
                text_bind: "limitTime",
                style: {
                    paddingBottom: 4,
                    fontSize: 13,
                    marginTop: 1,
                    width:"100%",
                    color: "#FD6D78"
                },
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
                    width: "100%",
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
                    borderTop: "1px solid #f1f1f1"
                },
                root: ["dateIcon", "addInputBlock","sureIcon"]
            },
            dateIcon: {
                type: "icon",
                font: "wc_e913",
                className:"wc-date-icon",
                text:"",
                textStyle:{
                    position:"absolute",
                    top:20,
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
            addInputBlock: {
                type: "view",
                style: {
                    flex: 1,
                    height: 50,
                    paddingTop:10,
                    paddingBottom:10,
                    paddingRight:10,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                },
                root: ["addInput"]
            },
            addInput: {
                type: "input",
                placeholder: "添加任务...",
                isInForm: true,
                style: {
                    flex: 1,
                    height: 30,
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
                },

            },

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
              ref:true,
                type: "listview",
                selectedMode: "m",
                autoLoadData: false,
                ajaxConfig: {
                    url: "/main/getTasksByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                        order: 1001,
                        code: 1001001
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
                root: ["haddone_row_checkbox_wrapper", "haddone_row_main_wrapper"]
            },
            haddone_row_checkbox_wrapper: {
                type: "view",
                disableParentSelect: true,
                root: ["haddone_row_checkbox"],
                ref: true,
                style: {
                    justifyContent: "center",
                    overflow: "hidden",
                    alignItems: "center",
                    width: 50,
                },
            },
            haddone_row_checkbox: {
                type: "checkbox",
                selectedStyle:{
                    backgroundColor:"#ccc",
                    border:"1px solid #ccc",
                },
            },
            haddone_row_main_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    justifyContent: "center",
                    flex: 1,
                },
                root: ["haddone_row_left", "haddone_row_right"]
            },
            haddone_row_left: {
                type: "view",
                style: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start"
                },
                root: ["haddone_row_title","haddone_row_leftDown"]
            },
            haddone_row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    marginTop:12,
                    marginBottom:2,
                    fontSize: 15,
                    width:"100%",
                    color: "#333333"
                },
            },
            haddone_row_leftDown:{
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-start"
                },
                root: ["haddone_row_team", "haddone_row_endTime"]
            },
            haddone_row_team: {
                type: "icon",
                font: "wc_e91b",
                iconStyle:{
                    color:"#BBBBBB",
                    marginRight:5,
                    marginTop:3,
                    marginLeft:20,
                    fontSize:14
                },
            },
            haddone_row_endTime:{
                type: "text",
                text_bind: "endTime",
                style: {
                    paddingBottom: 4,
                    fontSize: 13,
                    marginTop: 1,
                    width:"100%",
                    color: "#999"
                },
            },
            haddone_row_right: {
                type: "view",
                style: {
                    width: 50,
                    justifyContent: "center",
                    alignItems: "center"
                },
                root: ["haddone_row_flag"]
            },
            haddone_row_flag: {
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

        },

    };

    return Re;
});
