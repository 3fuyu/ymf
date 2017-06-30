/**
 * 用户自定义的分类列表
 **/
define(["../logic/filterlist", "../parts/common", 'utils'], function(pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["testEditor", "page_segment", "page_content", "ToolBar", "morePopover", "addInputWrapper"],
        components: {
            testEditor: {
                type: "button",
                title: "编辑",
                mode: 2,
                style: {
                    display: 'none'
                }
            },
            page_segment: {
                type: "segment_android",
                items: [{
                    title: "按创建时间",
                    key: "new_wrapper"
                }, {
                    title: "按到期时间",
                    key: "recommend_wrapper"
                }, {
                    title: "按字母",
                    key: "hot_wrapper"
                }],
                root: ["segment_android_item"],
                itemSelectedClassName: "todo-sgm-selected",
                indicatorStyle: {
                    backgroundColor: c.mainColor
                },
                style: {
                    backgroundColor: "#fff",
                    height: 45
                }
            },
            segment_android_item: {
                type: "text",
                text_bind: "title",
                style: {
                    color: c.labelColor,
                    fontSize: 15
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
                    marginTop: 10
                },
                root: ["todo_listview","completeListBtn","haddone_listview"]
            },
            //start listview
            todo_listview: {
                type: "listview",
                selectedMode: "m",
                leftBlock: {
                    key: "row_radiobox_wraper",
                    width: 40
                },
                autoLoadData: false,
                ajaxConfig: {
                    url: "/main/getTasksByCondition",
                    type: "GET",
                    pageSize: 20,
                    pageNumKey: "pageNo",
                    data: {
                      completed:0
                    }
                },
                nodata:"nodata",
                rowStyle: {
                    flexDirection: "row",
                    alignItems: "stretch",
                    height:"70",
                    borderBottom:"1px solid #EEEEEE",
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
                text:"您还未创建任务,赶紧行动吧",
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
                root: ["row_left", "row_right"]
            },
            row_left: {
                type: "view",
                style: {
                    flex: 1,
                },
                root: ["row_title", "row_leftDown"]
            },
            row_title: {
                type: "text",
                text_bind: "name",
                numberofline: 1,
                style: {
                    paddingTop: 13,
                    paddingBottom: 4,
                    fontSize: 15,
                    color: "#333333"
                },
            },
            row_leftDown:{
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
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
                    paddingTop: 1,
                    fontSize:14
                },
            },
            row_time: {
                type: "text",
                text_bind: "endTime",
                style: {
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

            //查看已完成
            completeListBtn: {
                type:"text",
                ref:true,
                text:"查看已完成",
                className:"displaynone",
                style: {
                    justifyContent: "center",
                    fontSize: 14,
                    width: "40%",
                    margin:"20 auto",
                    color: "#666666",
                    paddingTop:"5",
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
                        order: 1001,
                        pageSize: 20,
                        completed:1
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
                root: ["row_radiobox_wraper", "row_checkbox_wrapper", "row_main_wrapper"]
            },

        },

    };

    return Re;
});
