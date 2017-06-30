define(["./ApplyBase", "utils", "../parts/common"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this,
            defaultTitle = '用户';

        this.config = config;
        this.multiselect = this.config.itemData.multiselect ? true : false;
        this.isCurrentEmployee = this.config.itemData.isCurrentEmployee ? true : false;
        Component.baseConstructor.call(this, config);

        this.wrapKey = this.id + '_wrap';
        this.titleKey = this.id + '_title';
        var placeholder = this.itemData.tips ? this.itemData.tips : '请选择用户';

        if (this.multiselect) {
            this.repeatKey = this.id + '_repeat';
            this.iconKey = this.id + '_icon';
            this.addIconKey = this.id + '_addIcon';

            this.root.push(this.wrapKey);

            this.components[this.wrapKey] = {
                type: "view",
                ref: true,
                style: utils.processStyle({
                    backgroundColor: "#fff",
                    // marginBottom: 1,
                    borderBottom: "1px solid #ededed",
                }),
                root: [this.titleKey, this.repeatKey]
            };

            this.components[this.titleKey] = {
                type: "text",
                text: config.title || defaultTitle,
                nextText: "（点击头像删除人员）",
                style: utils.processStyle({
                    marginTop: 10,
                    paddingBottom: 10,
                    color: "333333",
                    fontSize: 14,
                    marginLeft: 14
                }),
                nextTextStyle: utils.processStyle({
                    color: "#b7b7b7"
                })
            };

            this.components[this.repeatKey] = {
                type: "repeat",
                className: "line-repeat",
                ref: true,
                style: utils.processStyle({
                    minHeight: 80,
                    flexWrap: "wrap",
                    paddingLeft: 6,
                    paddingBottom: 10,
                    flexDirection: "row"
                }),
                subComponent: this.addIconKey,
                itemStyle: utils.processStyle({
                    width: 50,
                }),
                root: [this.iconKey]
            };

            this.components[this.iconKey] = {
                type: "icon",
                style: {
                    paddingTop: 10,
                    zIndex: 10
                },
                iconStyle: utils.processStyle({
                    w: 32,
                    backgroundColor: "#eee",
                    borderRadius: "100%",
                    overflow: "hidden"
                }),
                textStyle: utils.processStyle({
                    marginTop: 3,
                    color: "#b7b7b7",
                    fontSize: 12
                }),
                title_bind: "userName",
                src_bind: "headImgUrl",
                text_bind: "userName",
                textPos: "bottom"
            };

            this.components[this.addIconKey] = {
                type: "image",
                src: "./imgs/addapprove.png",
                style: utils.processStyle({
                    w: 32,
                    marginTop: 9,
                    marginLeft: 9,
                    backgroundColor: "#fff"
                }),
            };

            // 点击删除人
            this.plugin[this.id + "_repeat_itemclick"] = function (sender, params) {
                var itemMemberID = sender.datasource.memberId.toString();
                if (_this.employee_select_list) {
                    for (var i = _this.employee_select_list.length - 1; i >= 0; i--) {
                        if (_this.employee_select_list[i].member_id.toString() === itemMemberID) {
                            _this.employee_select_list.splice(i, 1);
                        }
                    }
                }
                sender.remove();
            };

            // 增加人
            this.plugin[this.id + "_addIcon_click"] = function (sender, params) {
                this.sender = sender;
                try {
                    window.yyesn.enterprise.selectContacts(function (b) {
                        if (b.error_code === "0") {
                            var persons = b.data;
                            // 在明细里取值不同，需要特殊判断
                            if (_this.isIndetail) {
                                _this.plugin.pageview.refs[_this.DetailInstance.repeatKey].empty();
                            } else {
                                _this.plugin.pageview.refs[_this.repeatKey].empty();
                            }

                            _this.employee_select_list = [];
                            for (var i = 0, j = persons.length; i < j; i++) {
                                var itemData = persons[i];
                                _this.employee_select_list.push(itemData);
                                _this.plugin.pageview.refs[_this.repeatKey].addItem({
                                    userName: itemData.name,
                                    headImgUrl: itemData.avatar,
                                    memberId: itemData.member_id
                                });
                            }

                        }
                    }, {
                        mode: 1,
                        multi: 1,
                        select_list: _this.employee_select_list || []
                    }, function (b) {
                    });
                } catch (e) {
                    alert(JSON.stringify(e));
                }
            };
        } else {
            this.root.push(this.wrapKey);

            this.components[this.wrapKey] = {
                type: "view",
                ref: true,
                className: 'form-row',
                style: utils.processStyle({
                    backgroundColor: "#fff",
                    height: 60,
                    fontSize: 15,
                    paddingLeft: 13,
                    flexDirection: "row",
                    borderBottom: "solid 1px #ededed"
                }),
                root: [this.titleKey, this.id]
            };

            this.components[this.titleKey] = {
                type: "text",
                text: this.config.itemData.title || defaultTitle,
                numberofline: 2,
                style: utils.processStyle({
                    width: 80
                })
            };
            this.components[this.id] = {
                type: "icon",
                textPos: "left",
                ref: true,
                text: this.config.itemData.isRequired ? (placeholder + " (必填)") : placeholder,
                font: "icomoon_e913",
                numberofline: 5,
                textStyle: utils.processStyle({
                    color: "#b7b7b7",
                    fontSize: 15,
                    marginRight: 6,
                    maxWidth: "100%"
                }),
                iconStyle: utils.processStyle({
                    color: "#ccc",
                    fontSize: 14
                }),
                style: utils.processStyle({
                    flex: 1,
                    justifyContent: "flex-end",
                    paddingRight: 16,
                    paddingLeft: 20

                })
            };

            if (this.isCurrentEmployee) {
                this.plugin[this.wrapKey + "_init"] = function (sender, params) {
                    this.pageview.delegate(_this.id, function (target) {
                        var dom = '<div class="displayflex yy-fd-column yy-jc-center yy-ai-center"><image style="width: 30px;height: 30px;border-radius: 50%;margin-bottom: 2px;" src="' + (window.currentUserInfo && window.currentUserInfo.userPic || './imgs/unknow_person.png') + '" /><div style="font-size: 12px;">' + (window.currentUserInfo && window.currentUserInfo.userName || '未知') + '</div></div>';
                        target.setText(dom);
                    });
                };

                this.employee_select = {
                    userName: window.currentUserInfo && window.currentUserInfo.userName,
                    headImgUrl: window.currentUserInfo && window.currentUserInfo.userPic,
                    member_id: window.currentUserInfo && window.currentUserInfo.userCode.split('esn')[1]
                };
            } else {
                // 增加人
                this.plugin[this.wrapKey + "_click"] = function (sender, params) {
                    var __this = this;
                    var _sender = sender;

                    try {
                        window.yyesn.enterprise.selectContacts(function (b) {
                            if (b.error_code === "0") {
                                var data = JSON.stringify(b);
                                var itemData = JSON.parse(data).data[0];
                                _this.employee_select = itemData;

                                if (_this.isInDetail) {
                                    _sender.rowInstance.delegate(_this.id, function (target) {
                                        var dom = '<div class="displayflex yy-fd-column yy-jc-center yy-ai-center"><image style="width: 30px;height: 30px;border-radius: 50%;margin-bottom: 2px;" src="' + _this.employee_select.avatar + '" /><div style="font-size: 12px;">' + _this.employee_select.name + '</div></div>';
                                        target.setText(dom);
                                    });
                                } else {
                                    __this.pageview.delegate(_this.id, function (target) {
                                        var dom = '<div class="displayflex yy-fd-column yy-jc-center yy-ai-center"><image style="width: 30px;height: 30px;border-radius: 50%;margin-bottom: 2px;" src="' + _this.employee_select.avatar + '" /><div style="font-size: 12px;">' + _this.employee_select.name + '</div></div>';
                                        target.setText(dom);
                                    });
                                }
                            }
                        }, {
                            mode: 1,
                            multi: 0,
                        }, function (b) {
                        });
                    } catch (e) {
                        alert(JSON.stringify(e));
                    }
                };
            }
        }
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function (str) {
        if (this.employee_select_list && this.employee_select_list.length > 0) {
            var assignees = '';

            this.employee_select_list.forEach(function (value, key) {
                assignees += value.member_id + ',';
            });

            assignees = assignees.substring(0, assignees.length - 1);

            return assignees;
        } else if (this.employee_select) {
            return this.employee_select.member_id;
        } else {
            return '';
        }
    };
    Component.prototype.getConfig = function (rowInstance) {
        var value;
        var Config = utils.copy(this.itemData);
        value = this.getValue() || '';

        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }

        Config.value = value;
        return Config;
    };

    return Component;
});
