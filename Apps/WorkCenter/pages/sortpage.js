/**
 * 首页的上下分类
 **/
define(["../logic/sortpage", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content"],
        components: {
          page_content:{
            type:"view",
            style:{
              flex:1,
              overflow:"auto"
            },
            root:["sort_repeat"]
          },
          sort_repeat:{
            type:"repeat",
            sortHandle: "move_icon",
            style:{
              flexDirection:"column"
            },
            itemStyle:{
              height:50,
              backgroundColor:"#fff",
              width:"100%",
              flexDirection:"row",
              borderBottom:"1px solid #eee"
            },
            root:["item_icon","move_icon"]
          },
          item_icon:{
            type:"icon",
            text_bind:"name",
            font:"wc_e909",
            style:{
              justifyContent:"flex-start",
              flex:1
            },
            textStyle:{
              fontSize:16,
              marginLeft:10,
              width:"90%",
              color:"#333"
            },
            iconStyle:{
              fontSize:22,
              color:"#FFCF0E",
              marginLeft:10
            }
          },
          move_icon:{
            type:"icon",
            font:"wc_e91d",
            style:{
              width:50,
              color:"gray"
            }
          }

        }



    };
    return Re;
});
