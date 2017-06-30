define(["../parts/common", "utils", "../../../components/dialog"],
    function(c, utils, dialog) {

        function pageLogic(config) {
            this.pageview = config.pageview;
            var _this = this;
            this.setHeader();
            this.category = this.pageview.showPageParams.className;
            this.categoryid = this.pageview.showPageParams.classId;

            //记录被删除的数组
            this.delArr = [];

            //来自移动至分类的操作参数
            this.action = this.pageview.showPageParams.action;
            this.ids = this.pageview.showPageParams.ids;
        }
        pageLogic.prototype = {
            addCategoryBtn_click: function(sender, params) {
                this.addCategoryDialog.show();
                if (this.category_input) {
                    this.category_input.setValue('');
                    this.category_input.focus();
                }
            },
            onPageResume: function(sender, params) {
                this.setHeader();
            },
            setHeader: function() {
                var _this = this;
                try {
                    window.yyesn.ready(function () {
                        window.yyesn.register({
                            rightvalue: function (d) {
                            }
                        });
                        window.yyesn.client.configNavBar(function (d) {}, {
                            "centerItems":[
                                {"title":'移动至',
                                    "titleColor":"#292f33"},
                            ],
                            "rightItems":[
                            ]
                        });
                    });
                }catch (e) {

                }
                // try {
                //     window.yyesn.client.setHeader(function() {}, {
                //         type: 2,
                //         title: '移动至',
                //         rightTitle: "",
                //         rightValues: [],
                //     }, function(b) {});
                // } catch (e) {}
            },

            _loaddata: function() {
                var _this = this;
                this.pageview.ajax({
                    url: "/list/list",
                    type: "GET",
                    data: {},
                    timeout: 8100,
                    success: function(data) {
                        if (data.code === 0) {
                            // //处理一下，先把第一个未分类去掉
                            // data.data.splice(0, 1);

                            _this.pageview.hideLoading();
                            _this._loadDataSuccess(data.data);
                        } else {
                            _this.pageview.showLoadingError();
                        }
                    },
                    error: function(e) {
                        _this.pageview.showLoadingError();
                    }
                });
            },

            _loadDataSuccess: function(data) {
                this.pageview.do("category_repeat",
                    function(target) {
                        target.bindData(data);
                    });
                this.bindSelectedItemData();
            },
            bindSelectedItemData: function() {
                if (this.action === "moveto") {
                    return;
                }
                // this.category
                // this.categoryid
                var _this = this;
                if (this.category === "未分类") {
                    this.pageview.do("noCategory_Item", function(target) {
                        target.selected();
                    });
                } else {
                    var hasSelected = false;
                    this.category_repeat.eachItem(function(item) {
                        if (item.datasource.id.toString() === _this.categoryid.toString()) {
                            item.select();
                            hasSelected = true;
                            return false;
                        }
                    });
                    if (!hasSelected) {
                        this.pageview.do("noCategory_Item", function(target) {
                            target.selected();
                        });
                    }
                }

            },
            noCategory_Item_init: function(sender) {
                this.noCategory_Item = sender;
            },
            noCategory_Item_click: function(sender, params) {
                this.editicon.$el.removeClass("disabled");
                if (this.category_repeat.status === "edit") {
                    return;
                }
                sender.selected();
                this.category_repeat.clearSelectAll();
                this._selected(0, "收集箱");
            },
            category_repeat_itemclick: function(sender, params) {
                this.editicon.$el.removeClass("disabled");
                sender.select();
                this.noCategory_Item.unSelected();
                this._selected(sender.datasource.id, sender.datasource.name);
            },
            _selected: function(categoryid, category) {
                this.selectedData = {
                    id: categoryid,
                    name: category
                };
                var _this = this;
                //如果是移动至分类的操作
                if (this.action !== "moveto") {

                    window.setTimeout(function() {
                        _this.pageview.close();
                    }, 40);
                }

            },
            onPageClose: function() {
                //如果是移动至分类的操作
                if (this.action === "moveto") {
                    if (this.selectedData) {
                        this.pageview.ownerPage.plugin.moveItemTo(this.selectedData.id, this.selectedData.name);
                    }
                } else {
                    //如果是来自分类选择的操作
                    if (!this.selectedData) {
                        this.selectedData = {
                            id: 0,
                            name: "未分类"
                        };
                    }
                    this.pageview.ownerPage.plugin.setCategoryFromSelector(this.selectedData.id, this.selectedData.name);
                    this.selectedData = null;
                }
            },
            onPageLoad: function() {
                var _this = this;

                this.pageview.showLoading({
                    text: "正在加载...",
                    timeout: 7000,
                    reLoadCallBack: function() {
                        _this._loaddata();
                    }
                });

                this._loaddata();

                this.addCategoryDialog = new dialog({
                    mode: 3,
                    wrapper: this.pageview.$el,
                    title: "添加分类",
                    createContent: function(contentBody) {
                        _this.pageview.getComponentInstanceByComKey("category_input", null, null,
                            function(comInstance) {
                                contentBody.append(comInstance.$el);
                                _this.category_input = comInstance;
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
                            _this.addCategoryDialog.hide();
                        }
                    }, {
                        title: "添加",
                        style: {
                            height: 45,
                            fontSize: 16,
                            color: c.mainColor
                        },
                        onClick: function() {
                            _this.addCategory();
                        }
                    }]
                });

            },
            addCategory: function() {
                var _this = this;
                var value = this.category_input.getValue();
                if(2<=value.length&&value.length<=10){
                    this.pageview.ajax({
                        url: "/listClass/add",
                        type: "POST",
                        timeout: 10000,
                        data: {
                            name: value,
                            token: _this.token
                        },
                        success: function(data) {
                            if (data.code === 0) {
                                _this.category_repeat.insertItem(data.data, _this.category_repeat.datasource.length+1);
                                _this.pageview.showTip({
                                    text: '添加成功',
                                    withoutBackCover: true,
                                    style: {
                                        width: 160
                                    },
                                    duration: 1000
                                });

                            } else {
                                _this.pageview.showTip({
                                    text: data.msg,
                                    duration: 1000
                                });
                            }
                            //_this.page_content.hideLoading();
                        },
                        error: function(e) {
                            _this.pageview.showTip({
                                text: "添加失败!请稍后再试",
                                duration: 3000
                            });
                            //_this.page_content.hideLoading();
                        }
                    });
                    this.addCategoryDialog.hide();
                }
                else{
                    this.pageview.showTip({
                        text: '输入限制在2~10个字符以内',
                        duration: 1000
                    });
                }

            },
            item_del_icon_click: function(sender, params) {
                sender.rowInstance.remove(true);
                this.editicon.setText('保存');

                //记录被删除的ID
                this.delArr.push(sender.rowInstance.datasource.id);
                this.delId = this.delArr.join(',');
            },
            //保存移动到新的分类操作
            _selectRepeatMove:function(){
                var _this = this;
                this.pageview.ajax({
                       url:"/task/move",
                       type:"POST",
                       timeout:7000,
                       data:{
                           ids:_this.ids,
                           listId: _this.selectedData.id,
                           dataSource:1
                       },
                       success:function(data){
                           if (data.code === 0) {
                               _this.pageview.showTip({
                                   text: '任务已移动至'+_this.selectedData.name,
                                   duration: 1000
                               });
                               window.setTimeout(function() {
                                   _this.pageview.close();
                               }, 1000);
                           } else {
                               _this.pageview.showLoadingError();
                           }
                       },
                       error:function(error){
                           _this.pageview.showLoadingError();
                       }

                   });
            },

            //保存删除和修改的分类数据
            _saveRepeatChange: function(){
                var _this = this,
                    isOver = false,
                    repData = this.category_repeat.datasource;
                this.totalSort = [];

                this.pageview.showLoading();

                //筛选出改动的排序
                for (var rep = 0; rep < repData.length; rep++) {
                    for (var ori = 0; ori < this.originalRepeatDataSource.length; ori++) {

                        if (rep === ori) {
                            var arrObj = {};
                            arrObj.id = repData[rep].id;
                            arrObj.sort = this.originalRepeatDataSource[rep].sort;
                            this.totalSort.push(arrObj);
                        }
                    }
                }

                if (this.totalSort) {
                    _this.totalSort = JSON.stringify(_this.totalSort);
                    this.pageview.ajax({
                        url: "/listClass/sort",
                        type: "POST",
                        timeout: 10000,
                        data: {
                            sort: _this.totalSort
                        },
                        success: function(data) {
                            if (data.code === 0) {
                                if (!isOver) {
                                    _this.pageview.showTip({
                                        text: '保存成功',
                                        duration: 1000
                                    });
                                    isOver = true;
                                }

                            } else {
                                _this.pageview.showTip({
                                    text: data.msg,
                                    duration: 1000
                                });
                            }
                            _this.pageview.hideLoading();
                        },
                        error: function(e) {
                            _this.pageview.showTip({
                                text: "操作失败!请稍后再试",
                                duration: 3000
                            });
                            _this.pageview.hideLoading();
                        }
                    });
                }
                if (_this.delId) {
                    this.pageview.ajax({
                        url: "/listClass/delete?ids=" + _this.delId,
                        type: "DELETE",
                        timeout: 10000,
                        data: {},
                        success: function(data) {
                            if (data.code === 0) {
                                if (!isOver) {
                                    _this.pageview.showTip({
                                        text: '保存成功',
                                        duration: 1000
                                    });
                                    isOver = true;
                                }

                            } else {
                                _this.pageview.showTip({
                                    text: data.msg,
                                    duration: 1000
                                });
                            }
                            _this.pageview.hideLoading();
                        },
                        error: function(e) {
                            _this.pageview.showTip({
                                text: "操作失败!请稍后再试",
                                duration: 3000
                            });
                            _this.pageview.hideLoading();
                        }
                    });
                }

            },
            category_repeat_init: function(sender, params) {
                this.category_repeat = sender;
            },
            addCategoryBtn_init:function(sender, params){
                if (this.action === "moveto"){
                    sender.config.style.display = 'none';
                }
            },

            category_repeat_sortend: function(sender, params) {
                this.editicon.setText('保存');
            },
            editIcon_init: function(sender, params){
                this.editicon = sender;
                if (this.action === "moveto"){
                    sender.config.text = '完成';
                    sender.$el.addClass("disabled");
                    sender.config.iconStyle.display = 'none';
                }
            },
            editIcon_click: function(sender, params) {

                if(sender.$el.hasClass("disabled")){
                    return;
                }

                //如果是移动到的选择操作，保存则直接请求数据
                if (this.action === "moveto"){
                    this._selectRepeatMove();
                }else {
                    this.category_repeat.setLeftRightOpen();

                    if (this.category_repeat.isInSort) {
                        this.category_repeat.endSort();

                        if(sender.text === '保存'){
                            this._saveRepeatChange();
                        }

                        //this.originalRepeatDataSource 和 this.category_repeat.datasource 对比
                        // 对比出 被删除的以及顺序 然后调用ajax
                        sender.setText('编辑');
                        sender.iconDom.show();

                    } else {
                        this.category_repeat.startSort();
                        this.originalRepeatDataSource = utils.copy(this.category_repeat.datasource);
                        sender.setText('取消');
                        sender.iconDom.hide();
                    }
                }
            }
        };
        return pageLogic;
    });
