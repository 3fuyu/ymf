/**
 * Created by Gin on 17/3/7.
 */
define(["../parts/currency", "utils", "../parts/format"], function (c, utils, format) {
    function PageLogic(config) {
        var _this = this;
        this.pageview = config.pageview;
        this.currentId = this.pageview.params.id;
        window._applyHistory = JSON.parse(localStorage.getItem("_applyHistory"));
        this.bpmActivityForms = window._applyHistory.bpmActivityForms;


        this.itemNum = 1;
        this.classContent = {
            "alert-none": {
                "color": "rgb(85, 85, 85)",
                "border-color": "rgb(204, 204, 204)"
            },
            "alert-success": {
                "color": "rgb(60, 118, 61)",
                "background-color": "rgb(223, 240, 216)"
            },
            "alert-info": {
                "color": "rgb(49, 112, 143)",
                "background-color": "rgb(217, 237, 247)"
            },
            "alert-warning": {
                "color": "rgb(138, 109, 59)",
                "background-color": "rgb(252, 248, 227)"
            },
            "alert-danger": {
                "color": "rgb(169, 68, 66)",
                "background-color": "rgb(242, 222, 222)"
            }
        };
    }

    PageLogic.prototype = {
        body_init: function (sender, params) {
            var idx = 0;
            var formDataList = window._applyHistory.formDataMap[this.currentId];
            for (var bpmIdx = 0; bpmIdx < this.bpmActivityForms.length; bpmIdx++) {
                if (this.currentId === this.bpmActivityForms[bpmIdx].id) {
                    idx = bpmIdx;
                    break;
                }
            }
            var jsonList = [];
            var jsonContent = {};
            var fields = this.bpmActivityForms ? this.bpmActivityForms[idx].fields : [];
            for (var j = 0; j < fields.length; j++) {
                jsonContent = {};
                var fieldContent = JSON.parse(fields[j].fieldContent);
                var variableContent = JSON.parse(fields[j].variableContent);
                var name = variableContent.name ? variableContent.name : "未命名";
                jsonContent.title = name + ": ";
                jsonContent.type = variableContent.type.name;
                if (formDataList.length > 0 && formDataList[0][fields[j].tableFieldName]) {
                    jsonContent.content = formDataList[0][fields[j].tableFieldName];
                }
                if (fieldContent.keyFeatures) {
                    var content = jsonContent.content;
                    if (jsonContent.type === "boolean") {
                        content = jsonContent.content === "1" ? "是" : "否";
                    }
                }
                jsonList.push(jsonContent);
            }


            var subFormsList = [];

            var subForms = this.bpmActivityForms ? this.bpmActivityForms[idx].subForms : [];
            for (var subIdex = 0; subIdex < subForms.length; subIdex++) {

                var subFormsJson = {};
                var _fields = subForms[subIdex] ? subForms[subIdex].fields : [];
                subFormsJson.title = subForms[subIdex].title;
                subFormsJson.item = [];
                for (var s_idex = 0; s_idex < _fields.length; s_idex++) {
                    // var s_fieldContent = JSON.parse(_fields[s_idex].fieldContent);
                    var s_variableContent = JSON.parse(_fields[s_idex].variableContent);
                    var s_name = s_variableContent.name ? s_variableContent.name : "未命名";
                    var s_type = s_variableContent.type.name;

                    var _formdata = formDataList > 0 && formDataList[0][_fields[s_idex].tableFieldName] ? formDataList[0][_fields[s_idex].tableFieldName] : "";
                    subFormsJson.item.push({
                        "name": s_name + "：",
                        "type": s_type,
                        "content": _formdata
                    });
                }
                subFormsList.push(subFormsJson);
            }
            this.pageview.delegate('detail_repeat', function (target) {
                target.bindData(jsonList);
            });
            this.pageview.delegate('subform_repeat', function (target) {
                target.bindData(subFormsList);
            });
        },
        detail_item_content_init: function (sender, params) {
            var type = sender.datasource.type;
            switch (type) {
                case "link":
                    sender.config.style.color = "#0093ff";
                    break;
                case "date":
                    if (sender.datasource.kind === "datetime") {
                        sender.config.text = sender.config.text ? utils.ConvertDateToStr(sender.config.text, "yyyy-MM-dd hh:mm:ss") : "";

                    } else if (sender.datasource.kind === "time") {
                        sender.config.text = sender.config.text ? utils.ConvertDateToStr(sender.config.text, "hh:mm:ss") : "";

                    } else {
                        sender.config.text = sender.config.text ? utils.ConvertDateToStr(sender.config.text, "yyyy-MM-dd") : "";
                    }
                    break;
                case "user":
                    var _userId = sender.config.text;
                    var _this = this,
                        userAjaxConfig = {
                            url: '/user/getUserInfo',
                            type: 'POST',
                            data: {
                                userId: _userId || ''
                            },
                            success: function (userData) {
                                if (userData.code === 0) {
                                    sender.setText(userData.data.userName);
                                }
                            },
                            error: function (listData) {
                            }
                        };

                    this.pageview.ajax(userAjaxConfig);
                    break;
                case "money":
                    var json = JSON.parse(sender.config.text);
                    var currency = c.getCurrencyName(json.currency);
                    sender.config.text = json.amount + " " + currency.name;
                    break;
                case "boolean":
                    var boolean = sender.datasource.content === "1" ? "是" : "否";
                    sender.config.text = boolean;
                    break;
                case "Paragraph":

                    sender.$el.css(this.classContent[sender.datasource.style]);
                    sender.config.text = " " + sender.datasource.content;
                    break;
                case "file":
                    sender.$el.hide();
                    break;
            }

        },
        detail_repeat_iteminit: function (sender, params) {
            if (sender.datasource.type === "file") {
                sender.$el.hide();
            }
        },
        detail_repeat_itemclick: function (sender, params) {
            if (sender.datasource.type === "link") {
                window.open(sender.datasource.content, '_self');
            }
        },
        detail_item_title_init: function (sender, params) {
            if (sender.datasource.type === "file") {
                sender.config.style.minHeight = 30;
                sender.config.style.backgroundColor = "rgb(251,251,251)";
            } else if (sender.datasource.type === "Paragraph") {
                // sender.config.text =
                sender.$el.hide();
            }
        },
        detail_view_init: function (sender, params) {
            if (sender.datasource.type === "file") {
                sender.$el.css({
                    "flex-direction": "column",
                    "width": "100%"
                });
            }
        },
        detail_item_files_init: function (sender, params) {
            var _sender = sender;
            var _this = this;
            // _sender.bindData([{la:""},{la:""}]);
            if (sender.rowInstance.datasource.type === "file") {
                var attaAjaxConfig = {
                    url: '/process/getInstanceAttachments',
                    type: 'POST',
                    data: {
                        fileIds: sender.rowInstance.datasource.content || ''
                    },
                    success: function (attaData) {
                        if (attaData.code === 0) {
                            _sender.bindData(attaData.data);
                        }
                    },
                    error: function (listData) {
                    }
                };

                this.pageview.ajax(attaAjaxConfig);


            } else {
                sender.config.style.display = "none";
            }

        },
        detail_item_files_itemclick: function (sender, params) {
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
                //fixme 下载还有问题
                console.log("下载");
                // this.downloadFile(title, sender.datasource.url);
            }
        },
        detail_files_view_left_init: function (sender, params) {
            var fileType = sender.datasource.type || 'unknow';
            sender.config.src = "./imgs/" + format.getFormat(fileType).ext;

        },
        subform_view_title_init: function (sender, params) {
            sender.config.preText = this.itemNum;
            this.itemNum++;
        },
        subform_view_item_init: function (sender, params) {
            sender.bindData(sender.rowInstance.datasource.item);
        }
    };
    return PageLogic;
});
