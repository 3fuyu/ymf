define(["../parts/common", "utils", "../../../components/dialog"], function (c, utils, Dialog) {
    function pageLogic(config) {
        var _this = this;
        this.pageview = config.pageview;
        this.nowApprove = true;
        // 检测是否改变了状态，来决定是否刷新上级列表页面
        window.changeFormStatus = false;

        this.formName = this.pageview.params.formDataName || "";
        this.formName = decodeURI(this.formName) || "";
        this.setHeader();
        //动画在请求一起的时候 安卓会卡顿  动画完后请求
        if (utils.deviceInfo().isAndroid) {
            window.setTimeout(function () {
                _this.loadData();
            }, 300);
        } else {
            _this.loadData();
        }

        this.renderCacheData();
    }

    pageLogic.prototype = {
        onPageResume: function () {
            this.loadData();
            this.resetData();
            this.setHeader();
        },
        setHeader: function () {
            try {
                var title = (window.nowFormData && window.nowFormData.name ? (window.nowFormData.name + '的') : '') + this.formName || "";
                window.yyesn.client.setHeader(function () {}, {
                    type: 2,
                    title: title,
                    rightTitle: "",
                    rightValues: [],
                }, function (b) {

                });
            } catch (e) {

            }
        },
        loadData: function () {
            var _this = this;
            this.pageview.showLoading({
                text: "努力加载中...",
                timeout: 9000,
                reLoadCallBack: function () {
                    _this._loadData();
                }
            });
            _this._loadData();
        },
        _loadData: function () {
            var _this = this,
                detailAjaxConfig = {
                    url: '/formdata/mylist/' + this.pageview.params.formId,
                    type: 'GET',
                    data: {
                        toMemberId: this.pageview.params.toMemberId || '',
                        qzId: this.pageview.params.qzId || '',
                        ccId: this.pageview.params.ccId || ''
                    },
                    success: function (detailData) {
                        if (detailData.code === 0) {
                            _this.myListData = detailData.data;

                            _this.templateid = detailData.data.formData.ftId;
                            _this.loadDetailSuccess(detailData.data);

                            // 抄送我的每次回去都刷新
                            window.needRefresCopyApproveListData = true;
                        } else {
                            _this.pageview.showTip({text: detailData.msg, duration: 1000});
                        }
                    },
                    error: function (detailData) {
                        _this.pageview.showTip({text: detailData.msg, duration: 1000});
                    }
                },
                listAjaxConfig = {
                    url: '/processdata/gethistory/' + this.pageview.params.formId,
                    type: 'GET',
                    data: {
                        toMemberId: this.pageview.params.toMemberId || '',
                        qzId: this.pageview.params.qzId || ''
                    },
                    success: function (listData) {
                        if (listData.code === 0) {
                            _this.detailData = listData.data;
                            _this.currentMemberId = listData.data.currentMemberId;
                            _this.loadListSuccess(listData.data);
                        } else {
                            _this.pageview.showTip({text: listData.msg, duration: 1000});
                        }
                    },
                    error: function (listData) {
                        _this.pageview.showTip({text: listData.msg, duration: 1000});
                    }
                };

            this.pageview.ajax(detailAjaxConfig);
            this.pageview.ajax(listAjaxConfig);
        },
        loadDetailSuccess: function (data) {
            this.pageview.hideLoading(true);

            this.pageview.delegate('middle_cc_list_repeat', function (target) {
                target.bindData(data.cclist);
            });

            this.pageview.delegate('middle_cc_list_top', function (target) {
                if (data.cclist.length === 0) {
                    target.$el.hide();
                }
            });

            this.renderData(data);
        },
        loadListSuccess: function (data) {
            var _this = this;

            this.pageview.delegate('middle_flow_repeat', function (target) {
                _this.historyLength = data.historyList.length;

                // 给数组初始和最后一个元素做标志
                data.historyList[0].isFirst = true;
                data.historyList[data.historyList.length - 1].isLast = true;

                target.bindData(data.historyList);
            });
        },
        renderCacheData: function () {
            var data = utils.copy(window.nowFormData);

            this.nowFormData = data;

            if (data && !$.isEmptyObject(data)) {
                this.pageview.delegate('userinfo_name', function (target) {
                    target.setText(data.name);
                });
                this.pageview.delegate('user_icon', function (target) {
                    target.title = data.name;
                    target.setSrc(data.avatar + '.thumb.jpg');
                });
                this.pageview.delegate('userinfo_status', function (target) {
                    switch (parseInt(data.formDataResult)) {
                        // 0 审批中 1 通过 2 拒绝 3 撤销
                        case 0:
                            target.setText('等待 ' + (data.approverName || ' ') + '审批');
                            target.$el.css({color: '#F5C464'});
                            break;
                        case 1:
                            target.setText('审批通过');
                            break;
                        case 2:
                            target.setText('审批拒绝');
                            target.$el.css({color: '#FD8282'});
                            break;
                        case 3:
                            target.setText('已撤销');
                            target.$el.css({color: '#F5C464'});
                            break;
                        default:
                            console.error('未知的状态详情');
                            break;

                    }
                });
            }

            window.nowFormData = {};
        },
        renderData: function (data) {
            var _this = this;

            this.pageview.delegate('userinfo_name', function (target) {
                target.setText(data.creatorName);
            });
            this.pageview.delegate('user_icon', function (target) {
                target.title = data.creatorName;
                target.setSrc(data.creatorAvatar + '.thumb.jpg');
            });
            this.pageview.delegate('userinfo_status', function (target) {
                switch (data.status) {
                    // 0 审批中 1 通过 2 拒绝 3 撤销
                    case 0:
                        target.setText('等待 ' + (data.approver || '未知') + '审批');
                        target.$el.css({color: '#F5C464'});
                        break;
                    case 1:
                        target.setText('审批通过');
                        break;
                    case 2:
                        target.setText('审批拒绝');
                        target.$el.css({color: '#FD8282'});
                        break;
                    case 3:
                        target.setText('已撤销');
                        target.$el.css({color: '#F5C464'});
                        break;
                    default:
                        console.error('未知的状态详情');
                        break;

                }
            });
            this.pageview.delegate('result_logo', function (target) {
                // 0 审批中 1 通过 2 拒绝 3 撤销

                // 同意驳回动画
                if (data.status === 1) {
                    setTimeout(function () {
                        target.$el.show();
                    }, 300);
                    setTimeout(function () {
                        target.$el.css({'-webkit-transform': 'scale(.5)', opacity: '1'});
                    }, 450);
                } else if (data.status === 2) {
                    target.$el.find('img').attr('src', './imgs/refuse.png');
                    setTimeout(function () {
                        target.$el.show();
                    }, 300);
                    setTimeout(function () {
                        target.$el.css({'-webkit-transform': 'scale(.5)', opacity: '1'});
                    }, 450);
                }
            });

            // 处理后的formdata
            var formData = JSON.parse(data.formData.formData).body;

            formData.unshift({
                type: 'ApplyInputText',
                title: '审批编号',
                value: data.formData.number
            }, {
                type: 'ApplyInputText',
                title: '所在部门',
                value: data.deptName
            });

            var processData = _this.processFormData(formData);

            this.pageview.delegate('middle_detail_repeat', function (target) {

                // 非明细数据
                var repeatData = processData.simple;

                target.bindData(repeatData);
            });

            this.pageview.delegate('middle_layout_detail_repeat', function (target) {

                // 明细数据
                var repeatData = processData.layout;

                // 标记为明细最后一项
                var lastArr = repeatData[repeatData.length - 1];

                if (lastArr) {
                    lastArr.isLastLayout = true;
                    if (lastArr.value && lastArr.value.length > 0 && lastArr.value[lastArr.value.length - 1].type.indexOf('Total') > -1) {
                        lastArr.value[lastArr.value.length - 1].isLastLayout = true;
                    }
                }

                target.bindData(repeatData);
            });

            var repeactActions = [];
            this.pageview.delegate('bottom_repeat', function (target) {
                var manager = data.approverMemberId && data.approverMemberId.toString(),
                    creator = data.creatorMemberId && data.creatorMemberId.toString(),
                    current = data.currentMemberId && data.currentMemberId.toString(),
                    status = data.status;

                if (manager === current && manager !== creator && status === 0) {
                    target.$el.show();
                    repeactActions = [{title: '同意', key: '1'}, {title: '拒绝', key: '2'}, {title: '转交', key: '5'}];
                } else if (manager === current && manager === creator && status === 0) {
                    target.$el.show();
                    repeactActions = [{title: '同意', key: '1'}, {title: '拒绝', key: '2'}, {
                        title: '转交',
                        key: '5'
                    }, {title: '更多', key: '6'}];
                } else if (current === creator && status === 0) {
                    target.$el.show();
                    repeactActions = [{title: '撤销', key: '4'}, {title: '重新提交', key: '3'}];
                } else if (current === creator && status !== 0) {
                    target.$el.show();
                    repeactActions = [{title: '重新提交', key: '3'}];
                } else {
                    target.$el.hide();
                }

                target.bindData(repeactActions);

                setTimeout(function () {
                    target.$el.css({bottom: 0});
                }, 350);
            });
        },
        middle_detail_repeat_item_left_init: function (sender, params) {
            if (sender.config.text) {
                sender.config.text = sender.config.text + ':';

                var rightLength = sender.datasource.value.length,
                    leftLength = sender.datasource.title.length,
                    totalLength = rightLength + leftLength;

                // 判断是否换行逻辑
                if (totalLength > 20) {
                    sender.config.style.maxWidth = '70px';
                    sender.config.style.lineHeight = '21px';
                }
            } else {
                sender.config.text = '未填写标题:';
            }
        },
        middle_detail_repeat_item_repeat_iteminit: function (sender, params) {
            // 处理统计样式
            if (sender.datasource.type.indexOf('Total') > -1) {
                if (sender.datasource.flag === 'start') {
                    sender.config.style = {
                        margin: '7px 10px 8px 15px',
                        paddingTop: '12px',
                        borderTop: '1px solid #eee'
                    };
                } else if (sender.datasource.flag === 'end') {
                    sender.config.style = {
                        margin: '0 10px 0 15px',
                    };
                } else if (sender.datasource.flag === 'only_start') {
                    sender.config.style = {
                        margin: '10px 10px 0 15px',
                        padding: '6px 0',
                        borderTop: '1px solid #eee',
                    };
                } else {
                    sender.config.style = {
                        margin: '0 10px 8px 15px',
                    };
                }
            }
        },
        middle_detail_repeat_item_repeat_item_left_init: function (sender, params) {
            if (sender.config.text) {
                sender.config.text = sender.config.text + ':';
            } else {
                sender.config.text = '未填写标题:';
            }

            if (sender.datasource.type.indexOf('Total') > -1) {
                if (sender.datasource.isLastLayout) {
                    sender.config.style.borderBottom = 'none';
                }

                sender.config.style.marginLeft = '0';
            }
        },
        flow_right_content_left_init: function (sender, params) {
            sender.config.src = sender.config.src + '.thumb.jpg';
        },
        flow_right_content_right_init: function (sender, params) {
            if (sender.config.text) {
                sender.config.text = utils.timestampToTimeStr(sender.config.text);
            } else {
                sender.config.text = '';
            }
        },
        flow_right_content_right_didmount: function (sender, params) {
            var _this = this;
            if (!_this.detailData.approverMemberId) {
                _this.detailData.approverMemberId = '';
            }

            if (!_this.detailData.approverMemberId) {
                _this.detailData.creatorMemberId = '';
            }

            if (!_this.detailData.approverMemberId) {
                _this.detailData.currentMemberId = '';
            }

            // 当前用户是审批人 || 当前用户是创建人
            if ((_this.detailData.currentMemberId.toString() === _this.detailData.approverMemberId.toString()) || (_this.detailData.currentMemberId.toString() === _this.detailData.creatorMemberId.toString())) {
                // 该条记录是审批人 && 当前用户是审批人时不显示（不发给自己） ||  该条记录是创建人 && 当前用户是创建人时不显示 （不发给自己） || 当前用户是创建人或者是审批人
                if (((_this.detailData.approverMemberId.toString() === sender.datasource.memberId.toString()) && (_this.detailData.currentMemberId.toString() !== _this.detailData.approverMemberId.toString())) || ((_this.detailData.creatorMemberId.toString() === sender.datasource.memberId.toString()) && _this.detailData.creatorMemberId.toString() !== _this.detailData.currentMemberId.toString())) {
                    sender.setNextText('<img src="./imgs/message.png" />');
                }
            }
        },
        flow_right_content_right_click: function (sender, params) {
            if (sender.$el.find('.yy-nexttext').html()) {
                // this.pageview.showDialog('messageDialog');
                this.nowChatMessage = sender.datasource;
                this.message_bottom_submit_click();
            }
        },
        flow_right_content_middle_bottom_title_init: function (sender, params) {
            var status = parseInt(sender.datasource.status),
                step = sender.datasource.step;

            if (status === -1) {
                sender.config.text = '发起申请';

                sender.rowInstance.components.flow_left.components.left_line.$el.css({
                    bottom: '0'
                });
            } else if (status === 0) {
                if (this.nowApprove) {
                    sender.config.text = '审批中...';
                    sender.config.style.color = '#F5C464';
                    sender.rowInstance.components.flow_left.components.left_round.$el.css({boxShadow: '0px 0px 0px 3px #B6E5FF'});
                } else {
                    sender.$el.hide();
                    // 没有审批状态的人名居中
                    utils.css(sender.parent.parent.parent.$el, {alignItems: 'center'});
                    sender.rowInstance.components.flow_left.components.left_round.$el.css({backgroundColor: '#ddd'});
                    if (sender.datasource.isLast) {
                        setTimeout(function () {
                            var height = sender.rowInstance.components.flow_left.$el[0].clientHeight;

                            if (utils.deviceInfo().isIOS) {
                                sender.rowInstance.components.flow_left.components.left_line.$el.css({
                                    bottom: height - 74 + 23 + 'px',
                                    height: 74 + 'px',
                                    backgroundColor: '#ddd'
                                });
                            } else {
                                sender.rowInstance.components.flow_left.components.left_line.$el.css({
                                    bottom: height - 74 + 24 + 'px',
                                    height: 74 + 'px',
                                    backgroundColor: '#ddd'
                                });
                            }

                        }, 0);
                    } else {
                        if (utils.deviceInfo().isIOS) {
                            sender.rowInstance.components.flow_left.components.left_line.$el.css({
                                backgroundColor: '#ddd',
                                bottom: '23px'
                            });
                        } else {
                            sender.rowInstance.components.flow_left.components.left_line.$el.css({
                                backgroundColor: '#ddd',
                                bottom: '24px'
                            });
                        }
                    }
                }

                this.nowApprove = false;
            } else if (status === 1) {
                // 不是最后一步的同意都是灰色
                if (step < this.historyLength) {
                    sender.config.text = '已同意';
                    sender.config.style.color = '#999';
                } else {
                    sender.config.text = '已同意';
                    sender.config.style.color = '#6ACA8A';
                }

                // 当前状态的阴影
                if (sender.datasource.isLast) {
                    sender.rowInstance.components.flow_left.components.left_round.$el.css({boxShadow: '0px 0px 0px 3px #B6E5FF'});

                    setTimeout(function () {
                        var height = sender.rowInstance.components.flow_left.$el[0].clientHeight;

                        sender.rowInstance.components.flow_left.components.left_line.$el.css({
                            bottom: height - 74 + 20 + 'px',
                            height: 74 + 20 + 'px'
                        });
                    }, 0);
                }

            } else if (status === 1 && step !== 1) {
                sender.config.text = '已同意';
                sender.config.style.color = '#6ACA8A';

            } else if (status === 2) {

                sender.config.text = '已拒绝';
                sender.config.style.color = '#FD8282';
                sender.rowInstance.components.flow_left.components.left_round.$el.css({boxShadow: '0px 0px 0px 3px #B6E5FF'});
                setTimeout(function () {
                    var height = sender.rowInstance.components.flow_left.$el[0].clientHeight;

                    sender.rowInstance.components.flow_left.components.left_line.$el.css({
                        bottom: height - 74 + 20 + 'px',
                        height: 74 + 20 + 'px'
                    });
                }, 0);

            } else if (status === 3) {
                sender.config.text = '已撤回';
                sender.rowInstance.components.flow_left.components.left_round.$el.css({boxShadow: '0px 0px 0px 3px #B6E5FF'});
            } else if (status === 4) {
                sender.config.text = '已转交';
            } else {
                sender.$el.hide();
            }
        },
        flow_right_content_middle_bottom_title_didmount: function (sender, params) {
            if (sender.datasource.comment) {
                var text = sender.getText();

                sender.setText(text + ' <span style="color: #999"> （' + sender.datasource.comment + '）</span>');
            }
        },
        flow_right_content_middle_bottom_image_repeat_init: function (sender, params) {
            if (sender.datasource.photos) {
                var dataStr = sender.datasource.photos,
                    tempData = [],
                    data = [];

                tempData = dataStr.split(';');

                tempData.forEach(function (value, key) {
                    if (value) {
                        data.push({
                            src: value,
                            thumb_src: value + '.thumb.jpg'
                        });
                    }
                });

                sender.bindData(data);
            }
        },
        bottom_repeat_itemclick: function (sender, params) {
            var key = sender.datasource.key,
                id = this.pageview.params.formId,
                _this = this;

            switch (key) {
                case '1':
                    this.pageview.go('deal', {
                        type: 1,
                        id: id,
                        toMemberId: this.pageview.params.toMemberId || '',
                        qzId: this.pageview.params.qzId || ''
                    });
                    break;
                case '2':
                    this.pageview.go('deal', {
                        type: 2,
                        id: id,
                        toMemberId: this.pageview.params.toMemberId || '',
                        qzId: this.pageview.params.qzId || ''
                    });
                    break;
                case '3':
                    this.pageview.ajax({
                        url: '/formdata/checkResubmit',
                        type: 'POST',
                        data: {
                            fdId: this.templateid
                        },
                        success: function (data) {
                            if (data.code === 0) {
                                _this.pageview.showPage({
                                    pageKey: "form",
                                    nocache: true,
                                    mode: "fromBottom",
                                    params: {formName: _this.formName, id: id}
                                });
                            } else {
                                if (!_this.reSubmitDialog) {
                                    _this.reSubmitDialog = new Dialog({
                                        mode: 3,
                                        wrapper: _this.pageview.$el,
                                        contentText: data.msg,
                                        btnDirection: "row",
                                        buttons: [{
                                            title: "我知道了",
                                            style: {
                                                height: 45,
                                                fontSize: 16,
                                                color: "#37b7fd"
                                            },
                                            onClick: function () {
                                                _this.reSubmitDialog.hide();
                                            }
                                        }]
                                    });
                                }
                                _this.reSubmitDialog.show();
                            }
                        }
                    });
                    break;
                case '4':
                    if (!this.chexiaoDialog) {
                        this.chexiaoDialog = new Dialog({
                            mode: 3,
                            wrapper: this.pageview.$el,
                            contentText: "你确定要撤销申请吗？",
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
                                    _this.chexiaoDialog.hide();
                                }
                            }, {
                                title: "确定",
                                style: {
                                    height: 45,
                                    fontSize: 16,
                                    color: "#37b7fd",
                                },
                                onClick: function () {
                                    _this.chexiaoDialog.hide();
                                    _this.refuse_click();
                                }
                            }]
                        });
                    }
                    this.chexiaoDialog.show();
                    break;
                case '5':
                    try {
                        window.yyesn.enterprise.selectContacts(function (b) {
                            if (b.error_code === "0") {
                                // 防止乱码
                                var data = JSON.stringify(b);
                                var itemData = JSON.parse(data).data[0];

                                _this.pageview.go('deal', {
                                    type: 3,
                                    id: id,
                                    from: 'resend',
                                    memberId: itemData.member_id,
                                    userName: encodeURI(itemData.name),
                                    headImgUrl: itemData.avatar,
                                    toMemberId: _this.pageview.params.toMemberId || '',
                                    qzId: _this.pageview.params.qzId || ''
                                });

                            }
                        }, {
                            mode: 1,
                            multi: 0
                        }, function (b) {
                            // _this.pageview.showTip({text: '选择失败，请重试'});
                            console.error('选择联系人失败');
                        });
                    } catch (e) {
                        alert(JSON.stringify(e));
                    }

                    break;
                case '6':
                    _this.morePopover.show(sender);
                    break;
                default:
                    console.error('未知状态');
                    break;
            }
        },
        refuse_click: function () {
            var _this = this;

            this.pageview.ajax({
                url: '/formdata/undo',
                type: 'POST',
                data: {
                    fdId: _this.pageview.params.formId
                },
                success: function (data) {
                    if (data.code === 0) {
                        window.needRefresMyApproveListData = true;
                        _this.pageview.showTip({text: '撤销成功！', duration: 800});
                        setTimeout(function () {
                            _this.loadData();
                        }, 800);
                    } else {
                        _this.pageview.showTip({text: data.msg, duration: 1000});
                    }
                },
                error: function (data) {
                    _this.pageview.showTip({text: data.msg, duration: 1000});
                }
            });
        },
        processFormData: function (data) {
            if (data && data.length === 0) return data;
            var processData = [],
                processLayoutData = [],
                _this = this;

            data.forEach(function (value, key) {

                if (value.type === 'ApplyInputDateBetween') {
                    // 时长

                    _this.dateType = value.dateType.toString();
                    processData.push({
                        type: 'ApplyInputDateBetween',
                        title: value.title,
                        value: value.value[0]
                    });

                    processData.push({
                        type: 'ApplyInputDateBetween',
                        title: value.title1,
                        value: value.value[1]
                    });

                    if (value.autocalculate === '1') {
                        processData.push({
                            type: 'ApplyInputDateBetween',
                            title: value.autocalculatetitle + (value.dateType === 1 ? '（天）' : '（时）'),
                            value: _this.caculateDiff(value.value[0], value.value[1]) || '0'
                        });
                    }
                } else if (value.type === 'ApplyLayout' && value.isChildForm === '1') {
                    // 明细
                    var data = [];

                    if (value.inputs.length > 0) {
                        value.inputs[0].value.forEach(function (_value, _key) {
                            data.push([]);
                            value.inputs.forEach(function (__value, __key) {
                                var data_value = $.extend(true, {}, __value); // deep clone
                                data_value.value = __value.value[_key];
                                data[_key].push(data_value);
                            });
                        });
                        // 判断是否为同一类型明细中的 增加明细
                        var layoutIndex = 1;

                        data.forEach(function (_value, _key) {
                            var _processLayoutData = [],
                                totalData = []; // 统计数据

                            _value.forEach(function (__value, __key) {

                                if (__value.type === 'ApplyInputDateBetween') {
                                    // 时长

                                    _this.dateType = __value.dateType.toString();

                                    _processLayoutData.push({
                                        type: 'ApplyInputDateBetween',
                                        title: __value.title,
                                        value: __value.value[0]
                                    });

                                    _processLayoutData.push({
                                        type: 'ApplyInputDateBetween',
                                        title: __value.title1,
                                        value: __value.value[1]
                                    });

                                    if (__value.autocalculate === '1') {
                                        _processLayoutData.push({
                                            type: 'ApplyInputDateBetween',
                                            title: __value.autocalculatetitle + (__value.dateType === 1 ? '（天）' : '（时）'),
                                            value: _this.caculateDiff(__value.value[0], __value.value[1]) || '0'
                                        });
                                    }

                                    if (_key === (data.length - 1) && __value.isSummaryField === '1') {
                                        totalData.push({
                                            type: 'TotalApplyInputDateBetween',
                                            title: '总' + __value.autocalculatetitle + (__value.dateType === 1 ? '（天）' : '（时）'),
                                            value: __value.summaryvalue
                                        });
                                    }

                                } else if (__value.type === 'ApplyInputRadio') {
                                    _processLayoutData.push({
                                        type: __value.type,
                                        title: __value.title,
                                        value: __value.value && __value.value.value || ''
                                    });

                                } else if (__value.type === 'ApplyInputCheckbox') {
                                    var checkboxValue = '';

                                    __value.value.forEach(function (___value, ___key) {
                                        if (___key < __value.value.length - 1) {
                                            checkboxValue += ___value.value + ',';
                                        } else {
                                            checkboxValue += ___value.value + ';';
                                        }
                                    });

                                    _processLayoutData.push({
                                        type: __value.type,
                                        title: __value.title,
                                        value: checkboxValue
                                    });
                                } else if (__value.type === 'ApplyInputTextNum') {
                                    if (_key === (data.length - 1) && __value.isSummaryField === '1') {
                                        totalData.push({
                                            type: 'TotalApplyInputDateBetween',
                                            title: '总' + __value.title,
                                            value: __value.summaryvalue
                                        });
                                    }

                                    _processLayoutData.push({
                                        type: __value.type,
                                        title: __value.title,
                                        value: __value.value
                                    });
                                } else if (__value.type === 'ApplyInputTextMoney') {
                                    if (_key === (data.length - 1) && __value.isSummaryField === '1') {
                                        totalData.push({
                                            type: 'TotalApplyInputTextMoney',
                                            title: '总' + __value.title,
                                            value: __value.summaryvalue
                                        });
                                    }

                                    // 大写
                                    if (_key === (data.length - 1) && __value.uppercase === '1') {
                                        totalData.push({
                                            type: 'TotalApplyInputTextMoneyDX',
                                            title: '大写',
                                            value: c.MoneyDX(__value.summaryvalue)
                                        });
                                    }

                                    _processLayoutData.push({
                                        type: __value.type,
                                        title: __value.title,
                                        value: __value.value
                                    });
                                } else {
                                    _processLayoutData.push({
                                        type: __value.type,
                                        title: __value.title,
                                        value: __value.value
                                    });
                                }
                            });

                            if (totalData.length > 0) {
                                totalData.forEach(function (totalDataValue, totalDataKey) {

                                    if (totalDataKey === 0) {
                                        // 多条时的开始
                                        totalDataValue.flag = 'start';
                                    } else if (totalDataKey === totalData.length - 1) {
                                        // 多条时的结束
                                        totalDataValue.flag = 'end';
                                    } else {
                                        totalDataValue.flag = totalDataKey;
                                    }

                                    if (totalData.length === 1) {
                                        // 只有一条数据
                                        totalDataValue.flag = 'only_start';
                                    }
                                    _processLayoutData.push(totalDataValue);
                                });
                            }

                            processLayoutData.push({
                                type: 'ApplyLayout',
                                level: key,
                                index: layoutIndex,
                                value: _processLayoutData
                            });


                            layoutIndex++;
                        });
                    }


                } else if (value.type === 'ApplyInputRadio') {
                    processData.push({
                        type: value.type,
                        title: value.title,
                        value: value.value && value.value.value || ''
                    });

                } else if (value.type === 'ApplyInputCheckbox') {
                    var checkboxValue = '';

                    value.value.forEach(function (_value, _key) {
                        if (_key < value.value.length - 1) {
                            checkboxValue += _value.value + ',';
                        } else {
                            checkboxValue += _value.value + ';';
                        }
                    });

                    processData.push({
                        type: value.type,
                        title: value.title,
                        value: checkboxValue
                    });
                } else {
                    processData.push({
                        type: value.type,
                        title: value.title,
                        value: value.value
                    });

                    //2016年1月22日10:40 胡小中在此修改张宇的BUG 非详情未显示大写
                    if(value.type==="ApplyInputTextMoney"&&value.uppercase === '1'&&value.value.toString().length>0){
                        processData.push({
                            type: "",
                            title: "大写",
                            value:  c.MoneyDX(value.value)
                        });
                    }

                }
            });

            return {
                simple: processData,
                layout: processLayoutData
            };
        },
        middle_detail_repeat_item_right_didmount: function (sender, params) {
            // 过滤掉值为空的项
            if (!sender.datasource.value || sender.datasource.value.length === 0) {
                sender.parent.parent.$el.hide();
                return;
            }

            if (sender.datasource.type === 'ApplyImage' || sender.datasource.type.split('_')[1] === 'ApplyImage') {
                utils.css(sender.parent.$el, {flexDirection: 'column'});
                utils.css(sender.$el, {flex: 'none'});
                sender.change('middle_detail_repeat_item_right_img_repeat');
            }
        },
        middle_detail_repeat_item_repeat_item_right_didmount: function (sender, params) {
            // 过滤掉明细中值为空的项
            if (!sender.datasource.value || sender.datasource.value.length === 0) {
                sender.parent.parent.$el.hide();
                return;
            }

            if (sender.datasource.type === 'ApplyImage' || sender.datasource.type.split('_')[1] === 'ApplyImage') {
                utils.css(sender.parent.$el, {flexDirection: 'column'});
                utils.css(sender.$el, {flex: 'none'});
                sender.change('middle_detail_repeat_item_right_img_repeat');
            }
        },
        middle_detail_repeat_item_right_text_init: function (sender, params) {

            if (sender.datasource.type.indexOf('Total') > -1) {
                if (sender.datasource.type.indexOf('DX') > -1) {
                    sender.config.style.color = '#666';
                } else {
                    sender.config.style.color = '#F5C464';
                }
            }
        },
        middle_detail_repeat_item_right_text_didmount: function (sender, params) {
            if (sender.datasource.type === 'ApplyInputTextarea') {
                sender.config.text = sender.config.text.replace(/\n/g, '</br>');
                sender.setText(sender.config.text);
            }
        },
        middle_detail_repeat_item_right_img_repeat_init: function (sender, params) {
            var data = [];
            sender.datasource.value.forEach(function (value, key) {
                data.push({
                    src: value
                });
            });
            sender.bindData(data);
        },
        middle_detail_repeat_item_right_img_repeat_itemclick: function (sender, params) {
            var imgs = [],
                data = sender.parent.parent.datasource.value;

            for (var i = 0; i < data.length; i++) {
                imgs.push(data[i]);
            }
            try {
                window.yyesn.client.viewImage({
                    "files": imgs.join(","),
                    "index": parseInt(params.index)
                });
            } catch (e) {}
        },
        flow_right_content_middle_bottom_image_repeat_itemclick: function (sender, params) {

            var dataStr = sender.parent.parent.datasource.photos,
                data = dataStr.split(';');

            data.splice(data.length - 1, 1);

            var imgs = [];

            for (var i = 0; i < data.length; i++) {
                imgs.push(data[i]);
            }
            try {
                window.yyesn.client.viewImage({
                    "files": imgs.join(","),
                    "index": parseInt(params.index)
                });
            } catch (e) {}
        },
        middle_detail_repeat_item_repeat_init: function (sender, params) {
            sender.bindData(sender.datasource.value);
        },
        middle_detail_repeat_item_repeat_title_didmount: function (sender, params) {
            // level 是否为同一类型明细
            if (this.layoutLevel) {
                if (this.layoutLevel !== sender.datasource.level) {
                    sender.$el.css({
                        margin: "12px 10px 10px 15px",
                        paddingTop: "14px",
                        borderTop: "1px solid #eee"
                    });
                } else {
                    sender.$el.css({
                        margin: "10px 10px 10px 15px",
                    });
                }
            } else {
                this.layoutLevel = sender.datasource.level;

                sender.$el.css({
                    margin: "12px 10px 10px 15px",
                    paddingTop: "14px",
                    borderTop: "1px solid #eee"
                });
            }
            sender.setPreText(sender.datasource.index);
        },
        caculateDiff: function (startTime, endTime) {
            if (!startTime || !endTime) {
                return '0';
            }

            var startTimeObj = utils.convertToDate(startTime),
                endTimeObj = utils.convertToDate(endTime),
                diff = endTimeObj - startTimeObj,
                diffStr = 0;

            if (diff <= 0) {
                if (this.dateType === '2') {

                } else {
                    diffStr = 1;
                }
            } else {
                if (this.dateType === '2') {
                    diffStr = (diff / (60 * 60 * 1000)).toFixed(1);
                } else {
                    diffStr = diff / (24 * 60 * 60 * 1000) + 1;
                }
            }
            diffStr = parseInt(diffStr);

            return diffStr;
        },
        resetData: function () {
            this.nowApprove = true;
        },
        morePopover_init: function (sender, params) {
            this.morePopover = sender;
        },
        moreRepeat_didmount: function (sender, params) {
            var data = [{
                title: '重新提交',
                id: 1
            }, {
                title: '撤回',
                id: 2
            }];

            sender.bindData(data);
        },
        moreRepeat_itemclick: function (sender, params) {
            var _this = this;

            if (sender.datasource.id === 1) {
                // 重新提交

                this.pageview.ajax({
                    url: '/formdata/checkResubmit',
                    type: 'POST',
                    data: {
                        fdId: this.templateid
                    },
                    success: function (data) {
                        if (data.code === 0) {
                            _this.pageview.showPage({
                                pageKey: "form",
                                nocache: true,
                                mode: "fromBottom",
                                params: {formName: _this.formName, id: _this.myListData.formData.id}
                            });
                        } else {
                            if (!_this.reSubmitDialog) {
                                _this.reSubmitDialog = new Dialog({
                                    mode: 3,
                                    wrapper: _this.pageview.$el,
                                    contentText: data.msg,
                                    btnDirection: "row",
                                    buttons: [{
                                        title: "我知道了",
                                        style: {
                                            height: 45,
                                            fontSize: 16,
                                            color: "#37b7fd"
                                        },
                                        onClick: function () {
                                            _this.reSubmitDialog.hide();
                                        }
                                    }]
                                });
                            }
                            _this.reSubmitDialog.show();
                        }
                    }
                });
            } else if (sender.datasource.id === 2) {
                // 撤回

                if (!this.chexiaoDialog) {
                    this.chexiaoDialog = new Dialog({
                        mode: 3,
                        wrapper: this.pageview.$el,
                        contentText: "你确定要撤销申请吗？",
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
                                _this.chexiaoDialog.hide();
                            }
                        }, {
                            title: "确定",
                            style: {
                                height: 45,
                                fontSize: 16,
                                color: "#37b7fd",
                            },
                            onClick: function () {
                                _this.chexiaoDialog.hide();
                                _this.refuse_click();
                            }
                        }]
                    });
                }
                this.chexiaoDialog.show();
            }

            this.morePopover.hide();
        },

        message_bottom_cancel_click: function (sender, params) {
            this.pageview.hideDialog('messageDialog');
        },
        message_bottom_submit_click: function (sender, params) {
            var _this = this;

            // this.pageview.hideDialog('messageDialog');
            try {
                window.yyesn.enterprise.openChatWindow(function (b) {
                    if (b.error_code === "0") {
                    }
                }, {
                    chat_mode: '0',
                    send_id: _this.nowChatMessage.memberId.toString(),
                    send_name: _this.nowChatMessage.name.toString()
                }, function (b) {
                });
            } catch (e) {
                alert(JSON.stringify(e));
            }
        },
        message_middle_right_didmount: function (sender, params) {
            var text = sender.config.text;

            sender.setText('<span style="color: #37b7fd">' + this.myListData.creatorName + '</span>' + text);
        },
        message_middle_left_init: function (sender, params) {
            sender.src = this.myListData.templateUrl;
        },
        middle_cc_list_top_click: function (sender, params) {
            sender.$el.addClass('displaynone');
            sender.parent.components.middle_cc_list_bottom.$el.removeClass('displaynone');
            sender.parent.components.middle_cc_list_middle.$el.removeClass('displaynone');
        },
        middle_cc_list_bottom_click: function (sender, params) {
            sender.$el.addClass('displaynone');
            sender.parent.components.middle_cc_list_top.$el.removeClass('displaynone');
            sender.parent.components.middle_cc_list_middle.$el.addClass('displaynone');
        }
    };
    return pageLogic;
});
