define(["./ApplyBase", "utils", "../parts/common", "../libs/plupload/form-file-uploader"], function (baseClass, utils, c, FileUploader) {
    function Component(config) {
        var _this = this;
        Component.baseConstructor.call(this, config);
        this.fileMaxNum = this.itemData.isSingle ? 1 : 9; // 最大上传数
        this.fileNum = 0; // 现有文件数

        this.format = {
            "application/msword": {
                "ext": "word.png"
            },
            "application/pdf": {
                "ext": "pdf.png"
            },
            "application/pgp-signature": {
                "ext": "other.png"
            },
            "application/postscript": {
                "ext": "other.png"
            },
            "application/rtf": {
                "ext": "other.png"
            },
            "application/vnd.ms-excel": {
                "ext": "exc.png"
            },
            "application/vnd.ms-powerpoint": {
                "ext": "ppt.png"
            },
            "application/zip": {
                "ext": "zipfile.png"
            },
            "application/x-shockwave-flash": {
                "ext": "other.png"
            },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
                "ext": "word.png"
            },
            "application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
                "ext": "word.png"
            },
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                "ext": "exc.png"
            },
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
                "ext": "ppt.png"
            },
            "application/vnd.openxmlformats-officedocument.presentationml.template": {
                "ext": "other.png"
            },
            "application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
                "ext": "other.png"
            },
            "application/x-javascript": {
                "ext": "other.png"
            },
            "application/json": {
                "ext": "other.png"
            },
            "audio/mpeg": {
                "ext": "other.png"
            },
            "audio/x-wav": {
                "ext": "music.png"
            },
            "audio/x-m4a": {
                "ext": "music.png"
            },
            "audio/ogg": {
                "ext": "music.png"
            },
            "audio/aiff": {
                "ext": "other.png"
            },
            "audio/flac": {
                "ext": "other.png"
            },
            "audio/aac": {
                "ext": "other.png"
            },
            "audio/ac3": {
                "ext": "other.png"
            },
            "audio/x-ms-wma": {
                "ext": "other.png"
            },
            "image/bmp": {
                "ext": "pic.png"
            },
            "image/gif": {
                "ext": "pic.png"
            },
            "image/jpeg": {
                "ext": "pic.png"
            },
            "image/photoshop": {
                "ext": "other.png"
            },
            "image/png": {
                "ext": "pic.png"
            },
            "image/svg+xml": {
                "ext": "other.png"
            },
            "image/tiff": {
                "ext": "other.png"
            },
            "text/plain": {
                "ext": "text.png"
            },
            "text/html": {
                "ext": "other.png"
            },
            "text/css": {
                "ext": "other.png"
            },
            "text/csv": {
                "ext": "other.png"
            },
            "text/rtf": {
                "ext": "other.png"
            },
            "video/mpeg": {
                "ext": "video.png"
            },
            "video/quicktime": {
                "ext": "video.png"
            },
            "video/mp4": {
                "ext": "video.png"
            },
            "video/x-m4v": {
                "ext": "video.png"
            },
            "video/x-flv": {
                "ext": "video.png"
            },
            "video/x-ms-wmv": {
                "ext": "video.png"
            },
            "video/avi": {
                "ext": "video.png"
            },
            "video/webm": {
                "ext": "video.png"
            },
            "video/3gpp": {
                "ext": "video.png"
            },
            "video/3gpp2": {
                "ext": "video.png"
            },
            "video/vnd.rn-realvideo": {
                "ext": "video.png"
            },
            "video/ogg": {
                "ext": "video.png"
            },
            "video/x-matroska": {
                "ext": "video.png"
            },
            "application/vnd.oasis.opendocument.formula-template": {
                "ext": "other.png"
            },
            "application/octet-stream": {
                "ext": "other.png"
            },
            "unknow": {
                "ext": "other.png"
            }
        };

        this.titleKey = this.id + "_title";
        this.root.push(this.titleKey);
        this.root.push(this.id);

        this.imageKey = this.id + "_image";
        this.imageDelKey = this.id + "_imagedelbtn";

        this.subComponentKey = this.id + "_addbtn";
        this.itemData.tips = '请上传附件';

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
                width: 80,
                borderRadius: 5,
                border: "1px solid #ededed",
                backgroundColor: "rgba(244,244,244,.1)"
            })
        };

        this.plugin[this.subComponentKey + "_didmount"] = function (sender, params) {
            setTimeout(function () {
                _this.initUploader(sender);
            }, 1000);
        };

        this.plugin[this.subComponentKey + "_click"] = function (sender, params) {
            var formRepeatInstance = sender.parent.rowInstance;

            if (formRepeatInstance) {
                _this.RepeatInstance = formRepeatInstance.refs[_this.id];
            } else {
                _this.RepeatInstance = this.pageview.refs[_this.id];
            }
            _this.fileNum = _this.RepeatInstance.datasource.length;
            if (_this.RepeatInstance.datasource.length >= _this.fileMaxNum) {
                _this.plugin.pageview.showTip({
                    text: "最多上传" + _this.fileMaxNum + "张图片",
                    duration: 1000
                });
                return;
            }
            sender.parent.$el.find('.moxie-shim.moxie-shim-html5 input').click();
        };

        this.plugin[this.id + "_itemclick"] = function (sender, params) {
            var src = sender.datasource.aliOSSUrl,
                type = sender.datasource.type,
                name = sender.datasource.name.split('_')[1];

            if (type.indexOf('image/') > -1) {
                try {
                    window.yyesn.client.viewImage({
                        "files": src,
                    });
                } catch (e) {}
            } else {
                var suffix = '.' + name.split('.')[1];

                if (name.length >= 20) {
                    name = name.substring(0, 20) + '..';
                }

                _this.plugin.pageview.showTip({text: name + suffix, duration: 2000});
            }
        };

        this.plugin[this.imageDelKey + "_click"] = function (sender, params) {
            sender.rowInstance.remove();

            _this.fileUploader.deleteServerUploadImage(sender.datasource.id, function (data) {});
        };

        setTimeout(function () {
        }, 1000);
    }

    utils.extends(Component, baseClass);

    // 文件上传附件
    Component.prototype.initUploader = function (sender) {
        var _this = this,
            isShare = '';
        this.loadToken(function (token) {
            _this.token = token;
        });

        var picker = sender.parent.$el;
        var container = sender.parent.$el;
        var fileLimit = this.fileMaxNum - (this.RepeatInstance && this.RepeatInstance.datasource.length || 0);

        this.fileUploader = new FileUploader(this.plugin.pageview, this);

        isShare = this.plugin.pageview.params.share || '';

        this.uploaderId = this.fileUploader.initUploader(picker, container, '', fileLimit, isShare);
        setTimeout(function () {
            _this.fileUploader.updateUploaderSize();
        }, 100);
    };
    Component.prototype.loadToken = function (callbackFunc) {
        this.plugin.pageview.ajax({
            url: "user/getToken",
            success: function (token) {
                callbackFunc(token);
            },
            error: function (token) {
                console.error(token);
            }
        });
    };

    Component.prototype.loadFilesData = function (data) {
        var src = '';

        if (data.type.indexOf('image/') > -1) {
            src = data.aliOSSLimitUrl;
        } else {
            src = "./imgs/" + (this.format[data.type] ? this.format[data.type].ext : this.format.unknow.ext);
        }

        if (this.RepeatInstance.datasource.length > (this.fileMaxNum - 1)) {
            return;
        }

        this.RepeatInstance.addItem($.extend(data, {
            src: src
        }));
    };
    Component.prototype.getValue = function () {
        return this.plugin.pageview.refs[this.id].datasource;

    };
    Component.prototype.bindInitValueInRepeat = function (sender) {
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
    Component.prototype.bindInitValue = function (sender) {
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
    Component.prototype.getValueWhenItemInRepeat = function (rowInstance) {
        return rowInstance.refs[this.id].datasource;
    };
    Component.prototype.getConfig = function (rowInstance) {
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
            newRe.push({
                src: value[i].src,  // 缩略图
                id: value[i].id,
                name: value[i].name,
                type: value[i].type,
                aliOSSUrl: value[i].aliOSSUrl // 原图
            });
        }
        Config.value = newRe;
        return Config;
    };

    return Component;

});
