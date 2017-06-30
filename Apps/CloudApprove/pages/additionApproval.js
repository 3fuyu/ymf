define(["../logic/additionApproval", "../parts/common", 'utils'], function (pluginClass, c, utils) {
    var Re = {
        pluginClass: pluginClass,
        style: {
            backgroundColor: c.backColor,
            overflow: "auto"
        },
        root: ["body"],
        components: {
            body: {
                type: "view",
                style: {
                    padding: 15,
                    color: "#999"
                },
                root: ["title", "titleLable", "contentText", "contentImage", "contentText1", "contentImage1", "contentText2", "contentImage2", "contentImage3", "contentText3", "contentImage4", "contentText4", "contentImage5"]
            },
            title: {
                type: "text",
                text: "如何添加审批模版",
                style: {
                    fontSize: 17,
                    color: "#000",
                    margin: "auto",
                    fontWeight: "bold"
                }
            },
            titleLable: {
                type: "text",
                text: "如果我们提供的审批模版中没有你想要的审批模版，我们还能提供强大的自定义功能，可以定制出任何您想要的审批模版",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText: {
                type: "text",
                text: "1、电脑上登录企业空间进入审批应用，点击“审批”进入审批应用",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText1: {
                type: "text",
                text: "2、点击右上角按钮“创建新审批”，可以选择“从设计器创建”或者“经典模版”创建。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText2: {
                type: "text",
                text: "3、各种控件名称，提示文案，控件性质设置等完全自定义，可以拖动左边的控件进入中间编辑区域，通过右边的控件设置可设置属性",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText3: {
                type: "text",
                text: "4、设计完成，可以选择保存或者保存并启用",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText4: {
                type: "text",
                text: "5、如果新建的模版被启用，则审批中会新增一个自定义的模版，满足企业各种审批的需求",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentImage: {
                type: "image",
                src: './imgs/help/1.1.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage1: {
                type: "image",
                src: './imgs/help/1.2.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage2: {
                type: "image",
                src: './imgs/help/1.3.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage3: {
                type: "image",
                src: './imgs/help/1.4.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage4: {
                type: "image",
                src: './imgs/help/1.5.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage5: {
                type: "image",
                src: './imgs/help/1.6.png',
                style: {
                    // width: 300,
                    margin: "auto"
                }
            }
        }
    };
    return Re;
});
