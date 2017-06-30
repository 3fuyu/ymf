define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);

    c.createMoneyItemLayout(this);

    this.plugin[this.id+"_keyup"] = function(sender,params){
        var repeatItemInstance = sender.rowInstance;
        if(repeatItemInstance){
            if(_this.isSummaryField){
              _this.DetailInstance.updateSummary();
            }
        }
        if(_this.isEnabledConditionField()){
            this.updateApproveLines();
        }
    }

    // this.plugin[this.id+"_focus"] = function(sender,params){
    //     _this.scrollIntoView();
    // }
  }

  utils.extends(Component,baseClass);

  return Component;

});
