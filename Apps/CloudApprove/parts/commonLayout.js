/**
 * Created by 3fuyu on 2017/2/23.
 */

define(["utils"], function (utils) {
    "use strict";
    var mainColor = "#29B6F6";

    var Main = {
        mainColor: mainColor,
        switchLayout: function (itemInstance, _layout) {
            var layout = _layout || {};

            var placeholder = '',
                mode = layout.mode || '',
                type = layout.type || 'input',
                title = layout.title,
                singleLineStyle = layout.singleLineStyle || {}, // 同行布局时样式
                multiLineFirStyle = layout.multiLineFirStyle || {}, // 多行布局时父容器样式
                multiLineSecFirStyle = layout.multiLineSecFirStyle || {}, // 多行布局时第一个子容器样式
                multiLineSecSecStyle = layout.multiLineSecSecStyle || {}; // 多行布局时第二个子容器样式

            var inLeft = itemInstance.itemData.inLeft ? true : false;

            if (itemInstance.itemData.inDataTable || itemInstance.isInDetail){
                inLeft = true;
            }

            if (inLeft) {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.wrapKey = itemInstance.id + "_warp";
                itemInstance.root.push(itemInstance.wrapKey);

                itemInstance.components[itemInstance.wrapKey] = {
                    type: "view",
                    className: 'form-row bottom-half-line',
                    style: utils.processStyle($.extend({
                        backgroundColor: "#fff",
                        height: 50,
                        fontSize: 14,
                        // marginBottom: 1,
                        // borderBottom: "1px solid #ededed",
                        paddingLeft: 13,
                        flexDirection: "row"
                    }, multiLineFirStyle)),
                    root: [itemInstance.titleKey, itemInstance.id]
                };

                placeholder = itemInstance.itemData.tips || "请输入" + itemInstance.itemData.title;
                placeholder = itemInstance.isRequired ? placeholder + " (必填)" : placeholder;


                itemInstance.components[itemInstance.titleKey] = {
                    type: "text",
                    text: itemInstance.itemData.title || title,
                    numberofline: 2,
                    style: utils.processStyle($.extend({
                        width: 94
                    }, multiLineSecFirStyle))
                };
                itemInstance.components[itemInstance.id] = {
                    type: type,
                    ref: true,
                    mode: mode,
                    placeholder: placeholder,
                    className: 'form-row',
                    style: utils.processStyle($.extend({
                        flex: 1,
                        paddingRight: 16,
                        height: "100%",
                        fontSize: 14,
                        textAlign: "left"
                    }, multiLineSecSecStyle))
                };

            } else {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.root.push(itemInstance.titleKey);
                itemInstance.root.push(itemInstance.id);

                itemInstance.components[itemInstance.titleKey] = this.getCtlTitle(itemInstance.itemData.title || title);
                placeholder = itemInstance.itemData.tips || "请输入" + itemInstance.itemData.title || title;
                placeholder = itemInstance.isRequired ? placeholder + " (必填)" : placeholder;
                itemInstance.components[itemInstance.id] = {
                    type: type,
                    ref: true,
                    mode: mode,
                    className: 'form-row bottom-half-line',
                    placeholder: placeholder,
                    style: utils.processStyle($.extend({
                        backgroundColor: "#fff",
                        height: 50,
                        fontSize: 14,
                        // marginBottom: 1,
                        // borderBottom: "1px solid #ededed",
                        paddingLeft: 13,
                    }, singleLineStyle))
                };
            }
        },
        layoutForScore: function (itemInstance) {
            var inLeft = itemInstance.itemData.inLeft ? true : false;
            if (itemInstance.itemData.inDataTable){
                inLeft = true;
            }

            if (inLeft) {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.wrapKey = itemInstance.id + "_warp";
                itemInstance.scoreKey = itemInstance.id + "_score";

                itemInstance.root.push(itemInstance.wrapKey);

                itemInstance.components[itemInstance.wrapKey] = {
                    type: "view",
                    className:"bottom-half-line",
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        height: 50,
                        fontSize: 14,
                        // marginBottom: 1,
                        // borderBottom: "1px solid #ededed",
                        paddingLeft: 13,
                        flexDirection: "row"
                    }),
                    root: [itemInstance.titleKey, itemInstance.id]
                };

                itemInstance.components[itemInstance.titleKey] = {
                    type: "text",
                    text: itemInstance.itemData.title || "评分",
                    numberofline: 2,
                    style: utils.processStyle({
                        width: 94
                    })
                };

                itemInstance.components[itemInstance.id] = {
                    type: "repeat",
                    root: [itemInstance.scoreKey],
                    items: [],
                    style: utils.processStyle({
                        flex: 1,
                        backgroundColor: "#fff",
                        paddingRight: "15px",
                        justifyContent: "flex-end"
                    })
                };

                itemInstance.components[itemInstance.scoreKey] = {
                    type: "icon",
                    font: "cap_e908",
                    className: "star_icon all",
                    style: utils.processStyle({
                        flexDirection: "row",
                        flexWrap: "wrap",
                        backgroundColor: "#fff",
                        paddingLeft: "10px",
                    }),
                    iconStyle: {
                        color: itemInstance.starColor,
                    }
                };

            } else {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.root.push(itemInstance.titleKey);
                itemInstance.root.push(itemInstance.id);

                itemInstance.scoreKey = itemInstance.id + "_score";
                itemInstance.components[itemInstance.titleKey] = this.getCtlTitle(itemInstance.itemData.title);

                itemInstance.components[itemInstance.id] = {
                    type: "repeat",
                    root: [itemInstance.scoreKey],
                    items: [],
                    itemClassName:"bottom-half-line",
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        // marginBottom: "1px",
                        // borderBottom: "1px solid #ededed",
                        paddingLeft: "5px",
                        height: "50px"
                    })
                };

                itemInstance.components[itemInstance.scoreKey] = {
                    type: "icon",
                    font: "cap_e908",
                    className: "star_icon all",
                    style: utils.processStyle({
                        flexDirection: "row",
                        flexWrap: "wrap",
                        backgroundColor: "#fff",
                        paddingLeft: "10px",
                    }),
                    iconStyle: {
                        color: itemInstance.starColor,
                    }
                };
            }
        },
        createMoneyItemLayout: function (itemInstance, layout) {
            var placeholder = '',
                inLeft = itemInstance.itemData.inLeft ? true : false;

            if (itemInstance.itemData.inDataTable || itemInstance.isInDetail){
                inLeft = true;
            }

            if (inLeft) {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.wrapKey = itemInstance.id + "_warp";
                itemInstance.root.push(itemInstance.wrapKey);

                itemInstance.components[itemInstance.wrapKey] = {
                    type: "view",
                    className: 'form-row bottom-half-line',
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        height: 50,
                        // marginBottom: (itemInstance.isInDetail === false && itemInstance.itemData.uppercase === "1") ? 0 : 1,
                        // borderBottom: "1px solid #ededed",
                        fontSize: 14,
                        paddingLeft: 13,
                        flexDirection: "row"
                    }),
                    root: [itemInstance.titleKey, itemInstance.id]
                };

                placeholder = itemInstance.itemData.tips || "请输入" + itemInstance.itemData.title;
                placeholder = itemInstance.isRequired ? placeholder + " (必填)" : placeholder;
                itemInstance.components[itemInstance.id] = {
                    type: "input",
                    ref: true,
                    placeholder: placeholder,
                    mode: "number",
                    style: utils.processStyle({
                        flex: 1,
                        paddingRight: 16,
                        height: "100%",
                        fontSize: 14,
                        textAlign: "left"
                    })
                };

                itemInstance.components[itemInstance.titleKey] = {
                    type: "text",
                    text: itemInstance.itemData.title || layout.title,
                    numberofline: 2,
                    style: utils.processStyle({
                        width: 94
                    })
                };
            } else {
                itemInstance.titleKey = itemInstance.id + "_title";
                itemInstance.root.push(itemInstance.titleKey);
                itemInstance.root.push(itemInstance.id);

                itemInstance.components[itemInstance.titleKey] = this.getCtlTitle(itemInstance.itemData.title|| layout.title);
                placeholder = itemInstance.itemData.tips || "请输入" + itemInstance.itemData.title;
                placeholder = itemInstance.isRequired ? placeholder + " (必填)" : placeholder;

                itemInstance.components[itemInstance.id] = {
                    type: "input",
                    placeholder: placeholder,
                    mode: "number",
                    ref: true,
                    className:"bottom-half-line",
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        paddingRight: 12,
                        paddingLeft: 12,
                        height: 50,
                        fontSize: 14,
                        textAlign: "left",
                        // marginBottom: 1,
                        // borderBottom: "1px solid #ededed",
                    })
                };
            }
        },
        createItemLayout: function (itemInstance, layout) {

            itemInstance.titleKey = itemInstance.id + "_title";
            itemInstance.wrapKey = itemInstance.id + "_warp";
            itemInstance.root.push(itemInstance.wrapKey);

            var placeholder = itemInstance.itemData.tips ? itemInstance.itemData.tips : '请选择';

            itemInstance.components[itemInstance.wrapKey] = {
                type: "view",
                className: 'form-row bottom-half-line',
                style: utils.processStyle({
                    backgroundColor: "#fff",
                    minHeight: 50,
                    // marginBottom: 1,
                    // borderBottom: "1px solid #ededed",
                    paddingTop: 4,
                    paddingBottom: 4,
                    fontSize: 14,
                    paddingLeft: 13,
                    flexDirection: "row"
                }),
                root: [itemInstance.titleKey, itemInstance.id]
            };

            itemInstance.components[itemInstance.id] = {
                type: "icon",
                textPos: "left",
                ref: true,
                text: itemInstance.isRequired ? (placeholder + " (必填)") : placeholder,
                font: "icomoon_e913",
                numberofline: 5,
                textStyle: utils.processStyle({
                    color: "#b7b7b7",
                    fontSize: 14,
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
            var titleKey = itemData.id + "_title";
            var delBtnKey = itemData.id + "_delbtn";
            var Re = {
                type: "view",
                className:"bottom-half-line",
                style: {
                    flexDirection: "row",
                    background: "#fff",
                    borderRadius: "5px 5px 0 0",
                    // borderBottom: "1px solid #ededed"
                },
                root: [titleKey, delBtnKey]
            };
            components[titleKey] = {
                type: "text",
                ref: true,
                text: itemData.title,
                style: utils.processStyle({
                    height: 34,
                    flex: "1",
                    textIndent: 13,
                    fontSize: 14,
                    backgroundColor: "#FCFCFC",
                    color: "#262626"
                }),
            };
            components[delBtnKey] = {
                type: "text",
                text: "删除",
                titleKey: titleKey,
                titleLabel: itemData.title,
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
            };
            plugin[delBtnKey + "_click"] = function (sender, params) {
                params = params || {};
                params.DetailInstance = DetailInstance;
                this.detailItemDeleteClick(sender, params);
            };
            plugin[titleKey + "_init"] = function (sender, params) {
                this.detailItemTitleInit(sender, params);
            };
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
                    fontSize: 14,
                    color: "#9E9E9E"
                })
            };
        },

        //ApplySwitch component layout
        layoutForSwitch: function (itemInstance) {

            var inLeft = itemInstance.itemData.inLeft ? true : false;
            itemInstance.titleKey = itemInstance.id + "_title";

            if (itemInstance.itemData.inDataTable){
                inLeft = true;
            }

            if (inLeft) {
                itemInstance.wrapKey = itemInstance.id + "_warp";
                itemInstance.root.push(itemInstance.wrapKey);

                itemInstance.components[itemInstance.wrapKey] = {
                    type: "view",
                    className:"bottom-half-line",
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        height: 50,
                        fontSize: 14,
                        // marginBottom: 1,
                        // borderBottom: "1px solid #ededed",
                        paddingLeft: 13,
                        paddingRight: 13,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }),
                    root: [itemInstance.titleKey, itemInstance.id]
                };

                itemInstance.components[itemInstance.titleKey] = {
                    type: "text",
                    text: itemInstance.itemData.title || "开关",
                    style: utils.processStyle({
                        width: 94
                    }),
                };
                itemInstance.components[itemInstance.id] = {
                    type: 'switch',
                    ref: true,
                    selectedBackgroundColor: '#29B6F6',
                    style: utils.processStyle({
                        width: 50,
                        paddingRight: 16,
                        height: "100%",
                        fontSize: 14,
                        textAlign: "right"
                    })
                };

            } else {
                itemInstance.root.push(itemInstance.titleKey);
                itemInstance.root.push(itemInstance.id);

                itemInstance.components[itemInstance.titleKey] = this.getCtlTitle(itemInstance.itemData.title);
                itemInstance.components[itemInstance.id] = {
                    type: 'text',
                    ref: true,
                    className: 'form-row bottom-half-line',
                    style: utils.processStyle({
                        backgroundColor: "#fff",
                        height: 50,
                        fontSize: 14,
                        // marginBottom: 1,
                        // borderBottom: "1px solid #ededed",
                        paddingLeft: 13,
                    })
                };
            }
        },
        //针对的是带手机输入的验证码组件
        switchIdentifyCodeLayout: function (itemInstance, _layout) {
            itemInstance.titleKey = itemInstance.id + "_title";
            itemInstance.btn = itemInstance.id + "_button";
            itemInstance.wrapKey = itemInstance.id + "_warp";
            itemInstance.root.push(itemInstance.wrapKey);

            itemInstance.components[itemInstance.wrapKey] = {
                type: "view",
                className: "bottom-half-line",
                style: utils.processStyle({
                    backgroundColor: "#fff",
                    height: 50,
                    fontSize: 14,
                    paddingLeft: 13,
                    flexDirection: "row",
                    alignItems: "center"
                }),
                root: [itemInstance.titleKey, itemInstance.id, itemInstance.btn]
            };

            itemInstance.components[itemInstance.titleKey] = {
                type: "text",
                text: "验证码",
                numberofline: 2,
                style: utils.processStyle({
                    width: 94
                })
            };
            itemInstance.components[itemInstance.id] = {
                type: "input",
                ref: true,
                mode: "number",
                placeholder: "请输入验证码",
                style: utils.processStyle({
                    flex: 1,
                    paddingRight: 16,
                    height: "100%",
                    fontSize: 14,
                    textAlign: "left"
                })
            };
            itemInstance.components[itemInstance.btn] = {
                type: "button",
                ref: true,
                title: "获取验证码",
                style: utils.processStyle({
                    width: 100,
                    height: 30,
                    fontSize: 14,
                    marginRight: 20,
                    color: "#29b6f6",
                    borderColor: "#29b6f6"
                })
            };
        }
    };

    return Main;
});