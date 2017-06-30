/**
 * 首页的上下分类
 **/
define(["../logic/index", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content", "createIcon", "createDialog","folder_poplayer","billitem_poplayer"],
        components: {
            createDialog: {
                type: "poplayer",
                mode: "top",
                bkCoverStyle: {
                    backgroundColor: "rgba(0, 0, 0, 0.63)"
                },
                root: ["create_textArea",  "selector_wrapper", "create_bottombar",],
                style: {
                    height: "auto",
                    width: "100%",
                    backgroundColor: "#f0f4f6",
                    flexDirection: "column"
                }
            },

            //selector_div: {
            //    type: "view",
            //    style: {
            //        marginLeft:16,
            //        backgroundColor: '#eeee',
            //        height: 1,
            //    },
            //},

            create_textArea: {
                type: "textarea",
                style: {
                    height: 240,
                    padding:16
                },
            },
            selector_wrapper: {
                type: "view",
                style: {
                    marginTop:1,
                    backgroundColor: '#fff',
                    height: 50,
                    flexDirection: "row"
                },
                root: ["selector_label", "selector_icon"]
            },

            selector_label: {
                type: 'text',
                text: "选择清单",
                style: {
                    fontSize:16,
                    width: 100,
                    marginLeft: 10,
                }
            },
            selector_icon: {
                type: "icon",
                text: "111",
                font: "icomoon_e901",
                textPos: "left",

                style: {
                    flex: 1,
                    marginRight: 10,
                    justifyContent: "flex-end"
                }
            },
            create_bottombar: {
                type: "view",
                style: {
                    height: 50,
                    backgroundColor: "#eee",
                    flexDirection: "row"
                },
                root: ["calendar_icon", "flag_icon", "empty_view", "complete_btn"]
            },
            calendar_icon: {
                type: "icon",
                font: "icomoon_e904",
                style: {
                    width: 50
                }
            },
            flag_icon: {
                type: "icon",
                font: "icomoon_e904",
                style: {
                    width: 50
                }
            },

            empty_view: {
                type: "view",
                style: {
                    flex: 1
                }
            },
            complete_btn: {
                type: "text",
                text: "完成",
                style: {
                    width: 50
                }
            },

            createIcon: {
                type: "icon",
                text: "新建任务",
                font: "icomoon_e904",
                style: {
                    height: 50,
                    borderTop: "1px solid #eee",
                    backgroundColor: "#fff"
                },
                textStyle: {
                    fontSize: 16,
                    marginLeft: 4,
                    color: c.mainColor
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
                    overflowY: "auto"
                },
                root: ["first_repeat", "mid_label", "folderlist","addlistbtn", "bottom_label", "bottom_repeat"]
            },
            first_repeat: {
                type: "repeat",
                ref: true,
                root: ["first_repeat_label", "first_repeat_val"],
                itemStyle: {
                    flexDirection: "row",
                    height: 50,
                    borderBottom: "1px solid #eee"
                },
                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff",
                }
            },
            first_repeat_label: {
                type: "icon",
                font_bind: "icon",
                text_bind: "label",
                iconStyle_bind: {
                    color: "color"
                },
                iconStyle: {
                    fontSize: 18
                },
                textStyle: {
                    fontSize: 16,
                    marginLeft: 12
                },
                style: {
                    flex: 1,
                    justifyContent: "flex-start",
                    marginLeft: 15,
                    fontSize: 16,
                    color: c.titleColor
                }
            },
            first_repeat_val: {
                type: "text",
                text_bind: "count",
                style: {
                    flex: 1,
                    marginRight: 15,
                    justifyContent: "flex-end",
                    color: "#999",
                    fontSize: 15
                }
            },
            mid_label: {
                type: "text",
                text: "",
                style: {
                    height: 10,
                    paddingLeft: 10,
                    fontSize: 14,
                    backgroundColor: "#F2F3F4",
                    color: "#666"
                }
            },
            folderlist: {
                type: "folderlist",
                className:"wc_folderlist",
                ref: true,
                style:{

                }
            },
            addlistbtn:{
              type:"icon",
              font:"wc_e90a",
              text:"创建清单",
              textStyle:{
                fontSize:16,
                marginLeft:12
              },
              iconStyle:{
                fontSize:19
              },
              style:{
                height:50,
                color:"#37B7FD",
                paddingLeft:15,
                backgroundColor:"#fff",
                justifyContent:"flex-start"
              }
            },
            bottom_label: {
                type: "text",
                text: "",
                style: {
                    height: 10,
                    paddingLeft: 10,
                    fontSize: 14,
                    backgroundColor: "#F2F3F4",
                    color: "#666"
                }
            },
            bottom_repeat: {
                type: "repeat",
                ref: true,
                root: ["bottom_repeat_label", "bottom_repeat_val"],
                itemStyle: {
                    flexDirection: "row",
                    height: 50,
                    borderBottom: "1px solid #eee"
                },
                style: {
                    flexDirection: "column",
                    backgroundColor: "#fff"
                }
            },
            bottom_repeat_label: {
                type: "icon",
                font_bind: "icon",
                text_bind: "label",
                iconStyle_bind: {
                    color: "color"
                },
                iconStyle: {
                    fontSize: 18
                },
                textStyle: {
                    fontSize: 16,
                    marginLeft: 12
                },
                style: {
                    flex: 1,
                    justifyContent: "flex-start",
                    marginLeft: 15,
                    fontSize: 16,
                    color: c.titleColor
                }
            },
            bottom_repeat_val: {
                type: "text",
                text_bind: "count",
                style: {
                    flex: 1,
                    marginRight: 10,
                    justifyContent: "flex-end",
                    color: "#999",
                    fontSize: 15
                }
            },


            folder_poplayer:{
                type:"poplayer",
                mode:"bottom",
                bkCoverStyle:{
                    backgroundColor:"rgba(0, 0, 0, 0.5)"
                },
                style:{
                    width:"100%",
                    fontSize:16,
                    backgroundColor:"#f0f4f6",
                    flexDirection:"column"
                },
                root:["folder_rename_btn","folder_jiechu_btn","folder_sort_btn","folder_cancel_btn"]
            },
            folder_rename_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center"
                },
                text:"重命名"
            },
            folder_sort_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center",
                    borderTop:"1px solid #eee"
                },
                text:"排序"
            },
            folder_cancel_btn:{
                type:"text",
                text:"取消",
                style:{
                    height:45,
                    marginTop:10,
                    backgroundColor:"#fff",
                    justifyContent:"center"
                }
            },
            folder_jiechu_btn:{
                type:"text",
                text:"解除组合",
                style:{
                    height:45,
                    color:"red",
                    borderTop:"1px solid #eee",
                    backgroundColor:"#fff",
                    justifyContent:"center"
                }
            },



            billitem_poplayer:{
                type:"poplayer",
                mode:"bottom",
                bkCoverStyle:{
                    backgroundColor:"rgba(0, 0, 0, 0.63)"
                },
                style:{
                    width:"100%",
                    fontSize:16,
                    backgroundColor:"#f0f4f6",
                    flexDirection:"column"
                },
                root:["billitem_rename_btn","billitem_del_btn","billitem_sort_btn","billitem_moveto_btn","billitem_cancel_btn"]
            },
            billitem_rename_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center"
                },
                text:"重命名"
            },
            billitem_sort_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center",
                    borderTop:"1px solid #eee"
                },
                text:"排序"
            },
            billitem_moveto_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center",
                    borderTop:"1px solid #eee"
                },
                text:"移动至"
            },
            billitem_cancel_btn:{
                type:"text",
                text:"取消",
                style:{
                    height:45,
                    marginTop:10,
                    backgroundColor:"#fff",
                    justifyContent:"center"
                }
            },
            billitem_del_btn:{
                type:"text",
                text:"删除",
                style:{
                    height:45,
                    color:"red",
                    borderTop:"1px solid #eee",
                    backgroundColor:"#fff",
                    justifyContent:"center"
                }
            },


            add_list_input: {
                type: "input",
                ref: true,
                placeholder: "输入清单名称",
                style: {
                    width: "88%",
                    paddingLeft: 10,
                    margin: "auto",
                    fontSize: 16,
                    height: 45,
                    border: "none",
                    backgroundColor: "#F2F3F4",
                    borderRadius: "4px",
                    marginBottom:15
                }
            }





        },

    };
    return Re;
});
