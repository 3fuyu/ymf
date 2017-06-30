/**
 * 用户自定义的分类列表
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function(com, utils, dialog) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.token = this.pageview.params.token || "";
        this.listid = this.pageview.params.listid;
        this.name = decodeURI(this.pageview.params.name);

        this.headRightValue = '编辑';
        this.setHeader();
    }
    pageLogic.prototype = {
        todo_listview_init: function(sender, params) {
            this.todo_listview = sender;
            this.todo_listview.setAjaxConfigParams({
                id: +this.listid,
                sort: 1
            });
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
        onPageLoad: function(sender, params) {

        },

        setHeader: function() {
            var _this = this;
            try {
                window.yyesn.client.setHeader(function() {}, {
                    type: 2,
                    title: _this.name,
                    rightTitle: _this.headRightValue,
                    rightValues: [{
                        key: 'edit',
                        value: _this.headRightValue
                    }]
                }, function(b) {
                    b.registerHandler("edit", function(data, responseCallback) {
                        _this._editOrCancel();
                    });
                });
            } catch (e) {

            }
        },
        //简易创建清单回车事件
        addInput_keydown: function(sender, params) {
            var value = sender.getValue();
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
                        classId: _this.listid,
                        className: _this.name,
                        importance: 0,
                        completed: 0,
                        remark: "",
                        endTime: com.formatTime(endDate, "yyyy-MM-dd")
                    },
                    success: function(data) {
                        if (data.code === 0) {
                            _this.todo_listview.insertRow(data.data, 0);
                            _this.allListViewData.push(data.data);
                            sender.setValue("");
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
        _setToolbarDisabled: function(isDisabled) {
            this.completeBtn.setDisabled(isDisabled);
            this.moreBtn.setDisabled(isDisabled);
            this.setImportantBtn.setDisabled(isDisabled);
        },
        //列表项点击事件
        todo_listview_rowclick: function(sender, params) {
            this.curPageSelectedRow = sender;
            this.pageview.go("add", {
                id: sender.datasource.id,
                classId: sender.datasource.classId,
                className: sender.datasource.className,
                mode: 'edit'
            });
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
            if (sender.datasource.expired === 1) {
                sender.$el.addClass("todo-time-limit");
            }
            sender.config.text = com.smartTimestamp(sender.datasource.endTime);
        },
        selectedAll_init: function(sender) {
            this.selectedAll = sender;
        },

        //顶部的segment 点击切换事件
        page_segment_change: function(sender, params) {
            var _this = this;
            switch (params.item.index) {
                case 0:
                    this.todo_listview.setAjaxConfigParams({
                        id: +_this.listid,
                        sort: 1
                    });
                    break;

                case 1:
                    this.todo_listview.setAjaxConfigParams({
                        id: +_this.listid,
                        sort: 2
                    });
                    break;

                case 2:
                    this.todo_listview.setAjaxConfigParams({
                        id: +_this.listid,
                        sort: 3
                    });
                    break;
                default:

            }
            this.todo_listview.loadFirstPageData();
        },
        row_checkbox_click: function(sender, params) {
            var rowdata = sender.datasource;
            var _this = this;

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
            if (data.code !== 0) {
                return false;
            }
            this.allListViewData = data.data;
            return data.data;
        },
        ToolBar_init: function(sender) {
            this.ToolBar = sender;
        },
        page_segment_init: function(sender) {
            this.page_segment = sender;
        },
        addInputWrapper_init: function(sender){
            this.addInputWrapper = sender;
        },
        addIcon_click: function(sender, params) {
            this.pageview.go("add");
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
        moreRepeat_icon_click: function(sender, params) {

            var selectedRows = this.todo_listview.selectedRows,
                selectIds = [];

            if (sender.text == '删除') {
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
                        _this.deleteDialog.hide();
                        //如果是全选删除的话，需要更新列表
                        if(_this.selectedAll.value){
                            _this._reloadPage();
                        }
                        _this._editOrCancel();
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
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
                this.page_segment.$el.removeClass("displaynone");
                this.addInputWrapper.$el.removeClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
                });

            } else {
                this.ToolBar.$el.removeClass("displaynone");
                this.page_segment.$el.addClass("displaynone");
                this.addInputWrapper.$el.addClass("displaynone");
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.addClass("displaynone");
                });
                this._clearSelectEditInfo();
            }
            this.todo_listview.setLeftOpen();

        },
        //原生调用
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

            } else {
                this.ToolBar.$el.removeClass("displaynone");
                this.page_segment.$el.addClass("displaynone");
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
        completeBtn_click: function() {
            var ids = this.getSelectedIds();
            this.setComplete(ids);
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

                            //如果是全选完成的话，需要更新列表
                            if(_this.selectedAll.value){
                                _this._reloadPage();
                            }
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
                id: +_this.listid,
                sort: 1
            });
            this.todo_listview.loadFirstPageData();
        }
    };
    return pageLogic;
});
