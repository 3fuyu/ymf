define(["../components/commonCtl","utils"],function(c,utils){

  var listTem = {
       listview:{
          type:"listview",
          // groupKey:"userName",
          style:{
            padding:"7 7 0 7"
          },
          root:["row_que_name","row_timeauthor_wrapper","row_mark_repeat","row_DescLabelCtl","row_bottomwrapper"],
          rowStyle:{
            flexDirection:"column",
            marginBottom:5,
            padding:"12 16",
          }
        },
        row_bottomwrapper:{
          type:"view",
          style:{
            flexDirection:"row",
            justifyContent:"flex-end"
          },
          root:["row_answernum_icon","row_up_icon"]
        },
        row_answernum_icon:{
          type:"icon",
          ref:true,
          text:"0",
          text_bind:"answerNum",
          font:"icomoon_e912",
          textStyle:c.rowIconTextStyle,
          iconStyle:c.rowIconIconStyle,
          style:c.rowIconStyle(false)
        },
        row_up_icon:{
          type:"icon",
          text:"0",
          text_bind:"likes",
          textStyle:c.rowIconTextStyle,
          iconStyle:c.rowIconIconStyle,
          style:c.rowIconStyle(true),
          font:"icomoon_e90c",
          activeClassName:"qaa_upicon_active",
          selectedClassName:"qaa_upicon_selected",
        },
        row_DescLabelCtl:{
          type:"QueListDescCtl",
          text_bind:"description",
          numberofline:2,
          style:{
            color:c.descColor,
            width:"100%",
            marginTop:15,
            marginBottom:12,
            lineHeight:"21px",
            fontSize:14
          }
        },
        row_mark_repeat:{
          type:"repeat",
          items_bind:"label",
          style:{
            flexWrap:"wrap",
          },
          itemStyle:{
            marginRight:5,
            marginTop:10
          },
          root:["row_mark_text"]
        },
        row_mark_text:{
          type:"text",
          text_bind:"title",
          style:c.markLabelStyle
        },

        row_que_name:{
          type:"text",
          numberofline:2,
          text_bind:"title",
          style:{
            width:"100%",
            color:c.titleColor,
            lineHeight:"22px",
            fontSize:16
          }
        },
        row_timeauthor_wrapper:{
          type:"view",
          style:{
            flexDirection:"row",
            marginTop:10
          },
          root:["row_author","row_time"]
        },
        row_author:{
          type:"text",
          text_bind:"userName",
          text:"网友1",
          style:{
            color:c.seTitleColor,
            fontSize:12,
          }
        },
        row_time:{
          type:"text",
          style:{
            color:c.seTitleColor,
            fontSize:12,
            marginLeft:10,
          },
          text_bind:"createTime",
          text:"2012-01-02"
        }

  };


  return {
    getList:function(autoLoadData,ajaxConfig,nodata){
      var Re = utils.copy(listTem);
      Re.listview.autoLoadData = autoLoadData;
      if(nodata){
        Re.listview.nodata = nodata;
      }
      Re.listview.ajaxConfig = ajaxConfig;
      return Re;
    }

  };


});
