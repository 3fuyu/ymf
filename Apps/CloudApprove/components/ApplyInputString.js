define(["./ApplyBase", "utils"], function(baseClass, utils) {
    function Component(config) {
        var _this = this;
        Component.baseConstructor.call(this, config);

        // description
        this.strKey = this.id + "_string";
        this.root.push(this.strKey);
        this.components[this.strKey] = {
            type: "text",
            style: utils.processStyle({
                whiteSpace: "pre",
                paddingTop: 7,
                paddingBottom: 6,
                // marginBottom: 1,
                borderBottom: "1px solid #ededed",
                fontSize: 14,
                color: "#262626",
                paddingLeft: 13,
                paddingRight: 10
            }),
            textStyle: utils.processStyle({
                whiteSpace: "pre-line"
            }),
            text: this.itemData.content
        };

        this.plugin[this.strKey + "_init"] = function(sender, params) {
            var string_backColor;
            switch (_this.itemData.style) {
                case 'alert-none':
                    string_backColor = '#f5f5f5';
                    break;
                case 'alert-success':
                    string_backColor = '#dff0d8';
                    break;
                case 'alert-info':
                    string_backColor = '#d9edf7';
                    break;
                case 'alert-warning':
                    string_backColor = '#fcf8e3';
                    break;
                case 'alert-danger':
                    string_backColor = '#f2dede';
                    break;
                default:
                    string_backColor = '#f5f5f5';
            }
            sender.config.style.backgroundColor = string_backColor;
        }

    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        return this.itemData.content;
    };

    return Component;

});
