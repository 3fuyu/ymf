/**
 * 首页的上下分类
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils,Dialog) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.accountId = this.pageview.params.accountId;

        this.setHeader();

        this.deviceInfo = utils.deviceInfo();
        this.noNeedFolderListReLoadData = false; //  从排序页面回来Resume不再加载数据 而是在排序请求完加载数据
     }

    pageLogic.prototype = {
        calendar_icon_click:function(){

        },
        createIcon_click: function () {
            this.pageview.go('newtask');
        },
        selector_wrapper_click:function(){
        },
        complete_btn_click:function(){
            this.createDialog.hide();
        },
        create_textArea_init: function (sender) {
            this.create_textArea = sender;
        },
        createDialog_init:function(sender,params){
            this.createDialog = sender;
        },
        onPageResume: function (sender, params) {
          this.setHeader();
          if(this.noNeedReloadData){
            // 在排序没有变动的情况下 不刷新
            this.noNeedReloadData = false;
            return;
          }
            this.pageview.showLoading({
                text: "正在加载...",
                timeout: 9000
            });
            this._loadData();
            if(this.noNeedFolderListReLoadData){
              //  从排序页面回来Resume不再加载数据 而是在排序请求完加载数据
              this.noNeedFolderListReLoadData = false;
            }else{
              this.folderlist.loadData();
            }
        },
        setHeader: function () {
            // var _this = this;
            try {
                window.yyesn.ready(function () {
                    window.yyesn.register({
                        rightvalue: function (d) {
                        }
                    });
                    window.yyesn.client.configNavBar(function (d) {}, {
                        "centerItems":[
                            {"title":"工作清单",
                                "titleColor":"#292f33"},
                        ],
                        "rightItems":[
                        ]
                    });
                });
            }catch (e) {

            }
            // try {
            //     window.yyesn.client.setHeader(function () {
            //     }, {
            //         type: 2,
            //         title: "工作清单",
            //         rightTitle: "",
            //         rightValues: [],
            //     }, function (b) {});
            // } catch (e) {}

        },
        _loadData: function () {
          var _this = this;
          this.pageview.ajax({
            type:"GET",
            timeout:8000,
            url:"/main/entryStatistics",
            data:{},
            success:function(data){
              if(data.code === 0 ){
                _this.loadDataSuccess(data.data);
              }
              _this.pageview.hideLoading(data.code === 0);
            },
            error:function(e){
              _this.pageview.hideLoading(false);
            }
          });


        },
        loadDataSuccess:function(data){
          var _this = this;
          this.pageview.do("first_repeat", function (target) {
              target.bindData(_this.getListCountData(data));
              target.eachItem(function(item){
                var itemDataSource = item.datasource;
                //重要里面有数据的时候才显示入口
                if(itemDataSource.label ==="重要"&&itemDataSource.count.toString()==="0"){
                  item.$el.addClass("displaynone");
                }
              });
          });


        },
        bottom_repeat_init:function(sender,prams){
          sender.config.items = [{
              label: "已完成", icon: "wc_e907", color: "#1FDA9A", count: ""
          }, {
              label: "回收站", icon: "wc_e90f", color: "#FD746E", count: ""
          }];
        },
        getListCountData:function(data){
          var dataDict;
          if(data){
            dataDict = {};
            for(var i=0,j=data.length;i<j;i++){
              dataDict[data[i].code.toString()] = data[i].count;
            }
          }
          var ReData  =[{
              label: "收集箱", icon: "wc_e901", color: "#37b7fd", count: "",code:999
          }, {
              label: "今日", icon: "wc_e918", color: "#ffcf0e", count: "",code:1000
          },{
              label: "最近七天", icon: "wc_e91a", color: "#1FDA9A", count: "",code:1001
          },{
              label: "重要", icon: "wc_e90c", color: "#FD6D78", count: "",code:1003
          },{
              label: "日历", icon: "wc_e916", color: "#5CDDFD", count: ""
          },{
              label: "全部", icon: "wc_e900", color: "#37B7FD", count: "",code:1002
          }];
          if(dataDict){
            for(n=0,m=ReData.length;n<m;n++){
              var code = ReData[n].code;
              if(code){
                code  =code.toString();
                ReData[n].count = dataDict[code];
              }
            }
          }
          return ReData;
        },
        onPageLoad: function () {
            var _this = this;
            this.pageview.showLoading({
                text: "正在加载...",
                timeout: 9000,
                reLoadCallBack: function () {
                    _this._loadData();
                }
            });
            this._loadData();

            _this.pageview.do("first_repeat", function (target) {
                target.bindData(_this.getListCountData());
            });

            this.addListDaialog = new Dialog({
                mode: 3,
                wrapper: this.pageview.$el,
                title: "新清单",
                createContent: function(contentBody) {
                    _this.pageview.getComponentInstanceByComKey("add_list_input", null, null,
                        function(comInstance) {
                            contentBody.append(comInstance.$el);
                            _this.add_list_input = comInstance;
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
                        _this.addListDaialog.hide();
                    }
                }, {
                    title: "添加",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: c.mainColor
                    },
                    onClick: function() {
                      _this.addList();
                    }
                }]
            });


        },

        jiechuMethod:function(sender,params){
          var _this = this;
          var id = this.curFolderItem.itemData.id;
          this.pageview.ajax({
            type:"GET",
            url:"/folder/delete/"+id,
            data:{},
            success:function(data){
              if(data.code===0){
                _this.folderlist.loadData();
              }else{
                _this.pageview.showTip({text:"操作失败,请稍后再试",duration:1200,style:{
                  width:200
                }});
              }
            },
            error:function(){
              _this.pageview.showTip({text:"操作失败,请稍后再试",duration:1200,style:{
                width:200
              }});
            }
          });
        },
        folder_jiechu_btn_click:function(sender,params){
          var _this = this;
          var id = this.curFolderItem.itemData.id;
          this.folder_poplayer.hide();
          this.jiechuMethod();
          // if(!this.jiechuDialog){
          //   this.jiechuDialog = new Dialog({
          //       mode: 3,
          //       wrapper: this.pageview.$el,
          //       contentText:"确定删除解除当前文件夹？",
          //       btnDirection: "row",
          //       buttons: [{
          //           title: "解除",
          //           style: {
          //               height: 45,
          //               fontSize: 16,
          //               color: "red",
          //               borderRight: "1px solid #EEEEEE"
          //           },
          //           onClick: function() {
          //             _this.jiechuMethod();
          //           }
          //       },
          //       {
          //           title: "取消",
          //           style: {
          //               height: 45,
          //               fontSize: 16,
          //               color: c.titleColor
          //           },
          //           onClick: function() {
          //               _this.jiechuDialog.hide();
          //           }
          //       }]
          //   });
          // }
          // this.jiechuDialog.show();
        },

        billitem_del_btn_click:function(sender,params){
          var _this = this;

          this.billitem_poplayer.hide();
          var tips = '';
          if(this.curListItem.itemData.count !== 0){
              tips = '移除后该清单下任务</br>会移动至"<span style="color:#37B7FD">收集箱</span>"';
          }
          else{
              tips = '确定删除清单</br>"<span style="color:#37B7FD">'+ this.curListItem.itemData.name +'</span>"?';
          }
          // if(!this.delItemDialog){
            this.delItemDialog = new Dialog({
                mode: 3,
                wrapper: this.pageview.$el,
                contentText:tips,
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
                        _this.delItemDialog.hide();
                    }
                }, {
                    title: "删除",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: "red"
                    },
                    onClick: function() {
                      _this.delListItem(_this.curListItem.itemData.id);
                    }
                }]
            });
          // }
          this.delItemDialog.show();
        },

        delListItem:function(id){
          var _this= this;
          this.delItemDialog.hide();
          this.pageview.showLoading({
            text:"正在删除"
          });
          this.pageview.ajax({
            type:'POST',
            url:"/list/delete",
            data:{
              id:id
            },
            success:function(data){
              if(data.code===0){
                _this.curListItem.remove();
              }
              _this.pageview.hideLoading(data.code===0);
            },
            error:function(e){
              _this.pageview.hideLoading(false);
            }
          });
        },

        addlistbtn_click:function(sender,params){
          this.addListDaialog.show();
          if (this.add_list_input) {
              this.add_list_input.setValue('');
              this.add_list_input.focus();
          }
        },
        folderlist_init:function(sender){

          this.folderlist = sender;
        },
        addList:function(){
          var _this = this;
          var text = this.add_list_input.getValue();

          if(text.length===0){
            this.pageview.showTip({
              text:"请输入清单内容",
              duration:2000
            });
            return;
          }
          if(this.folderlist.hasSameItem(text)){
             this.pageview.showTip({
                  text:"已存在相同名字的清单!",
                  duration:2000
              });
              return;
          }
          if(text.length>20){
              this.pageview.showTip({
                  text:"清单内容限制20个字符以内",
                  duration:2000
              });
              return;
          }
          this.pageview.showLoading({
            text:"正在提交"
          });
          this.pageview.ajax({
            url:"/list/add",
            type:"POST",
            data:{
              name:text
            },
            success:function(data){
              if(data.code===0){
                _this.addListDaialog.hide();
                //addListItem
                var itemData = {
                  id:data.data.id,
                  name:data.data.name,
                  count:0
                };
                _this.folderlist.addListItem(itemData);
              }
              _this.pageview.hideLoading(data.code===0);
            },
            error:function(){
              _this.pageview.hideLoading(false);
            }

          });

        },

        folder_poplayer_init:function(sender,params){
          this.folder_poplayer = sender;
        },
        folder_cancel_btn_click:function(){
          this.folder_poplayer.hide();
        },
        billitem_cancel_btn_click:function(){
            this.billitem_poplayer.hide();
        },
        billitem_poplayer_init:function(sender,params){
          this.billitem_poplayer = sender;
        },

        folderlist_listitemclick:function(sender,params){
          this.pageview.go("filterlist",{listitemid:params.itemData.id,name:encodeURI(params.itemData.name)});
        },


        // folderlist_listiteminputblur:function(sender,params){
        //
        // },
        // folderlist_folderinputblur:function(sender,params){
        //
        // },
        folderlist_listiteminputblur:function(sender,params){
          this.curListItem = null;
          var oldFolderName = $.trim(params.itemInstance.itemData.name);
          var newFolderName = $.trim(params.itemInstance.input.val());
          if(newFolderName.length>20){
              this.pageview.showTip({
                  text:"清单名称限制20个字符以内",
                  duration:2000
              });
              return;
          }
          params.itemInstance.input.blur();
          params.itemInstance.disableEdit();
          if(oldFolderName===newFolderName){
            return;
          }
          if(newFolderName.length===0){
            params.itemInstance.input.val(oldFolderName);
            return false;
          }
          if(this.folderlist.hasSameItem(newFolderName)){
            this.pageview.showTip({
                  text:"已存在相同名字的清单",
                  duration:2000
              });

            params.itemInstance.input.val(oldFolderName);
            return;
          }
          //todo  不重复
          this.pageview.ajax({
            type:"POST",
            url:"/list/update",
            data:{
              id:params.itemInstance.itemData.id,
              name:newFolderName
            },
            success:function(data){
              if(data.code!==0){
                params.itemInstance.input.val(oldFolderName);
              }else{
                params.itemInstance.itemData.name= newFolderName;
              }
            },
            error:function(e){
              params.itemInstance.input.val(oldFolderName);
            }
          });
        },
        folderlist_folderinputblur:function(sender,params){
          this.curFolderItem = null;
          var oldFolderName = $.trim(params.itemInstance.itemData.name);
          var newFolderName = $.trim(params.itemInstance.input.val());
          if(newFolderName.length>20){
              this.pageview.showTip({
                  text:"文件夹名称限制20个字符以内",
                  duration:2000
              });
              return;
          }
          params.itemInstance.input.blur();
          //todo  不重复
          params.itemInstance.disableEdit();

          if(newFolderName.length===0){
            params.itemInstance.input.val(oldFolderName);
            return false;
          }
          if(oldFolderName===newFolderName){
            return;
          }

          if(this.folderlist.hasSameFolder(newFolderName)){
            this.pageview.showTip({
                  text:"已存在相同名字的文件夹",
                  duration:2000
              });

            params.itemInstance.input.val(oldFolderName);
            return;
          }
          this.pageview.ajax({
            type:"POST",
            url:"/folder/update",
            data:{
              id:params.itemInstance.itemData.id,
              name:newFolderName
            },
            success:function(data){
              if(data.code!==0){
                params.itemInstance.input.val(oldFolderName);
              }else{
                params.itemInstance.itemData.name= newFolderName;
              }
            },
            error:function(e){
              params.itemInstance.input.val(oldFolderName);
            }
          });
        },


        folder_rename_btn_click:function(sender){
          var _this = this;
          this.folder_poplayer.hide();
          this.curFolderItem.enableEdit();
          if(!this.deviceInfo.isIOS){
            window.setTimeout(function(){
              // _this.curFolderItem.$el[0].scrollIntoView();
              _this.page_content.$el[0].scrollTop = _this.curFolderItem.$el.offset().top+_this.page_content.$el[0].scrollTop;
            },300);
          }


        },
        page_content_init:function(sender,param){
          this.page_content = sender;
        },
        billitem_rename_btn_click:function(sender,params){
          var _this = this;
          this.billitem_poplayer.hide();
          this.curListItem.enableEdit();
          if(!this.deviceInfo.isIOS){
          window.setTimeout(function(){
            // _this.curListItem.$el[0].scrollIntoView();
            _this.page_content.$el[0].scrollTop = _this.curListItem.$el.offset().top+_this.page_content.$el[0].scrollTop;
          },300);
        }

        },
        MoveItemToFolder:function(itemInstance,folderData){
          var itemData = itemInstance.itemData;
          var _this = this;
          this.pageview.ajax({
            type:"POST",
            url:"/list/move",
            data:{
              ids:itemData.id.toString(),
              folderId:folderData.id.toString()
            },
            success:function(data){
              if(data.code===0){
                itemInstance.remove();
                _this.folderlist.addItemIntoFolder(itemData,folderData.id);
              }
              //
            },
            error:function(e){

            }
          });
        },
        cancelCurEdit:function(){
          if(this.curFolderItem){
            this.curFolderItem.input.val(this.curFolderItem.itemData.name);
            this.curFolderItem.disableEdit();
          }
          if(this.curListItem){
            this.curListItem.input.val(this.curListItem.itemData.name);
            this.curListItem.disableEdit();
          }
        },
        folderlist_foldermoreclick:function(sender,params){
          this.cancelCurEdit();
          this.curFolderItem = params.itemInstance;
          var folders = this.curFolderItem.getSameLevelFolderDataSource();
          if(folders.length===1){
            this.folder_sort_btn.$el.addClass("displaynone");
          }else{
            this.folder_sort_btn.$el.removeClass("displaynone");
          }
          this.folder_poplayer.show();
        },
        folder_sort_btn_click:function(){
          this.folder_poplayer.hide();
          var folders = this.curFolderItem.getSameLevelFolderDataSource();
          this.pageview.showPage({
            pageKey:"sortpage",
            mode:"fromBottom",
            nocache:true,
            params:{
              items:folders,
              type:"folder"
            }
          });
        },
        sortBillItem:function(data,folderId){
          var _this = this;
          this.pageview.showLoading({
            text:"正在排序"
          });
          this.pageview.ajax({
            type:"POST",
            url:"/list/sort",
            data:{
              folderId:folderId,
              sort:JSON.stringify(data)
            },
            success:function(data){
              if(data.code===0){
                _this.folderlist.loadData();
              }else{
                _this.pageview.showTip({
                    text:"操作失败!请稍后再试",
                    duration:1200
                });
              }
              _this.pageview.hideLoading(data.code===0);
            },
            error:function(error){
                _this.pageview.hideLoading(false);
            }
          });
        },
        sortFolder:function(data){
          var _this = this;
          this.pageview.showLoading({
            text:"正在排序"
          });
          this.pageview.ajax({
            type:"POST",
            url:"/folder/sort",
            data:{
              sort:JSON.stringify(data)
            },
            success:function(data){
                if(data.code===0){
                  _this.folderlist.loadData();
                }
                _this.pageview.hideLoading(data.code===0);
            },
            error:function(error){
                _this.pageview.hideLoading(false);
            }
          });
        },
        folder_sort_btn_init:function(sender){
          this.folder_sort_btn = sender;
        },

        folderlist_listitemmoreclick:function(sender,params){
          this.cancelCurEdit();
          this.curListItem = params.itemInstance;
          var items = this.curListItem.getSameLevelItemDataSource();
          if(items.length===1){
            this.billitem_sort_btn.$el.addClass("displaynone");
          }else{
            this.billitem_sort_btn.$el.removeClass("displaynone");
          }
          this.billitem_poplayer.show();
        },
        billitem_sort_btn_init:function(sender,params){
          this.billitem_sort_btn = sender;
        },
        billitem_sort_btn_click:function(sender,params){
          this.billitem_poplayer.hide();
          var items = this.curListItem.getSameLevelItemDataSource();
          var folderID = this.curListItem.getFolderId()||0;
          this.pageview.showPage({
            pageKey:"sortpage",
            mode:"fromBottom",
            nocache:true,
            params:{
              items:items,
              type:"item",
              folderID:folderID
            }
          });
        },

        folderlist_getdata:function(sender,params){
          var _this = this;
          this.pageview.ajax({
              type: "GET",
              url: "/main/list",
              timeout: 7000,
              data: {},
              success: function (data) {
                  if (data.code === 0) {
                      params.success(data.data);
                  } else {
                    params.error();
                  }
              },
              error: function (error) {
                  params.error();
              }
          });
        },
        first_repeat_init: function(sender, params){
            this.first_repeat = sender;
        },
        first_repeat_itemclick: function (sender, params) {
          var code = sender.datasource.code,
              name = encodeURI(sender.datasource.label),
              label = sender.datasource.label;

            switch (label) {
                case "收集箱":
                    this.pageview.go("filterlist", {
                      listid: 999,
                      name: name
                    });
                    break;
                case "重要":
                    this.pageview.go("todaylist", {
                        listtype: 1003
                    });
                    break;
                case "全部":
                    this.pageview.go("todaylist", {
                        listtype: 1002
                    });
                    break;
                case "今日":
                    this.pageview.go("todaylist", {
                        listtype: 1000
                    });
                    break;
                case "最近七天":
                    this.pageview.go("recentlylist", {
                        listtype: 1001
                    });
                    break;
                case "日历":
                    this.pageview.go("calendarlist", {
                        listtype: 1001
                    });
                    break;
                default:
            }
        },

        second_repeat_itemclick: function (sender, params) {
            var code = sender.datasource.code;
            var name = encodeURI(sender.datasource.name);
            this.pageview.go("filterlist", {
                listid: code,
                name: name
            });
        },
        billitem_moveto_btn_click:function(sender,params){

          this.billitem_poplayer.hide();
          this.pageview.showPage({
            pageKey:"itemmovetofolder",
            mode:"fromBottom",
            nocache:true,
            params:{
              listitem:this.curListItem,
              datasource:this.folderlist.datasource
            }
          });
        },
        bottom_repeat_itemclick: function(sender, params) {
            var label = sender.datasource.label;
            switch (label) {
                case "已完成":
                    this.pageview.go("donelist", {
                    });
                    break;
                case "回收站":
                    this.pageview.go("trashlist", {
                    });
                    break;
                default:
            }
        },
    };
    return pageLogic;
});
