define(["./ApplyBase", "utils", "../parts/common"], function(baseClass, utils, c) {
    function Component(config) {
        var _this = this;
        Component.baseConstructor.call(this, config);


        this.titleKey = this.id + "_title";
        this.root.push(this.titleKey);
        this.root.push(this.id);

        this.imageKey = this.id + "_image";
        this.imageDelKey = this.id + "_imagedelbtn";

        this.subComponentKey = this.id + "_addbtn";

        this.components[this.titleKey] = c.getCtlTitle(this.itemData.title);
        this.components[this.id] = {
            type: "repeat",
            subComponentAlwaysShow: true,
            ref: true,
            items: [],
            root: [this.imageKey, this.imageDelKey],
            style: utils.processStyle({
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 10,
                paddingLeft: 5
            }),
            itemStyle: utils.processStyle({
                w: 90,
                justifyContent: "center",
                alignItems: "center",
            }),
            subComponent: this.subComponentKey
        };
        this.components[this.subComponentKey] = {
            type: "icon",
            text: "＋",
            style: utils.processStyle({
                w: 80,
                backgroundColor: "#fff",
                marginTop: 5,
                marginLeft: 5,
                border: "1px dashed rgb(207,207,207)",
            }),
            textStyle: utils.processStyle({
                color: "rgb(207,207,207)",
                fontSize: 49
            })
        };





        this.components[this.imageDelKey] = {
            type: "icon",
            font: "icomoon_e909",
            style: utils.processStyle({
                position: "absolute",
                right: 8,
                border: "2px solid #fff",
                borderRadius: "100%",
                backgroundColor: "#fff",
                top: 8
            }),
            iconStyle: utils.processStyle({
                color: "#FC505F",
                fontSize: 17
            })
        };
        this.components[this.imageKey] = {
            type: "image",
            src_bind: "src",
            src: "",
            style: utils.processStyle({
                w: 80,
                backgroundColor: "rgba(0,0,0,.1)"
            })
        };

        var max = 10;

        this.plugin[this.subComponentKey + "_click"] = function(sender, params) {
            if (window.isPreview === true) {
                return;
            }
            var formRepeatInstance = sender.parent.rowInstance;
            var RepeatInstance;
            if (formRepeatInstance) {
                RepeatInstance = formRepeatInstance.refs[_this.id];
            } else {
                RepeatInstance = this.pageview.refs[_this.id];
            }
            if (RepeatInstance.datasource.length >= max) {
                _this.pageview.showTip({
                    text: "最多上传" + max + "张图片",
                    duration: 1000,
                    style: {
                        width: "220px"
                    }
                });
                return;
            }

            try {
                var last = max - RepeatInstance.datasource.length;
                window.yyesn.client.selectAttachment(function(Re) {
                    var data = Re.data;
                    if (data.length > last) {
                        this.pageview.showTip({
                            text: "最多上传5张图片",
                            duration: 1000,
                            style: {
                                width: "220px"
                            }
                        });
                    }
                    for (var i = 0, j = last; i < j; i++) {
                        RepeatInstance.addItem({
                            src: data[i].path
                        });
                    }

                }, {
                    type: 1,
                    maxselectnum: last
                });
            } catch (e) {}
        }

        this.plugin[this.id + "_itemclick"] = function(sender, params) {
            var imgs = [];
            for (var i = 0, j = sender.parent.datasource.length; i < j; i++) {
                imgs.push(sender.parent.datasource[i].src);
            }

            try {
                window.yyesn.client.viewImage({
                    "files": imgs.join(","),
                    "index": parseInt(params.index)
                });
            } catch (e) {}

        };



        this.plugin[this.imageDelKey + "_click"] = function(sender, params) {
            sender.rowInstance.remove();
        }




    }

    utils.extends(Component, baseClass);




    Component.prototype.getValue = function() {
        return this.plugin.pageview.refs[this.id].datasource;

    };
    Component.prototype.bindInitValueInRepeat = function(sender) {
        var arr = sender.datasource[this.id] || [];
        if (arr instanceof Array) {
            var ReArray = [];
            for (var i = 0, j = arr.length; i < j; i++) {
                ReArray.push({
                    src: arr[i]
                });
            }
            sender.config.items = ReArray;
        }
    };
    Component.prototype.bindInitValue = function(sender) {
        var arr = this.itemData.value || [];
        if (arr instanceof Array) {
            var ReArray = [];
            for (var i = 0, j = arr.length; i < j; i++) {
                ReArray.push({
                    src: arr[i]
                });
            }
            sender.config.items = ReArray;
        }

    };
    Component.prototype.getValueWhenItemInRepeat = function(rowInstance) {
        return rowInstance.refs[this.id].datasource;
    };
    Component.prototype.getConfig = function(rowInstance) {
        var value;
        var Config = utils.copy(this.itemData);
        if (rowInstance) {
            value = this.getValueWhenItemInRepeat(rowInstance) || [];
        } else {
            value = this.getValue() || [];
        }
        if (this.isRequired) {
            if (value.length === 0) {
                this.showRequiedTip();
                return false;
            }
        }
        var newRe = [];
        for (var i = 0, j = value.length; i < j; i++) {
            newRe.push(value[i].src);
        }
        Config.value = newRe;
        return Config;
    };



    return Component;

});
