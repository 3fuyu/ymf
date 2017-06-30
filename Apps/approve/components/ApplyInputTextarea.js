define(["./ApplyBase","utils","../parts/common"],function(baseClass,utils,c){
  function Component (config){
    var _this = this;
    Component.baseConstructor.call(this,config);

      this.titleKey = this.id+"_title";
  	  this.root.push(this.titleKey);
  	  this.root.push(this.id);
	  this.components[this.titleKey] =c.getCtlTitle(this.itemData.title);
      var placeholder = this.itemData.placeholder||"";
      placeholder= this.isRequired?placeholder+" (必填)":placeholder;
	   this.components[this.id] ={
	  	type:"textarea",
        ref:true,
        className:'form-row',
	  	placeholder:placeholder,
	  	style:utils.processStyle({
	  		backgroundColor:"#fff",
	  		height:80,
	  		fontSize:15,
            marginBottom:"10",
	  		paddingTop:10,
	  		paddingLeft:13,
	  	})
	  };
    //   this.plugin[this.id+"_focus"] = function(sender,params){
    //       _this.scrollIntoView();
    //   }
  }

  utils.extends(Component,baseClass);





  return Component;

});
