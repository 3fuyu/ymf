define(["../logic/repeatDemo"],function(pluginClass){
    return {
        pluginClass:pluginClass,
        root:["page2_header","contentWrapper"],
        components:{
            page2_header:{
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
                fontSize: "15px"
              }
            },
            header_title:{
                type:"text",
                style:{
                  fontSize:14
                },
                text:"Repeat控件"
            },
            right_icon:{
                type:"icon",
                font:"icomoon_e90e",
                style:{
                    position:"absolute",
                    right:"10px",
                    color:"rgb(0, 147, 255)",
                    top:"6px",
                    width:"30px",
                    height:"30px",
                },
                iconStyle:{
                    fontSize:"20px"
                }
            },
            contentWrapper:{
              type:"view",
              style:{
                flex:1,
                overflowY:"auto",
                backgroundColor:"#fff"
              },
              root:["repeat1","splitLine","repeat2"]
            },
            splitLine:{
              type:"view",
              style:{
                borderTop:"1px solid #eee",
                marginLeft:58
              }
            },
            repeat1:{
              type:"repeat",
              items:[{title:"@我的",icon:"icomoon_e905",iconColor:"rgb(91,179,218)"},
              {title:"赞",icon:"icomoon_e904",iconColor:"rgb(53,184,126)"},
              {title:"评论",icon:"icomoon_e908",iconColor:"rgb(255,162,0)"}],
              root:["repeat1_icon",'repeat1_right_icon'],
              style:{
                flexDirection:"column"
              },
              itemStyle:{
                height:50,
                alignItems:"center",
                flexDirection:"row",
              },
              splitStyle:{
                borderTop:"1px solid #eee",
                marginLeft:58
              }
            },
            repeat1_icon:{
              type:"icon",
              text:"@我的",
              text_bind:"title",
              iconStyle_bind:{
                backgroundColor:"iconColor"
              },
              iconStyle:{
                marginLeft:8,
                w:36,
                color:"#fff",
                justifyContent:"center",
                alignItems:"center",
                backgroundColor:"lightblue",
                borderRadius:"100%",
                fontSize:20
              },
              textStyle:{
                marginLeft:5,
                fontSize:13,
                color:"#000"
              },
              style:{
                flex:1,
                justifyContent:"flex-start"
              },
              font:"icomoon_e910",
              font_bind:"icon"
            },
            repeat1_right_icon:{
              type:"icon",
              iconStyle:{
                fontSize:14
              },
              style:{
                width:"30px",
                height:"30px"
              },
              font:"icomoon_e910"
            },
            repeat2:{
              type:"repeat",
              items:[
                {icon:"icomoon_e903","title":"新浪新闻","iconcolor":"red","content":" 在刚播出不久的好声音中,汪峰唱了哈林庾澄庆的一首春泥,而不为人知的是,春泥曾是伊能静写给庾澄庆的歌,二人当时感情深厚,那么二人又是因为什么离婚的",time:"19:22"},
                {icon:"icomoon_e904","title":"用友新闻","content":"8月22日晚,《中国新歌声》“五强争夺战”进行第三场录制,庾澄庆“哈令营”站上对战擂台。小魔女范晓萱担当助阵",time:"19:22"},
                {icon:"icomoon_e905","title":"深圳新闻","content":"在线二维码生成器提供免费的在线二维码生成服务,可以把电子名片、文本、wifi网络、电子邮件、短信、电",time:"19:22"},
                {icon:"icomoon_e906","title":"新浪新闻","iconcolor":"orange","content":"北京老虎袭击游客调查结果：不属于生产安全事故",time:"19:22"},
                {icon:"icomoon_e907","title":"订阅消息","content":"据路透社报道，土耳其军方周三表示，位于土耳其和叙利亚北部边境的土耳其坦克部队于周三跨过边境，进入叙利亚领土作战。作战目的旨在配合美国领",time:"09-22"},
                {icon:"icomoon_e908","title":"公共消息","content":"叙利亚边境的路透社记者观察发现，当天至少有6辆土耳其坦克出现在叙利亚边境一侧。从周三早晨开始，土耳其的战机和坦克",time:"10-02"},
                {icon:"icomoon_e909","title":"未订阅消息","content":"研究人员对一具埃及木乃伊进行CT扫描，结果证实是埃及两千多年前的一位少女，生前因吃糖而牙齿脓肿，并且患有贫血病",time:"10-02"},
                {icon:"icomoon_e903","title":"其它消息新闻","content":"她的真实名字已无从查询，研究小组将这具木乃伊称为“梅里塔穆恩”,其意思是“倍受爱戴的阿蒙神”伊严重损坏",time:"10:02"}
              ],
              root:["repeat2_icon","repeat2_midWrapper","repeat2_timeWrapper"],
              itemStyle:{
                height:50,
                flexDirection:"row",
              },
              style:{
                flexDirection:"column"
              },
              splitStyle:{
                borderTop:"1px solid #eee",
                marginLeft:58
              }
            },
            repeat2_icon:{
              type:"icon",
              font:"icomoon_e914",
              font_bind:"icon",
              iconStyle:{
                marginLeft:8,
                w:36,
                color:"#fff",
                justifyContent:"center",
                alignItems:"center",
                backgroundColor:"lightblue",
                borderRadius:"100%",
                fontSize:20
              },
              iconStyle_bind:{
                backgroundColor:"iconcolor"
              },
            },
            repeat2_midWrapper:{
              type:"view",
              style:{
                flex:1,
                paddingLeft:7
              },
              root:["repeat2_title","repeat2_content"]
            },
            repeat2_title:{
              type:"text",
              text:"title",
              text_bind:"title",
              style:{marginTop:6,fontSize:13,color:"#000"}
            },
            repeat2_content:{
              type:"text",
              text:"content",
              text_bind:"content",
              numberofline:1,
              style:{marginTop:4,fontSize:12,color:"rgb(115, 115, 115)"}
            },
            repeat2_timeWrapper:{
              type:"view",
              style:{
                width:40,
                alignItems:"center"
              },
              root:["repeat2_timelabel"]
            },
            repeat2_timelabel:{
              type:"text",
              text:"time",
              text_bind:"time",
              style:{
                marginTop:9,
                fontSize:12,
                color:"#ccc"
              }
            }

        }
    };
});
