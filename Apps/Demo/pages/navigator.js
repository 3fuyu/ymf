define(["../logic/navigator"],function(pluginClass){
    return {
        pluginClass:pluginClass,
        style:{
            backgroundColor:"#f0f4f6"
        },
        root:["page_header","page_content"],
        components:{
            page_header:{
                type:"view",
                root:["backIcon","header_title"],
                style:{
                    height:"44px",
                    borderBottom:"1px solid #e2e8ed",
                    backgroundColor:"#fff",
                    justifyContent:"center",
                    alignItems:"center"
                }
            },
            backIcon:{
              type:"icon",
              text:"返回",
              style:{
                position: "absolute",
                left: "0px",
                color: "rgb(0, 147, 255)",
                top: "7px",
                width: "50px",
                height: "30px",
              },
              textStyle: {
                fontSize: "14px"
              }
            },
            header_title:{
                type:"text",
                text:"页面导航示例",
                style:{
                    fontSize:14
                }
            },
            page_content:{
                type:"view",
                style:{
                    flex:1,
                    overflow:"auto"
                },
                root:["go_button","repalcego_button",
                "show_button_fromBottom_button",
                "show_button_fromLeft1_button",
            "show_button_fromLeft2_button",
            "show_button_fromLeft3_button",
            "show_button_fromRight1_button",
        "show_button_fromRight2_button",
        "show_button_fromRight3_button"]
            },
            go_button:{
                type:"button",
                text:"跳转Go到下一个页面",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            repalcego_button:{
                type:"button",
                text:"跳转Relace Go到下一个页面",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromBottom_button:{
                type:"button",
                text:"从下往上pop弹出页面",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromLeft1_button:{
                type:"button",
                text:"从左弹出方式1",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromLeft2_button:{
                type:"button",
                text:"从左弹出方式2",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromLeft3_button:{
                type:"button",
                text:"从左弹出方式3",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromRight1_button:{
                type:"button",
                text:"从右弹出方式1",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromRight2_button:{
                type:"button",
                text:"从右弹出方式2",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            },
            show_button_fromRight3_button:{
                type:"button",
                text:"从右弹出方式3",
                style:{
                    marginTop:20,
                    width:"100%",
                    borderLeftWidth:0,
                    borderRightWidth:0,
                    borderRadius:0,
                    height:38,
                    borderColor:"#eee",
                    justifyContent:"center"
                },
            }


        }
    };
});
