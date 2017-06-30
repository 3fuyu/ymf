define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);
    c.createItemLayout(this);
    this.checkListID=   this.id +"_radiolist";
      this.plugin[this.checkListID+"_selected"] = function(sender,params){
          if(_this.curFormRowInstance){
             _this.curFormRowInstance.datasource[_this.id]= params.selectedValue[0];
            _this.curFormRowInstance.refs[_this.id].setText(params.selectedValue[0].string);
          }else{
            //   _this.checkListSelectedData=  params.selectedValue;
              this.pageview.refs[_this.id].setText(params.selectedValue[0].string);

              if(_this.isEnabledConditionField()){
                  this.updateApproveLines();
              }
          }
    }
    //1.
    config.plugin[this.checkListID+"_init"] = function(sender,params){
      if(_this.isInDetail){
        // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
        // _this.bindSelectListInitValueInRepeat(sender);
      }else{
        _this.bindSelectListInitValue(sender);
      }
    }
    //2
    this.createCheckOrRadioList("radiolist");




  }

  utils.extends(Component,baseClass);


  Component.prototype.bindInitValue = function(sender){
      if(this.itemData.value===""||this.itemData.value===undefined||this.itemData.value===null){
          return;
      }
    this.itemData.value = [this.itemData.value]||[];
    var Re = [];

    for(var i=0,j=this.itemData.value.length;i<j;i++){
      this.itemData.value[i].id = this.itemData.value[i].index;
      Re.push(this.itemData.value[i].value);
    }
    if(Re.length>0){
       sender.config.text = Re.join(",");
    }
  };

   Component.prototype.bindSelectListInitValue = function(sender){

    var ArrValue = [this.itemData.value]||[];
    for(var i=0,j=ArrValue.length;i<j;i++){
      ArrValue[i].id = ArrValue[i].index;
      ArrValue[i].string = ArrValue[i].value;
    }
    sender.config.selectedValue= (ArrValue);
  };



    Component.prototype.getValue=function () {
        // var _this = this;
        // window.setTimeout(function(){
        //     _this.plugin.pageview.refs[_this.checkListID].selectedValue[0].string
        // },200);

      return this.plugin.pageview.refs[this.checkListID].selectedValue[0].string;

    };
    Component.prototype.getRadioValue=function () {
        return this.plugin.pageview.refs[this.checkListID].selectedValue;

    };
    Component.prototype.bindInitValueInRepeat = function(sender){
        if(sender.datasource[this.id]){
            sender.datasource[this.id].id = sender.datasource[this.id].index;
        }
          // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
      var value = utils.copy(sender.datasource[this.id]);
      var Re = [];
      if(value){
        value.id = value.index;// 点击多选的时候 显示的是控件的datasource中的id数据源
        sender.config.text =value.value;
      }

    };

    Component.prototype.getValueWhenItemInRepeat=function (rowInstance) {
        return rowInstance.datasource[this.id];
    };
     Component.prototype.getConfig=function (rowInstance) {
          var value ;

          var Config = utils.copy(this.itemData);
          if(rowInstance){
              value = [this.getValueWhenItemInRepeat(rowInstance)];
          }else{
              value = this.getRadioValue()||[];
          }

          var newRe = [];
          for(var i = 0,j = value.length;i<j;i++){

              repeatItemData = value[i];
              if(!repeatItemData){
                  if(this.isRequired){
                          this.showRequiedTip();
                          return false;
                  }
                   Config.value = {};
                   break;
              }
              Config.value =({
                  index:repeatItemData.id,
                  value:repeatItemData.value
              });

              break;
          }

        //   Config.value = newRe;

          return Config;
      };


  return Component;

});
