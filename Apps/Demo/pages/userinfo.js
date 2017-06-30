define(["../logic/userinfo"],function(pluginClass){
    return {
        pluginClass:pluginClass,
        root:["topview","midview","bottomview"],
        showPageStyle:{width:"80%",height:"100%"},
        components:{
            topview:{
                type:"view",
                root:[],
                style:{
                    height:"120px",
                    backgroundColor:"#fff",
                    justifyContent:"center",
                    alignItems:"center"
                }
            },
            midview:{
              type:"view",
              style:{
                flex:1,
                backgroundColor:"rgb(18, 183, 245)"
              },
              root:["repeat"]
            },
            bottomview:{
              type:"view",
              root:["settingIcon"],
              style:{
                height:"40px",
                justifyContent:"center",
                alignItems:"flex-start",
                backgroundColor:"rgb(18, 183, 245)"
              }
            },
            settingIcon:{
              type:"icon",
              font:"icomoon_e904",
              text:"设置",
              style:{
                marginLeft:"20px"
              },
              iconStyle:{color:"#fff",fontSize:15},
              textStyle:{color:"#fff",marginLeft:"4px",fontSize:12}
            },
            repeat:{
              type:"repeat",
              root:["repeat_icon"],
              items:[
                {"title":"开通会员","icon":"FontAwesome_f007"},
                {"title":"QQ钱包","icon":"FontAwesome_f0d6"},
                {"title":"个性装扮","icon":"FontAwesome_f228"},
                {"title":"我的收藏","icon":"FontAwesome_f16b"},
                {"title":"我的相册","icon":"FontAwesome_f02d"},
                {"title":"我的文件","icon":"FontAwesome_f1c6"},
                {"title":"我的名片夹","icon":"FontAwesome_f02e"}
              ],
              style:{
                flexDirection:"column"
              },
              itemStyle:{
                padding:"10px 0px",
                backgroundColor:"rgb(18, 183, 245)"
              }
            },
            repeat_icon:{
              type:"icon",
              text:"action",
              text_bind:"title",
              font_bind:"icon",
              font:"icomoon_e910",
              iconStyle:{
                fontSize:"23px",
                color:"#fff",
                width:30,
                justifyContent:"center"
              },
              textStyle:{
                fontSize:"14px",
                color:"#fff",
                marginLeft:"10px"
              },
              style:{
                justifyContent:"flex-start",
                marginLeft:"20px"
              }
            }
        }
    };
});
