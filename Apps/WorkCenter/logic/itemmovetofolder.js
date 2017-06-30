/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils,Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.folders = this.pageview.showPageParams.datasource.folder||[];
        this.listitem = this.pageview.showPageParams.listitem;
        this.setHeader();
        
    }

    pageLogic.prototype = {
         setHeader: function() {
             try {
                 window.yyesn.ready(function () {
                     window.yyesn.register({
                         rightvalue: function (d) {
                         }
                     });
                     window.yyesn.client.configNavBar(function (d) {}, {
                         "centerItems":[
                             {"title":"移动至",
                                 "titleColor":"#292f33"},
                         ],
                         "rightItems":[
                         ]
                     });
                 });
             }catch (e) {

             }
          // try {
          // window.yyesn.client.setHeader(function () {
          //   }, {
          //     type: 2,
          //     title: "移动至",
          //     rightTitle: "",
          //     rightValues: [],
          // }, function (b) {});
          // } catch (e) {}
      },
      onPageResume:function(){
      },

      hasSameNameFolder:function(name){
        var Re = false;
        var datasource = this.folder_reapeat.datasource;
        for(var i=0,j=datasource.length;i<j;i++){
          if($.trim(datasource[i].name) === $.trim(name)){
            Re = true;
            break;
          }
        }
        return Re;

      },

      onPageLoad:function(){
        var _this = this;
        this.addFolderDialog = new Dialog({
            mode: 3,
            wrapper: this.pageview.$el,
            title: "新建文件夹",
            createContent: function(contentBody) {
                _this.pageview.getComponentInstanceByComKey("add_folder_input", null, null,
                    function(comInstance) {
                        contentBody.append(comInstance.$el);
                        _this.add_folder_input = comInstance;
                    },
                    function() {});
            },
            btnDirection: "row",
            buttons: [{
                title: "取消",
                style: {
                    height: 45,
                    fontSize: 16,
                    color: c.titleColor,
                    borderRight: "1px solid #EEEEEE"
                },
                onClick: function() {
                    _this.addFolderDialog.hide();
                }
            }, {
                title: "确定",
                style: {
                    height: 45,
                    fontSize: 16,
                    color: c.mainColor
                },
                onClick: function() {
                  _this.addFolder();
                }
            }]
        });

      },
      folder_reapeat_init:function(sender,params){
        this.folder_reapeat = sender;
        sender.config.items = this.folders;
      },
      folder_reapeat_itemclick:function(sender){
        sender.select();
        this.pageview.ownerPage.plugin.MoveItemToFolder(this.listitem,sender.datasource);
        this.pageview.goBack();
      },
      addFolder:function(){
        var _this = this;
          var folderName = this.add_folder_input.getValue();
          if(folderName.length===0){
            return;
          }
          if(folderName.length>20){
              this.pageview.showTip({
                  text:"文件夹名称20字以内",
                  duration:2000
              });
              return;
          }
          if(this.hasSameNameFolder(folderName)){
            this.pageview.showTip({
                  text:"已存在相同名字的文件夹",
                  duration:2000
              });

            return;
          }
          this.addFolderDialog.hide();
          this.pageview.showLoading({
            text:"正在创建"
          });
          this.add_folder_input.setValue("");
          this.pageview.ajax({
            type:"POST",
            url:"/folder/add",
            data:{
              name:folderName,
              listIds:""
            },
            success:function(data){
              if(data.code===0){
                var itemData = {
                  id:data.data.id,
                  name:data.data.name
                };
                _this.pageview.refs.folder_reapeat.insertItem(itemData,-1);
              }
              _this.pageview.hideLoading(data.code===0);
            },
            error:function(){
              _this.pageview.hideLoading(false);
            }
          });
      },
      addFolderBtn_click:function(sender){
        var _this = this;
        this.addFolderDialog.show();
        this.add_folder_input.focus();

      }
    };
    return pageLogic;
});
