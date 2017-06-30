define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this,
            layout = [];

        this.config = config;
        this.selectedData = '';
        this.isDisabled = false;

        Component.baseConstructor.call(this, config);

        c.createItemLayout(this, layout);

        // 如果有联动，上级没选则该级无法选择
        if (this.itemData.linkageComponent && !(this.authInfo && this.authInfo.readonly)) {
            if (!window.linkageComponents) {
                // 储存所有可以联动控件
                window.linkageComponents = {};
            }

            // 储存id
            window.linkageComponents[this.itemData.linkageComponent + '_id'] = this.itemData.linkageField;

            this.isDisabled = true;
            setTimeout(function () {
                $('.' + _this.id + '_warp').css({opacity: 0.4});
            }, 100);
        }

        if (this.plugin.mode === 'MODIFY') {
            setTimeout(function () {
                _this.setValue();
            }, 100);
        }

        this.plugin[this.itemData.linkageComponent + "_change"] = function (value, selectData) {
            if (value) {
                _this.isDisabled = false;
                $('.' + _this.id + '_warp').css({opacity: 1});
            }
        };

        this.plugin[this.itemData.id + "_wrap_init"] = function (sender, params) {

        };

        this.plugin[this.id + "_warp_click"] = function (sender, params) {
            this.sender = sender;

            if (_this.isDisabled) {
                return false;
            }
            // 编辑表单时不可编辑
            if (_this.authInfo && _this.authInfo.readonly) {
                return false;
            }

            if (config.itemData.contMeta === 'bpmuserref') {
                if (config.itemData.isMutiSelect) {
                    try {
                        window.yyesn.enterprise.selectContacts(function (b) {
                            if (b.error_code === "0") {
                                var persons = b.data;
                                _this.multiValue = '';

                                for (var i = 0, j = persons.length; i < j; i++) {
                                    var itemData = persons[i];
                                    _this.multiValue += itemData.name + ',';
                                }

                                _this.multiValue = _this.multiValue.substring(0, _this.multiValue.length - 1);

                                var dom = '.' + _this.id;
                                $(dom).find('span').html(_this.multiValue);
                            }
                        }, {
                            mode: 1,
                            multi: 1,
                            select_list: _this.add_sign_select_list || []
                        }, function (b) {
                        });
                    } catch (e) {
                        alert(JSON.stringify(e));
                    }
                } else {
                    try {
                        window.yyesn.enterprise.selectContacts(function (b) {
                            if (b.error_code === "0") {
                                var data = JSON.stringify(b);
                                var itemData = JSON.parse(data).data[0];

                                _this.multiValue = itemData.name;

                                var dom = '.' + _this.id;
                                $(dom).find('span').html(_this.multiValue);
                            }
                        }, {
                            mode: 1,
                            multi: 0,
                        }, function (b) {
                        });
                    } catch (e) {
                        alert(JSON.stringify(e));
                    }
                }
            } else if (config.itemData.contMeta === 'bpmorgref') {
                console.log('调选部门');
            } else {
                this.pageview.showPage({
                    pageKey: "referenceList",
                    nocache: true,
                    mode: "fromRight2",
                    params: {
                        config: config,
                        parent: _this,
                    }
                });
            }
        };

        this.afterClosePage = function (data) {
            var dom = '.' + _this.id;
            _this.selectedData = data;
            _this.multiValue = '';
            _this.multiKey = '';

            if (config.itemData.isMutiSelect) {
                _this.selectedData.forEach(function (value, key) {
                    _this.multiValue += value.refname + ',';
                    _this.multiKey += value.refcode + ',';
                });

                _this.multiValue = _this.multiValue.substring(0, _this.multiValue.length - 1);
                _this.multiKey = _this.multiKey.substring(0, _this.multiKey.length - 1);

                $(dom).find('span').html(_this.multiValue);

                if (_this.plugin[_this.id + '_change']) {
                    _this.plugin[_this.id + '_change'].call(_this.plugin, _this.multiValue, _this.selectedData);
                }
            } else {
                $(dom).find('span').html(data.refname);

                if (_this.plugin[_this.id + '_change']) {
                    _this.plugin[_this.id + '_change'].call(_this.plugin, data.refname, _this.selectedData);
                }
            }

            // 储存联动父级的数据
            if (window.linkageComponents && window.linkageComponents[_this.id + "_id"]) {
                var linkageField = window.linkageComponents[_this.id + "_id"];
                data.linkageField = linkageField;

                window.linkageComponents[_this.id] = data;
            }

        };
    }

    utils.extends(Component, baseClass);

    // 编辑时调用设置值的方法
    Component.prototype.setValue = function () {
        var dom = '.' + this.id;
        var values = JSON.parse(this.itemData.values);

        // TODO 参照多选传数据有可能会有问题，时间来不及，会深圳在改

        if (this.itemData.isMutiSelect) {
            var valueName = '',
                valueCode = '';

            values.forEach(function (key, value) {
                valueName += value.name + ',';
                valueCode += value.code + ',';
            });

            valueName = valueName.substring(0, valueName.length - 1);
            valueCode = valueCode.substring(0, valueCode.length - 1);

            this.multiKey = valueCode;
            this.multiValue = valueName;

            $(dom).find('span').html(this.multiValue);
        } else {
            this.selectedData = {
                refname: values[0].name,
                linkageField: this.itemData.linkageField,
                refcode: values[0].code
            };

            $(dom).find('span').html(this.selectedData.refname);
        }
    };

    Component.prototype.getValue = function (str) {
        if (this.config.itemData.isMutiSelect) {
            return this.multiKey;
            // return this.multiValue;
        } else {
            return this.selectedData.refcode;
            // return this.selectedData.refname;
        }
    };

    Component.prototype.getReferenceValue = function () {
        if (this.config.itemData.isMutiSelect) {
            return this.multiValue;
        } else {
            return this.selectedData.refname;
        }
    };

    Component.prototype.getConfig = function (rowInstance) {
        var value,
            keyFeature = {},
            featureValue = '';
        var Config = utils.copy(this.itemData);
        value = this.getValue();

        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }

        Config.value = value || '';

        if (!rowInstance) {
            //对主表单字段才做关键特性的控制显示
            if (this.itemData.crux) {

                keyFeature.key = (this.itemData.title || '关联');
                keyFeature.value = this.getReferenceValue();
                keyFeature.code = value;
            }
        }

        Config.keyFeature = keyFeature;

        return Config;
    };
    return Component;
});
