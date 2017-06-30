/**
 * 最近七天列表
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function(com, utils, dialog) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.token = this.pageview.params.token || "";
        this.listtype = this.pageview.params.listtype || 1001;

        this.NowDate = utils.getDateInfo(new Date());

        this.headRightValue = '编辑';
        this.setHeader();
    }
    pageLogic.prototype = {
        list_group_headertitle_init: function(sender, params) {
            // var dateInfo = utils.timestampToDateInfo(sender.config.text);
            // if (dateInfo.year === this.NowDate.year && dateInfo.month === this.NowDate.month && dateInfo.day == this.NowDate.day) {
            //     sender.config.text = "今天";
            // } else {
            //     sender.config.text = dateInfo.year + "-" + dateInfo.monthStr + "-" + dateInfo.dayStr + " " + dateInfo.weekFullStr;
            // }
        },
        todo_listview_init: function(sender, params) {
            this.todo_listview = sender;
        },
        onPageResume: function(sender, params) {
            this.setHeader();
            this._reloadPage();
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
        setHeader: function() {
            var _this = this;
            try {
                window.yyesn.client.setHeader(function() {}, {
                    type: 2,
                    title: '最近七天',
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
                        classId: 0,
                        className: "未分类",
                        importance: 0,
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
                // var data = {
                //     "id": 1,
                //     "content": value,
                //     "className": "未分类",
                //     "importance": 0,
                //     "completed": 0,
                //     "createTime": "今天"
                // };
                // this.todo_listview.insertGroup(data, 0).insertRow(data, 0);
                // sender.setValue("");
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
        //列表项点击事件
        todo_listview_rowclick: function(sender, params) {
            this.curPageSelectedRow = sender;
            this.pageview.go("add", {
                id: sender.datasource.id,
                token: this.token,
                mode: 'edit'
            });
        },

        // 获取数据后对数据的的二次解析
        todo_listview_parsedata: function(sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }
            for (var i = 0, j = data.data.length; i < j; i++) {
                var Re = "";
                var timestamp = data.data[i].endTime;
                var dateInfo = utils.timestampToDateInfo(timestamp);
                if (dateInfo.year === this.NowDate.year && dateInfo.month === this.NowDate.month && dateInfo.day == this.NowDate.day) {
                    Re = "今天";
                } else {
                    Re = dateInfo.year + "-" + dateInfo.monthStr + "-" + dateInfo.dayStr + " " + dateInfo.weekFullStr;
                }
                data.data[i].endTime = Re;
            }
            this.allListViewData = data.data;
            return data.data;
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

        //清单类型初始化
        row_category_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-category-completed");
            }
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
        row_title_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-text-completed");
            }
        },
        ToolBar_init: function(sender) {
            this.ToolBar = sender;
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
        //弹出的pop删除和移动操作
        moreRepeat_itemclick: function(sender, params) {
            var selectedRows = this.todo_listview.selectedRows,
                selectIds = [];

            if (sender.datasource.title == '删除') {
                this.showDeleteDialog();
            } else {
                //移动至的操作
                for (var i = 0; i < selectedRows.length; i++) {
                    selectIds.push(selectedRows[i].datasource.id);
                }
                selectIds.join(',');

                this.pageview.showPage({
                    pageKey: "category",
                    mode: "fromBottom",
                    nocache: true,
                    params: {
                        action: "moveto",
                        ids: selectIds.toString(),
                        className: '',
                        classId: ''
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
                        //_this._setToolbarDisabled(true);
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
        //移动操作完成之后的回调，重新刷新页面
        moveItemTo: function(categoryid, category) {
            var _this = this;
            _this.todo_listview.selectedRows = [];
            this._editOrCancel();
            this._reloadPage();
        },
        completeBtn_click: function() {
            var ids = this.getSelectedIds();
            this.setComplete(ids);
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
        row_time_init: function(sender, params) {
            sender.config.text = com.smartTimestamp(sender.datasource.endTime);
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
                        var selectedRows = _this.todo_listview.selectedRows;
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            selectedRows = _this.todo_listview.selectedRows;
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
        row_checkbox_wrapper_init: function(sender) {
            if (this.todo_listview.status === "edit") {
                sender.$el.addClass("displaynone");
            }
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
