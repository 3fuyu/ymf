/**
 * Created by Gin on 17/3/21.
 */
define(["./common", "utils"], function (c, utils) {
    var Re = {
        getAnalysisContent: function (sender, _this) {

            var type = sender.datasource.type;
            switch (type) {
                case "link":
                case "Hyperlink":
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
                    var userAjaxConfig = {
                        url: '/user/getUserInfo',
                        type: 'POST',
                        data: {
                            userId: _userId || ''
                        },
                        success: function (userData) {
                            if (userData.success) {
                                sender.setText(userData.data.userName);
                                // sender.$el.addClass("line_clamp10");
                            }
                        },
                        error: function (listData) {
                        }
                    };

                    _this.pageview.ajax(userAjaxConfig);
                    break;
                case "money":
                    var json = JSON.parse(sender.config.text);
                    var currency = c.getCurrencyName(json.currency);
                    sender.config.text = json.amount + " " + currency.name;
                    break;
                case "Money":
                    sender.config.text = (sender.config.text ? sender.config.text : "0") + " " + sender.datasource.moneyType;
                    // sender.$el.addClass("line_clamp10");
                    break;
                case "boolean":
                    var boolean = sender.datasource.content === "1" ? "是" : "否";
                    sender.config.text = boolean;
                    break;
                case "Paragraph":
                    // sender.$el.css(_this.classContent[sender.datasource.style]);
                    sender.config.text = " " + sender.datasource.content;
                    break;
                case "Picture":
                case "file":
                case "File":
                case "DividingLine":
                case "DataTable":
                    sender.$el.hide();
                    break;
                //case "BillMaker":
                // console.log(JSON.parse(JSON.parse(window._applyHistory.iForms.jsontemp).formLayout.layoutDetail));
                //  console.log(sender.datasource);
                //break;
                case "DateCalculate":
                    if (sender.config.text) {
                        sender.config.text += " 天";
                    } else {
                        sender.config.text = "0 天";
                    }
                    break;
                case "Text":
                case "TextEditor":
                    // sender.$el.addClass("line_clamp10");
                    sender.config.text = sender.datasource.content && sender.datasource.content.replace(/\n/ig, "<br/>");
                    break;
                case "DateInterval":
                    try {
                        var arrParse = JSON.parse(sender.datasource.content);
                        if (arrParse[0].length > 0 && arrParse[1].length > 0) {
                            sender.config.text = arrParse[0] + " 至 " + arrParse[1];
                        } else {
                            sender.config.text = "";
                        }

                    } catch (e) {
                        var arrParse1 = sender.datasource.content.split(",");

                        if (arrParse1[0] && arrParse1[1] && arrParse1[0].length > 0 && arrParse1[1].length > 0) {
                            sender.config.text = arrParse1[0] + " 至 " + arrParse1[1];
                        } else {
                            sender.config.text = "";
                        }
                    }

                    break;
                case "Raty":
                    sender.config.text = sender.config.text + " 星";
                    break;
                case "Employee":
                    sender.config.text = "";
                    _this.pageview.ajax({
                        url: "user/getUserNames",
                        type: "POST",
                        data: {
                            memberIds: sender.datasource.content
                        },
                        success: function (data) {
                            sender.innerText.html(data.data.userName);
                        },
                        error: function (data) {
                        }
                    });
                    break;
                case "Department":
                    // console.log(sender.config.text)
                    sender.config.text = "";
                    _this.pageview.ajax({
                        url: "user/queryOrgNames",
                        type: "POST",
                        data: {
                            orgCodes: sender.datasource.content
                        },
                        success: function (data) {
                            sender.innerText.html(data.data);
                            if (data.data.length === 0) {
                                sender.innerText.html(sender.datasource.content);
                            }
                            // sender.$el.addClass("line_clamp10");
                        },
                        error: function (data) {
                        }
                    });
                    break;
            }
        }
    };
    return Re;
});