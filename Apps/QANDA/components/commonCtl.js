define(["utils"],function(utils){
  var mainColor = "#73D51C";
  var titleColor="#333333";
  var seTitleColor="#999999";
  var descColor="#666666";
  var backColor = "#f2f4f4";
    var Re =  {
      descColor:descColor,
      backColor:backColor,
      mainColor:mainColor,
      seTitleColor:seTitleColor,
      labelColor:"#666666",
      titleColor:titleColor,
      submitBtn:{
        type:"icon",
        text:"提交",
        style:{
            position:"absolute",
            right:"10px",
            color:mainColor,
            top:"9px",
            width:"50px",
            height:"30px",
        },
        textStyle:{
            fontSize:"16"
        }
      },
      upQue:function(config){
        var sender = config.sender;
        var pageview = config.pageview;

        var url = "/question/likes";
        var isCancel = false;
        if(sender.datasource.isLikes===0){
          isCancel = true;
          url = "/question/cancelLikes";
        }
        var text =isCancel?parseInt(sender.getText())-1:parseInt(sender.getText())+1;
        text = text<0?0:text;
        sender.datasource.isLikes =isCancel?1:0;
        if(isCancel){
          sender.unSelected();
        }else{
          sender.selected();
        }
        sender.setText(text);

        pageview.ajax({
          type:"POST",
          url:url,
          timeout:7000,
          data:{
            id:config.id,
            token:config.token,
            timestamp:(new Date()).valueOf()
          },
          success:function(data){
            var sender = config.sender;
            var pageview = config.pageview;
            if(data.code!==0&&data.code!=100020002){
              sender.unSelected();
              sender.datasource.isLikes = 1;
            }
            if(data.code!==0){
              if(isCancel){
                sender.selected();
                sender.datasource.isLikes = 0;
                sender.setText(text+1);
              }else{
                sender.setText(text-1);
              }
              pageview.showTip({
                text:data.msg,
                duration:2000
              });
            }
          },

          error:function(e){
            var sender = config.sender;
            if(isCancel){
              sender.selected();
              sender.datasource.isLikes = 0;
              sender.setText(text+1);
            }else{
              sender.unSelected();
              sender.datasource.isLikes = 1;
              sender.setText(text-1);
            }

          }
        });
      },
      selectAttachment:function(plugin,type){
        var _this = plugin;
        if(_this.imagesRepeat.datasource.length>=8){
          _this.pageview.showTip({text:"最多上传8张图片",duration:1000,style:{width:"220px"}});
          return;
        }

        try{
          var last  = 8 - _this.imagesRepeat.datasource.length;
           window.yyesn.client.selectAttachment(function(Re){
             var data= Re.data;
             if(data.length > last){
               _this.pageview.showTip({text:"最多上传8张图片",duration:1000,style:{width:"220px"}});
             }
             for(var i=0,j=last;i<j;i++){
               _this.imagesRepeat.addItem({src:data[i].path});
             }

          },{type:type||1,maxselectnum:last});
        }catch(e){

        }
      },
      headerTitle:function(title){
        return {
            type:"text",
            text:title,
            style:{
              color:titleColor,
              fontSize:17
            }
        };
      },
      rowIconStyle:function(isNoNarginRight){
        var Re = {
           backgroundColor:"#fff",
           justifyContent:"flex-start",
           border:"1px solid #eee",
            padding:"5 10",
           minWidth:65,
            fontSize:12,
            borderRadius:"12px"
        };
        if(isNoNarginRight){
          return Re;
        }else{
           Re.marginRight =  10;
          return Re;
        }

      },
      rowIconIconStyle:{
        color:mainColor,
          fontSize:14,
          marginRight:6
      },
      rowIconTextStyle:{
        color:descColor,
        fontSize:12
      },
      historyLableStyle:{
        fontSize:14,
                backgroundColor:"RGBA(86,86,86,.1)",
                padding:"6 16",
                color:"RGB(86,86,86)",
                borderRadius:"15px",
                marginRight:10
      },
      markLabelStyle:{
        backgroundColor:"rgba(255,169,47,.1)",
            padding:"1 6",
            fontSize:12,
            color:"#FFA92F",
            borderRadius:"20px"
      },
      cancelBackIcon:{
        type:"icon",
        text:"取消",
        style:{
          position: "absolute",
          left: "10px",
          top: "9px",
          width: "50px",
          height: "30px",
        },
        textStyle: {
          color: mainColor,
          fontSize: "16px"
        }
      },
      backIcon:{
        type:"icon",
        text:"返回",
        font:"icomoon_e914",
        textPos:"right",
        style:{
          position: "absolute",
          left: "10px",
          top: "9px",
          width: "50px",
          height: "30px",
        },
        iconStyle:{
          color: mainColor,
          width:12,
          fontSize: "21px",
        },
        textStyle: {
          color: mainColor,
          fontSize: "17px",
          marginLeft:3
        }
      },
      headerStyle:{
        height:"50px",
        borderBottom:"1px solid #e2e8ed",
        backgroundColor:"#fff",
        justifyContent:"center",
        zIndex: 5,
        alignItems:"center"
      },
      createIndexSearchView:function(inputKey){
        return {
          type:"view",
          style:{
            height:51,
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"#fff"
          },
          root:[inputKey]
        };
      },
      searchinput:{
        type:"icon",
        style:{
          width:356,
          height:31,
          justifyContent:"center",
          alignItems:"center",
          backgroundColor:"#F2F3F4",
          borderRadius:"4px"
        },
        textPos:"right",
        textStyle:{
          fontSize:14,
          color:"#CCCCCC"
        },
        iconStyle:{
          fontSize:14,
          color:"#CCCCCC"
        },
        text:"搜索",
        font:"icomoon_e90e"
      },
      convertLabelJsonToStr:function(labelSource){
        var labelArr = [];
        for (var i = 0,j = labelSource.length; i < j; i++) {
          labelArr.push(labelSource[i].title);
        }
        return labelArr.join(";");
      },
      convertLabelStrToJson:function(str){
        if(!str){
          return [];
        }
        var Re =[];
        var itemArr = str.split(";");
        for(var i=0,j=itemArr.length;i<j;i++){
          if(itemArr[i]===""){
            continue;
          }
          Re.push({title:itemArr[i]});
        }
        return Re;
      }
    };
    return Re;
});
