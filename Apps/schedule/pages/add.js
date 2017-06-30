
define(["../logic/add", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content","remind_radiolist","tips_poplayer"],
        components: {
            submitIcon: {
                type: "icon",
                text: "提交",
                style: {
                    marginTop:20,
                    marginBottom:20,
                    borderRadius:5,
                    height: 45,
                    backgroundColor: "#37b7fd",
                    marginRight:15,
                    marginLeft:15,
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
            remind_radiolist:{
                ref:true,
                type:"radiolist",
                primaryKey:"id",
                labelKey:"label"
            },
            page_content: {
                type: "view",
                style: {
                    flex: 1,
                    overflowY: "auto",
                    backgroundColor: "#f2f3f4",
                },
                root: ["theme_title","theme_title_input", "second_group","more_wrapper", "collapse_group","submitIcon"]
            },
            theme_title:{
                type:"view",
                style:{
                    flexDirection: "row",
                    height: 30,
                    lineHeight:"30px",
                    paddingRight: 15,
                    paddingLeft: 15,
                },
                root:["theme_title_name","theme_title_tips"]
            },
            theme_title_name:{
                type:"text",
                style:{
                    color:"#999999",
                    fontSize: 14
                },
                text:"主题"
            },
            theme_title_tips:{
                type:"text",
                ref: true,
                className:"displaynone",
                style:{
                    flex:1,
                    color:"#FF4E5B",
                    fontSize: 14,
                    justifyContent:"flex-end"
                },
                text:"超过50个字"
            },
            theme_title_input:{
                type: "textarea",
                ref:true,
                className:"theme_title_input",
                placeholder: "请输入日程主题(50个字以内)",
                style:{
                    height:50,
                    paddingRight:15,
                    paddingLeft:15,
                    backgroundColor:"#fff",
                    fontSize:14,
                    borderBottom:"1px solid #EBEFF4",
                    marginBottom:10
                }
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
            second_group: {
                type: "view",
                style: {
                    backgroundColor: "#fff",
                    paddingLeft: 14,
                },
                root: ["allDay_wrapper","startTime_wrapper","endTime_wrapper","participants_wrapper"]
            },
            allDay_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15,
                    borderBottom: "1px solid #eee"
                },
                root: ["allDay_title", "allDay_switch_wrapper"]
            },
            allDay_title: {
                type: "text",
                text: "全天日程",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            allDay_switch_wrapper: {
                type: "view",
                style: {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center"
                },
                root: ["allDay_value"]
            },
            allDay_value: {
                ref: true,
                type: "switch",
                selectedBackgroundColor: c.mainColor,
                style: {
                    width: 58,
                    height: 30
                }
            },
            startTime_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15,
                    borderBottom: "1px solid #eee"
                },
                root: ["startTime_title", "startTime_value", "startTime_icon"]
            },
            startTime_title: {
                type: "text",
                text: "开始时间",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            startTime_value: {
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
            startTime_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            endTime_wrapper: {
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15,
                    borderBottom: "1px solid #eee"
                },
                root: ["endTime_title", "endTime_value","endTime_icon"]
            },
            endTime_title: {
                type: "text",
                text: "结束时间",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            endTime_value: {
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
            endTime_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            participants_wrapper:{
                type: "view",
                style: {
                    flexDirection: "row",
                    minHeight: 60,
                    paddingRight: 15
                },
                root: ["participants_title", "participants_value","participants_icon"]
            },
            participants_title: {
                type: "view",
                style: {
                    width: 80,
                    fontSize: 15,
                    justifyContent:"center",
                    color: "#333"
                },
                root:["participants_title_name","participants_title_count"]
            },
            participants_title_name:{
                type:"text",
                text:"参与人",
                style:{
                    color:"#333333",
                    fontSize:15,
                    lineHeight:"16px"
                }
            },
            participants_title_count:{
                type:"text",
                ref:true,
                text:"已选0人",
                style:{
                    color:"#CCCCCC",
                    fontSize:12,
                    lineHeight:"14px"
                }
            },
            participants_value: {
                ref: true,
                type: "repeat",
                nodata:"participants_tips",
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999",
                    flexWrap: "wrap"
                },
                root: ["participants_item"]
            },
            participants_tips:{
                type:"text",
                style:{
                    color:"#CCCCCC",
                    fontSize:15
                },
                text:"请选择参与人"
            },
            participants_item:{
                type:"view",
                style: {
                    width: 40,
                    fontSize: 15,
                    paddingTop:"3px",
                    justifyContent:"center",
                    alignItems:"center"
                },
                root:["participants_header", "participants_name"]
            },
            participants_header:{
                type:"image",
                defaultSrc:'./imgs/100@3x.png',
                style:{
                  width:30,
                  height:30,
                  borderRadius:"50%"
                },
                src_bind:"avatar"
            },
            participants_name:{
                type:"text",
                numberofline:1,
                style:{
                    color:"#999",
                    fontSize:10
                },
                text_bind:"name"
            },
            participants_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            more_wrapper:{
                type:"icon",
                text:"展开更多",
                font: "sc_e90f",
                iconStyle:{
                    fontSize:8,
                    marginRight:5
                },
                style:{
                    backgroundColor:"#fff",
                    color:"#666666",
                    fontSize:11,
                    height:26,
                    borderTop:"1px solid #EBEFF4",
                    borderBottom:"1px solid #EBEFF4",
                }
            },
            collapse_group:{
                type:"view",
                className:"displaynone",
                ref:true,
                style:{
                    width:"100%"
                },
                root:["third_group","describe_title","fourth_group","file_group"]
            },
            third_group: {
                type: "view",
                style: {
                    backgroundColor: "#fff",
                    paddingLeft: 15,
                    marginTop:10
                },
                root: ["remind_wrapper","repeat_wrapper","repeat_time_group","important_wrapper"]
            },
            remind_wrapper:{
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15
                },
                root: ["remind_title", "remind_value","remind_icon"]
            },
            remind_title:{
                type: "text",
                text: "提醒",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            remind_value:{
                ref:true,
                type: "text",
                text: "不提醒",
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                }
            },
            remind_icon:{
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },

            repeat_wrapper:{
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15,
                    borderBottom: "1px solid #eee",
                    borderTop: "1px solid #eee",
                },
                root: ["repeat_title", "repeat_value","repeat_icon"]
            },
            repeat_title:{
                type: "text",
                text: "重复",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            repeat_value:{
                ref:true,
                type: "text",
                text: "永不",
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                }
            },
            repeat_icon:{
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            repeat_time_group:{
                type: "view",
                ref:true,
                className:"displaynone",
                style:{
                    width:"100%"
                },
                root: ["repeat_start_time", "repeat_end_time"]
            },
            repeat_start_time:{
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15,
                    borderBottom: "1px solid #eee"
                },
                root: ["repeat_startTime_title", "repeat_startTime_value","repeat_startTime_icon"]
            },
            repeat_startTime_title: {
                type: "text",
                text: "开始重复时间",
                style: {
                    width: 100,
                    fontSize: 15,
                    color: "#333"
                }
            },
            repeat_startTime_value: {
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
            repeat_startTime_icon: {
                type: "icon",
                font: "",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc",
                    paddingRight:16
                }
            },
            repeat_end_time:{
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    paddingRight: 15,
                    borderBottom: "1px solid #eee"
                },
                root: ["repeat_endTime_title", "repeat_endTime_value","repeat_endTime_icon"]
            },
            repeat_endTime_title: {
                type: "text",
                text: "结束重复时间",
                style: {
                    width: 100,
                    fontSize: 15,
                    color: "#333"
                }
            },
            repeat_endTime_value: {
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
            repeat_endTime_icon: {
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
                    paddingRight: 15
                },
                root: ["important_title", "important_switch_wrapper"]
            },
            important_title: {
                type: "text",
                text: "重要",
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
            describe_title:{
                type:"text",
                style:{
                    paddingLeft:15,
                    fontSize:14,
                    color:"#999999",
                    height:30
                },
                text:"描述"
            },
            fourth_group:{
                type:"view",
                style:{
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: "#fff",
                },
                root:["describe_textarea_area","place_wrapper","share_wrapper"]
            },
            describe_textarea_area:{
                type:"view",
                style:{
                },
                root:["describe_textarea","describe_textarea_count"]
            },
            describe_textarea: {
                ref: true,
                type: "textarea",
                placeholder: "请输入日程描述",
                style: {
                    fontSize: 14,
                    paddingTop: 14,
                    backgroundColor: "#fff",
                    height: 130
                }
            },
            describe_textarea_count:{
                ref:true,
                type:"text",
                text:"0",
                nextText:"/1000",
                style:{
                    color:"#cccccc",
                    fontSize:12,
                    justifyContent:"flex-end",
                    height:20,
                    borderBottom: "1px solid #eee",
                },
                nextTextStyle:{
                    color:"#cccccc",
                }
            },
            place_wrapper:{
                type: "view",
                style: {
                    flexDirection: "row",
                    height: 50,
                    borderBottom: "1px solid #eee",
                },
                root: ["place_title", "place_value","place_icon"]
            },
            place_title:{
                type: "text",
                text: "地点",
                style: {
                    width: 80,
                    fontSize: 15,
                    color: "#333"
                }
            },
            place_value:{
                ref:true,
                type: "text",
                text: "永不",
                style: {
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                }
            },
            place_icon:{
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },

            share_wrapper:{
                type: "view",
                style: {
                    flexDirection: "row",
                    minHeight: 60
                },
                root: ["share_title", "share_value","share_icon"]
            },
            share_title: {
                type: "view",
                style: {
                    width: 80,
                    fontSize: 15,
                    justifyContent:"center",
                    color: "#333"
                },
                root:["share_title_name","share_title_count"]
            },
            share_title_name:{
                type:"text",
                text:"共享人",
                style:{
                    color:"#333333",
                    fontSize:15,
                    lineHeight:"16px"
                }
            },
            share_title_count:{
                type:"text",
                ref:true,
                text:"已选0人",
                style:{
                    color:"#CCCCCC",
                    fontSize:12,
                    lineHeight:"14px"
                }
            },
            share_value: {
                ref: true,
                type: "repeat",
                nodata:"share_tips",
                style: {
                    flexWrap:"wrap",
                    flex: 1,
                    justifyContent: "flex-end",
                    fontSize: 15,
                    color: "#999"
                },
                root: ["share_item"]
            },
            share_tips:{
                type:"text",
                style:{
                    color:"#CCCCCC",
                    fontSize:15
                },
                text:"请选择共享人"
            },
            share_item:{
                type:"view",
                style: {
                    width: 40,
                    fontSize: 15,
                    paddingTop:"3px",
                    justifyContent:"center",
                    alignItems:"center"
                },
                root:["share_header", "share_name"]
            },
            share_header:{
                type:"image",
                style:{
                    width:30,
                    height:30,
                    borderRadius:"50%"
                },
                src_bind:"avatar"
            },
            share_name:{
                type:"text",
                numberofline:1,
                style:{
                    color:"#999",
                    fontSize:10
                },
                text_bind:"name"
            },
            share_icon: {
                type: "icon",
                font: "icomoon_e913",
                text: "",
                textPos: "left",
                style: {
                    justifyContent: "flex-end",
                    color: "#ccc"
                }
            },
            //上传附件
            file_group:{
                type:"view",
                style:{

                },
                root:["file_group_title","file_group_area"]
            },
            file_group_title:{
                type:"text",
                text:"附件列表",
                style:{
                    paddingLeft:15,
                    height:30,
                    flexDirection: "row",
                    alignItems:"center",
                    backgroundColor:"#f2f3f4",
                    color:"#999999",
                    fontSize:13,

                }
            },
            file_group_area:{
                type:"view",
                style:{
                    paddingLeft:15,
                    paddingRight:15,
                    backgroundColor:"#fff",
                    color:"#333333",
                    borderBottom: "1px solid #eee",
                },
                root:["file_repeat","file_add_btn"]
            },
            file_repeat:{
                type:"repeat",
                // type:"view",
                ref:true,
                style:{
                    flexWrap:"wrap",
                },
                itemStyle:{
                    height:60,
                    width:"100%",
                    alignItems:"center",
                    justifyContent:"flex-start",
                    borderBottom: "1px solid #eee",
                    flexDirection:"row",
                },
                root:["file_img","file_name","file_del_btn"]
            },
            file_img:{
                type:"image",
                style:{
                    width:32,
                    height:32,
                    borderRadius:"5px",
                    marginRight:12
                },
                // src:"./imgs/space_tips.png"
                src_bind:"path"
            },
            file_name:{
                type:"text",
                numberofline:1,
                style:{
                    fontSize:15,
                    flex:1,
                    color:"#333333"
                },
                textStyle:{
                    height:"20px",
                    lineHeight:"20px",
                },
                // text:"协同工作首页.jpg",
                text_bind:"fname"
            },
            file_del_btn:{
                type:"icon",
                font:"sc_e90a",
                className:"file_del_btn",
                style:{
                    justifyContent:"flex-end",
                    borderRadius:"50%",
                    width:16,
                    height:16,
                    backgroundColor:"#EBEBEB"
                },
                iconStyle:{
                    color:"#888888"
                }
            },
            file_add_btn:{
                type: "icon",
                font: "sc_e906",
                text:"新增图片",
                iconStyle:{
                    marginRight:10,
                    fontSize:20,
                },
                textStyle:{
                    fontSize:15,
                },
                style: {
                    flexDirection: "row",
                    height: 50,
                    justifyContent:"flex-start",
                    color:"#37B7FD"
                },
            },

            tips_poplayer:{
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
                root:["tips_first_btn","tips_second_btn","tips_cancel_btn"]
            },
            tips_first_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center"
                },
                text:"仅修改当前日程"
            },
            tips_second_btn:{
                type:"text",
                style:{
                    height:45,
                    backgroundColor:"#fff",
                    justifyContent:"center",
                    borderTop:"1px solid #eee"
                },
                text:"修改所有将来重复日程"
            },
            tips_cancel_btn:{
                type:"text",
                text:"取消",
                style:{
                    height:45,
                    marginTop:10,
                    backgroundColor:"#fff",
                    justifyContent:"center"
                }
            }
        },

    };
    return Re;
});
