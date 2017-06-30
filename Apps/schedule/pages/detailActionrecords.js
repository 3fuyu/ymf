/**
 * 首页的上下分类
 **/
define(["../logic/detailActionrecords", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
             minHeight:400
        },
        root: ["repeat"],
        components: {
              repeat:{
                  ref:true,
                  type:"repeat",
                  items:[{},{},{}],
                  style:{
                    flexDirection:"column",
                    paddingRight:16
                  },
                  itemStyle:{
                    flexDirection:"row",
                    alignItems:"center",
                    position: "relative"
                  },
                  root:["left_area","right_area"]
              },
              left_area:{
                type:"view",
                style:{
                  width:60,
                  height:"100%",
                  position: "absolute"
                },
                root:["vertical_line","left_ball"]
              },
              left_ball:{
                type:"view"
              },
              vertical_line:{
                type:"view",
                style:{
                },
              },
              right_area:{
                type:"view",
                style:{
                  flex:1,
                  height:"100%",
                  paddingTop:10,
                  paddingBottom:10,
                  paddingLeft:60,
                },
                root:["popover_area"]
              },
              popover_area:{
                type:"view",
                className:"detail-popover-area",
                style:{
                  flexDirection:"row",
                  width:"100%",
                  borderRadius:"5",
                  justifyContent:"flex-start",
                  alignItems:"flex-start",
                  padding:10,
                  backgroundColor:"#fff"

                },
                root:["user_avatar","record_main"]
              },
              user_avatar:{
                  type:"image",
                  style:{
                      width:35,
                      height:35,
                      marginTop:5,
                      borderRadius:"50%"
                  },
                  defaultSrc:"./imgs/100@3x.png",
                  src_bind:"avatar"
              },
              record_main:{
                  type:"view",
                  style:{
                      flex:1,
                      marginLeft:10
                  },
                  root:["record_header","record_content"]
              },
              record_header:{
                  type:"view",
                  className:"record_header",
                  style:{
                      flexDirection:"row"
                  },
                  root:["user_name","record_time"]
              },
              user_name:{
                  type:"text",
                  numberofline:1,
                  style:{
                      fontSize:16,
                      flex:1,
                      color:"#333333"
                  },
                  text_bind:"userName"
              },
              record_time:{
                  type:"text",
                  style:{
                      fontSize:11,
                      justifyContent:"flex-end",
                      color:"#999999"
                  },
                  text_bind:"createTime"
              },
              record_content:{
                  type:"text",
                  className:"record_content",
                  style:{
                      fontSize:14,
                      color:"#999999"
                  },
                  text_bind:"reason"
              }

        },

    };
    return Re;
});
