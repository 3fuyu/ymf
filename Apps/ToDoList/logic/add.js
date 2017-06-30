define(["../parts/common", "utils", "../parts/timepicker"], function(c, utils, timepicker) {

    function pageLogic(config) {
        this.pageview = config.pageview;
        this.classId = this.pageview.params.classId || 0;
        this.className = this.pageview.params.className || "未分类";
        this.editMode = this.pageview.params.mode;
        this.id = this.pageview.params.id;
        this.remidTimePicker = null;
        this.deadlineTimePicker = null;
        this.year = new Date().getFullYear();

        this.setHeader();

        //列表过来的详情数据
        this.prePage = this.pageview.prePageView;
        if (this.prePage && this.editMode === 'edit') {
            this.preSelectedRow = this.prePage.plugin.curPageSelectedRow;
            this.preSelectedRowDataSource = this.preSelectedRow.datasource;
        }
    }
    pageLogic.prototype = {
        todo_listview_init: function(sender, params) {
            this.todo_listview = sender;
        },
        getDataWhenEdit: function(config) {
            var _this = this;
            this.pageview.ajax({
                url: "/list/getListDetail", // 模拟请求
                type: "GET",
                timeout: 7000,
                data: {
                    id: this.id
                },
                success: function(data) {
                    if (data.code === 0) {
                        _this.pageview.hideLoading();
                        config.success(data.data);
                    } else {
                        _this.pageview.showLoadingError();
                    }
                },
                error: function() {
                    _this.pageview.showLoadingError();
                }
            });
        },
        getInitData: function(config) {
            var _this = this;
            if (this.editMode === "edit") {
                //  ajax 请求 this.id 获取该条记录的详细信息
                this.pageview.showLoading({
                    text: "正在加载...",
                    timeout: 8000,
                    reLoadCallBack: function() {
                        _this.getDataWhenEdit(config);
                    }
                });
                this.getDataWhenEdit(config);


            } else {
                var data, endDate = new Date();
                endDate = endDate.setDate(endDate.getDate() + 1);
                data = {
                    id: null,
                    content: "",
                    classId: _this.classId,
                    className: _this.className,
                    remindTime: "",
                    endTime: c.formatTime(new Date(endDate), "yyyy-MM-dd"),
                    important: false,
                    remark: "",
                    imgs: []
                };
                config.success(data);
            }
        },
        setCategoryFromSelector: function(classId, className) {
            this.data.classId = classId;
            this.data.className = className;
            this.category_value.setText(className);
        },
        category_value_init: function(sender) {
            this.category_value = sender;
        },
        category_wrapper_click: function() {
            this.pageview.showPage({
                pageKey: "category",
                mode: "fromBottom",
                nocache: true,
                params: {
                    className: this.data.className,
                    classId: this.data.classId
                }
            });

        },
        bindData: function(data) {
            var _this = this;
            this.data = data;

            //图片添加到图片组件里面去
            if (data && !!data.images) {
                var imgs = data.images.split(',');
                for (var i = 0; i < imgs.length; i++) {
                    _this.imagesRepeat.addItem({
                        src: imgs[i]
                    });
                }
            }

            this.pageview.do("remindtime_value", function(target) {
                if (_this.data.remindTime) {
                    target.setText(c.formatTime(new Date(_this.data.remindTime), "yyyy-MM-dd hh:mm"));
                }
            });

            this.pageview.do("category_value", function(target) {
                target.setText(_this.data.className);
            });

            this.pageview.do("deadline_value", function(target) {
                target.setText(c.formatTime(new Date(_this.data.endTime), "yyyy-MM-dd"));
            });

            this.pageview.do("todo_title", function(target) {
                target.setValue(_this.data.content);
            });

            this.pageview.do("rmark_textarea", function(target) {
                target.setValue(_this.data.remark);
            });

            this.pageview.do("important_value", function(target) {
                target.setValue(_this.data.importance);
            });
        },
        onPageLoad: function() {
            var _this = this;
            var data = this.getInitData({
                success: function(data) {
                    _this.bindData(data);
                }
            });
        },
        onPageEnter: function(sen) {

        },
        onPageResume: function(sender, params) {
            this.setHeader();
        },
        setHeader: function() {
            var _this = this,
                title = '创建清单';
            if (this.editMode === "edit") {
                title = '清单详情';
            }
            try {
                window.yyesn.client.setHeader(function() {}, {
                    type: 2,
                    title: title,
                    rightTitle: "",
                    rightValues: []
                }, function(b) {});
            } catch (e) {}
        },
        //页面元素初始化时
        deadline_value_init: function(sender, params) {
            this.deadline = sender;
        },
        todo_title_init: function(sender, params) {
            this.todotitle = sender;
        },
        rmark_textarea_init: function(sender, params) {
            this.todoremark = sender;
        },
        remindtime_value_init: function(sender, params) {
            this.todoremindtime = sender;
        },
        page_content_init: function(sender, params) {
            this.page_content = sender;
        },
        checkTime: function(deadline, remind) {
            //比较结束时间和提醒时间
            if (!remind) {
                return true;
            }
            var deadlineTime = c.formatTime(deadline, "yyyy-MM-dd");
            var remindTime = c.formatTime(remind, "yyyy-MM-dd");
            var difference = (new Date(deadlineTime)).getTime() - (new Date(remindTime)).getTime();
            if (difference >= 0) {
                return true;
            } else {
                return false;
            }
        },
        //提交清单
        submitIcon_click: function(sender, params) {

            var warn = null,
                _this = this,
                todotitle = $.trim(this.todotitle.getValue()),
                deadline = $.trim(this.deadline.innerText.html()),
                todoremindtime = $.trim(this.todoremindtime.innerText.html()),
                remark = $.trim(this.todoremark.getValue());

            //queDesc = queDesc.replace(/\n/g,"<br/>");
            deadline = deadline.replace(/-/g,'/');
            todoremindtime = todoremindtime.replace(/-/g,'/');
            // alert(todoremindtime);alert(deadline);
            // alert(new Date(todoremindtime));alert(JSON.stringify(new Date(todoremindtime)));
            if (todotitle === '' || 1 > todotitle.length || todotitle.length > 100) {
                warn = "请输入100个字符以内的清单内容";
            } else if (deadline === '') {
                warn = "请选择到期时间";
            } else if (todoremindtime && !this.checkTime(new Date(deadline), new Date(todoremindtime))) {
                //到期时间必须大于提醒时间
                warn = "提醒时间不能在到期时间之后";
            }
            deadline = deadline.replace(/\//g,'-');
            todoremindtime = todoremindtime.replace(/\//g,'-');

            //如果填写有问题
            if (warn !== null) {
                this.pageview.showTip({
                    text: warn,
                    withoutBackCover: true,
                    style: {
                        width: 160
                    },
                    duration: 1800
                });
                return;
            } else {
                //处理图片数据
                this._handlerImgs();

                if (this.editMode === "edit") {
                    this.page_content.showLoading({
                        text: "提交中...",
                        timeout: 11000,
                        reLoadCallBack: function() {
                            _this.submitUpdateRequest(todotitle, todoremindtime, deadline, remark);
                        }
                    });
                    this.submitUpdateRequest(todotitle, todoremindtime, deadline, remark);
                } else {
                    this.page_content.showLoading({
                        text: "提交中...",
                        timeout: 11000,
                        reLoadCallBack: function() {
                            _this.submitRequest(todotitle, todoremindtime, deadline, remark);
                        }
                    });
                    this.submitRequest(todotitle, todoremindtime, deadline, remark);
                }

            }
        },
        //清单新增请求
        submitRequest: function(content, remindTime, endTime, remark) {
            var _this = this;
            this.importantvalue = this.importantvalue ? '1' : '0';
            remindTime = remindTime ? (remindTime + ':00') : '';


            this.pageview.ajax({
                url: "/list/add",
                type: "POST",
                timeout: 10000,
                data: {
                    content: content,
                    classId: _this.data.classId,
                    className: _this.data.className,
                    importance: _this.importantvalue,
                    remindTime: remindTime,
                    endTime: endTime,
                    remark: remark,
                    images: _this.ImagStr,
                    token: _this.token
                },
                success: function(data) {
                    if (data.code === 0) {
                        _this.pageview.showTip({
                            text: '新增成功',
                            withoutBackCover: true,
                            style: {
                                width: 160
                            },
                            duration: 1000
                        });
                        window.setTimeout(function() {
                            _this.pageview.goBack();
                        }, 1000);

                    } else {
                        _this.pageview.showTip({
                            text: data.msg,
                            duration: 4000
                        });
                    }
                    _this.page_content.hideLoading();
                },
                error: function(e) {
                    _this.pageview.showTip({
                        text: "提交失败!请稍后再试",
                        duration: 3000
                    });
                    _this.page_content.hideLoading();
                }
            });
        },
        //清单修改请求
        submitUpdateRequest: function(content, remindTime, endTime, remark) {
            var _this = this;
            this.importantvalue = this.importantvalue ? '1' : '0';
            remindTime = remindTime ? (remindTime + ':00') : '';

            this.pageview.ajax({
                url: "/list/update",
                type: "POST",
                timeout: 10000,
                data: {
                    id: _this.id,
                    content: content,
                    classId: _this.data.classId,
                    className: _this.data.className,
                    importance: _this.importantvalue,
                    remindTime: remindTime,
                    endTime: endTime,
                    remark: remark,
                    images: _this.ImagStr,
                    token: _this.token
                },
                success: function(data) {
                    if (data.code === 0) {
                        //更新上一个页面的对应行数据
                        if (_this.preSelectedRow) {
                            data.data.content = content;
                            //_this.preSelectedRow.rebind(data.data);
                        }
                        _this.pageview.showTip({
                            text: '修改成功',
                            withoutBackCover: true,
                            style: {
                                width: 160
                            },
                            duration: 1000
                        });
                        window.setTimeout(function() {
                            _this.pageview.goBack();
                        }, 1000);

                    } else {
                        _this.pageview.showTip({
                            text: data.msg,
                            duration: 4000
                        });
                    }
                    _this.page_content.hideLoading();
                },
                error: function(e) {
                    _this.pageview.showTip({
                        text: "提交失败!请稍后再试",
                        duration: 3000
                    });
                    _this.page_content.hideLoading();
                }
            });
        },
        //处理图片数据
        _handlerImgs: function() {
            var newArr = [];
            for (var i = 0; i < this.imagesRepeat.datasource.length; i++) {
                newArr.push(this.imagesRepeat.datasource[i].src);
            }
            this.ImagStr = newArr.join(',');
        },
        deadline_value_click: function(sender, params) {
            var _this = this;
            if (this.deadlineTimePicker === null) {
                this.deadlineTimePicker = new timepicker();
                this.deadlineTimePicker.mapping.yyyy.start = (this.year);
                this.deadlineTimePicker.mapping.yyyy.end = (this.year + 4);
                this.deadlineTimePicker.setMode("yyyy-MM-dd").setParent(this.pageview.$el[0]).done()
                    .setMinValue((this.year) + "-1-1 00:00")
                    .bind("clear", function() {})
                    .bind("ok", function(valStr) {
                        sender.setText(valStr);
                    })
                    .bind("cancel", function() {}).setTitle("到期时间");
            }
            this.deadlineTimePicker.show(sender.getText());
        },
        remindtime_value_click: function(sender, params) {
            if (this.remidTimePicker === null) {
                this.remidTimePicker = new timepicker();
                this.remidTimePicker.mapping.yyyy.start = (this.year);
                this.remidTimePicker.mapping.yyyy.end = (this.year + 4);
                this.remidTimePicker.setMode("yyyy-MM-dd hh:mm").setParent(this.pageview.$el[0]).done()
                    .setMinValue((this.year) + "-1-1 00:00")
                    .bind("clear", function() {})
                    .bind("ok", function(valStr) {
                        sender.setText(valStr);
                    })
                    .bind("cancel", function() {}).setTitle("提醒时间");
            }
            this.remidTimePicker.show(sender.getText());
        },
        rmark_textarea_click: function(sender, params) {
            if (utils.deviceInfo().isAndroid) {
                setTimeout(function() {
                    sender.$el[0].scrollIntoViewIfNeeded(true);
                    sender.$el[0].scrollIntoView(true);
                }, 500);
            }

        },
        todo_listview_parsedata: function(sender, params) {
            var data = params.data;
            if (data.code !== 0) {
                return false;
            }
            return data.data;
        },

        important_value_change: function(sender, params) {
            this.importantvalue = params.value;
            sender.setValue(this.importantvalue);
        },

        row_time_init: function(sender, params) {
            sender.config.text = utils.timestampToTimeStr(sender.datasource.createTime);
        },

        imagesRepeat_init: function(sender) {
            this.imagesRepeat = sender;
        },
        imagesRepeat_itemclick: function(sender, params) {
            var imgs = [];
            for (var i = 0, j = sender.parent.datasource.length; i < j; i++) {
                imgs.push(sender.parent.datasource[i].src);
            }
            try {
                window.yyesn.client.viewImage({
                    "files": imgs.join(","),
                    "index": parseInt(params.index)
                });
            } catch (e) {}
        },
        addImageIcon_click: function(sender, params) {
            var type = 1;
            var _this = this;
            if (_this.imagesRepeat.datasource.length >= 5) {
                _this.pageview.showTip({
                    text: "最多上传5张图片",
                    duration: 1000,
                    style: {
                        width: "220px"
                    }
                });
                return;
            }

            try {
                var last = 5 - _this.imagesRepeat.datasource.length;
                window.yyesn.client.selectAttachment(function(Re) {
                    var data = Re.data;
                    if (data.length > last) {
                        _this.pageview.showTip({
                            text: "最多上传5张图片",
                            duration: 1000,
                            style: {
                                width: "220px"
                            }
                        });
                    }
                    for (var i = 0, j = last; i < j; i++) {
                        _this.imagesRepeat.addItem({
                            src: data[i].path
                        });
                    }

                }, {
                    type: type || 1,
                    maxselectnum: last
                });
            } catch (e) {

            }
        },


        imageDelIcon_click: function(sender, params) {
            sender.rowInstance.remove();
        },
    };
    return pageLogic;
});
