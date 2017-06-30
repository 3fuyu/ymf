
define(["utils","base","./commonCtl"],function(utils,baseClass,c){
    var Component = function(config){
        var _this = this;
        var width = utils.getRealWidth(55);
        config.style = config.style||{};
        Component.baseConstructor.call(this,config);
        var numberofline ;
        if(config.numberofline){
          numberofline = config.numberofline || 1;
        }

        var Re = utils.processHTML(config.text||"");
        this.hasImage = false;
        this.textWrapper = $("<div class=' yy-text-box yy-flex-1 list-desctext-wrap'></dov>");
        this.innerText = $("<span></span>");
        this.textWrapper.append(this.innerText);
        if(Re.imageDoms.length>0){
            this.hasImage = true;
          var img = $(Re.imageDoms[0]);
          utils.AutoResizeImage(width,width,Re.imageDoms[0],"1");
          // alert(Re.imageDoms[0].src);
          var imgWrapper = $("<div class='displayflex yy-jc-center yy-ai-center' ></div>");
          utils.css(imgWrapper,{
            marginTop:4,
            overflow:"hidden",
            marginRight:9,
            backgroundColor:"#ccc",
            width:55,
            height:55
          });
          this.$el.css({backgroundColor:"#fbfbfb"})
          imgWrapper.append(img);
          this.$el.append(imgWrapper);
          this.$el.addClass ("yy-text displayflex yy-al-flex-start yy-fd-row");
        }else{
          this.$el.addClass ("yy-text");
        }

        var paddingTop = utils.getRealHeight(10);


        this.setText(Re.curText);
        if(numberofline){
          this.textWrapper[0].style["-webkit-line-clamp"]=numberofline;
          this.innerText[0].style["-webkit-line-clamp"]=numberofline;
        }
        if(this.hasImage){
          this.textWrapper[0].style["padding-top"]=paddingTop+"px";
        }
        this.$el.append(this.textWrapper);

        if(!config.text||config.text==""){
          this.$el.empty();
        }
    }
    utils.extends(Component,baseClass);

    Component.prototype.setText= function(text){
      if(!this.hasImage&&(text===null||text==undefined||text==="")){
        this.$el.addClass("displaynone");
        return;
      }
      this.innerText.html("描述:&nbsp;&nbsp;"+text);
    };

    return Component;
});
