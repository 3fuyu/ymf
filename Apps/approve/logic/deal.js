define(["../parts/common", "utils"], function (c, utils) {
    function pageLogic(config) {
        this.pageview = config.pageview;
        this.params = this.pageview.params || {};
        this.comment = '';
        this.setHeader();
    }

    pageLogic.prototype = {
        image_del_icon_click: function (sender, params) {
            sender.rowInstance.remove();
        },
        setHeader: function () {
            var _this = this;

            try {
                var title = this.formName || "";
                window.yyesn.client.setHeader(function () {}, {
                    type: 2,
                    title: _this.params.userName ? ('转交给' + decodeURI(_this.params.userName)) : "审批意见",
                    rightTitle: "",
                    rightValues: [],
                }, function (b) {
                });
            } catch (e) {

            }
        },
        images_repeat_itemclick: function (sender, params) {
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

        },
        selectAttachment: function (type) {
            c.selectAttachment(this, type);
        },
        add_image_icon_click: function () {
            this.selectAttachment(1);
        },
        images_repeat_init: function (sender, params) {
            this.imagesRepeat = sender;
        },
        input_textarea_init: function (sender, params) {
            if (this.params.type === '1') {
                sender.config.placeholder = '请输入同意理由（非必填, 500字以内）';
            } else if (this.params.type === '2') {
                sender.config.placeholder = '请输入拒绝理由（非必填, 500字以内）';
            } else if (this.params.type === '3') {
                sender.config.placeholder = '请输入转交理由（非必填, 500字以内）';
            }
        },
        submit_click: function (sender, params) {
            var para = {},
                _this = this;

            para.status = this.params.type; // 1 同意 2 不同意 3 转交
            para.fdId = this.params.id;
            para.photos = '';
            para.comment = sender.parent.components.main_view.components.input_textarea.$el.find('textarea')
                .val() || '';
            para.toMemberId = this.pageview.params.toMemberId || ''; // 消息中进来需要的字段
            para.qzId = this.pageview.params.qzId || ''; // 消息中进来需要的字段
            para.receiver = this.pageview.params.memberId || 0;
            this.imagesRepeat.datasource.forEach(function (value, key) {
                para.photos += value.src + ';';
            });
            para.comment = this.beforeSubmit(para.comment);

            if (this.params.from && this.params.from === 'resend') {
                // 转交

                this.pageview.ajax({
                    url: '/formdata/transmit',
                    data: para,
                    type: 'POST',
                    success: function (data) {
                        if (data.code === 0) {
                            _this.pageview.showTip({text: '转交成功！', duration: 800});

                            window.changeFormStatus = true;

                            setTimeout(function () {
                                _this.pageview.goBack();
                            }, 800);
                        } else {
                            _this.pageview.showTip({text: data.msg, duration: 1000});
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            } else {
                // 审批

                this.pageview.ajax({
                    url: '/formdata/doApprove',
                    data: para,
                    type: 'POST',
                    success: function (data) {
                        if (data.code === 0) {
                            _this.pageview.showTip({text: '审批成功！', duration: 800});

                            window.changeFormStatus = true;

                            setTimeout(function () {
                                _this.pageview.goBack();
                            }, 800);
                        } else {
                            _this.pageview.showTip({text: data.msg, duration: 1000});
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
            }


        },
        beforeSubmit: function (content) {
            return this.filterEmoji(content);
        },
        filterEmoji: function (content) {
            if (!content) return '';

            var emojireg = content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|[\uD800-\uDBFF]|[\uDC00-\uDFFF]/g, "");
            return emojireg;
        }
    };

    return pageLogic;
});
