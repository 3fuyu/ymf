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
                                {"title":"选择",
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
                //         title: '选择',
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
                            //处理一下，先把第一个未分类去掉
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
                if (this.category === "收集箱") {
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
                if (this.category_repeat.status === "edit") {
                    return;
                }
                sender.selected();
                this.category_repeat.clearSelectAll();
                this._selected(0, "收集箱");
            },
            category_repeat_itemclick: function(sender, params) {
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
                            name: "收集箱"
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
                       url:"list/changeClass",
                       type:"POST",
                       timeout:7000,
                       data:{
                           ids:_this.ids,
                           classId: _this.selectedData.id
                       },
                       success:function(data){
                           if (data.code === 0) {
                               window.setTimeout(function() {
                                   _this.pageview.close();
                               }, 40);
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




        };
        return pageLogic;
    });
