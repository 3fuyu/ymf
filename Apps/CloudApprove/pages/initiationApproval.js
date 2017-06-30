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
                root: ["title","titleLable", "contentText", "contentImage", "contentText1", "contentImage1", "contentText2", "contentImage2", "contentText3", "contentImage3", "contentText4", "imageView", "contentText5", "contentImage6"]
            },
            title: {
                type: "text",
                text: "如何发起审批",
                style: {
                    fontSize: 17,
                    color: "#000",
                    margin: "auto",
                    fontWeight: "bold"
                }
            },
            titleLable: {
                type: "text",
                text: "进入移动端审批应用之后，如何发起审批呢，下面来看看吧。",
                style: {
                    fontSize: 14,
                    marginTop: 15
                }
            },
            contentText: {
                type: "text",
                text: "1、点击你想创建的审批类型，比方说订货申请单。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText1: {
                type: "text",
                text: "2、进入单据详情，输入相关内容。如果有提示必填，则必须填写该项才可提交；单据内如果有明细，则可以多条明细一起提交；如果管理员未设置审批人则需要自己选择审批人哦，未选择审批人也不可以提交审批单据。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText2: {
                type: "text",
                text: "3、提交成功之后，就坐等审批结果吧，不论是审批通过或者审批拒绝，该条审批单据都算是完成了，如果需要重新提交，我们也有相应的快速提交入口哦，点击重新提交，读取已经填写的内容，你可以直接修改在此提交。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText3: {
                type: "text",
                text: "4、如果提交时输入错误，可以撤销重新提交哦，所以发生错误的时候也不要太紧张。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText4: {
                type: "text",
                text: "5、审批同意，审批拒绝都会有消息提示，随时随地了解自己审批的进程。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentText5: {
                type: "text",
                text: "6、对于审批人，可以通过“待我审批”查看需要审批的单据，分类清晰，提高工作效率。",
                style: {
                    fontSize: 14,
                    margin: "15px 0"
                }
            },
            contentImage: {
                type: "image",
                src: './imgs/help/4.1.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage1: {
                type: "image",
                src: './imgs/help/4.2.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage2: {
                type: "image",
                src: './imgs/help/4.3.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            contentImage3: {
                type: "image",
                src: './imgs/help/4.4.png',
                style: {
                    // width: 800,
                    margin: "auto"
                }
            },
            imageView:{
                type: "view",
                style: {
                    textAlign: "center"
                },
                root: ["contentImage4", "contentImage5"]
            },
            contentImage4: {
                type: "image",
                src: './imgs/help/4.5.png',
                style: {
                    display: "inline-block"

                }
            },
            contentImage5: {
                type: "image",
                src: './imgs/help/4.6.png',
                style: {
                    marginLeft: 10,
                    display: "inline-block"
                }
            },
            contentImage6: {
                type: "image",
                src: './imgs/help/4.7.png',
                style: {
                    // width: 300,
                    margin: "auto"
                }
            }
        }
    };
    return Re;
});
