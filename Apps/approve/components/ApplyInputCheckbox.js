define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);

    c.createItemLayout(this);

    this.checkListID =   this.id +"_radiolist";
      this.plugin[this.checkListID+"_selected"] = function(sender,params){
        var Re = [];
          for(var i=0,j=params.selectedValue.length;i<j;i++){
            Re.push(params.selectedValue[i].string);
          }
          if(_this.curFormRowInstance){
              _this.curFormRowInstance.datasource[_this.id]= params.selectedValue;
               _this.curFormRowInstance.refs[_this.id].setText(Re.join(","));
          }else{
            //   _this.checkListSelectedData = params.selectedValue;
              this.pageview.refs[_this.id].setText(Re.join(","));
          }
    }

    config.plugin[this.checkListID+"_init"] = function(sender,params){
      if(_this.isInDetail){
        // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
        // _this.bindSelectListInitValueInRepeat(sender);
      }else{
        _this.bindSelectListInitValue(sender);
      }
    }
    this.createCheckOrRadioList("checklist");


  }

  utils.extends(Component,baseClass);


  Component.prototype.bindInitValue = function(sender){
    this.itemData.value = this.itemData.value||[];
    var Re = [];
    for(var i=0,j=this.itemData.value.length;i<j;i++){

      Re.push(this.itemData.value[i].value||this.itemData.value[i].string);
    }
    if(Re.length>0){
       this.initValue = this.itemData.value;
       sender.config.text = Re.join(",");
    }
  };

    Component.prototype.bindInitValueInRepeat = function(sender){

          // 点击多选的时候 显示的是控件的datasource中的id数据源 所以在控件初始化的时候 更新一下组件的数据源 而不是checklist的数据源
      var itemsData = sender.datasource[this.id];
      var value = utils.copy(itemsData||[]);
      var Re = [];
      for(var i=0,j=value.length;i<j;i++){
          itemsData[i].id =  itemsData[i].index;// 点击多选的时候 显示的是控件的datasource中的id数据源
        Re.push(value[i].value);
      }
      if(Re.length>0){
         sender.config.text = Re.join(",");
      }
    };

   Component.prototype.bindSelectListInitValue = function(sender){
    this.itemData.value = this.itemData.value||[];
    for(var i=0,j=this.itemData.value.length;i<j;i++){
      this.itemData.value[i].id = this.itemData.value[i].index;
    }
    sender.config.selectedValue = this.itemData.value ;
  };

  Component.prototype.getValue=function () {
      return this.plugin.pageview.refs[this.checkListID].selectedValue;
  };

  Component.prototype.getValueWhenItemInRepeat=function (rowInstance) {
      return rowInstance.datasource[this.id];
  };
   Component.prototype.getConfig=function (rowInstance) {
        var value ;
         var Config = utils.copy(this.itemData);
        if(rowInstance){
            value = this.getValueWhenItemInRepeat(rowInstance)||[];
        }else{
            value = this.getValue()||[];
        }
        if(this.isRequired){
            if(value.length===0){
                this.showRequiedTip();
                return false;
            }
        }
        var newRe = [];
        for(var i = 0,j = value.length;i<j;i++){
            var repeatItemData = value[i];
            newRe.push({
                index:repeatItemData.id,
                value:repeatItemData.value
            });
        }
        Config.value = newRe;
        return Config;
    };



  return Component;

});
