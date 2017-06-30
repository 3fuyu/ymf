/**
 * Created by axiba on 17/2/27.
 * switch 开关业务组件
 */
define(["./ApplyBase", "utils", "../parts/commonLayout"], function(baseClass, utils, cl) {
    function Component(config) {
        var _this = this;

        Component.baseConstructor.call(this, config);

        this.itemData.inLeft = true;
        cl.layoutForSwitch(this);
 
        this.plugin[this.id + "_change"] = function(sender, params) {
            sender.setValue(params.value);
        };
    }


    utils.extends(Component, baseClass);

    Component.prototype.bindInitValueInRepeat = function (sender) {
        var value = sender.datasource[this.id],
            defOption = this.itemData.defOption;
        if(value){
            sender.config.value = (value === 'true' || value === '1');
        }else {
            sender.config.value = (defOption === 'true' || defOption === '1');
        }

    };
    Component.prototype.bindInitValue = function (sender) {
        var values = this.itemData.values,
            defOption = this.itemData.defOption;
        if(values && values.length > 0){
            sender.config.value = (values[0] === 'true' || values[0] === '1');
        }else {
            sender.config.value = (defOption === 'true' || defOption === '1');
        }
    };

    Component.prototype.getConfig = function (rowInstance) {
        var value,
            keyFeature = '';
        var Config = utils.copy(this.itemData);

        if (rowInstance) {
            value = this.getValueWhenItemInRepeat(rowInstance) + '';

        } else {
            value = this.getValue() + '';

            //对主表单字段才做关键特性的控制显示
            if (this.itemData.crux){
                keyFeature = (this.itemData.title || '未命名') + ':' + value;
            }
        }
        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }
        if (this.verify) {
            this.showVerifyTip(this.verifyMsg);
            return false;
        }
        Config.value = value;
        Config.keyFeature = keyFeature;
        
        return Config;
    };

    return Component;

});
