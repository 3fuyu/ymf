define(["../logic/commentlist","../components/commonCtl"],function(pluginClass,c){
    return {
        pluginClass:pluginClass,
        style:{
            backgroundColor:"#f0f4f6"
        },
        root:["page_content","bottomview"],
        components:{
            page_content:{
              type:"view",
              style:{
                flex:1,
              },
              root:["listview"]
            },
            listview:{
              type:"listview",
              ajaxConfig:{
                url:"/comment/list",
                pageSize:20,
                pageNumKey:"pageNo",
                type:"GET",
                data:{
                  pageNo:1,
                  pageSize:20
                }
              },
              style:{
                flexDirection:"column"
              },
              rowStyle:{
                padding:"18 13 15 13",
                flexDirection:"column",
                backgroundColor:"#fff",
                borderBottom:"1px solid #EEEEEE"
              },
              autoLoadData:true,
              nodata:"comment_nodata",
              root:["row_top_view","row_content_text"]
            },
            comment_nodata:{
              type:"text",
              style:{
                margin:"40% auto",
                textAlign:"center",
                width:"210",
                fontSize:15,
                color:c.seTitleColor
              },
              text:"暂时没有用户评论，请点击下方进行评论"
            },
            row_content_text:{
              type:"text",
              style:{
                fontSize:14,
                marginTop:18,
                lineHeight:"20",
                color:c.descColor
              },
              text:"回答内容",
              text_bind:"commentText"
            },
           row_top_view:{
              type:"view",
              style:{
                flexDirection:"row",
              },
              root:["row_header","row_nametime"]
            },
            row_header:{
              type:"image",
              src_bind:"headImgUrl",
              style:{
                w:40,
                borderRadius:'100%',
                backgroundColor:"#eee"
              }
            },
            row_nametime:{
              type:"view",
              style:{
                flex:1,
                marginLeft:10,
                justifyContent:"center"
              },
              root:["re_name","row_time"]
            },
            re_name:{
              type:"text",
              text:"用户",
              text_bind:"userName",
              style:{
                color:c.titleColor,
                fontSize:16
              }
            },
            row_time:{
              type:"text",
              text:"2012-02-12",
              style:{
                color:c.seTitleColor,
                fontSize:12,
                marginTop:4
              }
            },
            bottomview:{
              type:"view",
              style:{
                height:"50",
                borderTop:"1px solid #DCDCDC",
                backgroundColor:'#fff',
                justifyContent:"center",
                alignItems:"center",
                flexDirection:"row"
              },
              root:["comment_input","submit_btn"]
            },
            submit_btn:{
              type:"button",
              mode:1,
              disabledClassName:"qaa-submit-btn-disabled",
              title:"提交",
              style:{
                width:60,
                height:30,
                marginLeft:5,
                fontSize:14,
                backgroundColor:c.mainColor,
                border:("1px solid "+c.mainColor),
                color:"#fff"
              }
            },
            comment_input:{
              type:"input",
              placeholder:"在此评论...",
              isInForm:true,
              style:{
                width:290,
                color:"#333",
                paddingLeft:10,
                fontSize:14,
                borderRadius:4,
                height:32,
                border:"1px solid #F2F3F4"
              }
            },

        }
    };
});
