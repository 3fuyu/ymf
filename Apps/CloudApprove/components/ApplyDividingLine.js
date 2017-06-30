define(["./ApplyBase", "utils", "../parts/commonLayout"], function (baseClass, utils, cl) {
    function Component(config) {
        Component.baseConstructor.call(this, config);

        this.root.push(this.id);

        this.components[this.id] = {
            type: 'text',
            text: '',
            style: utils.processStyle({
                height: 10,
                borderBottom: '1px solid #ddd',
                borderColor: "#ededed",
                marginBottom: 10,
                paddingBottom: 10
            })
        };
    }

    utils.extends(Component, baseClass);

    Component.prototype.getValue = function () {
        return '';
    };


    return Component;

});
