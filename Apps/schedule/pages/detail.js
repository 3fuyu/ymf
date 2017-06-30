/**
 * 首页的上下分类
 **/
define(["../logic/detail", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: "#fff",

        },
        root: ["body","bottom_action_repeat","morePopover","tips_poplayer"],
        components: {
          body:{
            ref:true,
            className:"detail-body",
            type:"view",
            stickyHeaderIndices:"segment",
            style:{
              flex:1,
              overflow:"auto",
              backgroundColor:"#F2F3F4"
            },
            root:["top_view","toggle_btn","segment","content","stickyplaceholder"]
          },
          stickyplaceholder:{
            ref:true,
            className:"displaynone",
            type:"view",
            style:{
              paddingBottom:50
            },
          },
          segment:{
            type:"segment_android",
            items:[{title:"回复"},{title:"文件"},{title:"操作记录"}],
            // items:[{title:"回复"},{title:"文件"}],
            root:["segment_android_item"],
            style:{height:40,backgroundColor:"#fff"}
          },
          segment_android_item:{
            type:"text",
            text_bind:"title",
            selectedClassName:"yy-sgm-item-selected-android",
            style:{color:"#8899a6",fontSize:13}
          },
          content:{
            type:"view",
            style:{
              position:"relative",
            },
            root:["viewpager"]
          },
          viewpager:{
            ref:true,
            type:"viewpager",
            autoHeight:true,
            style:{
              position:"relative",
            },
            defaultKey:"detailComment"
          },
          top_view:{
            type:"view",
            ref:true,
            style:{
              height:"auto",
              padding:15,
              lineHeight:22,
              backgroundColor: "#fff",
              overflow:"hidden"
            },
            root:["name","time_status_warp","describe","creator","joinUsers","shareUsers","location","remind","repeat"]
          },
          describe:{
            type:"text",
            ref:true,
            preText:"描述 :&nbsp;",
            preTextStyle:{
                
            },
            style:{
              marginTop:8,
              display:"inline-block",
              fontSize:"14px",
              color:"#999999"
            },
            text:""
          },
          remind:{
            type:"text",
            ref:true,
            preText:"提醒 :&nbsp;",
            preTextStyle:{
                
            },
            style:{
              marginTop:8,
              display:"inline-block",
              fontSize:"14px",
              color:"#999999"
            },
            text:"不提醒"
          },
          repeat:{
            type:"text",
            ref:true,
            preText:"重复 :&nbsp;",
            preTextStyle:{
                
            },
            style:{
              marginTop:8,
              display:"inline-block",
              fontSize:"14px",
              color:"#999999"
            },
            text:"不重复"
          },
          location:{
            type:"text",
            ref:true,
            preText:"地点 :&nbsp;",
            preTextStyle:{
                
            },
            style:{
              marginTop:8,
              display:"inline-block",
              fontSize:"14px",
              color:"#999999"
            },
            text:""
          },
          shareUsers:{
            type:"text",
            ref:true,
            preTextStyle:{
                
            },
            preText:"共享人 :&nbsp;",
            style:{
              marginTop:8,
              display:"inline-block",
              fontSize:"14px",
              color:"#999999"
            },
            text:""
          },
          creator:{
            type:"text",
            ref:true,
            preTextStyle:{
                
            },
            preText:"创建人 :&nbsp;",
            style:{
              marginTop:8,
              display:"inline-block",
              fontSize:"14px",
              color:"#999999"
            },
            text:""
          },
          joinUsers:{
            type:"text",
            ref:true,
            preTextStyle:{
                
            },
            preText:"参与人 :&nbsp;",
            style:{
              display:"inline-block",
              marginTop:8,
              fontSize:"14px",
              color:"#999999"
            },
            text:""
          },
          name:{
            type:"text",
            ref:true,
            numberofline:3,
            style:{
              color:"#292F33",
              fontSize:16
            }
          },
          time_status_warp:{
            type:"view",
            style:{
              fontSize:14,
              marginTop:14,
              flexDirection:"row"
            },
            root:["time","status"]
          },
          time:{
            ref:true,
            type:"text",
            style:{
              flex:1,
              color:"#37B7FD"
            },
            text:""
          },
          status:{
            type:"text",
            ref:true,
            text:"",
            style:{
              fontSize:11,
              borderRadius:9,
              padding:"0 7"
            }
          },
          toggle_btn:{
            type:"icon",
            text:"展开",
            className:"displaynone",
            font:"sc_e90f",
            textPos:"left",
            textStyle:{
              marginRight:5
            },
            iconStyle:{
              fontSize:12
            },
            style:{
              borderBottom:"1px solid #EEEEEE",
              backgroundColor:"#fff",
              color:"#999999",
              width:"100%",
              height:30,
              justifyContent:"center"
            }
          },

          bottom_action_repeat:{
            type:"repeat",
            ref:true,
            items:[],
            itemStyle:{
              flex:1
            },
            style:{
              height:50,
              position:"absolute",
              bottom:"0",
              width:"100%",
              backgroundColor:"#fff",
              zIndex:10,
              flexDirection:"row"
            },
            splitStyle:{
              height:15,
              marginTop:18,
              width:1,
              backgroundColor:"rgb(227, 227, 227)"
            },
            root:["bottom_action_item"]
          },
          bottom_action_item:{
            type:"icon",
            text_bind:"label",
            font_bind:"icon",
            iconStyle:{
              marginRight:6,
              color:"#666666",
              fontSize:18
            },
            textStyle:{
              fontSize:14,
              color:"#999999"
            },
            style:{
              flex:1
            }
          },



          morePopover:{
            type:"popover",
            root:["moreRepeat"],
            animate:{mode:"2"},
            bkCoverStyle:{
              backgroundColor:"rgba(230, 230, 230, 0.2)"
            },
            arrowStyle:{
              backgroundColor:"#fff",
              zIndex:2,
              "-webkit-box-shadow":"9px 8px 13px rgb(203, 203, 203)",
              "box-shadow":"9px 8px 13px rgb(203, 203, 203)",
            },
            style:{
              "-webkit-box-shadow":"0px 8px 13px rgb(203, 203, 203)",
              "box-shadow":"0px 8px 13px rgb(203, 203, 203)",
              width:100,
              backgroundColor:"#fff",
              height:"auto",
              borderRadius:"7px"
            }
          },
          moreRepeat:{
            type:"repeat",
            ref:true,
            items:[],
            root:["moreRepeat_icon"],
            style:{
              flexDirection:"column",
              flex:1,
              paddingTop:4,
              paddingBottom:4,
            },
            itemStyle:{
              height:40,
              justifyContent:"center",
              alignItems:"stretch"
            }
          },
          moreRepeat_icon:{
            type:"icon",
            text:"测试",
            text_bind:"title",
            style:{flex:1},
            textStyle:{
              fontSize:15,
              color:"#292f33"
            }
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
            root:["tips_first_btn","tips_second_btn","tips_third_btn","tips_cancel_btn"]
          },
          tips_first_btn:{
            type:"text",
            style:{
              height:45,
              backgroundColor:"#fff",
              justifyContent:"center"
            },
            text:"仅删除当前日程"
          },
          tips_second_btn:{
            type:"text",
            style:{
              height:45,
              backgroundColor:"#fff",
              justifyContent:"center",
              borderTop:"1px solid #eee"
            },
            text:"删除其未来的重复日程"
          },
          tips_third_btn:{
            type:"text",
            style:{
              height:45,
              backgroundColor:"#fff",
              justifyContent:"center",
              borderTop:"1px solid #eee"
            },
            text:"所有的重复日程"
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
