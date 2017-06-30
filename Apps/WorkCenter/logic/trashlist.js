/**
 * 回收站列表
 **/
define(["../parts/common", "utils", "../../../components/dialog"], function(com, utils, dialog) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.token = this.pageview.params.token || "";
        this.headRightValue = '编辑';
        this.NowDate = utils.getDateInfo(new Date());
        this.nowTime = (new Date()).getTime();
        this.setHeader();
    }
    pageLogic.prototype = {
        todo_listview_init: function(sender, params) {
            this.todo_listview = sender;
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
                            {"title":'回收站',
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
            //         title: '回收站',
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
        todo_listview_selectChange: function(sender, params) {

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
            com.gotoDetail(sender,this.pageview);
        },
        recoverBtn_click: function(sender, params) {
            var selectedRows = this.todo_listview.selectedRows,
                selectIds = [],
                _this = this;
            for (var i = 0; i < selectedRows.length; i++) {
                selectIds.push(selectedRows[i].datasource.id);
            }
            selectIds.join(',');
            // this.todo_listview.selectedRows[0].$el.remove();
            // console.log(this.todo_listview.selectedRows);
            var ids = selectIds.toString();
            this.pageview.showLoading({
                text:"正在处理中..."
            });
            this.pageview.ajax({
                url: "/task/restoreFromRecycle",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids,
                    dataSource:1
                },
                success: function(data) {
                    if (data.code === 0) {
                        //还原后操作
                        _this._editOrCancel();
                        for (var j = 0; j < selectedRows.length; j++) {
                            selectedRows[j].remove();
                        }
                        _this.pageview.showTip({
                            text: "已还原至清单",
                            duration: 1800
                        });

                    } else {
                        _this.pageview.showTip({
                            text: data.msg,
                            withoutBackCover: true,
                            style: {
                                width: 160
                            },
                            duration: 1800
                        });
                    }
                    _this.pageview.hideLoading(data.code === 0);
                },
                error: function(error) {
                    _this.pageview.hideLoading(false);
                }

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
        row_category_init: function(sender, params) {
            if (sender.datasource.completed === 1) {
                sender.$el.addClass("todo-category-completed");
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
            // debugger;
            // sender.config.text = '完成于 ' + com.customTimestamp(sender.datasource.completedTime, '', true);
        },
        selectedAll_init: function(sender) {
            this.selectedAll = sender;
        },
        recoverBtn_init: function(sender, params) {
            this.recoverBtn = sender;
            sender.setDisabled(true);
        },
        row_checkbox_wrapper_init: function(sender) {
            if (this.todo_listview.status === "edit") {
                sender.$el.addClass("displaynone");
            }
        },
        selectedAll_click: function(sender, params) {
            if (this.todo_listview.getRowCount() === 0 || sender.value) {
                sender.unSelected();
                this.todo_listview.clearSelectAll();
                this._setToolbarDisabled(true);
            } else {
                sender.selected();
                this.todo_listview.selectAll();
                this._setToolbarDisabled(false);
            }

        },
        todo_listview_parsedata: function(sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }
            for (var i = 0; i < data.data.length; i++) {
                var Re = "";
                var timestamp = data.data[i].endTime;
                var dateInfo = utils.timestampToDateInfo(timestamp);
                if (dateInfo.year === this.NowDate.year && dateInfo.month === this.NowDate.month && dateInfo.day == this.NowDate.day) {
                    Re = "今天";
                } else {
                    Re = dateInfo.year + "-" + dateInfo.monthStr + "-" + dateInfo.dayStr;
                }
                data.data[i].endTime = Re;
                // data.data[i].test = dateInfo.year + "-" + dateInfo.monthStr + "-" + dateInfo.dayStr;
            }
            this.allListViewData = data.data;
            return data.data;
        },
        ToolBar_init: function(sender) {
            this.ToolBar = sender;
        },
        page_content_pulltorefresh: function(sender, params) {
            this.todo_listview.loadFirstPageData();
        },
        page_content_loadmore: function(sender, params) {
            this.todo_listview.loadNextPageData();
        },
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
                this.todo_listview.eachRow(function(row) {
                    row.refs.row_checkbox_wrapper.$el.removeClass("displaynone");
                });
                this.headRightValue = '编辑';
                this._clearSelectEditInfo();

            } else {
                this.ToolBar.$el.removeClass("displaynone");
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

        //标记重要请求
        setImportant: function(ids, aim) {

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
                            _this._setToolbarDisabled(true);
                            _this.selectedAll.unSelected();
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
        //标记已完成请求
        setComplete: function(ids, aim) {
            var _this = this;
            this.pageview.ajax({
                url: "list/setCompleted",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids
                },
                success: function(data) {
                    if (data.code === 0) {
                        if (aim) {
                            aim.selected();
                            aim.datasource.completed = 1;
                            aim.rowInstance.rebind(aim.datasource);
                        }
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = 0; i < selectedRows.length; i++) {
                                selectedRows[i].datasource.completed = 1;
                                selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            _this._setToolbarDisabled(true);
                            _this.selectedAll.unSelected();
                        }
                        _this.pageview.showTip({
                            text: "清单已完成",
                            duration: 1500,
                        });

                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },
        //标记待办请求
        setUnComplete: function(ids, aim) {
            var _this = this;
            this.pageview.ajax({
                url: "list/setUnCompleted",
                type: "POST",
                timeout: 7000,
                data: {
                    ids: ids
                },
                success: function(data) {
                    if (data.code === 0) {
                        if (aim) {
                            aim.unSelected();
                            aim.datasource.completed = 0;
                            aim.rowInstance.rebind(aim.datasource);
                        }
                        if (!_this.ToolBar.$el.hasClass("displaynone")) {
                            var selectedRows = _this.todo_listview.selectedRows;
                            for (var i = selectedRows.length - 1; i >= 0; i--) {
                                selectedRows[i].remove();
                                //selectedRows[i].datasource.completed = 0;
                                //selectedRows[i].rebind(selectedRows[i].datasource);
                            }
                            //成功之后将按钮不可用
                            _this.todo_listview.selectedRows = [];
                            //_this._setToolbarDisabled(true);
                            //_this.selectedAll.unSelected();
                            _this._editOrCancel();
                        }
                        _this.pageview.showTip({
                            text: "已转为待办",
                            duration: 1000,
                        });

                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },
        //删除清单请求
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
                        var selectedRows = _this.todo_listview.selectedRows;
                        for (var i = selectedRows.length - 1; i >= 0; i--) {
                            selectedRows[i].remove();
                        }
                        _this._setToolbarDisabled(true);
                        _this.deleteDialog.hide();
                        _this.pageview.showTip({
                            text: "删除成功",
                            duration: 1000,
                        });
                        //如果是全选删除的话，需要更新列表
                        if(_this.selectedAll.value){
                            _this._reloadPage();
                        }
                        _this._editOrCancel();
                    } else {
                        _this.pageview.showTip({
                            text: data.msg,
                            withoutBackCover: true,
                            style: {
                                width: 160
                            },
                            duration: 1800
                        });
                    }
                },
                error: function(error) {
                    _this.pageview.showLoadingError();
                }

            });
        },

        //编辑的时候，有选中状态设置底部可点击操作
        _setToolbarDisabled: function(isDisabled) {
            this.recoverBtn.setDisabled(isDisabled);
        },
        //获取选中的清单的ID字符数组，例如： 112,113,114
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
        //删除提示
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
        _reloadPage:function(){
            this.todo_listview.selectedRows = [];
            this.todo_listview.setAjaxConfigParams({
                pageNo: 1,
                pageSize: 20
            });
            this.todo_listview.loadFirstPageData();
        }
    };
    return pageLogic;
});
