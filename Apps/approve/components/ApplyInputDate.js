define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);
    c.createItemLayout(this);
    var dateType = this.itemData.dateType;
	  this.plugin[this.id+"_warp_click"] = function(sender,params){
        // _this.scrollIntoView();
        if(dateType.toString()==="2"){
             this.yyyyMMddhhssTimePicker.sender = sender;
            this.yyyyMMddhhssTimePicker.curDateBetweenInstance = null;
            this.yyyyMMddhhssTimePicker.curDateInstance = _this;
            this.yyyyMMddhhssTimePicker.show(_this.getText(sender));
        }else{
            this.yyyyMMddTimePicker.sender = sender;
            this.yyyyMMddTimePicker.curDateBetweenInstance = null;
            this.yyyyMMddTimePicker.curDateInstance = _this;
            this.yyyyMMddTimePicker.show(_this.getText(sender));
        }
	  }

  }

  utils.extends(Component,baseClass);


  Component.prototype.setValue = function(str,sender){
            var repeatRowInstance = sender.rowInstance;
      if(repeatRowInstance){
         repeatRowInstance.refs[this.id].setText(str);
      }else{
          this.plugin.pageview.refs[this.id].setText(str);
      }
  };
  Component.prototype.bindInitValueInRepeat=function(sender){
    var val = sender.datasource[this.id]||"";
    if(val.length>0){
       sender.config.text = val;
     }

  };
  Component.prototype.bindInitValue = function(sender){
      if( this.itemData.value.length>0){
      sender.config.text = this.itemData.value;
      }
  };


  Component.prototype.getValue=function () {
      var text = this.plugin.pageview.refs[this.id].getText();
      if(text.indexOf("请选择")>=0){
          text = null;
      }
      return text;
  };
  Component.prototype.getValueWhenItemInRepeat=function (rowInstance) {
      var text = rowInstance.refs[this.id].getText();
      if(text.indexOf("请选择")>=0){
          text = null;
      }
      return text;
  };
  Component.prototype.getText = function(sender){
      var text = null;

      var repeatRowInstance = sender.rowInstance;
      if(repeatRowInstance){
        text = repeatRowInstance.refs[this.id].getText();
      }else{
         text= this.plugin.pageview.refs[this.id].getText();
      }
      if(!text||text.indexOf("请选择")>=0){
          text = null;
      }
      return text;
  };




  return Component;

});
