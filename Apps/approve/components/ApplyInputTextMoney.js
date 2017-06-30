define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);


    c.createMoneyItemLayout(this);

    if(this.itemData.uppercase==="1"&&this.isInDetail===false){
        this.upperCaseKey = this.id+"_upperCase";
        var upperCaseLabelKey = this.id+"_upperCaseLabel";
        this.upperCaseLabelValue = this.id+"_upperCasevalue";
        this.components[this.upperCaseKey] = {
            type:"view",
            className:"form-row form-upper-warp",
            style:utils.processStyle({
                height:40,
                flexDirection:"row",
                marginBottom:5,
                backgroundColor:"#fff",
                justifyContent:"center"
            }),
            root:[upperCaseLabelKey,this.upperCaseLabelValue]
        };
        this.components[upperCaseLabelKey] = {
            type:"text",
            style:utils.processStyle({
                width:60,
                fontSize:15,
                paddingLeft:15,
                color:"#666"
            }),
            text:"大写"
        };
        this.components[this.upperCaseLabelValue] = {
            type:"text",
            ref:true,
            numberofline:2,
            style:utils.processStyle({
                flex:1,
                justifyContent:"flex-end",
                paddingRight:15,
                fontSize:13,
                color:"#999"
            }),
            text:""
        };
        this.root.push(this.upperCaseKey);
    }
    if(this.itemData.uppercase==="1"){
        if(this.isInDetail===false){
            this.plugin[this.upperCaseLabelValue+"_init"] = function(sender,params){
                sender.config.text = c.MoneyDX(_this.itemData.value||0);
            }
        }
    };

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
        if(_this.itemData.uppercase==="1"){
            if(_this.isInDetail===false){
                _this.plugin.pageview.delegate(_this.upperCaseLabelValue,function(target){
                    target.setText(c.MoneyDX(_this.getValue()));
                });
            }else{

            }
        }
    }
    // this.plugin[this.id+"_focus"] = function(sender,params){
    //     _this.scrollIntoView();
    // }
  }

  utils.extends(Component,baseClass);



  return Component;

});
