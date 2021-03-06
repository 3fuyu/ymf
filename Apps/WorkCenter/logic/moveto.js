/**
 * 今日列表、重要列表、全部列表
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function(com, utils, dialog) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.listtype = this.pageview.params.listtype;
        this.type = this.pageview.params.listtype;

        this.headRightValue = '编辑';
        this.setHeader();
    }
    pageLogic.prototype = {
        completeBtn_init: function(sender, params) {
            this.completeBtn = sender;
            sender.setDisabled(true);
        },
        completeListBtn_init:function(sender,params){
            if(this.listtype==='1003'){
                sender.$el.hide();
            }
            else{
                sender.$el.show();
            }
        },
        setImportantBtn_init: function(sender, params) {
            this.setImportantBtn = sender;
            sender.setDisabled(true);
        },
        moreBtn_init: function(sender) {
            this.moreBtn = sender;
            sender.setDisabled(true);
        },
        _setToolbarDisabled: function(isDisabled) {
            this.completeBtn.setDisabled(isDisabled);
            this.moreBtn.setDisabled(isDisabled);
            this.setImportantBtn.setDisabled(isDisabled);
        },
        todo_listview_init: function(sender, params) {
            this.todo_listview = sender;
            this.todo_listview.setAjaxConfigParams({
                code: +this.listtype
            });
        },
        onPageResume: function(sender, params) {
            this.setHeader();
            this._reloadPage();
        },
        onPageLoad: function(sender, params) {

        },
        setHeader: function() {
            var _this = this,
                label = '';
            switch (this.listtype) {
                case '1002':
                    label = '重要';
                    break;
                case '1003':
                    label = '全部';
                    break;
                case '1000':
                    label = '今日';
                    break;
                default:
            }
            try {
                window.yyesn.ready(function () {
                    window.yyesn.register({
                        rightvalue: function (d) {
                            _this._editOrCancel();
                        }
                    });
                    window.yyesn.client.configNavBar(function (d) {}, {
                        "centerItems":[
                            {"title":label,
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
            //         title: label,
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
        addInput_keydown: function(sender, params) {
            var value = sender.getValue();
            var importance = 0; //0为不重要,1为重要
            if (this.listtype === '1002') {
                importance = 1;
            } else {
                importance = 0;
            }
            if (params.e.keyCode === 13) {

                if (value === '' || 1 > value.length || value.length > 100) {
                    this.pageview.showTip({
                        text: "请输入100个字符以内的清单内容",
                        duration: 1800
                    });
                    return;
                }

                //ajax请求
                var _this = this;
                var endDate = new Date();
                this.pageview.ajax({
                    url: "list/add",
                    type: "POST",
                    timeout: 7000,
                    data: {
                        content: value,
                        classId: 0,
                        className: "未分类",
                        importance: importance,
                        completed: 0,
                        remark: "",
                        endTime: com.formatTime(endDate, "yyyy-MM-dd")
                    },
                    success: function(data) {
                        if (data.code === 0) {
                            // _this.todo_listview.insertGroup(data.data, 0).insertRow(data.data, 0);
                            sender.setValue("");
                            _this.todo_listview.setAjaxConfigParams({

                            });
                            _this.todo_listview.loadFirstPageData();
                        } else {
                            _this.pageview.showLoadingError();
                        }
                    },
                    error: function(error) {
                        _this.pageview.showLoadingError();
                    }

                });
            }
        },
        nodata_image_init: function(sender, params) {
            if (this.type === "1000") {
                sender.config.text = "今日未创建清单,赶紧去行动吧";
            } else if (this.type === "1002") {
                sender.config.text = "未创建重要清单,赶紧去行动吧";
            } else {
                sender.config.text = "未创建任何清单,赶紧去行动吧";
            }
        },
        todo_listview_selectChange: function(sender, params) {
            if (this.isAllImportant()) {
                this.setImportantBtn.setText("撤销重要");
            } else {
                this.setImportantBtn.setText("标记重要");
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
        //列表项点击事件
        todo_listview_rowclick: function(sender, params) {
            this.curPageSelectedRow = sender;
            this.pageview.go("add", {
                id: sender.datasource.id,
                mode: 'edit'
            });
        },
        row_flag_init: function(sender, params) {
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
        row_title_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-text-completed");
            }
        },
        //清单时间初始化
        row_time_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-time-completed");
            }
            if (sender.datasource.expired === 1) {
                sender.$el.addClass("todo-time-limit");
            }
            sender.config.text = com.smartTimestamp(sender.datasource.endTime);
        },
        row_checkbox_click: function(sender, params) {
            var rowdata = sender.datasource;

            if (!sender.value) {
                this.setComplete(rowdata.id, sender);
            } else {
                this.pageview.ajax({
                    url: "list/setUnCompleted",
                    type: "POST",
                    timeout: 7000,
                    data: {
                        ids: rowdata.id
                    },
                    success: function(data) {
                        if (data.code === 0) {
                            sender.unSelected();
                            rowdata.completed = 0;
                            sender.rowInstance.rebind(rowdata);
                        } else {
                            _this.pageview.showLoadingError();
                        }
                    },
                    error: function(error) {
                        _this.pageview.showLoadingError();
                    }

                });
            }
        },
        row_flag_click: function(sender, params) {
            var _this = this;
            if (this.todo_listview.status === "edit") {
                return;
            }
            if (sender.isSelected) {

                this.pageview.ajax({
                    url: "/list/setUnImportance",
                    type: "POST",
                    timeout: 7000,
                    data: {
                        ids: sender.datasource.id
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
        setImportantBtn_click: function(sender, params) {
            var ids = this.getSelectedIds();
            if (sender.getText() == "标记重要") {
                this.setImportant(ids);
            } else {
                this.setUnimportant(ids);
            }
        },
        completeBtn_click: function(sender, params) {
            var ids = this.getSelectedIds();
            this.setComplete(ids);
        },
        selectedAll_init: function(sender) {
            this.selectedAll = sender;
        },
        selectedAll_click: function(sender, params) {
            if (this.allListViewData.length === 0 || sender.value) {
                sender.unSelected();
                this._setToolbarDisabled(true);
                this.todo_listview.clearSelectAll();
            } else {
                if (this.isAllImportant()) {
                    this.setImportantBtn.setText("撤销重要");

                } else {
                    this.setImportantBtn.setText("标记重要");
                }
                sender.selected();
                this._setToolbarDisabled(false);
                this.todo_listview.selectAll();
            }

        },
        todo_listview_parsedata: function(sender, params) {
            var data = params.data;
            alert("s");
            if (data.code !== 0) {
                return false;
            }
            this.allListViewData = data.data.folder;
            return data.data.folder;
        },
        ToolBar_init: function(sender) {
            this.ToolBar = sender;
        },
        addInputWrapper_init: function(sender){
            this.addInputWrapper = sender;
        },
        moreBtn_click: function(sender) {
            this.morePopover.show(sender);
        },
        morePopover_init: function(sender) {
            this.morePopover = sender;
        },
        moreRepeat_icon_init: function(sender, params) {
            if (sender.datasource.title == '删除') {
                sender.config.textStyle.color = "#FF4E5B";
            }
        },
        moreRepeat_itemclick: function(sender, params) {
            var selectedRows = this.todo_listview.selectedRows,
                selectIds = [];
            if (sender.datasource.title == '删除') {
                this.showDeleteDialog();
            } else {
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
        deleteSelectedRows: function() {
            //删除清单请求
            var _this = this;
            var ids = this.getSelectedIds();
            this.pageview.ajax({
                url: "list/delete",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    _method: "delete"
                },
                success: function(data) {
                    if (data.code === 0) {
                        //ajax 成功之后 物理删除
                        _this.pageview.showTip({
                            text: "删除清单成功",
                            duration: 1000,
                        });
                        var selectedRows = _this.todo_listview.selectedRows;
                        for (var i = selectedRows.length - 1; i >= 0; i--) {
                            selectedRows[i].remove();
                        }
                        // _this._setToolbarDisabled(true);
                        _this._editOrCancel();
                        //如果是全选删除的话，需要更新列表
                        if(_this.selectedAll.value){
                            _this._reloadPage();
                        }
                        _this.deleteDialog.hide();
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },
        showDeleteDialog: function() {
            var _this = this;
            if (!this.deleteDialog) {
                this.deleteDialog = new dialog({
                    mode: 3,
                    wrapper: this.pageview.$el,
                    contentText: "确定要删除所选清单吗？",
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
        moveItemTo: function(categoryid, category) {
            //这个方法是在 category.js onPageClose 方法中调用
            // var selectedRows = this.todo_listview.selectedRows;
            // var seledtedRowsData = [];
            // for (var i = 0; i <= selectedRows.length - 1; i++) {
            //     var row = selectedRows[i];
            //     row.datasource.className = category;
            //     row.datasource.categoryid = categoryid;
            //     seledtedRowsData.push(row.datasource);
            //     row.remove();
            // }
            // for (var k = 0, j = seledtedRowsData.length; k < j; k++) {
            //     var rowdata = seledtedRowsData[k];
            //     this.todo_listview.insertGroup(rowdata, 0).insertRow(rowdata, 0);
            // }
            //ajax成功以后 先删除 然后将选中的行的类型都改成 移动到的类型  然后插入
            var _this = this;
            _this.todo_listview.selectedRows = [];
            this._editOrCancel();
            this._reloadPage();
        },
        page_content_pulltorefresh: function(sender, params) {
            this.todo_listview.loadFirstPageData();
        },
        // page_content_loadmore: function(sender, params) {
        //     this.todo_listview.loadNextPageData();
        // },
        testEditor_click: function(sender, params) {
            if (this.todo_listview.status === "edit") {
                this.ToolBar.$el.addClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
                });

            } else {
                this.ToolBar.$el.removeClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.addClass("displaynone");
                });
                this._clearSelectEditInfo();
            }
            this.todo_listview.setLeftOpen();
        },
        row_checkbox_wrapper_init: function(sender) {
            if (this.todo_listview.status === "edit") {
                sender.$el.addClass("displaynone");
            }
        },
        //原生调用
        _editOrCancel: function() {
            if (this.todo_listview.status === "edit") {
                this.ToolBar.$el.addClass("displaynone");
                this.addInputWrapper.$el.removeClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
                });
                this.headRightValue = '编辑';
                this._clearSelectEditInfo();

            } else {
                this.ToolBar.$el.removeClass("displaynone");
                this.addInputWrapper.$el.addClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.addClass("displaynone");
                });
                this.headRightValue = '取消';
            }
            this.setHeader();
            this.todo_listview.setLeftOpen();
        },
        //取消编辑的时候清除信息
        _clearSelectEditInfo:function(){
            //清除选中状态
            this.todo_listview.clearSelectAll();
            //全选按钮清除选中
            this.selectedAll.unSelected();
            //底部不可操作
            this._setToolbarDisabled(true);
        },
        setComplete: function(ids, aim) {
            var _this = this;
            //标记已完成请求
            this.pageview.ajax({
                url: "list/setCompleted",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids
                },
                success: function(data) {
                    if (data.code === 0) {
                        _this.pageview.showTip({
                            text: "清单已完成，可前往已完成列表查看",
                            duration: 2500,
                        });

                        if (aim) {
                            aim.selected();
                            aim.datasource.completed = 1;
                            aim.rowInstance.rebind(aim.datasource);
                        }
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = selectedRows.length - 1; i >= 0; i--) {
                                selectedRows[i].remove();
                                // selectedRows[i].datasource.completed = 1;
                                // selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            // _this._setToolbarDisabled(true);
                            // _this.selectedAll.unSelected();
                            _this._editOrCancel();
                        }

                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },
        setUnimportant: function(ids) {
            //批量取消标记为重要
            var _this = this;
            this.pageview.ajax({
                url: "/list/setUnImportance",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids
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
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },
        setImportant: function(ids, aim) {
            //标记重要请求
            var _this = this;
            this.pageview.ajax({
                url: "list/setImportance",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids
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
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
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
        _reloadPage:function(){
            var _this = this;
            this.todo_listview.selectedRows = [];
            this.todo_listview.setAjaxConfigParams({
                code: _this.listtype
            });
            this.todo_listview.loadFirstPageData();
        }
    };
    return pageLogic;
});
