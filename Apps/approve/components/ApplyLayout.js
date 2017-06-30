define(["./ApplyBase","utils"],function(baseClass,utils){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);

  
  }

  utils.extends(Component,baseClass);




  return Component;

});
