define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {
    function pageLogic(config) {
        var _this = this;
        this.pageview = config.pageview;
        this._taskId = this.pageview.params.formId;
        this.parentThis = this.pageview.viewpagerParams.parent;

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

        this.loadData();
    }

    pageLogic.prototype = {
        loadData: function () {
            var _this = this;
            this.applyHistory = window._applyHistory;

            this.pageview.showLoading({
                text: "努力加载中...",
                timeout: 8000,
                reLoadCallBack: function () {
                    _this._loadData();
                }
            });
            _this._loadData();
        },
        _loadData: function () {
            var _this = this,
                ajaxConfig = {
                    url: '/process/getTaskAttachments',
                    type: 'POST',
                    data: {
                        taskId: this._taskId || ''
                    },
                    success: function (listData) {
                        _this.pageview.hideLoading(true);
                        _this.pageview.delegate('flow_repeat', function (target) {
                            target.bindData(listData.data);
                        });
                    },
                    error: function (err) {

                    }
                };
            this.pageview.ajax(ajaxConfig);
        },
        format_image_init: function (sender, params) {
            var fileType = sender.datasource.type || 'unknow';

            if (fileType.indexOf('image') > -1) {
                sender.config.src = sender.datasource.aliOSSLimitUrl;
            } else {
                sender.config.src = "./imgs/" + (this.format[sender.datasource.type] ? this.format[sender.datasource.type].ext : this.format.unknow.ext);
            }
        },
        atta_contributor_init: function (sender, params) {
            this.applyHistory = window._applyHistory;

            // 文件是当前用户上传的，而且在该环节上传的
            if ((this.applyHistory.currentUserId === sender.datasource.userId)) {
                this.applyHistory.instData.historicActivityInstances.forEach(function (value, key) {
                    if (value.assignee === sender.datasource.userId) {
                        sender.config.style.display = "block";
                    }
                });
            }
        },
        file_size_init: function (sender, params) {
            var text = sender.config.text;
            sender.config.text = text + sender.datasource.author;
        },
        atta_contributor_click: function (sender, params) {
            var _this = this;

            _this.deleteDialog = new Dialog({
                mode: 3,
                wrapper: _this.parentThis.pageview.$el,
                contentText: "确定要删除该附件吗?",
                btnDirection: "row",
                buttons: [{
                    title: "取消",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: c.titleColor,
                        borderRight: '1px solid #eee'
                    },
                    onClick: function () {
                        _this.deleteDialog.hide();
                    }
                }, {
                    title: "确定",
                    style: {
                        height: 45,
                        fontSize: 16,
                        color: "#37b7fd",
                    },
                    onClick: function () {
                        _this.deleteDialog.hide();

                        _this.pageview.showLoading({text: "删除中...", timeout: 8000});
                        _this.parentThis.fileUploader.deleteServerUploadImage(sender.datasource.id, function (data) {
                            _this.pageview.hideLoading(true);
                            sender.rowInstance.remove();
                            _this.pageview.showTip({text: "删除成功", duration: 1000});
                        }, function () {
                            _this.pageview.hideLoading(true);
                            _this.pageview.showTip({text: "删除失败，请稍后重试", duration: 1000});
                        });
                    }
                }]
            });
            _this.deleteDialog.show();
        },
        title_view_init: function (sender, params) {
            var tempArr = sender.datasource.name.split('_'),
                title = tempArr[tempArr.length - 1];
            sender.config.text = title;
        },
        flow_repeat_itemclick: function (sender, params) {
            var fileType = sender.datasource.type,
                tempArr = sender.datasource.name.split('_'),
                title = tempArr[tempArr.length - 1];

            if (fileType.indexOf('image') > -1) {
                try {
                    window.yyesn.client.viewImage({
                        "files": sender.datasource.aliOSSUrl
                    });
                } catch (e) {
                }
            } else {
                var host = window.location.origin,
                    base = host + '/approve-app/file/downloadattachment/';
                // base = 'http://121.42.30.191:8880/approve-app/file/downloadattachment/';
                this.downloadFile(title, base + sender.datasource.id);
            }
        },
        downloadFile: function (fileName, url) {
            // var aLink = document.createElement('a');
            // aLink.download = fileName;
            // aLink.href = url;
            // $(aLink).click();
            // window.location.href = url;
            // var iframe = document.createElement('iframe');
            // iframe.src = url;
            // iframe.style = {display: 'none'};
            // document.body.appendChild(iframe);
            // alert('download');
            window.open(url);
            return false;
        },
        atta_time_init: function (sender, params) {
            sender.config.text = utils.timestampToTimeStr(sender.datasource.time);
        }
    };
    return pageLogic;
});
