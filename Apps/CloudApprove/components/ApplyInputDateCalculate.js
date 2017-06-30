define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, c) {
    function Component(config) {
        var _this = this,
            layout = [];
        Component.baseConstructor.call(this, config);

        layout.title = '日期';
        c.switchLayout(this, layout);
        this.caculateData = [];

        console.log(this.itemData);
        this.itemData.dateFieldArr.forEach(function (value, key) {

            if (value.type === 'field') {
                _this.caculateData.push(value.value);
            }
        });

        this.caculateData.forEach(function (value, key) {

            _this.plugin[value + '_change'] = function (str, sender) {
                var days = _this.getDateValue(sender);

                if (days) {
                    sender.parent.$el.find('.' + _this.id).find('input').val(days);
                }
            };
        });
    }

    utils.extends(Component, baseClass);

    Component.prototype.getDateValue = function (sender) {
        var _this = this,
            results = [],
            days = 0;

        this.caculateData.forEach(function (value, key) {
            var text = '';

            // 区分是否是明细中获取不同值
            if (_this.itemData.inDataTable) {
                text = sender.rowInstance.refs[value].getText();
            } else {
                text = _this.plugin.pageview.refs[value].getText();
            }

            var reg = /^(\d{4})-(\d{2})-(\d{2})$/,
                str = text,
                arr = reg.exec(str);

            if ($.isArray(arr) && arr.length > 0) {
                results.push(+utils.convertStrToDate(text));
            } else {
                results.push('');
            }
        });

        if (!results[0] || !results[1]) {return '';}
        // 算天数
        days = (results[0] - results[1]) / 1000 / 60 / 60 / 24;

        // 正值时相同日期算一天，负值是该是多少就是多少，想喷找产品。。。
        if (days > 0 || days === 0) {
            days = days + 1;
        }

        this.days = days;
        return days + '（天）';
    };

    Component.prototype.getValue = function (sender, params) {
        if (this.days) {
            return this.days + '（天）';
        } else {
            return '';
        }
    };

    return Component;

});
