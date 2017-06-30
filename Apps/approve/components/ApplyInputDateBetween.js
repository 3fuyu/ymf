define(["./ApplyBase","utils"],function(baseClass,utils){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);
    this.dateType = this.itemData.dateType.toString();
    this.isAutoCaculate = this.itemData.autocalculate==="1";

    this.createItem();
    this.createItem("1");

    if(this.isAutoCaculate){
        this.autoCalculateKey = this.id+"_autocaculate";
        var autoCaculateLabelKey = this.id+"_autocaculateLabel";
        this.autoCaculateLabelValue = this.id+"_autocaculatevalue";
        this.components[this.autoCalculateKey] = {
            type:"view",
            className:"form-row",
            style:utils.processStyle({
                height:40,
                flexDirection:"row",
                marginBottom:10,
                backgroundColor:"#fff",
                justifyContent:"center"
            }),
            root:[autoCaculateLabelKey,this.autoCaculateLabelValue]
        };
        this.components[autoCaculateLabelKey] = {
            type:"text",
            numberofline:2,
            style:utils.processStyle({
                width:240,
                fontSize:15,
                paddingLeft:13,
                color:"#666"
            }),
            text:this.itemData.autocalculatetitle+(this.dateType==="2"?"(时)":"(天)")
        };
        this.components[this.autoCaculateLabelValue] = {
            type:"text",
            ref:true,
            style:utils.processStyle({
                flex:1,
                justifyContent:"flex-end",
                paddingRight:16,
                fontSize:15,
                color:"#999"
            }),
            text:0
        };
        this.root.push(this.autoCalculateKey);

        this.plugin[this.autoCaculateLabelValue+"_init"] = function(sender,params){
            var diffValueArr = [];
            if(_this.isInDetail){
                diffValueArr = sender.datasource[_this.id]||[];
            }else{
                diffValueArr= _this.itemData.value||[];
            }
            sender.config.text = _this.caculateDiff(diffValueArr[0],diffValueArr[1]);
        }
    }

    this.plugin[this.id+"1_init"] = function(sender,params){
        if(_this.isInDetail){
          _this.bindInitValueInRepeat1(sender);
        }else{
          _this.bindInitValue1(sender);
        }
    }

  }


  utils.extends(Component,baseClass);


  Component.prototype.caculateDiff = function(startTime,endTime){
      if(!startTime||!endTime){
        return "0";
      }

      var startTimeObj = utils.convertToDate(startTime);
      var endTimeObj = utils.convertToDate(endTime);
      var diff = endTimeObj - startTimeObj;
      var diffStr = 0;
      if(diff<=0){

        if(this.dateType==="2"){

        }else{
          diffStr=1;
        }
      }else{
         if(this.dateType==="2"){
          diffStr = (diff/(60*60*1000)).toFixed(1) ;
        }else{
          diffStr = diff/(24*60*60*1000)+1;
        }
      }
      diffStr = this.parseInt(diffStr);
      return diffStr;
  },

 Component.prototype.bindInitValue1 = function(sender){
    this.itemData.value = this.itemData.value||[];
    if(!(this.itemData.value instanceof Array)){
      this.itemData.value = [];
    }
    var endTime = this.itemData.value[1]||"";
    endTime = endTime.toString();
    if(endTime.length>0){
      sender.config.text = endTime;
    }
  };
  Component.prototype.bindInitValue = function(sender){
    this.itemData.value = this.itemData.value||[];
    if(!(this.itemData.value instanceof Array)){
      this.itemData.value = [];
    }
    var startTime = this.itemData.value[0]||"";
    startTime = startTime.toString();

    if(startTime.length>0){
      sender.config.text = startTime;
    }
  };

  Component.prototype.bindInitValueInRepeat1=function(sender){
      var value = sender.datasource[this.id];
      if(!(value instanceof Array)){
        value = [];
      }
      var endTime = value[1]||"";
      endTime = endTime.toString();

      if(endTime.length>0){
        sender.config.text = endTime;
      }
    };
   Component.prototype.bindInitValueInRepeat=function(sender){
    var value = sender.datasource[this.id];
      if(!(value instanceof Array)){
        value = [];
      }
      var startTime = value[0]||"";
      startTime = startTime.toString();

      if(startTime.length>0){
        sender.config.text = startTime;
      }
    };

  Component.prototype.createItem = function(index){
      var _this = this;
      index  = index||"";
      var wrapKey = this.id+"_warp"+index;
      var titleKey = this.id+"_title"+index;
      var iconID = this.id.toString()+""+index;

      this.components[wrapKey] ={
        type:"view",
        className:'form-row '+(index==="1"&&!this.isAutoCaculate?"":"from-between-first"),
        style:utils.processStyle({
            backgroundColor:"#fff",
            height:50,
            marginBottom:(index==="1"&&!this.isAutoCaculate)?10:0,
            fontSize:15,
            paddingLeft:13,
            flexDirection:"row"
        }),
        root:[titleKey,iconID]
      };


      this.components[iconID] ={
        type:"icon",
        ref:true,
        textPos:"left",
        text:this.isRequired?"请选择 (必填)":"请选择",
        font:"icomoon_e913",
        textStyle:utils.processStyle({
            color:"#999",
            fontSize:15,
            marginRight:6
        }),
        iconStyle:utils.processStyle({
            color:"#BBBBBB",
            fontSize:14
        }),
        style:utils.processStyle({
            flex:1,
            justifyContent:"flex-end",
            paddingRight:16,

        })
      };
      var label = this.itemData["title"+index]||"";
      this.components[titleKey] ={
        type:"text",
        text:label,
        numberofline:2,
        style:{
            width:100,
            color:"#666"
        }
      };

      this.root.push(wrapKey);



      this.plugin[wrapKey+"_click"] = function(sender,params){
        //   _this.scrollIntoView();
          var dateIndex =  index.toString()==="1"?"1":"0"
          if(_this.dateType.toString()==="2"){
              this.yyyyMMddhhssTimePicker.curDateBetweenInstance = _this;
              this.yyyyMMddhhssTimePicker.curDateBetweenInstanceIndex = dateIndex;
              this.yyyyMMddhhssTimePicker.curDateInstance = null;
              this.yyyyMMddhhssTimePicker.sender = sender;
              this.yyyyMMddhhssTimePicker.show(_this.getSingleValue(dateIndex,sender));
          }else{
              this.yyyyMMddTimePicker.curDateBetweenInstance = _this;
              this.yyyyMMddTimePicker.curDateBetweenInstanceIndex = dateIndex;
              this.yyyyMMddTimePicker.curDateInstance = null;
              this.yyyyMMddTimePicker.sender = sender;
              this.yyyyMMddTimePicker.show(_this.getSingleValue(dateIndex,sender));
          }
      }
  };


  Component.prototype.getValue=function () {
      return [
          this.convertText(this.plugin.pageview.refs[this.id].getText())||"",
          this.convertText(this.plugin.pageview.refs[this.id+"1"].getText())||""
      ];
  };
  Component.prototype.getValueWhenItemInRepeat=function (rowInstance) {
      return [
          this.convertText(rowInstance.refs[this.id].getText())||"",
          this.convertText(rowInstance.refs[this.id+"1"].getText())||""
      ];
  };
    Component.prototype.getConfigWhenItemInRepeatForSummary=function (rowInstance) {
        var Config = utils.copy(this.itemData);
        var value = this.getValueWhenItemInRepeat(rowInstance)||["",""];
        Config.value = value;
        return Config;
    };
   Component.prototype.getConfig=function (rowInstance) {
        var value ;
        var Config = utils.copy(this.itemData);
        if(rowInstance){
            var value = this.getValueWhenItemInRepeat(rowInstance)||["",""];
        }else{
            var value = this.getValue()||["",""];
        }
        if(this.isRequired){
            for(var i=0;i<=1;i++){
                if(value[i].length===0){
                    var text = i===0?this.itemData.title:this.itemData.title1;
                    this.showRequiedTip(text);
                    value =  false;
                    break;
                }
            }
        }
        if(value===false){
            return value;
        }
        Config.value = value;
        return Config;
    };

  Component.prototype.setSingleValue = function(str,index,sender,noChange){
      var textKey = this.id.toString()+""+(index==="0"?"":index);
      var repeatRowInstance = sender.rowInstance;
      if(repeatRowInstance){
        repeatRowInstance.refs[textKey].setText(str);


      }else{
          this.plugin.pageview.refs[textKey].setText(str);

      }
        if(!noChange){
           this.change(str,sender,index);
        }
  };

    Component.prototype.setDiffStr = function(str,repeatRowInstance){
      // var repeatRowInstance = sender.rowInstance;
      if(repeatRowInstance){
        repeatRowInstance.refs[this.autoCaculateLabelValue].setText(str);

      }else{
          this.plugin.pageview.refs[this.autoCaculateLabelValue].setText(str);

      }
  };
  Component.prototype.change = function(str,sender,index){
      var startTime = this.getSingleValue("0",sender);
      if(!startTime){
        this.setSingleValue(str,"0",sender,true);
        startTime = str;
      }
      var endTime = this.getSingleValue("1",sender);
      if(!endTime){
        this.setSingleValue(str,"1",sender,true);
        endTime = str;
      }

      var startTimeObj = utils.convertToDate(startTime);
      var endTimeObj = utils.convertToDate(endTime);
      var diff = endTimeObj - startTimeObj;
      var diffStr = 0;
      if(diff<=0){
        if(index==="0"){
         this.setSingleValue(str,"1",sender,true);
        }else{
         this.setSingleValue(str,"0",sender,true);
        }
        if(this.dateType==="2"){

        }else{
          diffStr=1;
        }
      }else{
         if(this.dateType==="2"){
          diffStr = (diff/(60*60*1000)).toFixed(1) ;

        }else{
          diffStr = diff/(24*60*60*1000)+1;
        }
      }


      diffStr = this.parseInt(diffStr);



     if(this.isAutoCaculate){

      this.setDiffStr(diffStr,sender.rowInstance);
      if(this.isSummaryField){
        this.DetailInstance&&this.DetailInstance.updateSummary();

      }




       if(this.isEnabledConditionField()){
          if(!this.isInDetail){
            this.itemData.diff = diffStr;
          }
            this.plugin.updateApproveLines();
        }


    }
  };


  Component.prototype.getSingleValue = function(index,sender){
      var textKey = this.id.toString()+""+(index==="0"?"":index);
      var text;
      var repeatRowInstance = sender.rowInstance;
      if(repeatRowInstance){
        text = repeatRowInstance.refs[textKey].getText();
      }else{
         text= this.plugin.pageview.refs[textKey].getText();
      }

      return this.convertText(text);
  };

  return Component;

});
