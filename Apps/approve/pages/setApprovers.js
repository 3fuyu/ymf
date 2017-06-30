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
                root: ["title","titleLable", "titleLable1", "contentText","contentImage", "contentText1", "contentText2",
                    "contentText3","contentImage1", "titleLable2","titleLable3", "contentText4", "contentText5",
                    "contentImage2","contentImage3","titleLable4","contentText6","contentText7","contentImage4","contentText8","contentImage5","contentText9"]
            },
            title: {
                type: "text",
                text: "如何设置审批流程",
                style: {
                    fontSize: 17,
                    color: "#000",
                    margin: "auto",
                    fontWeight: "bold"
                }
            },
            titleLable: {
                type: "text",
                text: "提供两种审批人设置方式：",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            titleLable1: {
                type: "text",
                text: "一、自由设置：自由设置顾名思义就是想怎么选就怎么选，完全没有任何限制。发起人在发起审批的时候选择自己想要制定的审批人，数量不限。这个方式非常适合权限划分不是非常清晰的中小企业，因为他们公司结构比较简单，用起来非常便捷。",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            titleLable2: {
                type: "text",
                text: "二、预设审批人：管理员按照公司的规章制度在审批单里预先设置好审批人，可以根据公司的管理层级来设定，也可以制定某一个人为审批人。",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            titleLable3: {
                type: "text",
                text: "A、不分条件审批人",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            titleLable4: {
                type: "text",
                text: "B、分条件审批人",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText: {
                type: "text",
                text: "1、打开“报销审批”，我们一起来填写这份报销审批",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText1: {
                type: "text",
                text: "2、内容填写好以后点击“添加审批人”",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText2: {
                type: "text",
                text: "3、选择审批人，可以反复添加多个",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText3: {
                type: "text",
                text: "4、选择的审批人会显示在请假审批页中，点击提交就可以了",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },


            contentText4: {
                type: "text",
                text: "1、进入“审批”应用，点击“审批人”进入审批人设置页",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText5: {
                type: "text",
                text: "2、点击“添加”或者“设置”即可选择审批人，在移动端则显示指定的审批人",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText6: {
                type: "text",
                text: "1、进入审批人设置页面，点击“分条件设置审批人”，如果该审批表单包含一下表单项，则可设置条件：时间段、金额、数字且均未必填，明细组件内部有时间段、金额、数字且内部统计",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText7: {
                type: "text",
                text: "2、选择一个条件，输入该条件各个数值，点击完成即可进入下一步；以时长为例，我们设置“4<10”",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText8: {
                type: "text",
                text: "3、可以看到时长就被划分为三段，一段以时长小于4，一段时长大于等于4小于等于10，一段时长大于10。我们可以理解为时长小于4时走第一段的审批人流程，大于等于4小于等于10时走第二段审批人流程，大于10时走第三段审批人流程",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText9: {
                type: "text",
                text: "4、只可设置一个条件为分条件审批人",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentImage: {
                type: "image",
                src: './imgs/help/2.1.png',
                style: {
                    margin: "auto"
                }
            },
            contentImage1: {
                type: "image",
                src: './imgs/help/2.2.png',
                style: {
                    margin: "auto"
                }
            },
            contentImage2: {
                type: "image",
                src: './imgs/help/2.3.png',
                style: {
                    margin: "auto"
                }
            },
            contentImage3: {
                type: "image",
                src: './imgs/help/2.4.png',
                style: {
                    margin: "auto"
                }
            },
            contentImage4: {
                type: "image",
                src: './imgs/help/2.5.png',
                style: {
                    margin: "auto"
                }
            },
            contentImage5: {
                type: "image",
                src: './imgs/help/2.6.png',
                style: {
                    margin: "auto"
                }
            }
        }
    };
    return Re;
});
