define(["utils"],function(utils){
  function BaseClass (config){
    var _this = this;
    this.components = config.components;
      this.itemData = config.itemData;
      this.plugin = config.plugin;

      this.id = this.itemData.id.toString();

      this.root = config.root;
      this.DetailInstance = config.DetailInstance; // 如果这个变量不为空的话 那么说明组件是在明细中
      this.isInDetail = true;
      if(!this.DetailInstance){
        this.isInDetail = false;
      }
      this.isSummaryField = this.itemData.isSummaryField==="1";
      this.pageRoot = this.plugin.pageview.config.root;
      this.isRequired = this.itemData.isRequired==="1";
      this.repeatKey = config.repeatKey;
      this.checkListSelectedData = [];

      config.plugin[this.id+"_init"] = function(sender,params){
        if(_this.isInDetail){
          _this.rowInstance = sender.rowInstance;
          _this.bindInitValueInRepeat(sender);
        }else{

          _this.bindInitValue(sender);
        }
      }



  }
  var labelValueNameArr = ["ApplyInputDate",""];
  BaseClass.prototype = {
      parseInt:function(str){
          var strMid = str.toString();
          var len = strMid.length;
          if(len>=3){
              var lastStr = strMid.substring(len-2,len);
              if(lastStr ===".0"){
                  str = parseInt(strMid);
              }
          }
          return str;
      },
      scrollIntoView:function(noNeedCheckDevice){
          var _this = this;
          if(noNeedCheckDevice!==true){
              if(!utils.deviceInfo().isAndroid){
                  return;
              }
          }

          try{
            window.setTimeout(function(){
                if(_this.isInDetail){
                    if(_this.rowInstance){
                        _this.rowInstance.refs[_this.id].$el[0].scrollIntoView();
                    }
                }else{
                    _this.plugin.pageview.refs[_this.id].$el[0].scrollIntoView();
                }
            },40);
          }catch(e){

          }
      },
    bindInitValueInRepeat:function(sender){
          sender.config.value = sender.datasource[this.id];
      },
      bindInitValue:function(sender){
          sender.config.value = this.itemData.value;
      },
      isEnabledConditionField :function () {
        if (!this.plugin.rule) {
            return false;
        }
        var ruleType = this.plugin.rule.activation || 1;
        if (ruleType !== 2) {
            return false;
        }
        var conditions = this.plugin.rule.type_2;
        if (!conditions) {
            return false;
        }
        if (!(conditions instanceof Array)) {
            return false;
        }
        if (conditions.length === 0) {
            return false;
        }
        var Re = false;
        for (i = 0, j = conditions.length; i < j; i++) {
            var conditionItem = conditions[i];
            var itemid = conditionItem.id.toString();
            var idArr = itemid.split(",");
            if (idArr.length === 2) {
                itemid = idArr[1];
            }
            if (itemid === this.id&&conditionItem.enabled.toString()==="1") {
                Re = true;
                break;
            }
        }
        return Re;
    },

      convertText:function(text){
          if(text.indexOf("请选择")>=0){
              text = null;
          }
          return text;
      },
        getValue:function () {
            return this.plugin.pageview.refs[this.id].getValue();
        },
        getValueWhenItemInRepeat:function (rowInstance) {
            return rowInstance.refs[this.id].getValue();
        },
        getConfigWhenItemInRepeat:function(rowInstance){
            return this.getConfig(rowInstance);
        },
         setValue: function () {

         },
         getConfigWhenItemInRepeatForSummary:function(rowInstance){
              var Config = utils.copy(this.itemData);
              var  value = this.getValueWhenItemInRepeat(rowInstance)||"";
              Config.value = value;
              return Config;
         },
         getConfig:function (rowInstance) {
              var value;
              var Config = utils.copy(this.itemData);

              if(rowInstance){
                  value = this.getValueWhenItemInRepeat(rowInstance)||"";

              }else{
                  value = this.getValue()||"";

              }
              if(this.isRequired ){
                  if(value.length===0){
                      this.showRequiedTip();
                      return false;
                  }
              }
              Config.value = value;
              return Config;
          },

    showRequiedTip:function(text){
        this.scrollIntoView(true);
        this.plugin.pageview.showTip({text:(text||this.itemData.title)+"为必填项！",duration:1100});
    },
    createCheckOrRadioList:function(type){
      var _this = this;
      //type radiolist or checklist

    this.components[this.checkListID] = {
          ref:true,
          type:type,
          primaryKey:"id",
          labelKey:"string"
    };


    this.plugin[this.wrapKey+"_click"] = function(sender,params){
      _this.curFormRowInstance = sender.rowInstance;
    //   _this.scrollIntoView();
      this.pageview.refs[_this.checkListID].show();
      var selectedData;
      if(_this.curFormRowInstance){
          if(type==="radiolist"){

            //   sender.rowInstance.datasource[_this.id].id = sender.rowInstance.datasource[_this.id].index;
             selectedData =[sender.rowInstance.datasource[_this.id]]||[];
          }else{
               selectedData = sender.rowInstance.datasource[_this.id]||[];
          }
          this.pageview.refs[_this.checkListID].setSelectedValue(selectedData);
      }else{
        //   selectedData = _this.checkListSelectedData;
      }

      // this.checkBoxCtlClick(sender,params);
    }
    var options = this.itemData.options;
    for(var i=0,j=options.length;i<j;i++){
      options[i].id = i;
      options[i].value = options[i].string;
    }
    this.plugin[this.checkListID+"_loaddata"] = function(sender,params){
      params.success(options);
    }



    // this.pageRoot.push(this.checkListID);
    var CheckListConfig = this.components[this.checkListID];
    // CheckListConfig.$$pageview = this.plugin.pageview;
    utils.getComponentClass(CheckListConfig,function(){
       var checkListInstance = _this.plugin.pageview._prepareComponent(_this.checkListID,null,null);
       _this.plugin.pageview.$el.append(checkListInstance.$el);

    })
    }
  }

  return BaseClass;

});
