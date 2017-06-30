/**
 * 首页的上下分类
 **/
define(["../logic/detailComment", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
             minHeight:400,
             backgroundColor:"#F2F3F4",
        },
        root: ["content","nodata"],
        components: {
          nodata:{
            className:"displaynone",
            type:"text",
            text:"nodata"
          },
          content:{
            type:"view",
            root:["comment_repeat","comment_nodata"],
            noScroll:true,
            style:{
              overflow:"hidden",
              height:"auto"
            }
          },
            comment_nodata:{
              type:"icon",
              ref:true,
              className:"displaynone",
              text:"还没有童鞋来评论哦~",
              style:{
                 width:"100%",
                 height:"100%",
                 textAlign:"center",
                 display:"block",

              },
              textStyle:{
                  fontSize:16,
                  color:"#999"
              },
              iconStyle:{
                  width:"28%",
                  height:"28%",
                  paddingTop:"50px",
                  paddingBottom:"10px",
                  margin:"0 auto",
              },
              src:"./imgs/nocomment@2x.png"
            },
            comment_repeat:{
              type: "repeat",
              ref:true,
              style:{
                width:"100%",
                flexDirection: "column",
                marginBottom:50
              },
              itemStyle: {
                  flexDirection: "column",
                  backgroundColor:"#F2F3F4",
                  paddingLeft:15,
                  paddingRight:15,
                  paddingTop:10,
                  paddingBottom:10,
                  borderBottom:"1px solid #E3E3E3"
              },
              root: ["row_header","row_content","row_attachment"]
            },
            row_header:{
                type:"view",
                style:{
                    flex:"0 1 auto",
                    flexDirection:"row",
                    alignItems:"center",
                    marginBottom:10
                },
                root:["user_avatar","user_name","comment_time"]
            },
            user_avatar:{
                type:"image",
                style:{
                    w:30,
                    borderRadius:"100%"
                },
                defaultSrc:'./imgs/100@3x.png',
                src_bind:"avatar"
            },
            user_name:{
                type:"text",
                numberofline:1,
                style:{
                    fontSize:15,
                    flex:1,
                    color:"#999999",
                    marginLeft:10
                },
                text:"便便藏",
                text_bind:"userName"
            },
            comment_time:{
                type:"text",
                style:{
                    justifyContent:"flex-end",
                    fontSize:12,
                    color:"#999999"
                },
                text:"今天 05:40"
            },
            row_content:{
                type:"text",
                style:{
                    fontSize:15,
                    color:"#333333",
                    marginBottom:5
                },
                text_bind:"content",
            },
            row_attachment:{
                type:"view",
                className:"displaynone",
                style:{

                },
                root:["attachment_img"]
            },
            attachment_img:{
                type:"image",
                style:{
                    width:100
                },
                src:"./imgs/keji5.jpg"
            }
        },

    };
    return Re;
});
