define(["./ApplyBase", "utils", "../parts/common"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this,
            defaultTitle = '部门';

        this.config = config;
        this.multiselect = this.config.itemData.multiselect ? true : false;
        this.isCurrentEmployee = this.config.itemData.isCurrentEmployee ? true : false;
        Component.baseConstructor.call(this, config);

        var placeholder = this.itemData.tips ? this.itemData.tips : '请选择用户';

        this.wrapKey = this.id + '_wrap';
        this.titleKey = this.id + '_title';


        this.root.push(this.wrapKey);

        this.components[this.wrapKey] = {
            type: "view",
            className: 'form-row',
            style: utils.processStyle({
                backgroundColor: "#fff",
                height: 50,
                fontSize: 15,
                paddingLeft: 13,
                flexDirection: "row",
                borderBottom:"1px solid #ededed"
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
            text: this.config.itemData.isRequired ? placeholder + " (必填)" : placeholder,
            font: "icomoon_e913",
            numberofline: 5,
            textStyle: utils.processStyle({
                color: "#B7B7B7",
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

        // 增部门
        this.plugin[this.wrapKey + "_click"] = function (sender, params) {
            var __this = this,
                _sender = sender;

            try {
                window.yyesn.enterprise.selectDepartmentForVerify(function (b) {
                    if (b.error_code === "0") {
                        var data = JSON.stringify(b);
                        var itemData = JSON.parse(data).data;
                        console.log(itemData);
                        _this.employee_select_list = itemData;
                        var name = '';

                        _this.employee_select_list.forEach(function (value, key) {
                            name += value.name + ',';
                        });

                        name = name.substring(0, name.length - 1);

                        if (_this.isInDetail) {
                            _sender.rowInstance.delegate(_this.id, function (target) {
                                var dom = '<div class="displayflex yy-fd-column yy-jc-center yy-ai-center">' + name + '</div></div>';
                                target.setText(dom);
                            });
                        } else {
                            __this.pageview.delegate(_this.id, function (target) {
                                var dom = '<div class="displayflex yy-fd-column yy-jc-center yy-ai-center">' + name + '</div></div>';
                                target.setText(dom);
                            });
                        }
                    }
                }, {
                    // select_list: _this.employee_select_list
                }, function (b) {
                });
            } catch (e) {
                alert(JSON.stringify(e));
            }
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function (str) {
        if (this.employee_select_list && this.employee_select_list.length > 0) {
            var assignees = '';

            this.employee_select_list.forEach(function (value, key) {
                assignees += value.name + ',';
            });

            assignees = assignees.substring(0, assignees.length - 1);

            return assignees;
        } else if (this.employee_select) {
            return this.employee_select.name;
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
