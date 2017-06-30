/**
 * Created by xiaoz on 16/8/13.
 */
define(["utils","base"],function(utils,baseClass){



var BillItem =  function(config){
  var _this = this;
  this.rootInstance = config.rootInstance;
  this.group  = config.group;
  this.itemData = config.itemData;

  var paddingLeft =config.isInFolder===true? utils.getRealWidth(28): utils.getRealWidth(10);
  var iconWidth = utils.getRealWidth(44);
  var leftIconWidth = config.isInFolder===true? utils.getRealWidth(50): utils.getRealWidth(40);
  this.$el = $("<div style='height:"+this.rootInstance.itemHeight+"px;' class='displayflex wc-fl-item yy-fd-row yy-ai-center'></div>");

  var moveIcon = $("<div data-move='true'  style='height:"+this.rootInstance.itemHeight+"px;width:"+leftIconWidth+"px'   class=' yy-wc wc-fl-moveicon displayflex yy-ai-center yy-jc-center'></div>");

  if( config.isInFolder){
    moveIcon = $("<div data-move='true'  style='height:"+this.rootInstance.itemHeight+"px;padding-right:4px;width:"+leftIconWidth+"px'   class=' yy-wc wc-fl-moveicon displayflex yy-ai-center yy-jc-flex-end'></div>");
  }

  var billName = $("<form action='' class='wc-fl-item-name flex-1'></form>");
  billName.bind("submit",function(e){
    e.preventDefault();
    return false;
  });
  this.input = $("<input readonly='readonly'></input>");
  this.input.css({fontSize:this.rootInstance.fontSize,height:this.rootInstance.inputHeight,lineHeight:this.rootInstance.inputHeight+3+"px"});
  this.input.val(this.itemData.name);
  billName.append(this.input);

  var iconFontSize = utils.getRealWidth(16);
  var moreBtn = $("<div  style='width:"+iconWidth+"px;font-size:"+iconFontSize+"px' class=' yy-wc wc-fl-moreicon'></div>");
  this.countLabel = $("<div class='wc-fl-item-count' style='width:"+iconWidth+"px;font-size:"+iconFontSize+"px'>"+(this.itemData.count)+"</div>");
  this.$el.append(moveIcon).append(billName).append(moreBtn).append(this.countLabel );
  moreBtn.bind("click",function(e){
    e.stopPropagation();
    e.preventDefault();
    _this.rootInstance.listItemMoreClick(e,_this.itemData,_this);
  });

  this.$el.bind("click",function(e){
    e.stopPropagation();
    e.preventDefault();
    _this.rootInstance.billItemClick(e,_this.itemData,_this);
  });
  //
  this.input.bind("keydown",function(e){
    if(e.keyCode===13){
      e.stopPropagation();
      e.preventDefault();

      _this.input.blur();
      // _this.rootInstance.listItemInputSubmit(e,_this.itemData,_this);
    }
  });
  this.input.bind("blur",function(e){
    e.stopPropagation();
    e.preventDefault();
    _this.rootInstance.listItemInputBlur(e,_this.itemData,_this);
  });
}

BillItem.prototype={
  enableEdit:function(){
    var _this = this;
    this.input.removeAttr("readonly");
    this.input.addClass("wc-fl-input-rename");
    this.input.focus();
  },
  getSameLevelItemDataSource:function(){
    var items = [];
    if(this.group){
      for(var i=0,j=this.group.items.length;i<j;i++){
        items.push(this.group.items[i].itemData);
      }
    }else{
      for(var n=0,m=this.rootInstance.items.length;n<m;n++){
        items.push(this.rootInstance.items[n].itemData);
      }
    }
    return items;
  },
  getFolderId:function(){
    if(this.group){
      return this.group.itemData.id;
    }else{
      return 0;
    }
  },
  remove:function(){
    var index = -1;
    if(this.group){
       index = this.group.items.indexOf(this);
       if(index>=0){
        this.group.items.splice(index,1);
       }
    }else{
      index = this.rootInstance.items.indexOf(this);
      if(index>=0){
        this.rootInstance.items.splice(index,1);
       }
    }
    this.$el.remove();
  },
  disableEdit:function(){
    this.input.attr("readonly","readonly");
    this.input.removeClass("wc-fl-input-rename");
  },
}


var FolderItem = function(config){
  var _this = this;
  this.rootInstance = config.rootInstance;
  this.itemData = config.itemData;
  this.group = config.group;
  var paddingLeft = utils.getRealWidth(15);
  var iconWidth = utils.getRealWidth(44);
  var leftIconWidth = utils.getRealWidth(26);
  var leftIconFontSize = utils.getRealWidth(19);
  this.$el = $("<div style='height:"+this.rootInstance.itemHeight+"px;padding-left:"+paddingLeft+"px' class='displayflex wc-fl-item yy-fd-row yy-ai-center'></div>");
  var folderIcon = $("<div style='font-size:"+leftIconFontSize+"px;width:"+leftIconWidth+"px' class='wc-fl-ficon yy-wc'></div>");

  var folderName = $("<form action='' class='wc-fl-item-name flex-1'></form>");
  folderName.bind("submit",function(e){
    e.preventDefault();
    return false;
  });

  this.input = $("<input readonly='readonly'></input>");
  this.input.css({fontSize:this.rootInstance.fontSize,height:this.rootInstance.inputHeight});
  this.input.val(this.itemData.name);
  folderName.append(this.input);

  var iconFontSize = utils.getRealWidth(16);
  var moreBtn = $("<div  style='width:"+iconWidth+"px;font-size:"+iconFontSize+"px' class=' yy-wc wc-fl-moreicon'></div>");
  this.dropdownicon = $("<div style='width:"+iconWidth+"px;font-size:"+iconFontSize+"px' class=' yy-wc wc-fl-dpicon'></div>");
  this.$el.append(folderIcon).append(folderName).append(moreBtn).append(this.dropdownicon);

  moreBtn.bind("click",function(e){
    e.stopPropagation();
    e.preventDefault();
    _this.rootInstance.folderMoreClick(e,_this.itemData,_this);
  });

  this.$el.bind("click",function(e){
    e.stopPropagation();
    e.preventDefault();

    _this.group.toggle();
  });

  this.input.bind("keydown",function(e){
    if(e.keyCode===13){
      e.stopPropagation();
      e.preventDefault();
      _this.input.blur();
      // _this.rootInstance.folderInputSubmit(e,_this.itemData,_this);
    }
  });

  this.input.bind("blur",function(e){
    e.stopPropagation();
    e.preventDefault();
    _this.rootInstance.folderInputBlur(e,_this.itemData,_this);
  });
}

FolderItem.prototype = {
  enableEdit:function(){
    var _this = this;
    this.input.removeAttr("readonly");
    this.input.addClass("wc-fl-input-rename");
    this.input.focus();

  },
  remove:function(){

    this.$el.remove();
  },
  getSameLevelFolderDataSource:function(){
    var groups = this.rootInstance.groups;
    var Re = [];
    for(var i=0,j=groups.length;i<j;i++){
      Re.push(groups[i].itemData);
    }
    return Re;
  },

  disableEdit:function(){
    this.input.attr("readonly","readonly");
    this.input.removeClass("wc-fl-input-rename");
  }
}



var BillGroup = function(config){
  this.itemData = config.itemData;
  this.rootInstance = config.rootInstance;
  this.$el = $("<div></div>");
  this.items=[];
  this.isOpen = true;
  var bills = config.itemData.lists||[];
  this.groupHeaderItem = new FolderItem({
    rootInstance:this.rootInstance,
    itemData:config.itemData,
    group:this
  });
  this.groupWrapper = $("<div class='wc-bill-group-wrap'></div>");

  this.$el.append(this.groupHeaderItem.$el).append(this.groupWrapper);
  this.bindData(bills);
}

BillGroup.prototype = {
  toggle:function(){
    if(this.isOpen){
      this.isOpen = false;
      this.groupWrapper.css({height:0});
      this.groupHeaderItem.$el.addClass("wc-fl-item-close");
    }else{
      this.isOpen = true;
      this.groupWrapper.css({height:"auto"});
      this.groupHeaderItem.$el.removeClass("wc-fl-item-close");
    }
  },
   getItemById:function(id){
      id=id.toString();
        var Re;
        for(var i=0,j=this.items.length;i<j;i++){
            if(this.items[i].itemData.id.toString() === id){
                Re = this.items[i];
                break;
            }
        }
        return Re;
    },
    getItemByName:function(name){
        var Re;
        for(var i=0,j=this.items.length;i<j;i++){
            if(this.items[i].itemData.name.toString() === name){
                Re = this.items[i];
                break;
            }
        }
        return Re;
    },
  addItem:function(itemData){
    var item = new BillItem({
      itemData:itemData,
      rootInstance:this.rootInstance,
      isInFolder:true,
      group:this
    });
    this.items.push(item);
    this.groupWrapper.append(item.$el);
  },
  remove:function(){
    var index = this.rootInstance.groups.indexOf(this);
    if(index>=0){
      this.rootInstance.groups.splice(index,1);
    }
    this.$el.remove();
  },
  bindData:function(data){
    this.items=[];
    for(var n=0,m=data.length;n<m;n++){
      var item = new BillItem({
        itemData:data[n],
        rootInstance:this.rootInstance,
        isInFolder:true,
        group:this
      });
      this.items.push(item);
      this.groupWrapper.append(item.$el);
    }
  }
}


    var Component = function(config){
        var _this = this;

        Component.baseConstructor.call(this,config);
        this.$el.addClass("wc-fl-wrap");
        this.fontSize = utils.getRealWidth(16);
        this.inputHeight = utils.getRealHeight(30);
        this.$el.css({fontSize:this.fontSize});

        this.itemHeight = utils.getRealHeight(50);
        var getDataMethodName = config.comKey+"_getdata";
        this.getDataMethod = this.pageview.plugin[getDataMethodName];
        if(!this.getDataMethod){
          console.error("未定义"+getDataMethodName+"方法");
        }

        var folderItemMoreClick = config.comKey+"_foldermoreclick";
        this.folderItemMoreClickMethod = this.pageview.plugin[folderItemMoreClick];

        var listItemMoreClick = config.comKey+"_listitemmoreclick";
        this.listItemMoreClickMethod= this.pageview.plugin[listItemMoreClick];

        var listItemClick = config.comKey+"_listitemclick";
        this.listItemClickMethod= this.pageview.plugin[listItemClick];

        // var folderinputsubmitName = config.comKey+"_folderinputsubmit";
        // this.folderInputSubmitMethod= this.pageview.plugin[folderinputsubmitName];
        //
        // var listiteminputsubmitName = config.comKey+"_listiteminputsubmit";
        // this.listItemInputSubmitMethod= this.pageview.plugin[listiteminputsubmitName];

        var listiteminputblurName = config.comKey+"_listiteminputblur";
        this.listiteminputblurMethod= this.pageview.plugin[listiteminputblurName];


        var folderInputblurMethodName = config.comKey+"_folderinputblur";
        this.folderInputblurMethod= this.pageview.plugin[folderInputblurMethodName];


        this.loadData();

        this.initEvent();
    }

    utils.extends(Component,baseClass);



    Component.prototype.hasSameItem = function(name){
      var item = this.getItemByName(name);
      if(item){
        return true;
      }
      return false;
    };
    Component.prototype.hasSameFolder = function(name){
      var item = this.getGroupByName(name);
      if(item){
        return true;
      }
      return false;
    };

    Component.prototype.getGroupByID = function(id){
      var Re= null;
      for(var i=0,j=this.groups.length;i<j;i++){
        var group = this.groups[i];
        if(group.itemData.id === id){
          Re = group;
          break;
        }
      }
      return Re;
    };

     Component.prototype.getGroupByName = function(name){
      var Re= null;
      for(var i=0,j=this.groups.length;i<j;i++){
        var group = this.groups[i];
        if(group.itemData.name === name){
          Re = group;
          break;
        }
      }
      return Re;
    };

    Component.prototype.getItemByName= function(name){
        var Re;
        for(var i=0,j=this.items.length;i<j;i++){
            if(this.items[i].itemData.name.toString() === name){
                Re = this.items[i];
                break;
            }
        }
        if(Re){
            return Re;
        }
        for(var ii=0,jj=this.groups.length;ii<jj;ii++){
            var group = this.groups[ii];
            var item = group.getItemByName(name);
            if(item){
                Re= item;
                break;
            }
        }
        return Re;
    };


    Component.prototype.getItemById = function(id){

        var Re;
        id = id.toString();
        for(var i=0,j=this.items.length;i<j;i++){
            if(this.items[i].itemData.id.toString() === id){
                Re = this.items[i];
                break;
            }
        }
        if(Re){
            return Re;
        }

        for(var ii=0,jj=this.groups.length;ii<jj;ii++){
            var group = this.groups[ii];
            var item = group.getItemById(id);
            if(item){
                Re= item;
                break;
            }
        }
        return Re;
    };

    Component.prototype.addItemIntoFolder = function(itemData,id){
      var group = this.getGroupByID(id);
      if(group){
        group.addItem(itemData);
      }
    };

    Component.prototype.initEvent = function(){
      var canMove = false;
      this.$el.bind("touchstart",function(e){

        var target = e.target;
        var data_move = target.getAttribute("data-move");
        if(data_move){
          canMove = true;
        }else{
          canMove = false;
        }
      });
      this.$el.bind("touchmove",function(e){
        if(!canMove){
          return;
        }
        e.stopPropagation();
        e.preventDefault();
      });
      this.$el.bind("touchend",function(e){
        if(!canMove){
          return;
        }
      });
    };

    Component.prototype.listItemMoreClick = function(e,itemData,itemInstance){
      this.listItemMoreClickMethod.call(this.pageview.plugin,this,{
        e:e,
        itemData:itemData,
        itemInstance:itemInstance
      });
    };

    Component.prototype.billItemClick = function(e,itemData,itemInstance){
      this.listItemClickMethod.call(this.pageview.plugin,this,{
        e:e,
        itemData:itemData,
        itemInstance:itemInstance
      });
    };

    Component.prototype.folderMoreClick = function(e,itemData,itemInstance){
      this.folderItemMoreClickMethod.call(this.pageview.plugin,this,{
        e:e,
        itemData:itemData,
        itemInstance:itemInstance
      });
    };


    Component.prototype.listItemInputBlur = function(e,itemData,itemInstance){
      this.listiteminputblurMethod.call(this.pageview.plugin,this,{
        e:e,
        itemData:itemData,
        itemInstance:itemInstance
      });
    };
    Component.prototype.folderInputBlur = function(e,itemData,itemInstance){
      this.folderInputblurMethod.call(this.pageview.plugin,this,{
        e:e,
        itemData:itemData,
        itemInstance:itemInstance
      });
    };
    // Component.prototype.folderInputSubmit = function(e,itemData,itemInstance){
    //   this.folderInputSubmitMethod.call(this.pageview.plugin,this,{
    //     e:e,
    //     itemData:itemData,
    //     itemInstance:itemInstance
    //   });
    // };
    //
    // Component.prototype.listItemInputSubmit = function(e,itemData,itemInstance){
    //   this.listItemInputSubmitMethod.call(this.pageview.plugin,this,{
    //     e:e,
    //     itemData:itemData,
    //     itemInstance:itemInstance
    //   });
    // };

    Component.prototype.hideLoading = function(isSuccess){
      var _this = this;
      if(isSuccess===false){
        if(!this.errorWrapper){
          var cb = function(){
            _this.showLoading();
            _this.loadData();
          };
          this.errorWrapper = this._createErrorDom(cb);
          this.errorWrapper.css({height:utils.getRealHeight(60)});
          this.$el.append(this.errorWrapper);
        }
        this.empty();
        this.errorWrapper.removeClass("displaynone");
        if(this.loadingWrapper){
          this.loadingWrapper.addClass("displaynone");
        }
      }else{
        if(this.loadingWrapper){
          this.loadingWrapper.addClass("displaynone");
        }
        if(this.errorWrapper){
          this.errorWrapper.addClass("displaynone");
        }

      }

    };

    Component.prototype.showLoading = function(){
      if(this.errorWrapper){
        this.errorWrapper.addClass("displaynone");
      }
      if(!this.loadingWrapper){
        this.loadingWrapper = $("<div class='wc-fl-loadingwrap displayflex yy-jc-center yy-ai-center displaynone' ><div class='preloader'></div><span>正在加载</span></div>");
        this.$el.append(this.loadingWrapper);
        this.loadingWrapper.css({height:utils.getRealHeight(60)});
      }
      this.loadingWrapper.removeClass("displaynone");
    };

    Component.prototype.loadData = function(){
      var _this = this;
      this.getDataMethod.call(this.pageview.plugin,this,{
        success:function(data){
          _this.bindData(data);
          _this.hideLoading(true);
        },
        error:function(e){
          // tdo
          _this.hideLoading(false);
        }
      });
    };

    Component.prototype.addListItem = function(itemData){
      var billItem = new BillItem({
        itemData:itemData,
        rootInstance:this
      });
      this.$el.append(billItem.$el);
      this.items.push(billItem);
      this.datasource.lists.push(itemData);
    };

    Component.prototype.empty = function(){
       if(this.items){
        for(var n = this.items.length-1;n>=0;n--){
          var item = this.items[n];
          item.remove();
        }
      }
      if(this.groups){
        for(var i=this.groups.length-1;i>=0;i--){
          this.groups[i].remove();
        }
      }


      this.groups = [];
      this.items = [];
    };



    Component.prototype.bindData = function(data){

      this.empty();
      this.datasource = data;
      var folders = data.folder||[];
      var lists = data.lists ||[];
      for(var i=0,j=folders.length;i<j;i++){
        var group = new BillGroup({
          itemData:folders[i],
          rootInstance:this
        });
        this.groups.push(group);
        this.$el.append(group.$el);
      }
      for(var n=0,m=lists.length;n<m;n++){
        var billItem = new BillItem({
          itemData:lists[n],
          rootInstance:this
        });
        this.items.push(billItem);
        this.$el.append(billItem.$el);
      }
    };

    return Component;
});
