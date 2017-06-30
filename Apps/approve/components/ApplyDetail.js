define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);
    this.isDetail = true;
      this.titleWrap = this.id+"_titlewrap";
      this.itemInstanceArr = [];
	  this.repeatKey = this.id;
	  this.addBtn = this.id+"_addbtn";

	  var repeatConfig = {
	  	type:"repeat",
        ref:true,
        className:"form-repeat",
	  	style:utils.processStyle({
	  		flexDirection:"column"
	  	}),
	  	itemStyle:utils.processStyle({
	  		width:"100%"
	  	}),
	  	subComponent:this.addBtn,
	  	items:[{}],
	  	root:[this.titleWrap]
	  };
	  var inputs = this.itemData.inputs;
	  for(var i=0,j=inputs.length;i<j;i++){
          var itemInstance = this.plugin.addSubComponent(inputs[i],this.components,repeatConfig.root,this.repeatKey,this);
          if(itemInstance){
              this.itemInstanceArr.push(itemInstance);
          }
	  }

	  this.components[this.titleWrap] = c.getDetailCtlTitle(this.itemData,this.components,this.plugin,this);
	  this.components[this.repeatKey] = repeatConfig;
	  this.components[this.addBtn] ={
	  	type:"icon",
      ref:true,
        src:"./imgs/add.png",
        textPos:"right",
        iconStyle:utils.processStyle({
            w:20,
            lineHeight:"20px"
        }),
	  	style:utils.processStyle({
	  		height:40,
            width:"100%",
	  		borderTop:"1px solid #eee",
	  		backgroundColor:"#fff",
	  		margin:"0px auto 10px auto",
	  	}),
        textStyle:{
            color:"rgb(2,199,255)",
            lineHeight:"15px",
            fontSize:15,
            marginLeft:5
        },
	  	text:this.itemData.actionname||"增加明细"
	  };
    this.summaryRepeatKey = this.id+"_summaryrepeat";

    this.summaryRepeatLabelKey = this.id+"_summaryrepeatlabel";
    this.summaryRepeatLabelValue = this.id+"_summaryrepeatvalue";
    var topview = this.id+"_itemtopview";
    var bottomview = this.id+"_itembottomview";
    this.components[this.summaryRepeatKey] = {
      type:"repeat",
      className:"displaynone",
      items:[],
      style:utils.processStyle({
        flexDirection:"column",
        fontSize:14,
        paddingBottom:3
      }),
      itemStyle:utils.processStyle({
        flexDirection:"column",
        padding:"2px 0px 2px 13px"
      }),
      root:[topview,bottomview],
      ref:true
    };
    this.components[topview] = {
        type:"view",
        style:utils.processStyle({
            flexDirection:"row"
        }),
        root:[this.summaryRepeatLabelKey,this.summaryRepeatLabelValue]
    };
    var upperLabel = this.id+"_upperlabel";
    var uppperValue = this.id+"_uppervalue";
    this.components[bottomview] = {
        type:"view",
        className:"displaynone",
        style:utils.processStyle({
            marginTop:3,
            flexDirection:"row"
        }),
        root:[upperLabel,uppperValue]
    };


    this.components[upperLabel] = {
      type:"text",
      text:"大写",
       style:utils.processStyle({
        color:"#333"
      })
    };
    this.components[uppperValue] = {
      type:"text",
      numberofline:2,
      style:utils.processStyle({
        color:"#999",
        flex:1,
        paddingRight:10,
        marginLeft:30
      })
    };

    this.components[this.summaryRepeatLabelKey] = {
      type:"text",
      text_bind:"label",
       style:utils.processStyle({
        color:"#333"
      })
    };
    this.components[this.summaryRepeatLabelValue] = {
      type:"text",
      text_bind:"value",
      style:utils.processStyle({
        color:"#999",
        marginLeft:30
      })
    };

    this.plugin[bottomview+"_init"] = function(sender,params){
        if(sender.datasource.uppercase ==="1"){
            sender.$el.removeClass("displaynone");
        }
    }

    this.plugin[uppperValue+"_init"] = function(sender,params){
        if(sender.datasource.uppercase ==="1"){
            sender.config.text = c.MoneyDX(sender.datasource.value);
        }
    }


	  this.root.push(this.repeatKey);
    this.root.push(this.summaryRepeatKey);

	  this.plugin[this.addBtn+"_click"] = function(sender,params){
	  	this.repeatAddMoreClick(sender,params);
	  }

  }

  utils.extends(Component,baseClass);


  Component.prototype.bindInitValue = function(sender){
      var inputs = this.itemData.inputs||[];
      var Re = [{}];
      if(inputs.length===0||this.plugin.mode === "NEW"||window.isPreview===true){
      }else{
        for(var i=0,j=inputs.length;i<j;i++){
          var item = {};
          var ctlData = inputs[i];
          var ctlID = ctlData.id.toString();
          var values = ctlData.value||[];
          for(var ii=0,jj=values.length;ii<jj;ii++){
            if(!Re[ii]){
              Re.push({});
            }
            Re[ii][ctlID] = values[ii];
          }

        }
      }
      sender.config.items = Re;
  };

  Component.prototype.getSummaryData = function(){
    var Re = {};
    var Retitle = {};
    var ReCtl={};
    //以 id为Key value为数值的数组
    var _this = this;
    var isError = false;
     this.plugin.pageview.refs[this.repeatKey].eachItem(function(rowInstance){
          for(var i=0,j=_this.itemInstanceArr.length;i<j;i++){
              var item = _this.itemInstanceArr[i];

              if(item.itemData.isSummaryField==="1"){
               if(!Re[item.id]){
                  Re[item.id] = [];
              }
              var itemResult = item.getConfigWhenItemInRepeatForSummary(rowInstance,true);
             var ctlType = itemResult.type;
             var val = 0;
              ReCtl[item.id] = item;
             if(ctlType==="ApplyInputDateBetween"){
               val = _this.getDateDiff(itemResult.value,itemResult.dateType);
               Retitle[item.id] = itemResult.autocalculatetitle+(itemResult.dateType.toString()==="2"?"(时)":"(天)");
               Re[item.id].push({value:val});

             }else if(ctlType==="ApplyInputTextNum"){
               Retitle[item.id] = itemResult.title;
               Re[item.id].push({value:itemResult.value,label:itemResult.title});
             }else if(ctlType==="ApplyInputTextMoney"){
               Retitle[item.id] = itemResult.title;

               Re[item.id].push({value:itemResult.value,uppercase:itemResult.uppercase});
             }
         }


          }
      });
      var result = [];
     for(var key in Re){
       var values = Re[key];
       var sum = this.sumVal(values);
       ReCtl[key].itemData.summaryvalue = sum;
       result.push({label:"总"+(Retitle[key]||""),value:sum,uppercase:values[0].uppercase||"0"});
     }

     return result;
  };
    Component.prototype.bindValue = function(valueArr){

   };

   Math.formatFloat = function(f, digit) {

}
   Component.prototype.sumVal = function(valueArr){
       var Re =[];
       var sum = 0;
       var digit = 0;
       var maxDigit = 0;
       for(var i=0,j=valueArr.length;i<j;i++){
           var val = valueArr[i].value.toString();
           var var_arr = val.split(".");
           if(var_arr.length===2){
                digit = var_arr[1].length;
                if(digit>maxDigit){
                    maxDigit = digit;
                }
           }
           try{
               val = parseFloat(val);
               if(!isNaN(val)){
                   Re.push(val);
               }
           }catch(e){

           }
       }

       //精度丢失
       if(maxDigit>0){
            var m = Math.pow(10, maxDigit);
           for(var ii=0,jj = Re.length;ii<jj;ii++){
               sum+= parseInt(Re[ii] * m, 10) ;
           }
           sum = sum/m;
       }else{
           for(var iii=0,jjj = Re.length;iii<jjj;iii++){
               sum+= Re[iii];
           }
       }



    //    if(maxDigit>0){
    //          var m = Math.pow(10, maxDigit);
    //          Re = parseInt(Re * m, 10) / m;
    //    }


       return this.parseInt(sum);
   };
  Component.prototype.getDateDiff = function(arr,dateType){
      if(!(arr instanceof Array)){
          return 0;
      }
      if(arr.length!=2){
          return 0;
      }
      var startTime = arr[0];
      if(!startTime||startTime===""){
        return 0;
      }
      var endTime =arr[1];
      if(!endTime||endTime===""){
          return 0;
      }

      var startTimeObj = utils.convertToDate(startTime);
      var endTimeObj = utils.convertToDate(endTime);
      var diff = endTimeObj - startTimeObj;
      if(dateType.toString()==="2"){
        diff = (diff/(60*60*1000)).toFixed(1) ;
         }else{
           diff = diff/(24*60*60*1000)+1;
         }
        diff = this.parseInt(diff);

      return diff;
  };
  Component.prototype.updateSummary = function(){
    var _this = this;
    this.plugin.pageview.delegate(this.summaryRepeatKey,function(target){
      target.bindData(_this.getSummaryData());
      target.$el.removeClass("displaynone");
    });
    this.plugin.pageview.delegate(this.addBtn,function(target){
      target.$el.css({marginBottom:4});
    })
  };

  Component.prototype.getConfig=function(){
      var _this = this;
       var Config = utils.copy(this.itemData);
      var Re = {};
      var isError = false;
      //以控件ID为key，value为数组 存储控件的配置  然后在将 value合并成一个控件配置
      this.plugin.pageview.refs[this.repeatKey].eachItem(function(rowInstance){
          for(var i=0,j=_this.itemInstanceArr.length;i<j;i++){
              var item = _this.itemInstanceArr[i];

              if(!Re[item.id]){
                  Re[item.id] = [];
              }
              var itemResult = item.getConfigWhenItemInRepeat(rowInstance);
              if(itemResult===false){
                  isError = true;
                  break;
              }
              Re[item.id].push(itemResult);
          }
      });
      if(isError===true){
          return false;
      }

      var inputs = Config.inputs;
      var inputLen = inputs.length;
      for(var i=0;i<inputLen;i++){
          var childConfig = inputs[i];

          var childId = childConfig.id.toString();
          var childData =Re[childId];

          childConfig.value = [];
          for(var ii=0,jj=childData.length;ii<jj;ii++){
              childConfig.value.push(childData[ii].value);
          }
      }

      // 过滤掉整行为空 以下标字符串为键
      var emptyDict ={};
      for(var n=0;n<inputLen;n++){
          var itemConfig = inputs[n];
          var itemValueArr = itemConfig.value;
          for(var nn = 0,mm = itemValueArr.length;nn<mm;nn++){
              if(emptyDict[nn.toString()]===undefined||emptyDict[nn.toString()]===null){
                  emptyDict[nn.toString()] = true;
              }
              var itemvalue = itemValueArr[nn];
              if(itemvalue!==undefined&&itemvalue!==null&&$.trim(itemvalue)!==""){
                  emptyDict[nn.toString()] = false;
              }
          }
      }


      //删除为空的行
      for(var k=0;k<inputLen;k++){
          var itemConfig = inputs[k];
          var itemValueArr = itemConfig.value;
          for(var kk = itemValueArr.length-1 ;kk>=0;kk--){
             if(emptyDict[kk.toString()]===true){
                 itemValueArr.splice(kk,1);
             }
          }
      }



      return Config;
  };

  return Component;

});
