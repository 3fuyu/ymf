
define(["utils","base"],function(utils,baseClass){
    var Component = function(config){
        var _this = this;
        // config.tagName = "SPAN";
        config.style = config.style||{};




        var lineHeight = config.style["lineHeight"]||config.style["line-height"];
        lineHeight = !lineHeight||isNaN(lineHeight)?20:lineHeight;
        lineHeight = parseInt(lineHeight);
        delete config.style["line-height"];
        config.style["lineHeight"] = lineHeight+"px";

        var baseWidth = config.baseWidth;
        baseWidth = !baseWidth||isNaN(baseWidth)?356:baseWidth;
        this.baseWidth = utils.getRealWidth(parseInt(baseWidth));


        var fontSize = config.style["fontSize"]||config.style["font-size"];
        fontSize = !fontSize?16:fontSize;
        fontSize = parseInt(fontSize);
        delete config.style["font-size"];
        config.style["fontSize"] = fontSize+"px";



        var offsetCount = config.offsetCount || 0;
        if(utils.deviceInfo().isAndroid){
          offsetCount += 19;
        }

        Component.baseConstructor.call(this,config);
        var numberofline  = this.config.numberofline||3;
        var minRowCount  = this.config.rowCount||2;
        numberofline = isNaN(numberofline)?3:parseInt(numberofline);

        this.closeHeight = numberofline*lineHeight;
        this.$el.addClass ("yy-imgcontent-text");



        this.oneRowFontCount = parseInt(Math.abs(this.baseWidth/fontSize));
        this.textCloseCount = this.oneRowFontCount*minRowCount - offsetCount-1;

        this.preText = this.config.preText||"";
        //initial"
        config.text = config.text === 0?"0":config.text;
        this.innerText = $("<span class='yy-inner-text yy-text-box'></span>");

        this.innerText[0].style["word-break"]="break-all";

        var expandClass = "yy-clearboth yy-icommon "+(this.config.expandBtnInLine?"yy-showall-btn":"yy-expand-btn")+" qaa-showmore-btn displaynone";

        this.actionBtn = $("<div style='font-size:"+utils.fontSize(14)+"px' class='"+expandClass+"'>展开</div>");
        this.closeBtn = $("<div style='font-size:"+utils.fontSize(14)+"px' class='yy-clearboth yy-icommon yy-collapse-btn displaynone'>收起</div>");
        //expand and collapse

        var expandStyle = config.expandStyle;
        if(expandStyle){
          utils.css(this.actionBtn,expandStyle);
        }

        var collapseStyle = config.collapseStyle;
        if(collapseStyle){
          utils.css(this.closeBtn,collapseStyle);
        }

        this.innerWrapper = $("<div></div>");
        var innerWrapperStyle = {position:"relative"};
        this.maxHeight = lineHeight*5;
        if(config.needExpand === true){
          innerWrapperStyle.maxHeight = this.maxHeight+"px";
          innerWrapperStyle.overflow = "hidden";
        }
        this.innerWrapper.css(innerWrapperStyle);
        this.innerWrapper.append(this.innerText);

        this.$el.append(this.innerWrapper);
        if(config.needExpand===true){
          this.$el.append(this.actionBtn).append(this.closeBtn);
        }
        if(config.text.length>0){
          this.setText(config.text);
        }else{
          this.$el.addClass("displaynone");
        }

        this.actionBtn.bind("click",function(){
          _this.showDetail();
        });
        this.closeBtn.bind("click",function(){
          _this.collapse();
        });

        this.innerText.bind("click",function(e){
          var date_imgindex = e.target.getAttribute("data-imgindex");
          if(date_imgindex){
            var imgs = [];
            for(var i=0,j=_this.textInfo.imageDoms.length;i<j;i++){
              imgs.push(_this.textInfo.imageDoms[i].src);
            }
            try{
              window.yyesn.client.viewImage({
                "files":imgs.join(","),
                "index":parseInt(date_imgindex)
              });
            }catch(e){}
          }
        });

    }
    utils.extends(Component,baseClass);

    Component.prototype.setText= function(text){
      var _this = this;

      if(text===null||text===undefined||text.length==0){
        text = "";
        this.$el.addClass("displaynone");
      }else{
        this.$el.removeClass("displaynone");
      }
      this.textInfo = utils.processHTML(text,function(imageDoms){
        for(var i=0,j=imageDoms.length;i<j;i++){
          var itemImage = imageDoms[i];
          itemImage.setAttribute("data-imgindex",i);
          itemImage.style.marginTop = "5px";
          utils.AutoResizeImage(_this.baseWidth,utils.getRealHeight(230),itemImage);
        }
      });



      this.innerText.empty();

      this.preTextDom = $("<span>"+this.preText+"</span>");
      if(this.config.preTextStyle){
        utils.css(this.preTextDom,this.config.preTextStyle);
      }


      this.textInfo.subText = text;

      this.preTextDom.appendTo(this.innerText);

      if(this.config.needExpand===true){
        this.innerText.append(this.textInfo.originalTextDom.html());
      }else{
        this.innerText.append(this.textInfo.dom);
      }
      window.setTimeout(function(){
        _this.showExpendBtn();
      },300);
    };
    Component.prototype.showExpendBtn=function(){
      this.outHeight = this.innerWrapper.height();
      if(this.textInfo.imageDoms.length>0||this.innerText.height()>this.maxHeight){
        this.actionBtn.removeClass("displaynone");
      }
    };
    Component.prototype.collapse = function(){
      this.innerText.empty();
      this.preTextDom&&this.preTextDom.appendTo(this.innerText);
      this.innerWrapper.css({maxHeight:this.outHeight});
      this.innerText.append(this.textInfo.originalTextDom.html());
      if(this.config.needExpand){
        this.closeBtn.addClass("displaynone");
        this.actionBtn.removeClass("displaynone");
      }
    };
    Component.prototype.close = function(){
      this.collapse();
    };
    Component.prototype.showDetail = function(){
        this.innerText.empty();
        this.innerWrapper.css({maxHeight:"10000px"});
        this.preTextDom.appendTo(this.innerText);
        this.innerText.append(this.textInfo.dom.html());
        if(this.config.needExpand===true){
          this.actionBtn.addClass("displaynone");
          this.closeBtn.removeClass("displaynone");
        }
    };


    return Component;
});
