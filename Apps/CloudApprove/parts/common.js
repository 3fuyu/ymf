define(["utils", "md5"], function (utils, md5) {
    var mainColor = "#29B6F6";
    var titleColor = "#333333";
    var seTitleColor = "#999999";
    var descColor = "#666666";
    var backColor = "#f7f7f7";
    var HeadColor = "#37B7FD";

    // 追加的单据数据(localStorage)
    var ADDITIONAL_FORM_DATA = "ADDITIONAL_FORM_DATA";

    var imgExtReg = /(\.thumb\.jpg|\.middle\.jpg|\.big\.jpg)*$/;
    // var HeadColor = "#ffffff";
    var Re = {
        thumbImg: function (src) {
            return src && src.replace(imgExtReg, '.thumb.jpg') || '#';
        },

        descColor: descColor,
        backColor: backColor,
        mainColor: mainColor,
        seTitleColor: seTitleColor,
        labelColor: "#666666",
        titleColor: titleColor,
        HeadColor: HeadColor,

        ADDITIONAL_FORM_DATA: ADDITIONAL_FORM_DATA,
        replaceUrl: function (oldid, newid, pageviewInstance) {
            var urlArr = window.location.href.split("taskId=" + oldid);
            var url;
            if (urlArr.length === 1) {
                url = window.location.href + "&taskId=" + newid;
            } else {
                url = window.location.href.split("taskId=" + oldid).join("taskId=" + newid);
            }
            pageviewInstance.pageManager.preventHasChange();
            window.location.replace(url);
        },
        gotoDetail: function (sender, pageviewInstance) {
            var token = pageviewInstance.params.token;
            var url = pageviewInstance.pageManager.appConfig.taskhost + '/dist/index.html#TaskDetailView?token=' + token + '&taskId=' + (sender.datasource.mirrorId || sender.datasource.id);
            window.location.href = url;
        },
        MoneyDX: function (num) {
            var strOutput = "";
            var strUnit = '仟佰拾万仟佰拾亿仟佰拾万仟佰拾元角分';
            var DX = "";
            num += "00";
            var intPos = num.indexOf('.');
            if (intPos >= 0)
                num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
            strUnit = strUnit.substr(strUnit.length - num.length);
            for (var i = 0; i < num.length; i++)
                strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
            DX = strOutput.replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零')
            .replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");

            return DX.replace(/零./g, '');
        },
        createMoneyItemLayout: function (itemInstance) {
            var placeholder = '';

            if (itemInstance.inLeft) {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.root.push(itemInstance.titleKey);
                itemInstance.root.push(itemInstance.id);

                placeholder = itemInstance.itemData.tips || "";
                placeholder = itemInstance.isRequired ? placeholder + " (必填)" : placeholder;
                itemInstance.components[itemInstance.id] = {
                    type: "input",
                    placeholder: placeholder,
                    mode: "number",
                    ref: true,
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        height: 50,
                        fontSize: 15,
                        marginBottom: 10,
                        paddingLeft: 13,
                    })
                };
            } else {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.wrapKey = itemInstance.id + "_warp";
                itemInstance.root.push(itemInstance.wrapKey);

                itemInstance.components[itemInstance.wrapKey] = {
                    type: "view",
                    className: 'form-row',
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        height: 50,
                        marginBottom: (itemInstance.isInDetail === false && itemInstance.itemData.uppercase === "1") ? 0 : 10,
                        fontSize: 15,
                        paddingLeft: 13,
                        flexDirection: "row"
                    }),
                    root: [itemInstance.titleKey, itemInstance.id]
                };
                placeholder = itemInstance.itemData.tips || "";
                placeholder = itemInstance.isRequired ? placeholder + " (必填)" : placeholder;
                itemInstance.components[itemInstance.id] = {
                    type: "input",
                    placeholder: placeholder,
                    mode: "number",
                    ref: true,
                    style: utils.processStyle({
                        flex: 1,
                        paddingRight: 16,
                        height: "100%",
                        fontSize: 15,
                        textAlign: "left"
                    })
                };

                itemInstance.components[itemInstance.titleKey] = {
                    type: "text",
                    text: itemInstance.itemData.title || "",
                    numberofline: 2,
                    style: utils.processStyle({
                        // width: 80
                        width: 94
                    })
                };
            }


        },
        createItemLayout: function (itemInstance, layout) {

            itemInstance.titleKey = itemInstance.id + "_title";
            itemInstance.wrapKey = itemInstance.id + "_warp";
            itemInstance.root.push(itemInstance.wrapKey);

            itemInstance.components[itemInstance.wrapKey] = {
                type: "view",
                className: 'form-row',
                style: utils.processStyle({
                    backgroundColor: "#fff",
                    minHeight: 50,
                    // marginBottom: 1,
                    borderBottom: "1px solid #ededed",
                    paddingTop: 4,
                    paddingBottom: 4,
                    fontSize: 15,
                    paddingLeft: 13,
                    flexDirection: "row"
                }),
                root: [itemInstance.titleKey, itemInstance.id]
            };

            itemInstance.components[itemInstance.id] = {
                type: "icon",
                textPos: "left",
                ref: true,
                text: itemInstance.isRequired ? "请选择 (必填)" : "请选择",
                font: "icomoon_e913",
                numberofline: 1,
                textStyle: utils.processStyle({
                    color: "#b7b7b7",
                    fontSize: 15,
                    marginRight: 6,
                    maxWidth: "100%"
                }),
                iconStyle: utils.processStyle({
                    color: "#ccc",
                    fontSize: 14
                }),
                style: utils.processStyle({
                    flex: 1,
                    justifyContent: "flex-end",
                    paddingRight: 16,
                    paddingLeft: 20

                })
            };

            itemInstance.components[itemInstance.titleKey] = {
                type: "text",
                text: itemInstance.itemData.title || layout.title,
                numberofline: 2,
                style: {
                    width: 100
                }
            };
        },
        getDetailCtlTitle: function (itemData, components, plugin, DetailInstance) {
            var titleKey = itemData.id || itemData.fieldId + "_title";
            var delBtnKey = itemData.id || itemData.fieldId  + "_delbtn";
            var Re = {
                type: "view",
                style: {
                    flexDirection: "row",
                    background: "#fff",
                    borderRadius: "5px 5px 0 0",
                    borderBottom: "1px solid #ededed"
                },
                root: [titleKey, delBtnKey]
            };
            //很特殊的处理
            if(itemData.displayTitle === 'null'){
                itemData.displayTitle = '';
            }
            components[titleKey] = {
                type: "text",
                ref: true,
                text: itemData.title || itemData.displayTitle || '明细',
                style: utils.processStyle({
                    height: 34,
                    flex: "1",
                    textIndent: 13,
                    fontSize: 14,
                    backgroundColor: "#FCFCFC",
                    color: "#666",
                    borderRadius: 5
                }),
            };
            components[delBtnKey] = {
                type: "icon",
                src: './imgs/deitalDel.png',
                titleKey: titleKey,
                titleLabel: itemData.title || itemData.displayTitle,
                iconStyle: utils.processStyle({
                    w: 17,
                    marginRight: 10,
                    lineHeight: "20px"
                }),
                style: utils.processStyle(
                    {
                        flex: "1",
                        justifyContent: "flex-end",
                        paddingRight: 20,
                        textIndent: 15,
                        fontSize: 14,
                        backgroundColor: "#FCFCFC",
                        color: "#37B7FD"
                    }
                ),
            };

            plugin[delBtnKey + "_init"] = function (sender, params) {

                this.detailItemDeleteInit(sender, params);
            }
            plugin[delBtnKey + "_click"] = function (sender, params) {
                params = params || {};
                params.DetailInstance = DetailInstance;
                this.detailItemDeleteClick(sender, params);
            }
            plugin[titleKey + "_init"] = function (sender, params) {
                this.detailItemTitleInit(sender, params);
            }
            return Re;
        },
        getCtlTitle: function (title) {
            return {
                type: "text",
                text: title,
                style: utils.processStyle({
                    height: 30,
                    width: "100%",
                    paddingLeft: 13,
                    fontSize: 13,
                    color: "#666"
                })
            };
        },
        //自定义格式的 日期格式 （优先处理showToday字段）
        // 例子：
        // customTimestamp(14444444444,"yyyy-MM-dd   .S",true) ==> 今天 08:09:04.423
        // customTimestamp(14444444444,"yyyy-M-d h:m:s.S",false)      ==> 2006-7-2 8:9:4.18
        customTimestamp: function (timestamp, fmt, showToday) {
            var timeStr = "";
            try {
                timestamp = parseFloat(timestamp);
                var date = new Date(timestamp),
                    now = new Date(),
                    time = now.getTime(),
                    dateInfo = utils.getDateInfo(date),
                    nowDateInfo = utils.getDateInfo(now);
                time = parseInt((time - timestamp) / 1000);

                //如果是今天
                if (nowDateInfo.year === dateInfo.year && nowDateInfo.day === dateInfo.day && nowDateInfo.month === dateInfo.month && showToday) {
                    //如果要显示文字今天
                    timeStr = "今天 " + this.formatTime(date, "hh:mm");
                } else {
                    //如果不是今天，判断fmt是否存在，
                    if (fmt) {
                        timeStr = this.formatTime(date, fmt);
                    } else {
                        timeStr = this.formatTime(date, "yyyy-MM-dd hh:mm");
                    }

                }
            } catch (e) {}
            return timeStr;
        },
        //格式化日期
        // 例子：
        // (new Date()).Format("yyyy-MM-dd   .S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
        formatTime: function (date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },
        selectAttachment: function (plugin, type, _maxLength) {
            var _this = plugin;
            var maxLength = _maxLength || 9
            if (_this.imagesRepeat.datasource.length >= maxLength) {
                _this.pageview.showTip({text: "最多上传" + maxLength + "张图片", duration: 1000, style: {width: "220px"}});
                return;
            }

            try {
                var last = maxLength - _this.imagesRepeat.datasource.length;
                window.yyesn.client.selectAttachment(function (Re) {
                    var data = Re.data;
                    if (data.length > last) {
                        _this.pageview.showTip({
                            text: "最多上传" + maxLength + "张图片",
                            duration: 1000,
                            style: {width: "220px"}
                        });
                    }
                    for (var i = 0, j = last; i < j; i++) {
                        _this.imagesRepeat.addItem({src: data[i].path});
                    }

                }, {type: type || 1, maxselectnum: last});
            } catch (e) {

            }
        },

        // 测试
        parseAuthInfo: function (processAuthinfo, itemData, mode, taskDefinitionKey) {

            //{name:'编辑', value: '2'},
            //{name:'查看', value: '1'},
            //{name:'隐藏', value: '0'}

            var itemId = itemData.fieldId || itemData.subFormId,
                result = {
                    readonly: false
                };

            // processAuthinfo 如果是空的话,有可能是云审批,也有可能是云表单,但是没有设置字段权限
            if (!processAuthinfo){
                result.readonly = itemData.readonly;
                return result;
            }
            if ((mode === 'reAdd' || mode === 'NEW') && processAuthinfo.fillIn) {
                var fillInfo = processAuthinfo.fillIn || [];

                fillInfo.every(function (item) {
                    if (item.fieldid === itemId){
                        //如果该控件隐藏,则不需要将其添加到组件布局中
                        if (item.auth === '0'){
                            result = false;
                        } else if (item.auth === '2'){
                            //如果该控件可以编辑
                            result.readonly = false;
                        } else {
                            result.readonly = true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                });

            }else {
                //编辑的情况下:
                //先拿到详情中的流程ID: taskDefinitionKey,根据流程ID解析控件ID对应的字段权限
                var taskDefinitionKeyArr = processAuthinfo[taskDefinitionKey] || [];

                taskDefinitionKeyArr.every(function (item) {
                    if (item.fieldid === itemId){
                        //如果该控件隐藏,则不需要将其添加到组件布局中
                        if (item.auth === '0'){
                            result = false;
                        } else if (item.auth === '2'){
                            //如果该控件可以编辑
                            result.readonly = false;
                        } else {
                            result.readonly = true;
                        }
                        return false;
                    } else {
                        return true;
                    }
                });

            }
            return result;
        },

    };
    return Re;
});
