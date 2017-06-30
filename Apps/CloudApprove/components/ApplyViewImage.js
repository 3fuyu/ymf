define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        Component.baseConstructor.call(this, config);

        this.root.push(this.id);

        this.components[this.id] = {
            type: 'image',
            src: config.itemData.url,
            style: utils.processStyle({
                fontSize: 15,
                marginBottom: 10,
                marginTop: 10,
                marginLeft: 13,
                marginRight: 13,
                backgroundColor: '#F2F4F4'
            })
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        return '';  // 图片不需要返回数据
    };

    return Component;

});
