/**
 * 未处理日程
 **/
define(["../logic/untreated", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content"],
        components: {
            page_content: {
                type: "view",
                style: {
                    backgroundColor: "#f2f3f4",
                    flex:1,
                    overflow:"auto"
                },
                root:["listview"]
            },
            listview:{
                ref:true,
                type:"listview",
                autoLoadData:true,
                nodata:"nodata_view",
                ajaxConfig: {
                    url: "/schedule/unresolved",
                    type: "GET",
                    timeout:8000,
                    pageSize:5,
                    pageNumKey: "pageNo",
                    data: {
                        pageSize:5,
                    }
                },
                rowStyle:{
                    flexDirction:"column",
                    marginBottom:"10px"
                },
                style: {

                },
                root:["repeat_main","repeat_btn_group"]
            },
            nodata_view:{
                type:"view",
                style:{
                    marginTop:"220px"
                },

                root:["nodata_icon","nodata_text"]
            },
            nodata_icon:{
                type:"icon",
                style:{
                    justifyContent:"center",
                    marginBottom:"15px"
                },
                iconStyle:{
                    width:"80px",
                    height:"80px",
                },
                src:"./imgs/notask@2x.png",
            },
            nodata_text:{
                type:"text",
                style:{
                    justifyContent:"center",
                    fontSize:15,
                    color:"#999999"
                },
                text:"暂无未处理日程",
            },
            repeat_main:{
                type:"view",
                style:{
                    backgroundColor:"#fff",
                    padding:"12px 15px",
                },
                root:["schedule_theme","schedule_describe","schedule_time"]
            },
            schedule_theme:{
                type:"text",
                preText:"主题:",
                numberofline:1,
                preTextStyle:{
                    marginRight:10
                },
                style:{
                    alignItems:"flex-start",
                    color:"#333333",
                    fontSize:16,
                    paddingRight:35,
                    flexDirection:"row"
                },
                text_bind:"title",
            },
            schedule_describe:{
                type:"text",
                preText:"描述:",
                numberofline:1,
                preTextStyle:{
                    marginRight:10
                },
                style:{
                    alignItems:"flex-start",
                    color:"#999999",
                    fontSize:14,
                    paddingRight:35,
                    marginTop:5,
                },
                text_bind:'describe',
            },
            schedule_time:{
                type:"text",
                style:{
                    color:"#999999",
                    fontSize:12,
                    marginTop:12,
                    flexDirection:"row"
                }
                //text:"2016-11-04 至 2016-11-05 18:30",
            },
            repeat_btn_group:{
                type:"view",
                style:{
                    flexDirection:"row",
                    backgroundColor:"#fff",
                    fontSize:14,
                    justifyContent:"center",
                    paddingTop:"12px",
                    paddingBottom:"12px",
                    borderTop:"1px solid #EEEEEE",
                    borderBottom:"1px solid #EEEEEE",
                },
                root:["reject_btn","receive_btn"]
            },
            reject_btn:{
                type:"text",
                style:{
                    flexGrow:"1",
                    justifyContent:"center",
                    width:"50%",
                    color:"#FC4E5B",
                    borderRight:"1px solid #eeeeee"
                },
                text:"拒绝"
            },
            receive_btn:{
                type:"text",
                style:{
                    flexGrow:"1",
                    justifyContent:"center",
                    width:"50%",
                    color:"#37b7fd",
                },
                text:"接受"
            },
            add_reason_input_area:{
                type:"view",
                style:{
                    flex:1
                },
                root:["reason_input","reason_input_count"]
            },
            reason_input: {
                type: "textarea",
                ref: true,
                placeholder: "请输入拒绝理由(非必填)",
                style: {
                    width: "100%",
                    paddingLeft: 15,
                    paddingTop: 12,
                    height:100,
                    margin: "auto",
                    fontSize: 16,
                    border: "none",
                    backgroundColor: "#fff",
                    marginBottom:15
                }
            },
            reason_input_count:{
                ref:true,
                type:"text",
                text:"100",
                style:{
                    color:"#cccccc",
                    fontSize:12,
                    justifyContent:"flex-end",
                    paddingRight:15,
                    paddingTop:5,
                    paddingBottom:8,
                }
            }

        },

    };
    return Re;
});
