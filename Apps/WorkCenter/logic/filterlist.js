/**
 * 用户自定义的分类列表
 **/
define(["../parts/common", "utils", "../../../components/dialog", "../parts/timepicker"], function(com, utils, dialog, timepicker) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.token = this.pageview.params.token || "";
        this.listid = this.pageview.params.listid;

        this.selectEndTime = utils.ConvertDateToStr(new Date(),"yyyy-MM-dd");
        if(this.pageview.params.name){
            this.name = decodeURI(this.pageview.params.name);
        }


        this.deadlineTimePicker = null;
        this.NowDate = utils.getDateInfo(new Date());
        this.year = new Date().getFullYear();
        this.now = new Date();
        this.nowTime = this.now.getTime();
        this.listitemid = this.pageview.params.listitemid; //清单ID
        if (this.listitemid) {
            this.isFromListItem = true; //说明来自清单点击
        }
        //如果参数中有清单ID 说明是点击清单进入该页面 请求接口为

        this.deadlineTimePicker = null;

        this.headRightValue = '编辑';
        this.setHeader();
    }
    pageLogic.prototype = {
        todo_listview_init: function(sender, params) {
            this.todo_listview = sender;
            if (this.isFromListItem) {
                //  来自清单
                sender.config.ajaxConfig.url = "/list/getTasks";
                sender.setAjaxConfigParams({
                    listId: this.listitemid,
                    order: 1001,
                    completed:0
                });
            } else {
                //来自 收集箱 等
                sender.setAjaxConfigParams({
                    order: 1001,//按照创建时间排序
                    code: 999
                });
            }

            sender.loadFirstPageData();


        },
        haddone_listview_init: function(sender, params) {
            this.haddone_listview = sender;
            sender.$el.addClass("displaynone");
            if (this.isFromListItem) {
                //  来自清单
                sender.config.ajaxConfig.url = "/list/getTasks";
                sender.setAjaxConfigParams({
                    listId: this.listitemid,
                    order: 1001,
                    completed:1
                });
            } else {
                //来自 收集箱 等
                sender.setAjaxConfigParams({
                    order: 1001,
                    completed:1,
                    code: 999
                });
            }
            sender.loadFirstPageData();

        },

        completeBtn_init: function(sender, params) {
            this.completeBtn = sender;
            sender.setDisabled(true);
        },
        setImportantBtn_init: function(sender, params) {
            this.setImportantBtn = sender;
            sender.setDisabled(true);
        },
        moreBtn_init: function(sender) {
            this.moreBtn = sender;
            sender.setDisabled(true);
        },
        onPageResume: function(sender, params) {
            this.setHeader();
            this._reloadPage();
        },


        setHeader: function() {
            var _this = this;
            try {
                window.yyesn.ready(function () {
                    window.yyesn.register({
                        rightvalue: function (d) {
                            _this._editOrCancel();
                        }
                    });
                    window.yyesn.client.configNavBar(function (d) {}, {
                        "centerItems":[
                            {"title":_this.name,
                                "titleColor":"#292f33"},
                        ],
                        "rightItems":[
                            {"title":_this.headRightValue,
                                "callback":'rightvalue'},
                        ]
                    });
                });
            }catch (e) {

            }
            // try {
            //     window.yyesn.client.setHeader(function() {}, {
            //         type: 2,
            //         title: _this.name,
            //         rightTitle: _this.headRightValue,
            //         rightValues: [{
            //             key: 'edit',
            //             value: _this.headRightValue
            //         }],
            //     }, function(b) {
            //         b.registerHandler("edit", function(data, responseCallback) {
            //             _this._editOrCancel();
            //         });
            //     });
            // } catch (e) {
            //
            // }
        },
        //简易创建清单回车事件
        addInput_init: function(sender) {
            this.addInput = sender;
        },
        addInput_keydown: function(sender, params) {
            if (params.e.keyCode === 13) {
                sender.blur();
                this.addTask();
            }
        },
        completeListBtn_init:function(sender){
          this.completeListBtn = sender;
          this.changeListUI();

          //
        },
        page_content_pulltorefresh: function(sender, params) {

            this.todo_listview.loadFirstPageData();
            this.completeListBtn.setText("查看已完成");
            this.haddone_listview.$el.addClass("displaynone");
        },
        todo_listview_selectChange: function(sender, params) {

            if (this.isAllImportant()) {
                this.setImportantBtn.setText("撤销重要");
            } else {
                this.setImportantBtn.setText("标记重要");
            }
            if (this.isAllComplete()) {
                this.completeBtn.setText("转为待办");
            } else {
                this.completeBtn.setText("完成本单");
            }
            var selectedLen = this.todo_listview.selectedRows.length;
            if (selectedLen === sender.getRowCount()) {
                this.selectedAll.selected();
            } else {
                this.selectedAll.unSelected();
            }
            if (selectedLen > 0) {
                this._setToolbarDisabled(false);
            } else {
                this._setToolbarDisabled(true);
            }

        },
        _setToolbarDisabled: function(isDisabled) {
            this.completeBtn.setDisabled(isDisabled);
            this.moreBtn.setDisabled(isDisabled);
            this.setImportantBtn.setDisabled(isDisabled);
        },
        //列表项点击事件
        todo_listview_rowclick: function(sender, params) {
            this.curPageSelectedRow = sender;
            com.gotoDetail(sender,this.pageview);
        },
        haddone_listview_rowclick: function(sender, params) {
            this.curPageSelectedRow = sender;
            com.gotoDetail(sender,this.pageview);
        },
        row_flag_click: function(sender, params) {
            var _this = this;
            if(sender.datasource.completed === 1){
                return;
            }
            if (this.todo_listview.status === "edit") {
                return;
            }
            if (sender.isSelected) {

                this.pageview.ajax({
                    url: "/task/importance",
                    type: "POST",
                    timeout: 7000,
                    data: {
                        ids: sender.datasource.id,
                        importance: 0
                    },
                    success: function(data) {
                        if (data.code === 0) {
                            sender.rowInstance.datasource.importance = 0;
                            sender.unSelected();
                        } else {
                            _this.pageview.showLoadingError();
                        }
                    },
                    error: function(error) {
                        _this.pageview.showLoadingError();
                    }

                });
            } else {
                this.setImportant(sender.datasource.id, sender);
                //sender.selected();
            }
        },
        row_flag_init: function(sender, params) {
            this.row_flag = sender;
            if (sender.datasource.importance === 1) {
                sender.selected();
            }
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-flag-completed");
            }
        },
        row_checkbox_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.selected();
                sender.$el.addClass("todo-checkbox-completed");
            }
        },
        //清单标题内容初始化
        row_title_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-text-completed");
            }
        },
        row_time_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-time-completed");
            }

            if (utils.compareDate(this.nowTime,sender.datasource.endTime)>0) {
                sender.$el.addClass("todo-time-limit");
            }
            sender.config.text = com.smartTimestamp(sender.datasource.endTime);
        },
        selectedAll_init: function(sender) {
            this.selectedAll = sender;
        },
        sureIcon_init: function(sender, params) {
            this.sureIcon = sender;
            sender.$el.addClass("displaynone");
        },
        sureIcon_click: function(sender, params) {
            this.addTask();
        },
        addTask: function() {
            var importance = 0; //0为不重要,1为重要
            var listId = 0;
            if (this.listtype === '1002') {
                importance = 1;
            } else {
                importance = 0;
            }
            if(this.listitemid){
                listId = this.listitemid;
            }
            if (this.selectEndTime) {
                var inputVal = this.addInput.getValue();
                if (inputVal) {
                    if (inputVal === '' || 1 > inputVal.length || inputVal.length > 50) {
                        this.pageview.showTip({
                            text: "请输入50个字符以内的任务内容",
                            duration: 1800
                        });
                        return;
                    }
                    //ajax请求
                    var _this = this;
                    this.pageview.showLoading({
                        text:"正在处理中..."
                    });
                    this.pageview.ajax({
                        url: "task/add",
                        type: "POST",
                        timeout: 7000,
                        data: {
                            name: inputVal,
                            listId: listId,
                            importance: importance,
                            endTime: _this.selectEndTime
                        },
                        success: function(data) {
                            if (data.code === 0) {
                                _this.addSuccess(data.data,_this.selectEndTime);
                            }
                            _this.pageview.hideLoading(data.code === 0);
                        },
                        error: function(error) {
                            _this.pageview.hideLoading(false);
                        }

                    });
                } else {
                    this.pageview.showTip({
                        text: "请填写任务",
                        duration: 1000
                    });
                }
            } else {
                this.pageview.showTip({
                    text: "请选择结束时间",
                    duration: 1000
                });
            }
        },

        addSuccess:function(data,endTime){
          this.addInput.setValue("");
          this.sureIcon.$el.addClass("displaynone");
          var RowData = {
            completed:0,
            completedTime:null,
            endTime:utils.convertToDate(endTime).getTime(),
            id:data.id,
            mirrorId:data.mirrorId,
            importance:0,
            multi:0,
            name:data.name
          };
          this.todo_listview.insertRow(RowData, 0);
          this.page_content.$el[0].scrollTop = 0;
          this.todoListViewData.push(RowData);
          this.changeListUI();
        },
        addCompleted:function(data){
            //设置完成后加到已完成列表中去
            var index;
            this.haddone_listview.insertRow(data,0);
            for(index=0 ; index<this.todoListViewData.length ; index++){
                if(this.todoListViewData[index].id === data.id){
                    this.todoListViewData.splice(index, 1);
                }
            }
            this.haddoListViewData.push(data);
            this.changeListUI();
        },
        addUnCompleted:function(data){
            //设置未完成后加到待办列表中去
            var index;
            this.todo_listview.insertRow(data,0);
            // this.haddoListViewData.remove(data);
            for(index=0 ; index<this.haddoListViewData.length ; index++){
                if(this.haddoListViewData[index].id === data.id){
                    this.haddoListViewData.splice(index, 1);
                }
            }
            this.todoListViewData.push(data);
            this.changeListUI();
        },
        _resetHaddoneListView:function(){
          this.completeListBtn.setText("查看已完成");
          this.haddone_listview.$el.addClass("displaynone");
        },
        //顶部的segment 点击切换事件
        page_segment_change: function(sender, params) {
            var _this = this;
            this._resetHaddoneListView();
            switch (params.item.index) {
                case 0:
                    this.todo_listview.setAjaxConfigParams({
                        code: +_this.listid,
                        order: 1001
                    });
                    break;

                case 1:
                    this.todo_listview.setAjaxConfigParams({
                        code: +_this.listid,
                        order: 1000
                    });
                    break;

                case 2:
                    this.todo_listview.setAjaxConfigParams({
                        code: +_this.listid,
                        order: 1004
                    });
                    break;
                default:

            }
            this.todo_listview.loadFirstPageData();
        },
        row_checkbox_wrapper_click:function(sender,params){
            this.row_checkbox_click(sender.components.row_checkbox,null);
        },
        row_checkbox_click: function(sender, params) {
            var rowdata = sender.datasource;
            var _this = this;

            if (!sender.value) {
                this.setComplete(rowdata.id, sender);
            } else {
                this.setUncomplete(rowdata.id, sender);
                // this.pageview.ajax({
                //     url: "task/complete",
                //     type: "POST",
                //     timeout: 7000,
                //     data: {
                //         ids: rowdata.id,
                //         completed: 0
                //     },
                //     success: function(data) {
                //         if (data.code === 0) {
                //             sender.unSelected();
                //             rowdata.completed = 0;
                //             sender.rowInstance.rebind(rowdata);
                //         } else {
                //             _this.pageview.showLoadingError();
                //         }
                //     },
                //     error: function(error) {
                //         _this.pageview.showLoadingError();
                //     }
                //
                // });
            }
        },
        isAllComplete: function() {
            //判断是否全部为已标记为已完成的
            var selectedRows = this.todo_listview.selectedRows;
            var isAll = true;
            if (selectedRows.length === 0) {
                isAll = false;
            }
            selectedRows.forEach(function(row) {
                if (row.datasource.completed === 0) {
                    isAll = false;
                }
            });
            return isAll;
            //console.log(selectedRows);
        },
        selectedAll_click: function(sender, params) {
            var _this  = this;
            if (this.todo_listview.getRowCount()=== 0 || sender.value) {

                sender.unSelected();
                this._setToolbarDisabled(true);
                this.todo_listview.clearSelectAll();
            } else {
                this.todo_listview.selectAll();
                if (this.isAllImportant()) {
                    this.setImportantBtn.setText("撤销重要");

                } else {
                    this.setImportantBtn.setText("标记重要");
                }
                if (this.isAllComplete()) {
                    this.completeBtn.setText("转为待办");
                } else {
                    this.completeBtn.setText("完成本单");
                }
                sender.selected();
                this._setToolbarDisabled(false);
            }

        },
        todo_listview_parsedata: function(sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }
            this.todoListViewData = data.data;
            this.changeListUI();
            return data.data;
        },
        changeListUI:function () {
            //这里判断待办的数目,为0的时候作相应的UI变化
            if(this.todoListViewData && this.haddoListViewData && this.completeListBtn){
                if(this.todoListViewData.length === 0 && this.haddoListViewData.length !== 0){
                    //只有已完成列表:显示查看按钮,已完成列表默认收起
                    this.todo_listview.$el.addClass("displaynone");
                    this.completeListBtn.$el.removeClass("displaynone");
                    if(this.completeListBtn.getText() === "查看已完成"){
                        this.haddone_listview.$el.addClass("displaynone");
                    }
                    else{
                        this.haddone_listview.$el.removeClass("displaynone");
                    }
                }
                else if(this.todoListViewData.length !== 0 && this.haddoListViewData.length !== 0){
                    //两个列表都有数据:待办列表显示,显示查看按钮,已完成列表默认收起
                    this.todo_listview.$el.removeClass("displaynone");
                    this.completeListBtn.$el.removeClass("displaynone");
                    if(this.completeListBtn.getText() === "查看已完成"){
                        this.haddone_listview.$el.addClass("displaynone");
                    }
                    else{
                        this.haddone_listview.$el.removeClass("displaynone");
                    }
                }
                else{
                    //只有待办列表:不显示查看按钮
                    //两个列表都没有数据:不显示查看按钮,待办列表的空页面显示
                    this.todo_listview.$el.removeClass("displaynone");
                    this.haddone_listview.$el.addClass("displaynone");
                    this.completeListBtn.$el.addClass("displaynone");
                }
            }
        },

        ToolBar_init: function(sender) {
            this.ToolBar = sender;
        },
        page_segment_init: function(sender) {
            this.page_segment = sender;
        },
        addInputWrapper_init: function(sender) {
            this.addInputWrapper = sender;
        },

        morePopover_init: function(sender) {
            this.morePopover = sender;
        },
        moreRepeat_icon_init: function(sender, params) {
            if (sender.datasource.title == '移除') {
                sender.config.textStyle.color = "#FF4E5B";
            }
        },
        addInput_focus: function(sender, params) {
            var _this = this;
            this.isFirst = this.isFirst || "true";
            this.sureIcon.$el.removeClass("displaynone");
            window.setTimeout(function() {
                sender.$el[0].scrollIntoViewIfNeeded();
            }, 200);
        },
        addInput_blur: function(sender, params) {
            var _this = this;
            if(sender.getValue()){
                return;
            }
            setTimeout(function() {
                _this.sureIcon.$el.addClass("displaynone");
            }, 100);
        },

        haddone_listview_parsedata: function(sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }

            this.haddoListViewData = data.data;
            this.changeListUI();
            return data.data;
        },
        completeListBtn_click: function(sender, params) {
            var _this = this;
            if (sender.getText() === "查看已完成") {
                sender.setText("隐藏已完成");
                this.haddone_listview.$el.removeClass("displaynone");
            } else {
              this.pageview.refs.page_content.LoadMoreWrapper.addClass("displaynone");
                sender.setText("查看已完成");
                this.haddone_listview.$el.addClass("displaynone");
            }

        },
        page_content_init:function(sender){
          this.page_content = sender;

        },
        todo_listview_afterload:function(){
          var _this = this;
          window.setTimeout(function(){
            _this.page_content.LoadMoreWrapper.addClass("displaynone");
          },301);
          this.pageview.delegate("completeListBtn",function(target){
              target.$el.removeClass("displaynone");
          });
          this.changeListUI();
        },
        page_content_loadmore: function(sender, params) {
            var haddone_listview_ishide = this.pageview.refs.completeListBtn.getText()!=="隐藏已完成";
            if(!haddone_listview_ishide){
                this.haddone_listview.loadNextPageData();
            }else{
            }
        },
        addIcon_click: function(sender, params) {
            this.pageview.go("add");
        },
        moreBtn_click: function(sender) {
            this.morePopover.show(sender);
        },
        dateIcon_init: function(sender, params){
            //今日,最近七天,全部,重要 默认选中当天,样式相应改变
            sender.config.font = "wc_e912";
            sender.config.text = this.NowDate.day;
            sender.config.style.color = "#0093ff";
        },
        dateIcon_click: function(sender, params) {
            var _this = this;
            if (this.deadlineTimePicker === null) {
                this.deadlineTimePicker = new timepicker({
                    cancelText: "移除",
                    cancelBtnClassName: "wc-tp-btn",
                    okBtnClassName: "wc-tp-btn"
                });
                this.deadlineTimePicker.mapping.yyyy.start = (this.year);
                this.deadlineTimePicker.mapping.yyyy.end = (this.year + 4);
                this.deadlineTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
                    .setMinValue((this.year) + "-1-1 00:00")
                    .bind("clear", function() {

                    })
                    .bind("ok", function(valStr) {
                        var dateInfo = utils.getDateInfo(valStr);
                        var selectDay = dateInfo.day;
                        _this.curSelecteData = valStr;
                        sender.setText(selectDay);
                        sender.setIcon("wc_e912", {
                            color: "#0093ff"
                        });
                        _this.selectEndTime = valStr;
                    })
                    .bind("cancel", function() {
                        _this.curSelecteData = _this.NowDate.year + '-' + _this.NowDate.month + '-' + _this.NowDate.day;
                        sender.setText(_this.NowDate.day);
                        sender.setIcon("wc_e912");
                        _this.selectEndTime = _this.curSelecteData;

                    }).setTitle("到期时间");
            }
            this.deadlineTimePicker.show(_this.curSelecteData);
        },
        showDeleteDialog: function() {
            var _this = this;
            if (!this.deleteDialog) {
                this.deleteDialog = new dialog({
                    mode: 3,
                    wrapper: this.pageview.$el,
                    contentText: "确定要移除所选任务吗？",
                    btnDirection: "row",
                    buttons: [{
                        title: "确定",
                        style: {
                            height: 45,
                            fontSize: 16,
                            borderRight: "1px solid #EEEEEE",
                            color: com.mainColor
                        },
                        onClick: function() {
                            _this.deleteSelectedRows();
                        }
                    }, {
                        title: "取消",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: com.titleColor,
                        },
                        onClick: function() {
                            _this.deleteDialog.hide();
                        }
                    }]
                });
            }
            this.deleteDialog.show();
        },
        moreRepeat_icon_click: function(sender, params) {

            var selectedRows = this.todo_listview.selectedRows,
                selectIds = [];

            if (sender.text === '移除') {
                //删除
                this.showDeleteDialog();
            } else {
                //点击移动至
                for (var i = 0; i < selectedRows.length; i++) {
                    selectIds.push(selectedRows[i].datasource.id);
                }
                selectIds.join(',');

                this.pageview.showPage({
                    pageKey: "category",
                    nocache: true,
                    mode: "fromBottom",
                    params: {
                        action: "moveto",
                        ids: selectIds.toString(),
                        className: "",
                        classId: ""
                    }
                });
            }
            this.morePopover.hide();
        },
        //移动操作完成之后的回调，重新刷新页面
        moveItemTo: function(categoryid, category) {
            var _this = this;
            this._editOrCancel();
            this._reloadPage();
        },
        deleteSelectedRows: function() {
            var _this = this;
            var ids = this.getSelectedIds();
            this.pageview.showLoading({
                text:"正在处理中..."
            });
            this.pageview.ajax({
                url: "/main/delete",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    dataSource:1
                },
                success: function(data) {
                    if (data.code === 0) {
                        //ajax 成功之后 物理删除
                        _this.pageview.showTip({
                            text: '已移除至"回收站"',
                            duration: 1000,
                        });
                        var selectedRows = _this.todo_listview.selectedRows;
                        for (var i = selectedRows.length - 1; i >= 0; i--) {
                            selectedRows[i].remove();
                        }
                        // _this._setToolbarDisabled(true);
                        _this.deleteDialog.hide();
                        //如果是全选删除的话，需要更新列表
                        if (_this.selectedAll.value) {
                            _this._reloadPage();
                        }
                        _this._editOrCancel();
                    }
                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                    _this.pageview.hideLoading(false);
                }

            });
        },
        row_team_init: function(sender, params){
            if(sender.datasource.multi === 0){
                sender.$el.addClass("displaynone");
            }
        },
        hideDoneList: function(){
            //编辑时已完成及其查看已完成按钮隐藏
            this.completeListBtn.$el.addClass("displaynone");
            this.haddone_listview.$el.addClass("displaynone");
        },
        showDoneList: function(){
            //非编辑时已完成及其查看已完成按钮显示
            this.completeListBtn.$el.removeClass("displaynone");
            if(this.completeListBtn.getText()==="查看已完成"){
                this.haddone_listview.$el.addClass("displaynone");
            }
            else{
                this.haddone_listview.$el.removeClass("displaynone");
            }
        },
        testEditor_click: function(sender, params) {
            if (this.todo_listview.status === "edit") {
                this.ToolBar.$el.addClass("displaynone");
                this.page_segment.$el.removeClass("displaynone");
                this.addInputWrapper.$el.removeClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
                });
                this.showDoneList();

            } else {
                this.ToolBar.$el.removeClass("displaynone");
                this.page_segment.$el.addClass("displaynone");
                this.addInputWrapper.$el.addClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.addClass("displaynone");
                });
                this._clearSelectEditInfo();
                this.hideDoneList();
            }
            this.todo_listview.setLeftOpen();

        },
        //原生调用

        _afterSetSuccess:function(){
          // if(this.completeListBtn.getText()!=="隐藏已完成"){
          //   this.completeListBtn.setText("隐藏已完成");
          // }

          this.ToolBar.$el.addClass("displaynone");
          this.page_segment.$el.removeClass("displaynone");
          this.addInputWrapper.$el.removeClass("displaynone");
          this.todo_listview.eachRow(function(row) {
              row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
          });
          this.headRightValue = '编辑';
          this._clearSelectEditInfo();

          this.showDoneList();
          this.todo_listview.setLeftClose();
          this.setHeader();
        },
        _editOrCancel: function() {
            if (this.todo_listview.status === "edit") {
                this.ToolBar.$el.addClass("displaynone");
                this.page_segment.$el.removeClass("displaynone");
                this.addInputWrapper.$el.removeClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
                });
                this.headRightValue = '编辑';
                this._clearSelectEditInfo();
                this.showDoneList();

            } else {
                this.ToolBar.$el.removeClass("displaynone");
                this.page_segment.$el.addClass("displaynone");
                this.addInputWrapper.$el.addClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.addClass("displaynone");
                });
                this.headRightValue = '取消';
                this.hideDoneList();
            }
            this.todo_listview.setLeftOpen();
            this.setHeader();
        },
        //取消编辑的时候清除信息
        _clearSelectEditInfo: function() {
            //清除选中状态
            this.todo_listview.clearSelectAll();
            //全选按钮清除选中
            this.selectedAll.unSelected();
            //底部不可操作
            this._setToolbarDisabled(true);
        },
        completeBtn_click: function(sender, params) {
            var ids = this.getSelectedIds();
            if (sender.getText() == "完成本单") {
                this.setComplete(ids);
            } else {
                this.setUncomplete(ids);
            }
        },
        row_checkbox_wrapper_init: function(sender) {
            if (this.todo_listview.status === "edit") {
                sender.$el.addClass("displaynone");
            }
        },
        setImportantBtn_click: function(sender, params) {
            var ids = this.getSelectedIds();
            if (sender.getText() == "标记重要") {
                this.setImportant(ids);
            } else {
                this.setUnimportant(ids);
            }

        },
        setComplete: function(ids, aim) {
            var _this = this;
            //标记已完成请求
            this.pageview.showLoading({
                text:"正在处理中..."
            });
            this.pageview.ajax({
                url: "task/complete",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    completed: 1
                },
                success: function(data) {
                    if (data.code === 0) {
                        // _this.pageview.showTip({
                        //     text: "清单已完成，可前往已完成列表查看",
                        //     duration: 2500,
                        // });

                        if (aim) {
                            aim.selected();
                            aim.datasource.completed = 1;
                            aim.rowInstance.rebind(aim.datasource);
                            _this.addCompleted(aim.datasource);
                            aim.rowInstance.remove();
                        }
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            _this.todo_listview.status = "";
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = selectedRows.length - 1; i >= 0; i--) {
                                selectedRows[i].datasource.completed = 1;
                                _this.addCompleted(selectedRows[i].datasource);
                                selectedRows[i].remove();
                                // selectedRows[i].datasource.completed = 1;
                                // selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            // _this._setToolbarDisabled(true);
                            // _this.selectedAll.unSelected();

                            //如果是全选完成的话，需要更新列表
                            if (_this.selectedAll.value) {
                                _this._reloadPage();
                            }
                            _this._afterSetSuccess();
                        }
                    }
                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                    _this.pageview.hideLoading(false);
                }

            });
        },
        setUncomplete: function(ids, aim) {
            var _this = this;
            //标记已完成请求
            this.pageview.showLoading({text:"正在处理中..."});
            this.pageview.ajax({
                url: "task/complete",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    completed: 0
                },
                success: function(data) {
                    if (data.code === 0) {
                        if (aim) {
                            aim.selected();
                            aim.datasource.completed = 0;
                            aim.rowInstance.rebind(aim.datasource);
                            _this.addUnCompleted(aim.datasource);
                            aim.rowInstance.remove();
                        }
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            _this.todo_listview.status = "";
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = selectedRows.length - 1; i >= 0; i--) {
                                selectedRows[i].datasource.completed = 0;
                                _this.addUnCompleted(selectedRows[i].datasource);
                                selectedRows[i].remove();
                                // console.log(selectedRows[i]);
                                // var rowdata = selectedRows[i].datasource;
                                // selectedRows[i].unSelected();
                                // rowdata.completed = 0;
                                // selectedRows[i].rebind(rowdata);
                                // selectedRows[i].datasource.completed = 1;
                                // selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            // _this._setToolbarDisabled(true);
                            // _this.selectedAll.unSelected();
                            _this._afterSetSuccess();
                        }

                    }
                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                    _this.pageview.hideLoading(false);
                }

            });
        },
        setUnimportant: function(ids) {
            //批量取消标记为重要
            var _this = this;
            this.pageview.showLoading({
                text:"正在处理中..."
            });
            this.pageview.ajax({
                url: "/task/importance",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    importance: 0
                },
                success: function(data) {
                    if (data.code === 0) {
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = 0; i < selectedRows.length; i++) {
                                selectedRows[i].datasource.importance = 0;
                                selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            // _this._setToolbarDisabled(true);
                            // _this.selectedAll.unSelected();
                            _this._editOrCancel();
                        }
                    }
                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                    _this.pageview.hideLoading(false);
                }

            });
        },
        setImportant: function(ids, aim) {
            //标记重要请求
            var _this = this;
            this.pageview.showLoading({
                text:"正在处理中..."
            });
            this.pageview.ajax({
                url: "task/importance",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    importance: 1
                },
                success: function(data) {
                    if (data.code === 0) {
                        if (aim) {
                            aim.selected();
                            aim.rowInstance.datasource.importance = 1;
                        }
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = 0; i < selectedRows.length; i++) {
                                selectedRows[i].datasource.importance = 1;
                                selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            // _this._setToolbarDisabled(true);
                            // _this.selectedAll.unSelected();
                            _this._editOrCancel();
                        }
                    }
                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                    _this.pageview.hideLoading(false);
                }

            });
        },
        getSelectedIds: function() {
            var selectedIds = [],
                Ids,
                selectedRows = this.todo_listview.selectedRows;
            for (var i = 0; i < selectedRows.length; i++) {
                selectedIds[i] = selectedRows[i].datasource.id;
            }
            Ids = selectedIds.join(',');
            return Ids;
        },
        isAllImportant: function() {
            //判断是否全部为已标记为重要的
            var selectedRows = this.todo_listview.selectedRows;
            var isAll = true;
            if (selectedRows.length === 0) {
                isAll = false;
            }
            selectedRows.forEach(function(row) {
                if (row.datasource.importance === 0) {
                    isAll = false;
                }
            });
            return isAll;
            //console.log(selectedRows);
        },
        _reloadPage: function() {
            var _this = this;

            // this.todo_listview.selectedRows = [];
            // this.todo_listview.setAjaxConfigParams({
            //     id: +_this.listid,
            //     sort: 1
            // });
            //
            if (this.isFromListItem) {
                //  来自清单
                this.todo_listview.config.ajaxConfig.url = "/list/getTasks";
                this.todo_listview.setAjaxConfigParams({
                    listId: this.listitemid,
                    order: 1000,
                    completed:0
                });
                this.haddone_listview.config.ajaxConfig.url = "/list/getTasks";
                this.haddone_listview.setAjaxConfigParams({
                    listId: this.listitemid,
                    order: 1001,
                    completed:1
                });
            } else {
                //来自 收集箱 等
                // alert(this.listid);
                this.todo_listview.setAjaxConfigParams({
                    code: +this.listid,
                    order: 1000
                });
            }

            this.todo_listview.loadFirstPageData();
        }
    };
    return pageLogic;
});
