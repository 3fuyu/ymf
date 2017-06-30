define(["./ApplyBase","utils"],function(baseClass,utils){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);

    // description
    var strKey = this.id +"_string";
     this.root.push(strKey);
     this.components[strKey] = {
      type:"text",
      style:utils.processStyle({
        whiteSpace:"pre",
        paddingTop:7,
        marginBottom:10,
        fontSize:13,
        color:"#666",
        paddingLeft:13,
        paddingRight:10
      }),
      textStyle:utils.processStyle({
        whiteSpace: "pre-line"
      }),
      text:this.itemData.description
     };

  }

  utils.extends(Component,baseClass);


  Component.prototype.getConfig = function(){
      return this.itemData;
  };

  Component.prototype.getConfigWhenItemInRepeat = function(){
      return this.itemData;
  };

  return Component;

});
