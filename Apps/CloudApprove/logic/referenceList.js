define(["../parts/common", "utils"], function (c, utils) {


    function pageLogic(config) {
        this.pageview = config.pageview;
        this.params = this.pageview.showPageParams;
        this.referenceData = this.params.config.itemData;
        this.isMutiSelect = this.referenceData.isMutiSelect;
        this.parentThis = this.pageview.showPageParams.parent;
        this.listDataSource = [];
        this.searchValue = '';
        this.setHeader();
        this.searchKey = true; // 配置是否显示搜索框
    }

    pageLogic.prototype = {
        body_init: function (sender) {
            this.body = sender;
        },
        setHeader: function () {
            var _this = this;

            try {
                window.yyesn.client.setHeader(function () {
                }, {
                    type: 2,
                    title: _this.parentThis.itemData.title || '关联',
                    rightTitle: "",
                    rightValues: []
                }, function (b) {

                });
            } catch (e) {

            }
        },
        searchBtn_click: function (sender, params) {
            this.pageview.refs.leftview.$el.hide();
            this.pageview.refs.searchInput.$el.show();
            this.pageview.refs.searchInput._focus();
            this.pageview.refs.approveSelector.hideDropDown();
        },
        searchInput_init: function (sender, params) {
            if (this.searchKey) {
                sender.config.style.display = "show";
            } else {
                sender.config.style.display = "none";
            }
        },
        searchInput_cancel: function (sender, params) {
            var value = params.value;

            if (value) {
                sender.input.val('');

                this.listviewSender.config.ajaxConfig.data.keyword = '';
                this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
            }

            this.pageview.refs.leftview.$el.show();
        },
        searchInput_search: function (sender, params) {
            this.listviewSender.config.ajaxConfig.data.keyword = params.value;
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});
        },
        onPageResume: function () {
            this.pageview.refs.listview.loadFirstPageData({parentAnimate: true});

            this.setHeader();
        },
        body_pulltorefresh: function (sender, params) {
            this.pageview.refs.listview.ajaxConfig.data.start = 0;
            this.pageview.refs.listview.ajaxConfig.data.pageNum = 1;

            this.pageview.refs.listview.setAjaxConfigParams();
            this.pageview.refs.listview.loadFirstPageData();
        },
        body_reload: function (sender) {
            this.pageview.refs.listview.reload();
        },
        body_loadmore: function (sender, params) {
            var size = this.pageview.refs.listview.ajaxConfig.data.size;
            var start = this.pageview.refs.listview.ajaxConfig.data.start;
            var count = size + start;
            this.pageview.refs.listview.ajaxConfig.data.pageNum++;

            this.pageview.refs.listview.setAjaxConfigParams();
            this.pageview.refs.listview.loadNextPageData();
        },
        listview_rowclick: function (sender, params) {
            sender.select();
            if (!this.isMutiSelect) {
                this.parentThis.afterClosePage(sender.parent.selectedRows[0].datasource);
                this.pageview.close();
            } else {
                this.pageview.delegate('bottom_left', function (target) {
                    target.setText('已选择 ' + sender.parent.selectedRows.length);
                });
            }
        },
        listview_parsedata: function (sender, params) {
            var data = params.data,
                _this = this;

            if (!data.success) {
                return false;
            }
            data.data = data.data ? JSON.parse(data.data).data : [];

            data.data.forEach(function (value, key) {
                var processData = [];

                _this.referenceData.contMetaOption.fieldIds.forEach(function (_value, _key) {
                    processData.push({
                        value: _value.name + ': ' + value[_value.fieldId],
                        key: _value.name
                    });
                });

                // 屏蔽时间一栏
                // processData.push({
                //     value: '时间: ' + value.ts,
                //     key: '时间'
                // });

                value.data = processData;
                value.mutiSelect = _this.isMutiSelect;
            });

            if (!data.data) {
                data.data = {
                    list: []
                };
            }
            return data.data;
        },
        listview_init: function (sender) {
            var url = '';
            var _this = this;
            this.listviewSender = sender;

            if (this.isMutiSelect) {
                sender.config.selectedMode = 'm';
            } else {
                sender.config.selectedMode = 's';
            }

            this.clientParam = {};

            if (this.parentThis.itemData.linkageComponent) {
                var selectData = window.linkageComponents[this.parentThis.itemData.linkageComponent];

                if ($.isArray(selectData)) {
                    selectData.forEach(function (value, key) {
                        _this.clientParam.linkageField = _this.parentThis.itemData.linkageField;
                        _this.clientParam.value = value.refcode;
                    });
                } else {
                    _this.clientParam.linkageField = selectData.linkageField;
                    _this.clientParam.value = selectData.refcode;
                }

            }

            sender.config.ajaxConfig = {
                url: '/iref_ctr/ref',
                type: "POST",
                pageSize: 20,
                pageNumKey: "index",
                data: {
                    refCode: "formref",
                    transmitParam: JSON.stringify({
                        "pk_bo": _this.referenceData.pk_bo,
                        "relate_pk_bo": _this.referenceData.contMeta,
                        "fieldId": _this.referenceData.fieldId,
                        "formName": _this.referenceData.contMetaName,
                        "hasLinkage": _this.referenceData.hasLinkage,
                        "contMetaOption": _this.referenceData.contMetaOption.fieldIds
                    }),
                    cfgParam: JSON.stringify({
                        "isMultiSelectedEnabled": _this.isMutiSelect,
                        "isCheckListEnabled": false
                    }),
                    clientParam: JSON.stringify(this.clientParam),
                    pageSize: 20,
                    index: 1
                }
            };

            sender.config.autoLoadData = true;
        },
        listview_rowinit: function (sender, params) {
            if (this.parentThis.selectedData) {
                if (this.isMutiSelect) {
                    this.parentThis.selectedData.forEach(function (value, key) {
                        if (sender.datasource.refcode === value.refcode) {
                            setTimeout(function () {
                                sender.select();
                            }, 100);
                        }
                    });
                } else {
                    if (sender.datasource.refcode === this.parentThis.selectedData.refcode) {
                        setTimeout(function () {
                            sender.select();
                        }, 100);
                    }
                }
            }
        },
        row_left_repeat_init: function (sender, params) {
            sender.bindData(sender.datasource.data);
        },
        row_right_statusview_didmount: function (sender, params) {
            if (sender.datasource.mutiSelect) {
                sender.change('row_right_checkbox');
            }
        },
        bottom_init: function (sender, params) {
            if (this.isMutiSelect) {
                sender.config.style.display = 'flex';
            } else {
                sender.config.style.display = 'none';
            }
        },
        bottom_right_btn_click: function (sender, params) {
            var data = [];

            this.pageview.refs.listview.selectedRows.forEach(function (value, key) {
                data.push(value.datasource);
            });

            this.parentThis.afterClosePage(data);
            this.pageview.close();
        },
        bottom_left_init: function (sender, params) {
            if (this.parentThis.selectedData && this.isMutiSelect) {
                sender.config.text = '已选择 ' + this.parentThis.selectedData.length;
            }
        }
    };
    return pageLogic;
});
