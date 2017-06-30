/**
 * Created by Gin on 17/3/9.
 */
define(["./common"], function (c) {
    var jsonList = [];
    var Re = {
        getAnalysis_ifroms: function (ifroms, formDataList, currentActivityId) {
            window._formData = [];
            var jsontemp = JSON.parse(ifroms[0].jsontemp);
            jsonList = [];
            var processAuthinfo = jsontemp.form.processAuthinfo[currentActivityId];
            // console.log(currentActivityId);
            if (!processAuthinfo) {
                processAuthinfo = jsontemp.form.processAuthinfo.fillIn;
            }
            for (var key in jsontemp) {
                if (key !== "enable" && key !== "pk_bo" && key !== "form") {
                    switch (key) {
                        case "formLayout":
                            var formLayout;
                            if (typeof jsontemp[key].layoutDetail === "object") {
                                formLayout = jsontemp[key].layoutDetail;
                            } else {
                                formLayout = JSON.parse(jsontemp[key].layoutDetail);
                            }
                            for (var i = 0; i < formLayout.layoutDetail.length; i++) {
                                this.getComponentData(formLayout.layoutDetail[i], formDataList[0], processAuthinfo, currentActivityId);
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            return jsonList;
        },
        getComponentData: function (layoutDetail, formData, processAuthinfo, currentActivityId) {
            var _this = this;
            if (!formData) {
                formData = [];
            }
            var jsonContent = {};
            switch (layoutDetail.componentKey) {
                case "ColumnPanel":
                case "TableLayout":
                    layoutDetail.layoutDetail.forEach(function (item, index) {
                        item.layoutDetail.forEach(function (itemData, idx) {
                            if (_this.isHide(itemData.fieldId, processAuthinfo)) {
                                if (itemData.componentKey !== "Score") {
                                    jsonContent = {};
                                    jsonContent.title = itemData.title + "：";
                                    jsonContent.type = itemData.componentKey;
                                    jsonContent.content = formData[itemData.columncode];
                                    if (itemData.componentKey === "Paragraph") {
                                        jsonContent.style = itemData.style;
                                    } else if (itemData.componentKey === "Select") {
                                        jsonContent.content = "";
                                        var selectionId = formData[itemData.columncode];
                                        if (selectionId) {
                                            itemData.options.forEach(function (opt, oidx) {
                                                if (selectionId.indexOf(opt.selectionId) > -1) {
                                                    jsonContent.content += opt.name + ",";
                                                }
                                            });


                                            var selectionIdArr = selectionId.split(",");
                                            var lastSelection = selectionIdArr[selectionIdArr.length - 1];
                                            if (lastSelection.indexOf("$$hasOther$$") === 0) {
                                                jsonContent.content += lastSelection.substring(12, lastSelection.length) + ",";
                                            }
                                            jsonContent.content = (jsonContent.content.substring(jsonContent.content.length - 1) === ',') ? jsonContent.content.substring(0, jsonContent.content.length - 1) : jsonContent.content;
                                        }
                                    } else if (itemData.componentKey === "Picture") {
                                        jsonContent.url = itemData.url;
                                    } else if (itemData.componentKey === "Money") {
                                        if (jsonContent.content === "" || !jsonContent.content) {
                                            jsonContent.content = "0";
                                        }
                                        if (itemData.numberToChinese) {
                                            jsonContent.content = c.MoneyDX(jsonContent.content);
                                        }
                                        jsonContent.moneyType = itemData.moneyType;
                                    } else if (itemData.componentKey === "Password") {
                                        jsonContent.content = "";
                                        var password = formData[itemData.columncode];
                                        for (var p = 0; p < password.length; p++) {
                                            jsonContent.content += "＊";
                                        }
                                    } else if (itemData.componentKey === "TaskComment") {
                                        if (itemData.processActivity && itemData.processActivity === currentActivityId) {
                                            var component = {
                                                name: itemData.columncode,
                                                type: "TaskComment",
                                                value: itemData.showStyle.toString()
                                            };
                                            window._formData.push(component);
                                        }
                                    }
                                    jsonList.push(jsonContent);
                                }
                            }
                        });
                    });
                    break;
                case "Select":
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        jsonContent.title = layoutDetail.title + "：";
                        jsonContent.type = layoutDetail.componentKey;
                        // jsonContent.content = formData[layoutDetail.columncode];
                        var selectionId = formData[layoutDetail.columncode];
                        console.log(layoutDetail.hasOther);
                        console.log(layoutDetail);
                        console.log(selectionId);
                        if (selectionId) {
                            jsonContent.content = "";

                            layoutDetail.options.forEach(function (opt, oidx) {
                                if (selectionId.indexOf(opt.selectionId) > -1) {
                                    jsonContent.content += opt.name + ",";
                                }
                            });
                            var selectionIdArr = selectionId.split(",");
                            var lastSelection = selectionIdArr[selectionIdArr.length - 1];
                            var pos = lastSelection.indexOf("$$hasOther$$");
                            if (lastSelection.indexOf("$$hasOther$$") === 0) {
                                jsonContent.content += lastSelection.substring(12, lastSelection.length) + ",";
                            }
                            // jsonContent.content += selectionId.substring(pos, selectionId.length) + ",";
                            jsonContent.content = (jsonContent.content.substring(jsonContent.content.length - 1) === ',') ? jsonContent.content.substring(0, jsonContent.content.length - 1) : jsonContent.content;

                        }

                        jsonList.push(jsonContent);
                    }
                    break;
                case "Picture":
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        jsonContent.title = layoutDetail.title + "：";
                        jsonContent.type = layoutDetail.componentKey;
                        jsonContent.url = layoutDetail.url;
                        jsonList.push(jsonContent);
                    }
                    break;
                case "Money":
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        jsonContent.title = layoutDetail.title + "：";

                        jsonContent.type = layoutDetail.componentKey;
                        jsonContent.content = formData[layoutDetail.columncode];
                        jsonContent.moneyType = layoutDetail.moneyType;
                        if (layoutDetail.numberToChinese) {
                            jsonContent.content = c.MoneyDX(jsonContent.content);
                        }

                        jsonList.push(jsonContent);
                    }
                    break;
                case "DataTable":
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        var formdataList = formData[layoutDetail.tableName];
                        jsonContent = {};
                        jsonContent.title = "明细子表";
                        jsonContent.type = layoutDetail.componentKey;
                        jsonContent.items = [];
                        if (formdataList) {
                            formdataList.forEach(function (formItem, index) {
                                var jsonTable = {};
                                jsonTable.title = "明细子表";
                                jsonTable.num = index + 1;
                                jsonTable.type = layoutDetail.componentKey;
                                jsonTable.items = [];
                                // 循环组件
                                layoutDetail.layoutDetail.forEach(function (itemData, idx) {
                                    if (itemData.componentKey !== "Score") {
                                        var jsonComponent = {};
                                        jsonComponent.title = itemData.title + "：";
                                        jsonComponent.type = itemData.componentKey;
                                        jsonComponent.content = formItem[itemData.columncode];
                                        if (itemData.componentKey === "Paragraph") {
                                            jsonComponent.style = itemData.style;
                                        } else if (itemData.componentKey === "Select") {
                                            var selectionId = formItem[itemData.columncode];
                                            jsonComponent.content = "";
                                            if (selectionId) {
                                                itemData.options.forEach(function (opt, oidx) {
                                                    if (selectionId.indexOf(opt.selectionId) > -1) {
                                                        jsonComponent.content += opt.name + ",";
                                                    }
                                                });
                                                var selectionIdArr = selectionId.split(",");
                                                var lastSelection = selectionIdArr[selectionIdArr.length - 1];
                                                if (lastSelection.indexOf("$$hasOther$$") === 0) {
                                                    jsonComponent.content += lastSelection.substring(12, lastSelection.length) + ",";
                                                }
                                                // if (itemData.hasOther) {
                                                //     var pos = selectionId.lastIndexOf(",") + 1;
                                                //     jsonComponent.content += selectionId.substring(pos, selectionId.length) + ",";
                                                // }
                                                jsonComponent.content = (jsonComponent.content.substring(jsonComponent.content.length - 1) === ',') ? jsonComponent.content.substring(0, jsonComponent.content.length - 1) : jsonComponent.content;
                                            }
                                        } else if (itemData.componentKey === "Picture") {
                                            jsonContent.url = itemData.url;
                                        } else if (itemData.componentKey === "Money") {
                                            if (jsonComponent.content === "" || !jsonComponent.content) {
                                                jsonComponent.content = "0";
                                            }
                                            if (itemData.numberToChinese) {
                                                jsonComponent.content = c.MoneyDX(jsonComponent.content);
                                            }
                                            jsonComponent.moneyType = itemData.moneyType;
                                        } else if (itemData.componentKey === "Password") {
                                            jsonComponent.content = "";
                                            var password = formData[itemData.columncode] || "";
                                            for (var p = 0; p < password.length; p++) {
                                                jsonComponent.content += "＊";
                                            }
                                        }

                                        jsonTable.items.push(jsonComponent);
                                    }
                                });

                                jsonContent.items.push(jsonTable);
                            });
                        } else {
                            var jsonTable1 = {};

                            jsonTable1.title = "明细子表";
                            jsonTable1.num = "1";
                            jsonTable1.type = layoutDetail.componentKey;
                            jsonTable1.items = [];
                            // 循环组件
                            layoutDetail.layoutDetail.forEach(function (itemData, idx) {

                                if (itemData.componentKey !== "Score") {
                                    var jsonComponent1 = {};
                                    jsonComponent1.title = itemData.title + "：";
                                    jsonComponent1.type = itemData.componentKey;
                                    jsonComponent1.content = formData[itemData.columncode];
                                    if (itemData.componentKey === "Paragraph") {
                                        jsonComponent1.style = itemData.style;
                                    } else if (itemData.componentKey === "Select") {
                                        var selectionId = formData[itemData.columncode];
                                        jsonComponent1.content = "";
                                        if (selectionId) {
                                            itemData.options.forEach(function (opt, oidx) {
                                                if (selectionId.indexOf(opt.selectionId) > -1) {
                                                    jsonComponent1.content += opt.name + ",";
                                                }
                                            });
                                            var selectionIdArr = selectionId.split(",");
                                            var lastSelection = selectionIdArr[selectionIdArr.length - 1];
                                            if (lastSelection.indexOf("$$hasOther$$") === 0) {
                                                jsonComponent1.content += lastSelection.substring(12, lastSelection.length) + ",";
                                            }

                                            jsonComponent1.content = (jsonComponent1.content.substring(jsonComponent1.content.length - 1) === ',') ? jsonComponent1.content.substring(0, jsonComponent1.content.length - 1) : jsonComponent1.content;
                                        }
                                    } else if (itemData.componentKey === "Picture") {
                                        jsonContent.url = itemData.url;
                                    } else if (itemData.componentKey === "Money") {
                                        if (jsonComponent1.content === "" || !jsonComponent1.content) {
                                            jsonComponent1.content = "0";
                                        }
                                        if (itemData.numberToChinese) {
                                            jsonComponent1.content = c.MoneyDX(jsonComponent1.content);
                                        }
                                        jsonComponent1.moneyType = itemData.moneyType;
                                    } else if (itemData.componentKey === "Password") {
                                        jsonComponent1.content = "";
                                        var password1 = formData[itemData.columncode] || "";
                                        for (var p = 0; p < password1.length; p++) {
                                            jsonComponent1.content += "＊";
                                        }
                                    }


                                    jsonTable1.items.push(jsonComponent1);
                                }
                            });

                            jsonContent.items.push(jsonTable1);
                        }
                        jsonList.push(jsonContent);
                    }
                    break;
                case "Password":
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        jsonContent.title = layoutDetail.title + "：";
                        jsonContent.type = layoutDetail.componentKey;
                        var password = formData[layoutDetail.columncode] || "";
                        jsonContent.content = "";
                        for (var p = 0; p < password.length; p++) {
                            jsonContent.content += "＊";
                        }
                        jsonList.push(jsonContent);
                    }
                    break;
                case "Score":
                    break;
                case "TaskComment":
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        if (layoutDetail.processActivity && layoutDetail.processActivity === currentActivityId) {
                            var component = {
                                name: layoutDetail.columncode,
                                type: "TaskComment",
                                value: layoutDetail.showStyle.toString()
                            };
                            window._formData.push(component);
                        }
                        jsonContent.title = layoutDetail.title + "：";
                        jsonContent.type = layoutDetail.componentKey;
                        jsonContent.content = formData[layoutDetail.columncode];
                        jsonList.push(jsonContent);
                    }
                    break;
                // 详情页不显示验证码组件  3fuyu
                case "IdentifyCode":
                    break;
                default:
                    if (_this.isHide(layoutDetail.fieldId, processAuthinfo)) {
                        jsonContent.title = layoutDetail.title + "：";
                        jsonContent.type = layoutDetail.componentKey;
                        jsonContent.content = formData[layoutDetail.columncode];
                        if (layoutDetail.componentKey === "Paragraph") {
                            jsonContent.style = layoutDetail.style;
                            if (!jsonContent.content) {
                                jsonContent.content = "";
                            }
                        }
                        jsonList.push(jsonContent);
                    }
                    break;
            }
        },
        isHide: function (fieldId, processAuthinfo) {
            if (processAuthinfo) {
                for (var i = 0; i < processAuthinfo.length; i++) {
                    if (processAuthinfo[i].fieldid === fieldId) {
                        if (processAuthinfo[i].auth === "0") {
                            return false;
                        }
                    }
                }
            }
            return true;
        }
    };
    return Re;
});