/**
 * 首页的上下分类
 **/
define(["../logic/itemmovetofolder", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor
        },
        root: ["page_content","addFolderBtn"],
        components: {
          addFolderBtn:{
            type:"icon",
            text:"创建文件夹",
            font:"wc_e90a",
            iconStyle:{
              fontSize:17
            },
            textStyle:{
              fontSize:16,
              marginLeft:5
            },
            style:{
              height:50,
              backgroundColor:"#fff",
              borderTop:"1px solid #eee",
              color:"rgb(55, 183, 253)",
              justifyContent:"center"
            }
          },
          page_content:{
            type:"view",
            style:{
              flex:1,
              overflow:"auto"
            },
            root:["folder_reapeat"]
          },
          nodata:{
            type:"icon",
            style:{
              color:"#333",
              backgroundColor:"transparent",
              fontSize:15,
              top:"100px"
            },
            text:"还未创建文件夹！请点击下方创建文件夹"
          },
          folder_reapeat:{
            type:"repeat",
            ref:true,
            nodata:"nodata",
            selectedMode: "s",
            root:["folder_icon","selected_icon"],
            itemStyle:{
              height:50,
              alignItems:"center",
              flexDirection:"row",
              justifyContent:"center",
              backgroundColor:"#fff",
              borderBottom:"1px solid #eee"
            },
            style:{
              flexDirection:"column"
            }
          },
          selected_icon:{
            type: "icon",
            selectedClassName: "category-selected",
            font: "icomoon_e90a",
            iconStyle: {
                color: c.mainColor,
                fontSize: 19
            },
            style: {
                width: 40,
                opacity: 0
            }
          },
          folder_icon:{
            type:"icon",
            font:"wc_e909",
            text_bind:'name',
            textStyle:{
              color:"#333",
              marginLeft:10,
              fontSize:15
            },
            iconStyle:{
              color:'#FFCF0E',
              fontSize:18
            },
            style:{
              flex:1,
              justifyContent:"flex-start",
              paddingLeft:10
            }
          },
          add_folder_input: {
              type: "input",
              ref: true,
              placeholder: "输入文件名称",
              style: {
                  width: "92%",
                  paddingLeft: 10,
                  margin: "auto",
                  fontSize: 16,
                  height: 45,
                  border: "none",
                  backgroundColor: "#F2F3F4",
                  borderRadius: "4px"
              }
          }

        },



    };
    return Re;
});
