/**
 * 首页的上下分类
 **/
define(["../logic/detailFiles", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
            minHeight:400
        },
        root: ["content"],
        components: {
          content:{
            onlyForSticky:true,
            type:"view",
            noScroll:true,
            root:["repeat","file_nodata"],
            style:{
              overflow:"hidden",
              height:"auto"
            }
          },
            file_nodata:{
                type:"icon",
                ref:true,
                text:"还没上传过文件哦~",
                className:"displaynone",
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
                    paddingTop:"90px",
                    paddingBottom:"10px",
                    margin:"0 auto",
                },
                src:"./imgs/nofile@2x.png"
            },
            repeat:{

                type:"repeat",
                ref:true,
                style:{
                  backgroundColor:"#fff",
                  flexDirection:"column",
                  marginTop:10,
                },
                itemStyle:{
                  height:70,
                  flexDirection:"row",
                  alignItems:"center"
                },
                splitStyle:{
                  marginLeft:77,
                  borderTop:"1px solid #EEEEEE"
                },
                root:["item_icon","item_content"]
            },
            item_icon:{
              type:"image",
              src:"./imgs/space_tips.png",
              src_bind:"filePath",
              style:{
                w:48,
                marginLeft:15,
                marginRight:15
              }
            },
            item_content:{
              type:"view",
              style:{
                flex:1,
                paddingTop:10,
                height:"100%"
              },
              root:["item_name","item_bottom_wrap"]
            },
            item_name:{
              type:"text",
              style:{
                fontSize:16,
                color:"#292F33"
              },
              text_bind:"fileName",
              numberofline:1
            },
            item_bottom_wrap:{
              type:"view",
              style:{
                flexDirection:"row",
                paddingRight:14,
                paddingTop:8
              },
              root:["timesize","from"]
            },
            timesize:{
              type:"text",
              style:{
                fontSize:11,
                color:"#BEBEBE",
                flex:1
              },
              text:"2016-05-09 05:40 128.5KB"
            },
            from:{
              type:"text",
              style:{
                fontSize:11,
                color:"#292F33"
              },
              preTextStyle:{
                color:"#BBBBBB"
              },
              preText:"来自:",
              text_bind:"userName",
            }

        },

    };
    return Re;
});
